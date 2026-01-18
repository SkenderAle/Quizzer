// ==================== NUOVE FUNZIONI AGGIUNTE ====================

// Helper per URL Google Forms
const GoogleFormsHelper = {
    /**
     * Converte un URL Google Forms normale in URL embedded
     */
    toEmbeddedUrl: function(url) {
        if (!url) return '';
        
        try {
            // Se è già un URL embedded, mantienilo
            if (url.includes('/embedded')) {
                return url;
            }
            
            // Normalizza URL
            let normalizedUrl = url.trim();
            if (!normalizedUrl.startsWith('http')) {
                normalizedUrl = 'https://' + normalizedUrl;
            }
            
            // Crea URL object
            const urlObj = new URL(normalizedUrl);
            
            // Aggiungi parametri embedded
            urlObj.searchParams.set('embedded', 'true');
            urlObj.searchParams.set('usp', 'pp_url');
            
            // Per Forms italiani, aggiungi lingua
            urlObj.searchParams.set('hl', 'it');
            
            return urlObj.toString();
            
        } catch (error) {
            console.error('Errore conversione URL:', error);
            return url; // Ritorna l'URL originale in caso di errore
        }
    },
    
    /**
     * Verifica se un URL è un Google Forms valido
     */
    isValidFormsUrl: function(url) {
        if (!url) return false;
        
        const patterns = [
            /^https:\/\/forms\.gle\/[a-zA-Z0-9_-]+$/,
            /^https:\/\/docs\.google\.com\/forms\/d\/e\/[a-zA-Z0-9_-]+\/viewform/,
            /^https:\/\/docs\.google\.com\/forms\/d\/[a-zA-Z0-9_-]+\/edit/,
            /^https:\/\/docs\.google\.com\/forms\/d\/[a-zA-Z0-9_-]+\/viewform/
        ];
        
        return patterns.some(pattern => pattern.test(url.trim()));
    },
    
    /**
     * Estrae l'ID del form da un URL Google Forms
     */
    extractFormId: function(url) {
        if (!url) return null;
        
        const patterns = [
            /forms\.gle\/([a-zA-Z0-9_-]+)/,
            /\/forms\/d\/e\/([a-zA-Z0-9_-]+)/,
            /\/forms\/d\/([a-zA-Z0-9_-]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    },
    
    /**
     * Crea un URL di preview per test
     */
    createPreviewUrl: function(formId) {
        if (!formId) return '';
        return `https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true`;
    }
};

// Helper per il localStorage
const StorageHelper = {
    prefix: 'examlock_',
    
    set: function(key, value) {
        try {
            const fullKey = this.prefix + key;
            const data = JSON.stringify(value);
            localStorage.setItem(fullKey, data);
            return true;
        } catch (error) {
            console.error('Errore salvataggio localStorage:', error);
            return false;
        }
    },
    
    get: function(key) {
        try {
            const fullKey = this.prefix + key;
            const data = localStorage.getItem(fullKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Errore lettura localStorage:', error);
            return null;
        }
    },
    
    remove: function(key) {
        try {
            const fullKey = this.prefix + key;
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            console.error('Errore rimozione localStorage:', error);
            return false;
        }
    },
    
    clearAll: function() {
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.prefix)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            console.log('🧹 localStorage pulito');
            return true;
        } catch (error) {
            console.error('Errore pulizia localStorage:', error);
            return false;
        }
    },
    
    // Mantieni solo i dati essenziali
    keepOnlySessionData: function() {
        const essentialKeys = ['student', 'session', 'quiz_url'];
        const allKeys = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.prefix)) {
                const shortKey = key.replace(this.prefix, '');
                if (!essentialKeys.includes(shortKey)) {
                    allKeys.push(key);
                }
            }
        }
        
        allKeys.forEach(key => localStorage.removeItem(key));
        return allKeys.length;
    }
};

// Helper per il logging
const LogHelper = {
    enabled: CONFIG.DEBUG_MODE,
    
    log: function(message, data = null, type = 'info') {
        if (!this.enabled) return;
        
        const timestamp = new Date().toISOString();
        const styles = {
            info: 'color: #4285f4;',
            success: 'color: #34a853; font-weight: bold;',
            warn: 'color: #ff9800; font-weight: bold;',
            error: 'color: #ff4444; font-weight: bold;',
            debug: 'color: #9c27b0;'
        };
        
        const style = styles[type] || styles.info;
        
        console.log(`%c[${timestamp}] ${message}`, style);
        if (data) {
            console.log(data);
        }
        
        // Salva anche in localStorage per debug
        if (type === 'error' || type === 'warn') {
            this.saveToLogHistory(message, data, type);
        }
    },
    
    saveToLogHistory: function(message, data, type) {
        try {
            const logEntry = {
                message,
                data,
                type,
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            };
            
            const history = StorageHelper.get('log_history') || [];
            history.push(logEntry);
            
            // Mantieni solo ultimi 50 log
            if (history.length > 50) {
                history.shift();
            }
            
            StorageHelper.set('log_history', history);
        } catch (error) {
            console.error('Errore salvataggio log:', error);
        }
    },
    
    getLogHistory: function() {
        return StorageHelper.get('log_history') || [];
    },
    
    clearLogHistory: function() {
        StorageHelper.remove('log_history');
    }
};

// Helper per il tempo
const TimeHelper = {
    formatDuration: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    formatRemainingTime: function(seconds) {
        if (seconds <= 0) return 'TEMPO SCADUTO';
        
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        if (mins > 0) {
            return `${mins} minuti e ${secs} secondi`;
        } else {
            return `${secs} secondi`;
        }
    },
    
    getTimeUntil: function(targetMinutes) {
        const now = new Date();
        const targetTime = new Date(now.getTime() + targetMinutes * 60000);
        return targetTime;
    },
    
    isTimeExpired: function(startTime, maxMinutes) {
        const now = new Date();
        const start = new Date(startTime);
        const elapsedMinutes = (now - start) / (1000 * 60);
        return elapsedMinutes >= maxMinutes;
    }
};

// Esponi tutte le utility globalmente
if (typeof window !== 'undefined') {
    window.EXAMLOCK_HELPERS = {
        GoogleForms: GoogleFormsHelper,
        Storage: StorageHelper,
        Log: LogHelper,
        Time: TimeHelper,
        Utils: Utils // Quelli già esistenti
    };
    
    // Backward compatibility
    window.EXAMLOCK_UTILS = Utils;
    
    LogHelper.log('Helper system caricato', null, 'success');
}