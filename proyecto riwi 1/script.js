document.addEventListener('DOMContentLoaded', () => {
    const testContainer = document.getElementById('test-container');
    const resetButton = document.getElementById('reset-button');
    const timerDisplay = document.getElementById('timer');
    const errorDisplay = document.getElementById('error-count');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const resultsDiv = document.getElementById('results');
    const finalTimeSpan = document.getElementById('final-time');
    const finalErrorsSpan = document.getElementById('final-errors');

    // Coordenadas de los círculos en porcentajes [x, y] del contenedor.
    const circlePositions = [
        { number: 1, pos: [62, 53] }, { number: 2, pos: [50, 65] },
        { number: 3, pos: [67, 72] }, { number: 4, pos: [78, 38] },
        { number: 5, pos: [65, 22] }, { number: 6, pos: [45, 9] },
        { number: 7, pos: [25, 20] }, { number: 8, pos: [8, 33] },
        { number: 9, pos: [22, 48] }, { number: 10, pos: [38, 58] },
        { number: 11, pos: [20, 78] }, { number: 12, pos: [41, 69] },
        { number: 13, pos: [13, 62] }, { number: 14, pos: [33, 41] },
        { number: 15, pos: [50, 30] }, { number: 16, pos: [31, 28] },
        { number: 17, pos: [15, 15] }, { number: 18, pos: [38, 3] },
        { number: 19, pos: [59, 40] }, { number: 20, pos: [82, 55] },
        { number: 21, pos: [90, 75] }, { number: 22, pos: [75, 85] },
        { number: 23, pos: [55, 65] }, { number: 24, pos: [35, 90] },
        { number: 25, pos: [10, 85] }
    ];

    let state = {};
    // Nuevas variables para manejar el estado de arrastre
    let isDrawing = false;
    let permanentLines = [];

    function resetState() {
        state = {
            currentNumber: 1,
            startTime: null,
            timerInterval: null,
            errorCount: 0,
            lastCorrectPosition: null,
            gameActive: false,
        };
    }

    function setupTest() {
        resetState();
        isDrawing = false;
        permanentLines = [];

        // Limpiar círculos anteriores, pero mantener el canvas
        testContainer.innerHTML = '';
        testContainer.appendChild(canvas);

        resultsDiv.classList.add('hidden');
        timerDisplay.textContent = '0s';
        errorDisplay.textContent = '0';

        // Ajustar tamaño del canvas al contenedor
        const rect = testContainer.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Crear y posicionar los círculos
        circlePositions.forEach(item => {
            const circle = document.createElement('div');
            circle.classList.add('circle');
            circle.textContent = item.number;
            circle.dataset.number = item.number;
            // Posicionar el círculo. Restamos la mitad del tamaño para centrarlo.
            circle.style.left = `calc(${item.pos[0]}% - 22px)`;
            circle.style.top = `calc(${item.pos[1]}% - 22px)`;

            // Cambiamos el evento de 'click' a 'mousedown' para iniciar el arrastre
            circle.addEventListener('mousedown', handleMouseDown);
            testContainer.appendChild(circle);
        });
    }

    function redrawCanvas() {
        // Limpia el canvas por completo
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Vuelve a dibujar todas las líneas permanentes que ya se han completado
        permanentLines.forEach(line => {
            drawLine(line.from, line.to, false); // Dibuja líneas sólidas
        });
    }

    function handleMouseDown(e) {
        const clickedCircle = e.target.closest('.circle');
        if (!clickedCircle) return;

        const clickedNumber = parseInt(clickedCircle.dataset.number);

        // Inicia el juego y el temporizador al presionar sobre el número 1
        if (!state.gameActive && clickedNumber === 1) {
            state.gameActive = true;
            startTimer();
            clickedCircle.classList.add('correct');
        }

        if (!state.gameActive) return;

        // Solo se puede empezar a dibujar desde el último número correcto
        if (clickedNumber === state.currentNumber) {
            isDrawing = true;
            state.lastCorrectPosition = {
                x: clickedCircle.offsetLeft + clickedCircle.offsetWidth / 2,
                y: clickedCircle.offsetTop + clickedCircle.offsetHeight / 2
            };
            // Escuchamos el movimiento y el soltar el clic en todo el documento
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    }

    function handleMouseMove(e) {
        if (!isDrawing) return;

        // Limpia y redibuja las líneas permanentes
        redrawCanvas();

        // Calcula la posición actual del ratón relativa al canvas
        const rect = canvas.getBoundingClientRect();
        const currentPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        // Dibuja la línea temporal de arrastre (punteada)
        drawLine(state.lastCorrectPosition, currentPos, true);
    }

    function handleMouseUp(e) {
        if (!isDrawing) return;

        isDrawing = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Limpia la línea temporal
        redrawCanvas();

        // Detecta sobre qué elemento se soltó el ratón
        const releasedOnElement = document.elementFromPoint(e.clientX, e.clientY);
        const releasedOnCircle = releasedOnElement ? releasedOnElement.closest('.circle') : null;

        // Comprueba si se soltó sobre el siguiente círculo correcto
        if (releasedOnCircle && parseInt(releasedOnCircle.dataset.number) === state.currentNumber + 1) {
            // --- ACIERTO ---
            const nextCircle = releasedOnCircle;
            nextCircle.classList.add('correct');
            const newPosition = {
                x: nextCircle.offsetLeft + nextCircle.offsetWidth / 2,
                y: nextCircle.offsetTop + nextCircle.offsetHeight / 2
            };

            // Guarda y dibuja la línea como permanente
            const permanentLine = { from: state.lastCorrectPosition, to: newPosition };
            permanentLines.push(permanentLine);
            drawLine(permanentLine.from, permanentLine.to, false);

            state.currentNumber++; // Avanza al siguiente número

            if (state.currentNumber >= circlePositions.length) {
                endTest(); // El test termina al conectar con el último número
            }
        } else {
            // --- ERROR ---
            state.errorCount++;
            errorDisplay.textContent = state.errorCount;
            if (releasedOnCircle) { // Animación de error si se soltó sobre un círculo incorrecto
                releasedOnCircle.classList.add('error');
                setTimeout(() => releasedOnCircle.classList.remove('error'), 300);
            }
        }
    }

    function startTimer() {
        state.startTime = Date.now();
        state.timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);
        timerDisplay.textContent = `${elapsedTime}s`;
    }

    function drawLine(fromPos, toPos) {
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.strokeStyle = 'rgba(0, 100, 0, 0.7)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    function endTest() {
        clearInterval(state.timerInterval);
        state.gameActive = false;

        // Mostrar resultados finales
        const finalTime = Math.floor((Date.now() - state.startTime) / 1000);
        finalTimeSpan.textContent = `${finalTime} segundos`;
        finalErrorsSpan.textContent = state.errorCount;
        resultsDiv.classList.remove('hidden');

        // Desactivar clics en los círculos
        document.querySelectorAll('.circle').forEach(c => {
            c.style.pointerEvents = 'none';
        });
    }

    // --- INICIALIZACIÓN ---

    // Asignar el evento al botón de reinicio
    resetButton.addEventListener('click', setupTest);

    // Configurar el test por primera vez al cargar la página
    setupTest();
});