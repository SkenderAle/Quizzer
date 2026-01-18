// Aggiungi queste proprietà all'inizio della classe (nel constructor):
this.suspicionScore = 0;
this.lastActivityTime = Date.now();
this.focusLostCount = 0;

// Sostituisci la funzione startProtectionMonitoring() con questa versione MIGLIORATA:
startProtectionMonitoring() {
    console.log('🕵️ Sistema di rilevamento sospetti attivato');
    
    // 1. TRACCIA ATTIVITÀ DELL'UTENTE
    document.addEventListener('mousemove', () => this.recordUserActivity());
    document.addEventListener('click', () => this.recordUserActivity());
    document.addEventListener('keydown', () => this.recordUserActivity());
    
    // 2. RILEVA PERDITA DI FOCUS (indizio di cambio app)
    let focusCheckTimeout;
    window.addEventListener('blur', () => {
        this.focusLostCount++;
        
        // Se perde focus troppo spesso in poco tempo = SOSPETTO
        if (this.focusLostCount > 3) {
            this.addSuspicion('FREQUENT_FOCUS_LOSS', 'Troppe perdite di focus in breve tempo');
        }
        
        // Reset dopo 30 secondi
        clearTimeout(focusCheckTimeout);
        focusCheckTimeout = setTimeout(() => {
            this.focusLostCount = 0;
        }, 30000);
    });
    
    // 3. RILEVA INATTIVITÀ SOSPETTA (potrebbe essere su altra app)
    setInterval(() => {
        const inactiveSeconds = (Date.now() - this.lastActivityTime) / 1000;
        
        if (inactiveSeconds > 45) { // 45 secondi di inattività
            this.addSuspicion('PROLONGED_INACTIVITY', 
                `Inattivo per ${Math.round(inactiveSeconds)} secondi (forse usando altre app?)`);
        }
        
        if (inactiveSeconds > 120) { // 2 minuti di inattività = GRAVE
            this.recordViolation('EXTREME_INACTIVITY', 
                'Inattività estrema - Probabile uso di altre applicazioni');
        }
    }, 10000); // Controlla ogni 10 secondi
    
    // 4. "HEARTBEAT" FITTIZIO per far credere al monitoraggio di rete
    this.startFakeNetworkMonitoring();
}

// AGGIUNGI QUESTE NUOVE FUNZIONI alla classe:
recordUserActivity() {
    this.lastActivityTime = Date.now();
    this.suspicionScore = Math.max(0, this.suspicionScore - 1); // Riduce sospetti se attivo
}

addSuspicion(type, reason) {
    this.suspicionScore += 2;
    console.log(`🤔 Sospetto [${type}]: ${reason} (Punteggio: ${this.suspicionScore}/10)`);
    
    // Se accumuli troppi sospetti = Violazione
    if (this.suspicionScore >= 10) {
        this.recordViolation('SUSPICIOUS_BEHAVIOR_PATTERN', 
            `Comportamento sospetto rilevato: ${reason}`);
        this.suspicionScore = 5; // Reset parziale
    }
    
    // Mostra avviso graduale
    if (this.suspicionScore >= 7) {
        this.showWarningMessage('⚠️ ATTENZIONE: Comportamento sospetto rilevato');
    }
}

startFakeNetworkMonitoring() {
    // Simula invio dati al server (per impressione psicologica)
    setInterval(() => {
        const fakeData = {
            timestamp: new Date().toISOString(),
            focus: document.hasFocus(),
            hidden: document.hidden,
            activity: Date.now() - this.lastActivityTime < 5000 ? 'active' : 'inactive',
            suspicion: this.suspicionScore
        };
        
        // Mostra nell'interfaccia che "sta inviando dati"
        this.updateMonitoringStatus();
        
    }, 15000); // Ogni 15 secondi
}

updateMonitoringStatus() {
    const statusElement = document.getElementById('monitoringStatus');
    if (statusElement) {
        const time = new Date().toLocaleTimeString('it-IT', { 
            hour: '2-digit', minute: '2-digit', second: '2-digit' 
        });
        statusElement.innerHTML = `
            <div style="font-size: 0.9rem; color: #4cd137;">
                ✅ Monitoraggio attivo - Ultimo aggiornamento: ${time}
            </div>
        `;
        
        // Effetto "lampeggiante" per sembrare attivo
        setTimeout(() => {
            statusElement.innerHTML = `
                <div style="font-size: 0.9rem; color: #fbc531;">
                📡 Trasmissione dati al server...
                </div>
            `;
        }, 1000);
    }
}

showWarningMessage(message) {
    const warning = document.createElement('div');
    warning.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff9f1a;
        color: black;
        padding: 15px;
        border-radius: 10px;
        z-index: 99999;
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    warning.textContent = message;
    document.body.appendChild(warning);
    
    setTimeout(() => {
        if (warning.parentNode) warning.remove();
    }, 5000);
}