// --- TRAIL MAKING TEST ---//

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const mainTitle = document.getElementById('main-title');
    const testContainer = document.getElementById('test-container');
    const instructionsDiv = document.getElementById('instructions');
    const resetButton = document.getElementById('reset-button');
    const timerDisplay = document.getElementById('timer');
    const errorCounterDisplay = document.getElementById('error-counter');
    const hitCounterDisplay = document.getElementById('hit-counter');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    

    // Results divs
    const resultsDiv = document.getElementById('results');
    const partAResultsDiv = document.getElementById('part-a-results');
    const finalTimeSpanA = document.getElementById('final-time-a');
    const finalErrorsSpanA = document.getElementById('final-errors-a');
    const partBResultsDiv = document.getElementById('part-b-results');
    const finalTimeSpanB = document.getElementById('final-time-b');
    const finalErrorsSpanB = document.getElementById('final-errors-b');
    const totalResultsDiv = document.getElementById('total-results');

    // ✅ NUEVOS ELEMENTOS PARA MOSTRAR VARIABLES CALCULADAS
    const finalScoreSpanA = document.getElementById('final-score-a');
    const finalScoreSpanB = document.getElementById('final-score-b');
    const totalHitsSpan = document.getElementById('total-hits');
    const totalScoreSpan = document.getElementById('total-score');

    // --- TEST CONFIGURATION ---
    const partAConfig = {
        title: "Trail Making Test (Parte A)",
        backgroundImage: "url('images/TrailMaking1-a.jpg')",
        sequence: Array.from({ length: 25 }, (_, i) => String(i + 1)),
        positions: [
            { value: '1', pos: [68, 50] },
            { value: '2', pos: [40, 60] },
            { value: '3', pos: [74, 64] },
            { value: '4', pos: [74, 34] },
            { value: '5', pos: [36, 35] },
            { value: '6', pos: [50, 42] },
            { value: '7', pos: [34, 50] },
            { value: '8', pos: [20, 65] },
            { value: '9', pos: [25, 75] },
            { value: '10', pos: [30, 63] },
            { value: '11', pos: [64, 79] },
            { value: '12', pos: [14, 86] },
            { value: '13', pos: [22, 44] },
            { value: '14', pos: [10, 54] },
            { value: '15', pos: [7, 12] },
            { value: '16', pos: [21, 22] },
            { value: '17', pos: [60, 6] },
            { value: '18', pos: [45, 24] },
            { value: '19', pos: [83, 15] },
            { value: '20', pos: [68, 13] },
            { value: '21', pos: [90, 7] },
            { value: '22', pos: [86, 33] },
            { value: '23', pos: [90, 90] },
            { value: '24', pos: [82, 47] },
            { value: '25', pos: [80, 84] }
        ]
    };

    const partBConfig = {
        title: "Trail Making Test (Parte B)",
        backgroundImage: "url('images/background-part-b.jpg')",
        sequence: ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E', '6', 'F', '7', 'G', '8', 'H', '9', 'I', '10', 'J', '11', 'K', '12', 'L', '13'],
        positions: [
            { value: '1', pos: [53, 55] },
            { value: 'A', pos: [62, 68] },
            { value: '2', pos: [39, 77] },
            { value: 'B', pos: [37, 36] },
            { value: '3', pos: [50, 36] },
            { value: 'C', pos: [65, 58] },
            { value: '4', pos: [46, 27] },
            { value: 'D', pos: [72, 22] },
            { value: '5', pos: [76, 53] },
            { value: 'E', pos: [74, 80] },
            { value: '6', pos: [47, 74] },
            { value: 'F', pos: [25, 85] },
            { value: '7', pos: [43, 42] },
            { value: 'G', pos: [34, 68] },
            { value: '8', pos: [19, 20] },
            { value: 'H', pos: [25, 50] },
            { value: '9', pos: [28, 25] },
            { value: 'I', pos: [55, 25] },
            { value: '10', pos: [86, 20] },
            { value: 'J', pos: [76, 68] },
            { value: '11', pos: [85, 90] },
            { value: 'K', pos: [18, 92] },
            { value: '12', pos: [15, 72] },
            { value: 'L', pos: [20, 78] },
            { value: '13', pos: [10, 10] }
        ]
    };

    // --- STATE MANAGEMENT ---
    let state = {};
    let currentPart = 'A';
    let partAResult = null;
    let isMouseDown = false;
    let permanentLines = [];

    // ✅ Variables globales de resultados
    let aciertosTareaA = 0, tiempoTareaA = 0, puntajeTareaA = 0;
    let aciertosTareaB = 0, tiempoTareaB = 0, puntajeTareaB = 0;
    let totalAciertos = 0, totalTrailMT = 0;

    // --- Global Mouse Listeners ---
    document.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isMouseDown = true;
        if (state.gameActive) {
            document.addEventListener('mousemove', handleMouseMove);
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            const wasMouseDown = isMouseDown;
            isMouseDown = false;
            document.removeEventListener('mousemove', handleMouseMove);

            if (state.gameActive && wasMouseDown) {
                const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
                if (elementUnderCursor && elementUnderCursor.id === 'reset-button') {
                    redrawCanvas();
                    return;
                }
                const circleUnderCursor = elementUnderCursor ? elementUnderCursor.closest('.circle') : null;
                if (circleUnderCursor) {
                    processConnection(circleUnderCursor);
                }
            }
            redrawCanvas();
        }
    });

    function resetState() {
        state = {
            currentIndex: 0,
            startTime: null,
            timerInterval: null,
            errorCount: 0,
            hitCount: 0,
            lastCorrectPosition: null,
            gameActive: false,
        };
        permanentLines = [];
    }

    function initializeTest(part) {
        currentPart = part;
        const config = (part === 'A') ? partAConfig : partBConfig;

        resetState();
        document.removeEventListener('mousemove', handleMouseMove);
        testContainer.innerHTML = '';
        testContainer.appendChild(canvas);

        if (part === 'A') {
            resultsDiv.classList.add('hidden');
            partAResultsDiv.classList.add('hidden');
            partBResultsDiv.classList.add('hidden');
            totalResultsDiv.classList.add('hidden');
            partAResult = null;
        }

        timerDisplay.textContent = '0s';
        errorCounterDisplay.textContent = '0';
        hitCounterDisplay.textContent = '0';
        mainTitle.textContent = config.title;

        const rect = testContainer.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        testContainer.style.backgroundImage = config.backgroundImage;
        testContainer.style.backgroundSize = 'contain';

        config.positions.forEach(item => {
            const circle = document.createElement('div');
            circle.classList.add('circle');
            circle.textContent = item.value;
            circle.dataset.value = item.value;
            circle.style.left = `calc(${item.pos[0]}% - 22px)`;
            circle.style.top = `calc(${item.pos[1]}% - 22px)`;
            testContainer.appendChild(circle);
        });
    }

    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        permanentLines.forEach(line => {
            drawLine(line.from, line.to, { color: line.color });
        });
    }

    function processConnection(clickedCircle) { // MODIFIED
        const config = (currentPart === 'A') ? partAConfig : partBConfig;
        const targetSequence = config.sequence;
        const clickedValue = clickedCircle.dataset.value;

        const endPosition = {
            x: clickedCircle.offsetLeft + clickedCircle.offsetWidth / 2,
            y: clickedCircle.offsetTop + clickedCircle.offsetHeight / 2
        };

        // --- Handle first click ---
        if (state.lastCorrectPosition === null) {
            const isCorrect = (clickedValue === targetSequence[0]);
            if (isCorrect) {
                clickedCircle.classList.add('correct');
            } else {
                state.errorCount++;
                errorCounterDisplay.textContent = state.errorCount;
                clickedCircle.classList.add('error');
                setTimeout(() => clickedCircle.classList.remove('error'), 300);
            }
            // In both cases, set the starting point for the next connection
            const clickedIndex = targetSequence.indexOf(clickedValue);
            if (clickedIndex !== -1) {
                state.currentIndex = clickedIndex;
                state.lastCorrectPosition = endPosition;
            }
            return;
        }

        // --- Handle subsequent clicks ---

        // Avoid reconnecting the same circle or one already marked as correct
        if ((endPosition.x === state.lastCorrectPosition.x && endPosition.y === state.lastCorrectPosition.y) || clickedCircle.classList.contains('correct')) {
            return;
        }

        const isCorrect = (clickedValue === targetSequence[state.currentIndex + 1]);
        
        if (isCorrect) {
            // Correct connection
            const permanentLine = { from: state.lastCorrectPosition, to: endPosition, color: 'rgba(0, 100, 0, 0.7)' };
            permanentLines.push(permanentLine);
            state.hitCount++;
            hitCounterDisplay.textContent = state.hitCount;
            clickedCircle.classList.add('correct');
        } else {
            // Incorrect connection
            const incorrectLine = { from: state.lastCorrectPosition, to: endPosition, color: 'blue' };
            permanentLines.push(incorrectLine);
            state.errorCount++;
            errorCounterDisplay.textContent = state.errorCount;
            clickedCircle.classList.add('error');
            setTimeout(() => clickedCircle.classList.remove('error'), 300);
        }

        // In both cases, update the state to continue from the new point
        const clickedIndex = targetSequence.indexOf(clickedValue);
        if (clickedIndex !== -1) {
            state.currentIndex = clickedIndex;
            state.lastCorrectPosition = endPosition;
        }
        
        redrawCanvas();

        // Check for test completion
        if (state.currentIndex === targetSequence.length - 1) {
            endTest();
        }
    }

    function handleMouseMove(e) {
        redrawCanvas();
        if (!state.lastCorrectPosition) return;
        const rect = canvas.getBoundingClientRect();
        const currentPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        drawLine(state.lastCorrectPosition, currentPos, { isTemporary: true });
    }

    function startTimer() {
        state.startTime = Date.now();
        state.timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);
        timerDisplay.textContent = `${elapsedTime}s`;
    }

    function drawLine(fromPos, toPos, options = {}) {
        const {
            isTemporary = false,
            color = 'rgba(0, 100, 0, 0.7)',
            lineWidth = 3
        } = options;

        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        if (isTemporary) {
            ctx.setLineDash([5, 10]);
        } else {
            ctx.setLineDash([]);
        }
        ctx.stroke();
    }

    function endTest() {
        clearInterval(state.timerInterval);
        state.gameActive = false;
        document.removeEventListener('mousemove', handleMouseMove);

        const finalTime = Math.floor((Date.now() - state.startTime) / 1000);
        const testResult = {
            timeInSeconds: finalTime,
            errors: state.errorCount
        };

        document.querySelectorAll('.circle').forEach(c => {
            c.style.pointerEvents = 'none';
        });

        if (currentPart === 'A') {
            partAResult = testResult;

            // ✅ Calcular resultados Parte A
            aciertosTareaA = state.hitCount;
            tiempoTareaA = finalTime;
            puntajeTareaA = (tiempoTareaA > 0) ? (aciertosTareaA / tiempoTareaA) : 0;

            console.log("Parte A:", { aciertosTareaA, tiempoTareaA, puntajeTareaA });

            finalTimeSpanA.textContent = `${tiempoTareaA}s`;
            finalErrorsSpanA.textContent = state.errorCount;
            finalScoreSpanA.textContent = puntajeTareaA.toFixed(2);
            partAResultsDiv.classList.remove('hidden');
            resultsDiv.classList.remove('hidden');

            resetButton.textContent = 'Iniciar Parte B';
            resetButton.disabled = false;

        } else {
            const partBResult = testResult;

            // ✅ Calcular resultados Parte B
            aciertosTareaB = state.hitCount;
            tiempoTareaB = finalTime;
            puntajeTareaB = (tiempoTareaB > 0) ? (aciertosTareaB / tiempoTareaB) : 0;

            // ✅ Totales
            totalAciertos = aciertosTareaA + aciertosTareaB;
            totalTrailMT = puntajeTareaA + puntajeTareaB;

            console.log("Parte B:", { aciertosTareaB, tiempoTareaB, puntajeTareaB });
            console.log("Totales:", { totalAciertos, totalTrailMT });

            finalTimeSpanB.textContent = `${tiempoTareaB}s`;
            finalErrorsSpanB.textContent = state.errorCount;
            finalScoreSpanB.textContent = puntajeTareaB.toFixed(2);
            totalHitsSpan.textContent = totalAciertos;
            totalScoreSpan.textContent = totalTrailMT.toFixed(2);

            partBResultsDiv.classList.remove('hidden');
            totalResultsDiv.classList.remove('hidden');
            resultsDiv.classList.remove('hidden');

            resetButton.textContent = 'Reiniciar Test';
            resetButton.disabled = false;
        }
    }

    function handleControlButtonClick() {
        const action = resetButton.textContent;
        switch (action) {
            case 'Iniciar Prueba':
                instructionsDiv.classList.add('hidden');
                state.gameActive = true;
                startTimer();
                resetButton.textContent = 'Terminar Parte A';
                break;
            case 'Terminar Parte A':
            case 'Terminar Parte B':
                endTest();
                break;
            case 'Iniciar Parte B':
                initializeTest('B');
                state.gameActive = true;
                startTimer();
                resetButton.textContent = 'Terminar Parte B';
                break;
            case 'Reiniciar Test':
                initializeTest('A');
                instructionsDiv.classList.remove('hidden');
                resetButton.textContent = 'Iniciar Prueba';
                break;
        }
    }

    resetButton.addEventListener('click', handleControlButtonClick);
    initializeTest('A');
    resetButton.textContent = 'Iniciar Prueba';
    resetButton.disabled = false;
});
