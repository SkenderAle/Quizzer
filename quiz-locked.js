// In index.html, sostituisci il form submit con:
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Salva dati...
    const studentData = { ... };
    localStorage.setItem('examlock_student', JSON.stringify(studentData));
    
    // Apri quiz-locked.html come popup a schermo intero
    const popup = window.open(
        'quiz-locked.html',
        'QuizLocked',
        `width=${screen.width},height=${screen.height},left=0,top=0,scrollbars=no,toolbar=no,menubar=no,status=no,location=no,resizable=no`
    );
    
    if (popup) {
        window.close(); // Chiudi index.html
    }
});