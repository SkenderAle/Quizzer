// start-quiz.html - CODICE CORRETTO DA SOSTITUIRE
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Pagina di avvio caricata');

    // 1. MOSTRA SUBITO I DATI DELLO STUDENTE
    const studentData = JSON.parse(localStorage.getItem('examlock_student') || '{}');
    const studentInfoDiv = document.getElementById('studentData');
    
    if (studentData.name) {
        studentInfoDiv.innerHTML = `
            <strong>👤 Studente:</strong> ${studentData.name} ${studentData.surname}
            <br><strong>🏫 Classe:</strong> ${studentData.class}
            <br><strong>🖥️ Dispositivo:</strong> ${studentData.device || 'Non rilevato'}
        `;
        console.log('✅ Dati studente caricati:', studentData.name);
    } else {
        studentInfoDiv.innerHTML = '<p style="color:#ff4444;">❌ Dati non trovati. Torna alla <a href="index.html">pagina iniziale</a>.</p>';
        console.error('Dati studente non trovati in localStorage');
        return; // Ferma l'esecuzione se non ci sono dati
    }

    // 2. RENDI CLICCABILE IL PULSANTE DI AVVIO
    const launchBtn = document.getElementById('launchBtn');
    launchBtn.disabled = false;
    launchBtn.style.opacity = '1';
    launchBtn.style.cursor = 'pointer';
    
    // 3. GESTISCI IL CLICK PER APRIRE L'AMBIENTE PROTETTO
    launchBtn.addEventListener('click', function() {
        console.log('🛡️ Tentativo di apertura ambiente protetto...');
        
        // Passa alla fase "inizializzazione"
        document.getElementById('step1').classList.remove('active');
        document.getElementById('step2').classList.add('active');
        
        // Dopo 2 secondi, apri la finestra protetta
        setTimeout(function() {
            const quizWindow = window.open(
                'quiz-locked.html',
                'ExamLockQuiz',
                'width=' + screen.width + ',height=' + screen.height + ',fullscreen=yes,scrollbars=no,toolbar=no,menubar=no,status=no,location=no'
            );
            
            if (quizWindow) {
                console.log('✅ Finestra protetta aperta con successo');
                // Mostra messaggio di successo dopo 1 secondo
                setTimeout(function() {
                    document.getElementById('step2').classList.remove('active');
                    document.getElementById('step4').classList.add('active');
                }, 1000);
            } else {
                console.error('❌ Browser ha bloccato la finestra');
                // Mostra errore popup bloccato
                document.getElementById('step2').classList.remove('active');
                document.getElementById('step3').classList.add('active');
            }
        }, 2000);
    });

    // 4. GESTIONE PULSANTE "APRI MANUALMENTE"
    document.getElementById('manualOpenBtn').addEventListener('click', function() {
        window.open('quiz-locked.html', '_blank');
    });
    
    // 5. GESTIONE PULSANTE "RIPROVA"
    document.getElementById('retryBtn')?.addEventListener('click', function() {
        location.reload();
    });
});