
import GoNoGoGame from './Gono_go.js';
import StroopGame from './stroop.js';

document.addEventListener('DOMContentLoaded', () => {
    const gngSection = document.getElementById('goNoGo-section');
    const stroopSection = document.getElementById('stroop-section');


    const participantId = 'participante-test-01';
    const sessionId = 'sesion-test-abc';


    const onGngComplete = (results) => {
        console.log('Go/No-Go finalizado. Resultados:', results);
        
        gngSection.classList.add('d-none');
        stroopSection.classList.remove('d-none');

        // Inicia el juego Stroop
        new StroopGame(stroopSection, onStroopComplete, {
            participantId,
            sessionId,
            debug: true
        });
    };

    const onStroopComplete = (results) => {
        console.log('Stroop finalizado. Resultados:', results);
        stroopSection.innerHTML = '<h1>¡Has completado todos los juegos!</h1>';
    };

    new GoNoGoGame(gngSection, onGngComplete, { participantId, sessionId, debug: true });
});