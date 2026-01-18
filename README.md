# 🛡️ Quizzer - Sistema Avanzato di Monitoraggio Quiz

Sistema di protezione e monitoraggio per quiz online, pensato per funzionare su qualsiasi dispositivo senza richiedere Chromebook o Google Workspace a pagamento.

## ✨ Funzionalità Principali

### 🔒 Protezione Avanzata
- **Monitoraggio cambio schede/finestre** (visibilitychange API)
- **Blocco tasti di sviluppo** (F12, Ctrl+Shift+I, Ctrl+Shift+C)
- **Disabilitazione copia/incolla** sulla pagina principale
- **Blocco click destro** e menu contestuale
- **Rilevamento perdita focus** (click su altre applicazioni)
- **Protezione screenshot** (blocco Print Screen)

### 📊 Logging Dettagliato
- **Registrazione di tutti gli eventi** in localStorage
- **Tracciamento temporale** (secondo per secondo)
- **Categorizzazione eventi** (INFO, WARNING, VIOLATION, CRITICAL)
- **Sessioni uniche** per ogni studente
- **Persistenza dati** per analisi successiva

### 👨‍🏫 Dashboard Insegnante
- **Panoramica in tempo reale** di tutte le sessioni
- **Filtri avanzati** per studente, data, tipo di violazione
- **Report esportabili** in JSON
- **Visualizzazione log completi** per studente
- **Statistiche dettagliate**

### 🧠 Deterrenza Psicologica
- **Messaggi dissuasivi random** durante il quiz
- **Timer prominente** con cambi di colore
- **Avvisi violazioni** in tempo reale
- **Sistema di alert** per l'insegnante

## 🚀 Installazione e Utilizzo

### 1. Configurazione Iniziale
1. Clona il repository o copia i file nella tua cartella web
2. Apri `index.html` nel browser per la pagina di accesso
3. Configura i dati studente nel `localStorage`

### 2. Per lo Studente
1. Accede tramite `index.html`
2. Inserisce nome, cognome, classe
3. Viene reindirizzato a `quiz-locked.html`
4. Il sistema avvia automaticamente il monitoraggio
5. Completa il Google Form nell'iframe
6. Tutte le azioni vengono registrate

### 3. Per l'Insegnante
1. Apri `teacher-dashboard-enhanced.html`
2. Visualizza tutte le sessioni in corso/completate
3. Analizza le violazioni e gli eventi critici
4. Esporta i report per analisi approfondite
5. Monitora le emergenze segnalate dagli studenti

## 📁 Struttura dei File
