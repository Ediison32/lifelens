export default class StroopGame {

    static #COLORS = ["ROJO", "AZUL", "VERDE", "AMARILLO"];
    static #COLOR_CODES = { ROJO: "red", AZUL: "blue", VERDE: "green", AMARILLO: "orange" };
    static #RESPUESTAS = {
        tarea1: ["ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "ROJO", "AZUL", "ROJO", "VERDE", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "ROJO", "AZUL", "ROJO", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "ROJO", "VERDE"],
        tarea2: ["AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "VERDE", "ROJO", "AZUL", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "VERDE", "AZUL", "ROJO", "VERDE", "AZUL", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "ROJO"],
        tarea3: ["AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "VERDE", "ROJO", "AZUL", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "VERDE", "AZUL", "ROJO", "VERDE", "AZUL", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "ROJO"]
    };
    static #TASKS = [
        { name: "Tarea 1", instructions: "Selecciona la palabra correcta (ignora el color).", type: "word" },
        { name: "Tarea 2", instructions: "Selecciona el color de las XXXX.", type: "colorXXXX" },
        { name: "Tarea 3", instructions: "Selecciona el color con que está escrita la palabra (palabra aleatoria distinta del color).", type: "colorWord" }
    ];

    #TIME_PER_TASK_S = 45;

    constructor(container, onComplete, options = {}) {
        this.container = container;
        this.onComplete = onComplete;
        this.participantId = options.participantId || null;
        this.sessionId = options.sessionId || null;
        this.debug = options.debug ?? false;

        // --- Estado del juego ---
        this.currentTask = 0;
        this.currentTrial = 0;
        this.timer = null;
        this.timeLeft = this.#TIME_PER_TASK_S;
        this.scoresPorTarea = [0, 0, 0];
        this.time_homework_p = 0;
        this.time_homework_c = 0;
        this.time_homework_pc = 0;

        this.#findElements();
        this.#attachInitialListeners();
    }

    #findElements() {
        this.elements = {
            startBtn: this.container.querySelector('#stroop-start-btn'),
            startTaskBtn: this.container.querySelector('#stroop-start-task-btn'),
            testDiv: this.container.querySelector('#stroop-test'),
            taskTitle: this.container.querySelector('#stroop-task-title'),
            instructions: this.container.querySelector('#stroop-instructions'),
            stimulusDiv: this.container.querySelector('#stroop-stimulus'),
            optionsDiv: this.container.querySelector('#stroop-options'),
            resultDiv: this.container.querySelector('#stroop-result'),
            timerDiv: this.container.querySelector('#stroop-timer'),
            taskCounter: this.container.querySelector('#stroop-task-counter'),
        };
    }

    #attachInitialListeners() {
        this.elements.startBtn.addEventListener('click', () => {
            this.elements.startBtn.classList.add('hidden');
            this.elements.testDiv.classList.remove('hidden');
            this.#showInstructions();
        });

        this.elements.startTaskBtn.addEventListener('click', () => {
            this.elements.startTaskBtn.classList.add('hidden');
            this.elements.instructions.classList.add('hidden');
            this.elements.taskTitle.classList.add('hidden');
            this.elements.taskCounter.classList.add('hidden');
            this.elements.timerDiv.classList.add('hidden');
            this.#loadTask();
        });
    }

    #showInstructions() {
        if (this.currentTask >= StroopGame.#TASKS.length) {
            this.#computeAndSendFinalResults();
            return;
        }
        const task = StroopGame.#TASKS[this.currentTask];
        this.elements.taskTitle.textContent = task.name;
        this.elements.taskTitle.classList.remove('hidden');
        this.elements.instructions.textContent = task.instructions;
        this.elements.instructions.classList.remove('hidden');
        this.elements.taskCounter.textContent = `Tarea ${this.currentTask + 1} de ${StroopGame.#TASKS.length}`;
        this.elements.startTaskBtn.classList.remove('hidden');
        this.elements.timerDiv.classList.add('hidden');
        this.elements.stimulusDiv.textContent = "";
        this.elements.stimulusDiv.classList.add('hidden');
        this.elements.optionsDiv.innerHTML = "";
    }

    #startTimer() {
        this.timeLeft = this.#TIME_PER_TASK_S;
        this.timer = setInterval(() => {
            this.timeLeft--;
            if (this.timeLeft <= 0) {
                if (this.currentTask === 0) this.time_homework_p = this.#TIME_PER_TASK_S;
                if (this.currentTask === 1) this.time_homework_c = this.#TIME_PER_TASK_S;
                if (this.currentTask === 2) this.time_homework_pc = this.#TIME_PER_TASK_S;
                clearInterval(this.timer);
                this.#nextTask();
            }
        }, 1000);
    }

    #loadTask() {
        if (this.currentTask >= StroopGame.#TASKS.length) {
            this.#computeAndSendFinalResults();
            return;
        }
        this.currentTrial = 0;
        this.#startTimer();
        this.#nextTrial();
    }

    #nextTrial() {
        const totalTrials = StroopGame.#RESPUESTAS.tarea1.length;
        if (this.currentTrial >= totalTrials) {
            this.#nextTask();
            return;
        }

        this.elements.optionsDiv.innerHTML = "";
        let correctAnswer = "";
        const task = StroopGame.#TASKS[this.currentTask];

        this.elements.stimulusDiv.classList.remove('hidden');

        if (task.type === "word") {
            correctAnswer = StroopGame.#RESPUESTAS.tarea1[this.currentTrial];
            this.elements.stimulusDiv.textContent = correctAnswer;
            this.elements.stimulusDiv.style.color = "black";
        } else if (task.type === "colorXXXX") {
            correctAnswer = StroopGame.#RESPUESTAS.tarea2[this.currentTrial];
            this.elements.stimulusDiv.textContent = "XXXX";
            this.elements.stimulusDiv.style.color = StroopGame.#COLOR_CODES[correctAnswer];
        } else if (task.type === "colorWord") {
            correctAnswer = StroopGame.#RESPUESTAS.tarea3[this.currentTrial];
            let randomWord;
            do {
                randomWord = StroopGame.#COLORS[Math.floor(Math.random() * StroopGame.#COLORS.length)];
            } while (randomWord === correctAnswer);
            this.elements.stimulusDiv.textContent = randomWord;
            this.elements.stimulusDiv.style.color = StroopGame.#COLOR_CODES[correctAnswer];
        }

        StroopGame.#COLORS.forEach(color => {
            const btn = document.createElement('button');
            btn.textContent = color;
            btn.onclick = () => {
                if (btn.textContent === correctAnswer) {
                    this.scoresPorTarea[this.currentTask]++;
                }
                this.currentTrial++;
                this.#nextTrial();
            };
            this.elements.optionsDiv.appendChild(btn);
        });
    }

    #nextTask() {
        clearInterval(this.timer);
        let usedTime = this.#TIME_PER_TASK_S - this.timeLeft;
        if (this.currentTask === 0) this.time_homework_p = usedTime;
        if (this.currentTask === 1) this.time_homework_c = usedTime;
        if (this.currentTask === 2) this.time_homework_pc = usedTime;

        this.currentTask++;
        this.#showInstructions();
    }

    #climb(total_stroop) {
        if (total_stroop <= 0.29) return "muy bajo";
        if (total_stroop <= 0.6) return "bajo";
        if (total_stroop <= 0.9) return "medio";
        return "alto";
    }

    #computeAndSendFinalResults() {
        this.elements.testDiv.classList.add('hidden');
        this.elements.resultDiv.classList.remove('hidden');
        this.elements.resultDiv.innerHTML = '<h2>¡Test finalizado!</h2>';

        const p = this.scoresPorTarea[0] || 0;
        const c = this.scoresPorTarea[1] || 0;
        const pc = this.scoresPorTarea[2] || 0;


        const P_C = (p + c) !== 0 ? (p * c) / (p + c) : 0;


        const interference = pc - P_C;

        const time_total = (this.time_homework_p || 0) + (this.time_homework_c || 0) + (this.time_homework_pc || 0);

        const total_stroop = time_total !== 0 ? (p + c + pc) / time_total : 0;

        const climbResult = this.#climb(total_stroop);

        const finalPayload = {
            P: p,
            C: c,
            PC: pc,
            P_C: Number(P_C.toFixed(3)),
            interferencia: Number(interference.toFixed(3)),
            time_homework_p: this.time_homework_p,
            time_homework_c: this.time_homework_c,
            time_homework_pc: this.time_homework_pc,
            time_total: time_total,
            total_stroop: Number(total_stroop.toFixed(3)),
            climb: climbResult
        };

        console.log("Resultados del test Stroop:", finalPayload);

        if (!this.debug) {
            const finalPayloadWrapper = {
                participantId: this.participantId,
                sessionId: this.sessionId,
                game: 'stroop',
                timestamp: new Date().toISOString(),
                result: finalPayload,
                meta: { client: 'stroop-frontend', version: '1.1-class' }
            };

            sendToSPA(finalPayloadWrapper.game, finalPayloadWrapper);

            sendToServer(finalPayload);
        }


        if (typeof this.onComplete === 'function') {
            this.onComplete(finalPayload);
        }
    }
}



