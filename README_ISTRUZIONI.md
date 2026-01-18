# 🛡️ EXAMLOCK SYSTEM - Istruzioni Installazione

## 📋 COSA È INCLUSO
Sistema completo per quiz protetti con:
- Fullscreen obbligatorio per PC
- Rilevamento uscita pagina
- Blocco tasti di scelta rapida
- Protezioni per dispositivi mobile
- Dashboard insegnante
- Integrazione Google Forms

## 🚀 INSTALLAZIONE RAPIDA

### 1. PREPARAZIONE FILE
1. Crea una cartella sul tuo computer
2. Copia tutti i file forniti nella cartella
3. Modifica `index.html`:
   - Linea 58: Sostituisci `https://forms.gle/TUO_LINK_QUI` con il tuo link Google Form

### 2. UPLOAD SU GITHUB
1. Crea un nuovo repository su GitHub
2. Carica tutti i file
3. Attiva GitHub Pages:
   - Settings → Pages → Source: `main` branch → `/ (root)`
   - Salva

### 3. CONFIGURAZIONE
1. **Password Insegnante**: Cambia in due punti:
   - `config.js` linea 5: `TEACHER_PASSWORD`
   - `teacher-dashboard.html` linea 33: `TEACHER_PASSWORD`

2. **Link Google Form**: Assicurati che sia corretto in `index.html`

## 🎯 COME USARE

### PER GLI STUDENTI:
1. Accedono al tuo link GitHub Pages
2. Inseriscono nome, cognome, classe
3. Cliccano "INIZIA QUIZ"
4. Il sistema si avvia in modalità protetta

### PER L'INSEGNANTE:
1. Accedi a `tuosito.github.io/teacher-dashboard.html`
2. Inserisci password: `insegnante123` (cambiala!)
3. Monitora studenti attivi e violazioni

## ⚙️ PERSONALIZZAZIONE

### Modificare timer:
- `quiz-locked.html` linea 31: `30 * 60` (30 minuti)
- `config.js` linea 12: `AUTO_SUBMIT_AFTER_MINUTES`

### Modificare limiti violazioni:
- `config.js` linea 11: `MAX_VIOLATIONS`

### Aggiungere siti bloccati (mobile):
- `service-worker.js` linea 28-35: Aggiungi domini alla lista

## 🔧 RISOLUZIONE PROBLEMI

### Problema: Fullscreen non funziona
- Soluzione: Il browser potrebbe bloccare popup. Autorizza il sito

### Problema: Mobile non rileva uscita
- Soluzione: Limitazione tecnica. Il sistema avvisa ma non può bloccare completamente

### Problema: Google Form non si carica
- Soluzione: Assicurati che il link termini con `?embedded=true`

## 📞 SUPPORTO
Per problemi o domande, controlla:
1. Console del browser (F12 → Console)
2. Log in `config.js` (attiva `DEBUG_MODE: true`)
3. Repository GitHub per aggiornamenti

## 🔒 SICUREZZA
- Il sistema **non garantisce** protezione assoluta
- Usalo in combinazione con sorveglianza in aula
- Per massima sicurezza, usa in laboratorio controllato

## 📄 LICENZA
Sistema educativo - Libero uso per scuole