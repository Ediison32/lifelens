const colors = ["ROJO", "AZUL", "VERDE", "AMARILLO"];
const colorCodes = {
    ROJO: "red",
    AZUL: "blue",
    VERDE: "green",
    AMARILLO: "orange"
};

// TODAS LAS RESPUESTAS (100 elementos por tarea)
const respuestas = {
    tarea1: [
        "ROJO","AZUL","VERDE","ROJO","AZUL","VERDE","VERDE","ROJO","AZUL","VERDE",
        "AZUL","ROJO","AZUL","VERDE","ROJO","VERDE","AZUL","ROJO","ROJO","AZUL",
        "ROJO","ROJO","VERDE","AZUL","VERDE","AZUL","VERDE","AZUL","VERDE","ROJO",
        "ROJO","AZUL","VERDE","AZUL","VERDE","AZUL","VERDE","ROJO","VERDE","ROJO",
        "VERDE","ROJO","AZUL","ROJO","AZUL","AZUL","VERDE","VERDE","AZUL","VERDE",
        "VERDE","ROJO","AZUL","ROJO","ROJO","ROJO","AZUL","ROJO","VERDE","AZUL",
        "VERDE","ROJO","AZUL","ROJO","VERDE","AZUL","AZUL","ROJO","VERDE","ROJO",
        "ROJO","VERDE","VERDE","AZUL","AZUL","AZUL","AZUL","ROJO","VERDE","ROJO",
        "ROJO","VERDE","AZUL","ROJO","VERDE","VERDE","ROJO","VERDE","AZUL","AZUL",
        "ROJO","AZUL","ROJO","VERDE","ROJO","VERDE","ROJO","VERDE","AZUL","VERDE"
    ],
    tarea2: [
        "AZUL","ROJO","AZUL","VERDE","ROJO","ROJO","AZUL","VERDE","ROJO","AZUL",
        "VERDE","VERDE","ROJO","AZUL","VERDE","AZUL","ROJO","AZUL","VERDE","ROJO",
        "VERDE","VERDE","ROJO","ROJO","AZUL","ROJO","AZUL","VERDE","AZUL","VERDE",
        "VERDE","VERDE","ROJO","VERDE","ROJO","ROJO","ROJO","AZUL","ROJO","AZUL",
        "AZUL","AZUL","VERDE","AZUL","VERDE","ROJO","ROJO","ROJO","VERDE","AZUL",
        "AZUL","AZUL","VERDE","AZUL","VERDE","VERDE","VERDE","AZUL","ROJO","ROJO",
        "ROJO","AZUL","ROJO","AZUL","AZUL","VERDE","VERDE","VERDE","ROJO","VERDE",
        "AZUL","ROJO","AZUL","VERDE","ROJO","VERDE","VERDE","VERDE","AZUL","AZUL",
        "AZUL","ROJO","ROJO","VERDE","ROJO","ROJO","AZUL","AZUL","ROJO","VERDE",
        "VERDE","ROJO","VERDE","AZUL","AZUL","AZUL","VERDE","AZUL","ROJO","ROJO"
    ],
    tarea3: [
        "AZUL","ROJO","AZUL","VERDE","ROJO","ROJO","AZUL","VERDE","ROJO","AZUL",
        "VERDE","VERDE","ROJO","AZUL","VERDE","AZUL","ROJO","AZUL","VERDE","ROJO",
        "VERDE","VERDE","ROJO","ROJO","AZUL","ROJO","AZUL","VERDE","AZUL","VERDE",
        "VERDE","VERDE","ROJO","VERDE","ROJO","ROJO","ROJO","AZUL","ROJO","AZUL",
        "AZUL","AZUL","VERDE","AZUL","VERDE","ROJO","ROJO","ROJO","VERDE","AZUL",
        "AZUL","AZUL","VERDE","AZUL","VERDE","VERDE","VERDE","AZUL","ROJO","ROJO",
        "ROJO","AZUL","ROJO","AZUL","AZUL","VERDE","VERDE","VERDE","ROJO","VERDE",
        "AZUL","ROJO","AZUL","VERDE","ROJO","VERDE","VERDE","VERDE","AZUL","AZUL",
        "AZUL","ROJO","ROJO","VERDE","ROJO","ROJO","AZUL","AZUL","ROJO","VERDE",
        "VERDE","ROJO","VERDE","AZUL","AZUL","AZUL","VERDE","AZUL","ROJO","ROJO"
    ]
};