function sendToSPA(gameId, payload) {
    if (window.SPA && typeof window.SPA.receiveGameResult === 'function') {
        try {
            window.SPA.receiveGameResult(gameId, payload);
            return Promise.resolve({ ok: true, via: 'direct' });
        } catch (err) {
            console.warn('SPA direct API failed', err);
        }
    }
    try {
        window.dispatchEvent(new CustomEvent('game:result', { detail: { game: gameId, payload } }));
        return Promise.resolve({ ok: true, via: 'customevent' });
    } catch (err) {
        console.warn('dispatch CustomEvent failed', err);
    }
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'GAME_RESULT', game: gameId, payload }, '*');
            return Promise.resolve({ ok: true, via: 'postMessage' });
        }
    } catch (err) {
        console.warn('postMessage failed', err);
    }
    queueOutbox({ game: gameId, payload, ts: new Date().toISOString() });
    return Promise.resolve({ ok: false, via: 'outbox' });
}

const BACKEND_URL = window.BACKEND_URL || 'https://tu-backend.example.com/api/save-game-result';
const AUTH_TOKEN = window.API_TOKEN || null;

async function sendToServer(payload) {
    try {
        const res = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(AUTH_TOKEN ? { 'Authorization': `Bearer ${AUTH_TOKEN}` } : {})
            },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Network response not ok: ' + res.status);
        const body = await res.json();
        return { ok: true, body };
    } catch (err) {
        console.warn('sendToServer failed, queueing', err);
        queueOutbox({ game: payload.game, payload, ts: new Date().toISOString(), sendAttempted: true });
        return { ok: false, error: String(err) };
    }
}

function queueOutbox(item) {
  try {
    const k = 'games_outbox_v1';
    const arr = JSON.parse(localStorage.getItem(k) || '[]');
    arr.push(item);
    localStorage.setItem(k, JSON.stringify(arr));
  } catch (e) { console.error('Outbox queue failed', e); }
}

async function flushOutbox() {
  const k = 'games_outbox_v1';
  const arr = JSON.parse(localStorage.getItem(k) || '[]');
  if (!arr.length) return;
  const remaining = [];
  for (const it of arr) {
    try {
      const payload = it.payload || it;
      const r = await sendToServer(payload);
      if (!r.ok) remaining.push(it);
    } catch (e) { remaining.push(it); }
  }
  localStorage.setItem(k, JSON.stringify(remaining));
}
