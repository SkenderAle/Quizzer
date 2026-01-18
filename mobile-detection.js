// MOBILE PROTECTION SYSTEM
class MobileProtection {
    constructor() {
        this.isMobile = EXAMLOCK_UTILS.isMobileDevice();
        this.suspicions = [];
        this.lastActivity = Date.now();
        this.activityCheck = null;
        
        if (this.isMobile) this.init();
    }
    
    init() {
        console.log('📱 Mobile Protection attivato');
        
        this.setupEventListeners();
        this.startActivityMonitor();
        this.preventSleep();
        this.setupTouchTracking();
    }
    
    setupEventListeners() {
        // App in background
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.logSuspicion('APP_BACKGROUNDED');
                this.showToast('Non uscire dall\'app!');
            }
        });
        
        // Orientation change (split screen)
        window.addEventListener('resize', () => {
            setTimeout(() => {
                const ratio = window.innerWidth / window.innerHeight;
                if (ratio < 0.4 || ratio > 2.5) {
                    this.logSuspicion('SCREEN_SPLIT_SUSPECTED');
                }
            }, 300);
        });
        
        // Battery changes (second device?)
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => {
                battery.addEventListener('levelchange', () => {
                    if (battery.level < 0.1) {
                        this.logSuspicion('LOW_BATTERY_POSSIBLE_SECOND_DEVICE');
                    }
                });
            });
        }
    }
    
    startActivityMonitor() {
        this.activityCheck = setInterval(() => {
            const idle = Date.now() - this.lastActivity;
            if (idle > 45000) { // 45 secondi inattivo
                this.logSuspicion('PROLONGED_INACTIVITY', `${Math.round(idle/1000)}s`);
            }
        }, 10000);
    }
    
    preventSleep() {
        // Mantieni schermo acceso
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen').catch(console.log);
        }
        
        // Video nascosto per prevenire sleep
        const keepAliveVideo = document.createElement('video');
        keepAliveVideo.muted = true;
        keepAliveVideo.playsInline = true;
        keepAliveVideo.style.cssText = 'position:absolute; width:1px; height:1px; opacity:0.01;';
        
        // Crea stream bianco
        const canvas = document.createElement('canvas');
        canvas.width = 2;
        canvas.height = 2;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 2, 2);
        
        const stream = canvas.captureStream(1);
        keepAliveVideo.srcObject = stream;
        keepAliveVideo.play();
        
        document.body.appendChild(keepAliveVideo);
    }
    
    setupTouchTracking() {
        document.addEventListener('touchstart', () => {
            this.lastActivity = Date.now();
        });
        
        document.addEventListener('touchmove', () => {
            this.lastActivity = Date.now();
        });
    }
    
    logSuspicion(type, details = '') {
        const suspicion = {
            type,
            details,
            timestamp: new Date().toISOString(),
            battery: null
        };
        
        this.suspicions.push(suspicion);
        console.warn('📱 Sospetto:', suspicion);
        
        // Invia al server
        this.sendSuspicion(suspicion);
        
        // Se troppe, avviso serio
        if (this.suspicions.length >= 3) {
            this.showSeriousWarning();
        }
    }
    
    sendSuspicion(suspicion) {
        fetch(EXAMLOCK_CONFIG.API_ENDPOINTS.LOG_VIOLATION, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({...suspicion, platform: 'mobile'})
        }).catch(e => console.log('Suspicion log failed'));
    }
    
    showToast(message) {
        // Crea notifica non intrusiva
        const toast = document.createElement('div');
        toast.textContent = `📱 ${message}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 68, 68, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            z-index: 10000;
            font-size: 14px;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: fadeIn 0.3s;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 3000);
    }
    
    showSeriousWarning() {
        const html = `
            <div style="
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0,0,0,0.97);
                color: white;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 25px;
            ">
                <div style="font-size: 48px; margin-bottom: 20px;">🚨</div>
                <h2 style="color: #ff4444;">ATTENZIONE</h2>
                <p style="margin: 15px 0; font-size: 16px;">
                    Attività sospette rilevate: ${this.suspicions.length}
                </p>
                <p style="margin-bottom: 30px;">
                    Il quiz potrebbe essere invalidato.
                </p>
                <button onclick="this.parentElement.remove()" 
                       style="padding: 15px 30px; background: #4285f4; 
                              color: white; border: none; border-radius: 10px;
                              font-size: 16px; font-weight: bold;">
                    HO CAPITO
                </button>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.innerHTML = html;
        document.body.appendChild(overlay.firstElementChild);
    }
    
    cleanup() {
        if (this.activityCheck) {
            clearInterval(this.activityCheck);
        }
    }
}

// Avvia su mobile
if (EXAMLOCK_UTILS.isMobileDevice()) {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileProtection = new MobileProtection();
    });
}