const tasks = [
    { name: "Tarea 1", instructions: "Selecciona la palabra correcta (ignora el color).", type: "word" },
    { name: "Tarea 2", instructions: "Selecciona el color de las XXXX.", type: "colorXXXX" },
    { name: "Tarea 3", instructions: "Selecciona el color con que está escrita la palabra (palabra aleatoria distinta del color).", type: "colorWord" }
];

let currentTask = 0;
let currentTrial = 0;
let score = 0;
let timer;
let timeLeft = 45;
let scoresPorTarea = [0, 0, 0];

// DOM
const startBtn = document.getElementById('start-btn');
const startTaskBtn = document.getElementById('start-task-btn');
const testDiv = document.getElementById('test');
const taskTitle = document.getElementById('task-title');
const instructions = document.getElementById('instructions');
const stimulusDiv = document.getElementById('stimulus');
const optionsDiv = document.getElementById('options');
const resultDiv = document.getElementById('result');
const timerDiv = document.getElementById('timer');
const taskCounter = document.getElementById('task-counter');

// Iniciar test
startBtn.addEventListener('click', () => {
    startBtn.classList.add('hidden');
    testDiv.classList.remove('hidden');
    showInstructions();
});

// Mostrar instrucciones
function showInstructions() {
    if (currentTask >= tasks.length) {
        showResult();
        return;
    }
    const task = tasks[currentTask];
    taskTitle.textContent = task.name;
    instructions.textContent = task.instructions;
    taskCounter.textContent = `Tarea ${currentTask + 1} de ${tasks.length}`;
    startTaskBtn.classList.remove('hidden');
    timerDiv.classList.add('hidden');
    stimulusDiv.textContent = "";
    optionsDiv.innerHTML = "";
}

// Botón para comenzar tarea
startTaskBtn.addEventListener('click', () => {
    startTaskBtn.classList.add('hidden');
    timerDiv.classList.remove('hidden');
    loadTask();
});

// Cronómetro
function startTimer() {
    timeLeft = 45;
    timerDiv.textContent = `Tiempo: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerDiv.textContent = `Tiempo: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextTask();
        }
    }, 1000);
}

// Cargar tarea
function loadTask() {
    if (currentTask >= tasks.length) {
        showResult();
        return;
    }
    currentTrial = 0;
    startTimer();
    nextTrial();
}

// Mostrar estímulos
function nextTrial() {
    let totalTrials = respuestas.tarea1.length; // 100
    if (currentTrial >= totalTrials) {
        nextTask();
        return;
    }
    optionsDiv.innerHTML = "";
    let correctAnswer = "";

    if (tasks[currentTask].type === "word") {
        correctAnswer = respuestas.tarea1[currentTrial];
        stimulusDiv.textContent = correctAnswer;
        stimulusDiv.style.color = "black";
    } else if (tasks[currentTask].type === "colorXXXX") {
        correctAnswer = respuestas.tarea2[currentTrial];
        stimulusDiv.textContent = "XXXX";
        stimulusDiv.style.color = colorCodes[correctAnswer];
    } else if (tasks[currentTask].type === "colorWord") {
        correctAnswer = respuestas.tarea3[currentTrial];
        let randomWord;
        do {
            randomWord = colors[Math.floor(Math.random() * colors.length)];
        } while (randomWord === correctAnswer); // aseguramos que NO coincidan
        stimulusDiv.textContent = randomWord;
        stimulusDiv.style.color = colorCodes[correctAnswer];
    }

    colors.forEach(color => {
        const btn = document.createElement('button');
        btn.textContent = color;
        btn.onclick = () => {
            if (btn.textContent === correctAnswer) {
                score++;
                scoresPorTarea[currentTask]++;
            }
            currentTrial++;
            nextTrial();
        };
        optionsDiv.appendChild(btn);
    });
}

// Siguiente tarea
function nextTask() {
    clearInterval(timer);
    currentTask++;
    showInstructions();
}

// Resultado final
function showResult() {
    testDiv.classList.add('hidden');
    resultDiv.classList.remove('hidden');

    let detalle = `
        <h2>Resultados</h2>
        <p>Total: ${score} aciertos</p>
        <ul>
            <li>Tarea 1: ${scoresPorTarea[0]} aciertos de ${respuestas.tarea1.length}</li>
            <li>Tarea 2: ${scoresPorTarea[1]} aciertos de ${respuestas.tarea2.length}</li>
            <li>Tarea 3: ${scoresPorTarea[2]} aciertos de ${respuestas.tarea3.length}</li>
        </ul>
        <button onclick="location.reload()">Reiniciar Test</button>
    `;
    resultDiv.innerHTML = detalle;
}
