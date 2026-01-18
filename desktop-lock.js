// DESKTOP LOCK SYSTEM - Protezioni per PC
class DesktopLock {
    constructor() {
        this.violations = [];
        this.heartbeatInterval = null;
        this.isLocked = false;
        this.init();
    }
    
    init() {
        this.forceFullscreen();
        this.setupEventListeners();
        this.blockShortcuts();
        this.startHeartbeat();
        console.log('🔒 Desktop Lock attivato');
    }
    
    forceFullscreen() {
        if (!EXAMLOCK_CONFIG.ENABLE_FULLSCREEN) return;
        
        const elem = document.documentElement;
        const requestFS = elem.requestFullscreen || elem.webkitRequestFullscreen || 
                         elem.mozRequestFullScreen || elem.msRequestFullscreen;
        
        if (requestFS) {
            requestFS.call(elem).catch(e => {
                this.logViolation('FULLSCREEN_DENIED', e.message);
            });
            
            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement) {
                    this.logViolation('EXITED_FULLSCREEN');
                    requestFS.call(elem);
                }
            });
        }
    }
    
    setupEventListeners() {
        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.logViolation('TAB_SWITCH');
                this.showPopupWarning('Tentativo di cambio tab/pagina rilevato!');
            }
        });
        
        // Window blur
        window.addEventListener('blur', () => {
            if (document.hasFocus()) {
                this.logViolation('WINDOW_BLUR');
            }
        });
        
        // Right click block
        document.addEventListener('contextmenu', e => {
            e.preventDefault();
            this.logViolation('RIGHT_CLICK');
            return false;
        });
        
        // Copy/paste block
        document.addEventListener('copy', e => e.preventDefault());
        document.addEventListener('cut', e => e.preventDefault());
        document.addEventListener('paste', e => e.preventDefault());
    }
    
    blockShortcuts() {
        if (!EXAMLOCK_CONFIG.BLOCK_KEYBOARD_SHORTCUTS) return;
        
        document.addEventListener('keydown', e => {
            const blocked = [
                {key: 'F12', desc: 'DevTools'},
                {ctrl: true, shift: true, key: 'I', desc: 'DevTools'},
                {ctrl: true, shift: true, key: 'J', desc: 'Console'},
                {ctrl: true, shift: true, key: 'C', desc: 'Inspector'},
                {ctrl: true, key: 'U', desc: 'View Source'},
                {ctrl: true, key: 'S', desc: 'Save'},
                {ctrl: true, key: 'P', desc: 'Print'},
                {alt: true, key: 'Tab', desc: 'Switch App'}
            ];
            
            for (const combo of blocked) {
                const ctrlMatch = !combo.ctrl || e.ctrlKey;
                const shiftMatch = !combo.shift || e.shiftKey;
                const altMatch = !combo.alt || e.altKey;
                const keyMatch = e.key === combo.key;
                
                if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.logViolation(`KEY_BLOCKED_${combo.desc}`);
                    return false;
                }
            }
        }, true);
    }
    
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, 10000);
    }
    
    sendHeartbeat() {
        const data = {
            type: 'HEARTBEAT',
            time: new Date().toISOString(),
            violations: this.violations.length,
            page: window.location.href
        };
        
        // Invia a endpoint configurato
        fetch(EXAMLOCK_CONFIG.API_ENDPOINTS.LOG_HEARTBEAT, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).catch(e => console.log('Heartbeat failed:', e));
    }
    
    logViolation(type, details = '') {
        const violation = {
            type,
            details,
            timestamp: new Date().toISOString(),
            page: window.location.href
        };
        
        this.violations.push(violation);
        EXAMLOCK_UTILS.log(`Violazione: ${type}`, 'warn');
        
        // Invia al server
        this.sendViolationToServer(violation);
        
        // Controlla limite
        if (this.violations.length >= EXAMLOCK_CONFIG.MAX_VIOLATIONS) {
            this.forceTermination('TROPPE_VIOLAZIONI');
        }
        
        // Aggiorna contatore visivo
        this.updateViolationCounter();
    }
    
    sendViolationToServer(violation) {
        fetch(EXAMLOCK_CONFIG.API_ENDPOINTS.LOG_VIOLATION, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(violation)
        }).catch(e => console.log('Violation log failed:', e));
    }
    
    showPopupWarning(message) {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        popup.innerHTML = `
            <strong>⚠️ ATTENZIONE</strong>
            <p style="margin: 5px 0 0; font-size: 14px;">${message}</p>
            <p style="margin: 5px 0 0; font-size: 12px; opacity: 0.9;">
                Violazione ${this.violations.length}/${EXAMLOCK_CONFIG.MAX_VIOLATIONS}
            </p>
        `;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            if (popup.parentNode) popup.remove();
        }, 5000);
    }
    
    updateViolationCounter() {
        const counter = document.getElementById('violationCounter');
        if (counter) {
            counter.textContent = `Violazioni: ${this.violations.length}`;
            counter.style.color = this.violations.length > 2 ? '#ff4444' : 'white';
        }
    }
    
    forceTermination(reason) {
        alert(`🚨 QUIZ TERMINATO\nMotivo: ${reason}`);
        
        // Invia form se presente
        const iframe = document.querySelector('iframe');
        if (iframe) {
            iframe.contentWindow.postMessage('FORCE_SUBMIT', '*');
        }
        
        setTimeout(() => {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.close();
            }
        }, 3000);
    }
}

// Avvia automaticamente se nella pagina quiz
if (window.location.pathname.includes('quiz-locked')) {
    document.addEventListener('DOMContentLoaded', () => {
        window.desktopLock = new DesktopLock();
    });
}