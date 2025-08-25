const colors = ["ROJO", "AZUL", "VERDE", "AMARILLO"];
const colorCodes = {
    ROJO: "red",
    AZUL: "blue",
    VERDE: "green",
    AMARILLO: "orange"
};

// 100 respuestas del PDF (orden de celdas)
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
let timer;
let timeLeft = 45;

// DOM
const startBtn = document.getElementById('start-btn');
const startTaskBtn = document.getElementById('start-task-btn');
const testDiv = document.getElementById('test');
const taskTitle = document.getElementById('task-title');
const instructions = document.getElementById('instructions');
const stimulusDiv = document.getElementById('stimulus');
const optionsDiv = document.getElementById('options');
const resultDiv = document.getElementById('result');

// Iniciar test
startBtn.addEventListener('click', () => {
    startBtn.classList.add('hidden');
    testDiv.classList.remove('hidden');
    showInstructions();
});

// Mostrar instrucciones
function showInstructions() {
    if (currentTask >= tasks.length) {
        showThanks();
        return;
    }
    const task = tasks[currentTask];
    taskTitle.textContent = task.name;
    instructions.textContent = task.instructions;
    startTaskBtn.classList.remove('hidden');
    stimulusDiv.classList.add('hidden');
    optionsDiv.classList.add('hidden');
    stimulusDiv.textContent = "";
    optionsDiv.innerHTML = "";
}

// Botón para comenzar tarea
startTaskBtn.addEventListener('click', () => {
    startTaskBtn.classList.add('hidden');
    taskTitle.classList.add('hidden');
    instructions.classList.add('hidden');
    stimulusDiv.classList.remove('hidden');
    optionsDiv.classList.remove('hidden');
    loadTask();
});

// Cronómetro oculto
function startTimer() {
    timeLeft = 45;
    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextTask();
        }
    }, 1000);
}

// Cargar tarea
function loadTask() {
    currentTrial = 0;
    startTimer();
    nextTrial();
}

// Mostrar estímulos
function nextTrial() {
    let totalTrials = respuestas.tarea1.length;
    if (currentTrial >= totalTrials) {
        nextTask();
        return;
    }
    optionsDiv.innerHTML = "";
    let correctAnswer = "";

    if (tasks[currentTask].type === "word") {
        correctAnswer = respuestas.tarea1[currentTrial];
        stimulusDiv.textContent = correctAnswer;
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        stimulusDiv.style.color = colorCodes[randomColor];
    } else if (tasks[currentTask].type === "colorXXXX") {
        correctAnswer = respuestas.tarea2[currentTrial];
        stimulusDiv.textContent = "XXXX";
        stimulusDiv.style.color = colorCodes[correctAnswer];
    } else if (tasks[currentTask].type === "colorWord") {
        correctAnswer = respuestas.tarea3[currentTrial];
        let randomWord;
        do {
            randomWord = colors[Math.floor(Math.random() * colors.length)];
        } while (randomWord === correctAnswer);
        stimulusDiv.textContent = randomWord;
        stimulusDiv.style.color = colorCodes[correctAnswer];
    }

    colors.forEach(color => {
        const btn = document.createElement('button');
        btn.textContent = color;
        btn.onclick = () => {
            currentTrial++;
            nextTrial();
        };
        optionsDiv.appendChild(btn);
    });
}

// Pasar a la siguiente tarea
function nextTask() {
    clearInterval(timer);
    currentTask++;
    taskTitle.classList.remove('hidden');
    instructions.classList.remove('hidden');
    startTaskBtn.classList.remove('hidden');
    stimulusDiv.classList.add('hidden');
    optionsDiv.classList.add('hidden');
    showInstructions();
}

// Mensaje final
function showThanks() {
    testDiv.classList.add('hidden');
    resultDiv.classList.remove('hidden');
    resultDiv.textContent = "¡Siguiente Prueba!";
}