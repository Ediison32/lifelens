// Export the main function for the Go/No-Go game
export function GoNoGoGame() {
    // Get the container element for the game
    const container = document.getElementById('GoNoGo-section');
    // Set the duration for each stage in milliseconds
    const STAGE_DURATION_MS = 45000;
    // Set the maximum number of responses per stage
    const MAX_RESPONSE = 100;
    const STAGES = [
        {
            name: 'Palabras', // Stage name: Words
            stimuli: ["Si","Nu","No","Se","Na","Ne","Si","No","Su","Sa","Ni","Si","Ne","Si","Su","No","Si","Su","Si","Si","No","Ni","Nu","Si","No","Si","Nu","No","Se","Na","Ne","Si","No","Su","Sa","Ni","Si","Ne","Si","Su","No","Si","Su","Si","Si","No","Ni","Nu","Si","No","No","Su","Sa","Ni","Si","Ne","Si","Su","No","Si","Su","Si","Nu","No","Se","Na","Ne","Si","No","Ne","Si","Su","No","Si","Su","Si","Si","No","Ni","Nu","Si","No","No","Su","Sa","Ni","Si","Ne","Si","Su","Ne","Si","Su","No","Si","Su","Si","Si","No","Ni"
], // The stimuli for this stage
            getExpectedResponse: (s) => { // Function to get the expected response
                const normalized = s.trim().toUpperCase();
                if (normalized === 'SI') return 'no';
                if (normalized === 'NO') return 'si'; 
                return 'otro'; // 
            },
            renderStimulus: (s, el) => { // Function to render the stimulus
                el.textContent = s;
                el.classList.add('stimulus-text');
            },
            instructions: `Marca "NO" cuando veas "SI", "SÍ" cuando veas "NO" y "OTRO" con cualquier otra sílaba.` // Instructions for this stage
        },
        {
            name: 'Colores Invertidos', // Stage name: Inverted Colors
            stimuli: ["rojo", "otro", "azul", "otro", "azul", "rojo", "otro", "azul", "otro", "otro", "azul", "otro", "rojo", "otro", "azul", "azul", "rojo", "otro", "azul", "rojo",
                "otro", "azul", "otro", "rojo", "otro", "rojo", "otro", "azul", "otro", "azul", "rojo", "otro", "azul", "otro", "otro", "azul", "otro", "rojo", "otro", "azul",
                "otro", "rojo", "otro", "azul", "rojo", "otro", "azul", "otro", "rojo", "otro", "azul", "otro", "otro", "azul", "otro", "rojo", "otro", "otro", "azul", "rojo",
                "otro", "azul", "rojo", "otro", "azul", "otro", "rojo", "otro", "rojo", "otro", "azul", "otro", "azul", "rojo", "otro", "azul", "otro", "otro", "azul", "otro",
                "azul", "otro", "azul", "rojo", "otro", "azul", "otro", "otro", "azul", "otro", "rojo", "otro", "azul"], // The stimuli for this stage
            getExpectedResponse: (c) => { // Function to get the expected response
                const normalized = c.toLowerCase();
                if (normalized === 'rojo') return 'azul'; 
                if (normalized === 'azul') return 'rojo'; 
                return 'otro'; 
            },
            renderStimulus: (c, el) => { // Function to render the stimulus
                el.textContent = '';
                let displayColor = c;
                if (c === 'otro') {
                    displayColor = Math.random() < 0.5 ? 'amarillo' : 'verde'; // If stimulus is "otro", display yellow or green
                }
                el.classList.add('stimulus-circle', `color-${displayColor}`);
            },
            instructions: 'Presiona "AZUL" si ves ROJO, "ROJO" si ves AZUL, o "OTRO" para cualquier otro color.' // Instructions for this stage
        },
        {
            name: 'Signos', // Stage name: Signs
            stimuli: ["/", "( )", ">", "%", "( )", "&", "( )", "/", "( )", "&", "/", "( )", "( )", "%", "/", "&", ">", "/", "%",
                "/", "( )", "/", ">", "( )", "/", ">", "%", "( )", "&", "( )", "/", ">", "( )", "&", "/", ">", "( )", "( )", "%",
                "/", "&", ">", "/", "%", "/", "( )", "/", "&", "( )", "/", "( )", "&", "%", "( )", "&", "( )", "/", "&", "( )",
                "&", "/", "( )", "( )", "%", "/", "&", ">", "/", "%", "/", "( )", "/", "&", "( )", "/", "( )", "&", ">", "/", "%",
                "/", "( )", "/", "( )", "&", "( )", "/", "( )", "&", "/", "( )", "( )", "%", "/", "&", ">", "/", "%"], // The stimuli for this stage
            getExpectedResponse: (s) => { // Function to get the expected response
                if (s === '/') return '>';
                if (s === '>') return '/'; 
                if (s === '( )') return 'x'; 
                return 'otro'; // Otherwise, expect "otro"
            },
            renderStimulus: (s, el) => { // Function to render the stimulus
                el.textContent = s;
                el.classList.add('stimulus-sign');
            },
            instructions: 'Marca ">" cuando aparece "/", "/" cuando aparece ">", "x" cuando aparece "()", y "OTRO" en cualquier otro símbolo.' // Instructions for this stage
        }
    ];

    // --- State ---
    let stageIndex = 0; // Current stage index
    let currentStage = null; // Current stage object
    let running = false; // Is the game running?
    let responded = false; // Has the user responded in the current trial?
    let trialStartTime = 0; // Timestamp of the start of the current trial
    let currentStimulus = ''; // The current stimulus being displayed
    let data = []; // Array to store trial data
    let stageTimer = null; // Timer for the stage duration
    let stageStartTime = 0; // Timestamp of the start of the current stage
    let endedByTimeout = false; // Did the stage end due to a timeout?

    // --- Metrics ---
    let hw_time_1 = 0, hw_time_2 = 0, hw_time_3 = 0; // Time for each stage
    let hw_answer_1 = 0, hw_answer_2 = 0, hw_answer_3 = 0; // Correct answers for each stage
    let hw_score_1 = 0, hw_score_2 = 0, hw_score_3 = 0; // Score for each stage

    // --- DOM elements ---
    const el = {
        stimulus: container.querySelector('#stimulus'), // Stimulus display element
        results: container.querySelector('#results'), // Results display element
        startBtn: container.querySelector('#start'), // Start button
        stageIntro: container.querySelector('#stage-intro'), // Stage introduction screen
        stageTitle: container.querySelector('#stage-title'), // Stage title element
        stageInstructions: container.querySelector('#stage-instructions'), // Stage instructions element
        stageProgress: container.querySelector('#stage-progress'), // Stage progress indicator
        beginStageBtn: container.querySelector('#begin-stage'), // Button to begin a stage
        encabezado: container.querySelector('#encabezado'), // Header element
        nextStageBtn: container.querySelector('#next-stage'), // Button to go to the next stage
    };

    // ==== Helpers ====
    function resetStimulusStyle() { // Function to reset the stimulus style
        el.stimulus.className = '';
        el.stimulus.textContent = '';
    }

    function showButtonsForStage(stageName) { // Function to show the appropriate buttons for the current stage
        const siNoOtro = container.querySelector('#section-si-no-otro');
        const colores = container.querySelector('#section-colores');
        const signals = container.querySelector('#section-signals');
        [siNoOtro, colores, signals].forEach(sec => {
            sec.classList.add('d-none');
            sec.classList.remove('d-flex', 'justify-content-center', 'gap-3', 'mt-3');
        });
        const show = (el) => { el.classList.remove('d-none'); el.classList.add('d-flex', 'justify-content-center', 'gap-3', 'mt-3'); };
        if (stageName === 'Palabras') show(siNoOtro);
        else if (stageName === 'Colores Invertidos') show(colores);
        else if (stageName === 'Signos') show(signals);
    }

    // ==== Logic ====
    function showStageIntro(stage, index) { // Function to show the introduction for a stage
        el.encabezado.classList.add('d-none');
        el.stimulus.style.display = 'none';
        el.results.innerHTML = '';
        el.stageTitle.textContent = `Etapa ${index + 1}: ${stage.name}`;
        el.stageInstructions.textContent = stage.instructions;
        el.stageProgress.textContent = `Etapa ${index + 1} de ${STAGES.length}`;
        el.stageIntro.classList.remove('d-none');

        el.beginStageBtn.onclick = () => {
            el.stageIntro.classList.add('d-none');
            runStage(stage);
        };
    }

    function runStage(stage) { // Function to run a stage
        currentStage = stage;
        data = [];
        responded = false;
        el.results.innerHTML = '';
        el.startBtn.style.display = 'none';
        el.nextStageBtn.classList.add('d-none');
        showButtonsForStage(stage.name);

        running = true;
        el.stimulus.style.display = 'flex';
        stageStartTime = Date.now();
        endedByTimeout = false;
        nextTrial(stage);

        stageTimer = setTimeout(() => {
            running = false;
            endedByTimeout = true;
            showResults(stage.name);
        }, STAGE_DURATION_MS);
    }

    function nextTrial(stage) { // Function to proceed to the next trial
        if (!running) return;
        resetStimulusStyle();
        responded = false;
        currentStimulus = stage.stimuli[Math.floor(Math.random() * stage.stimuli.length)];
        stage.renderStimulus(currentStimulus, el.stimulus);
        trialStartTime = Date.now();
    }

    function recordResponse(response) { // Function to record the user's response
        if (!running || responded || !currentStage) return;
        responded = true;
        const expected = currentStage.getExpectedResponse(currentStimulus);
        const correct = response === expected;
        const now = Date.now();
        data.push({
            stimulus: currentStimulus, response, expected, correct,
            rt: now - trialStartTime, tStimulus: trialStartTime, tResponse: now
        });
        if (data.length >= MAX_RESPONSE) {
            running = false;
            clearTimeout(stageTimer);
            endedByTimeout = false;
            showResults(currentStage.name);
            return;
        }
        nextTrial(currentStage);
    }

    function showResults(stageName) { // Function to show the results of a stage
        if (stageTimer) clearTimeout(stageTimer);
        el.stimulus.style.display = 'none';
        showButtonsForStage('');

        let stageDurationMs = endedByTimeout ? STAGE_DURATION_MS : (data.length > 0 ? (data[data.length - 1].tResponse - stageStartTime) : STAGE_DURATION_MS);
        const correct = data.filter(d => d.correct).length;
        const durationSec = stageDurationMs / 1000;
        const score = durationSec > 0 ? (correct / durationSec) : 0;

        if (stageIndex === 0) { hw_time_1 = +durationSec.toFixed(3); hw_answer_1 = correct; hw_score_1 = +score.toFixed(3); }
        else if (stageIndex === 1) { hw_time_2 = +durationSec.toFixed(3); hw_answer_2 = correct; hw_score_2 = +score.toFixed(3); }
        else if (stageIndex === 2) { hw_time_3 = +durationSec.toFixed(3); hw_answer_3 = correct; hw_score_3 = +score.toFixed(3); }

        // Save partial results to localStorage
        savePartialResult();

        stageIndex++;
        if (stageIndex < STAGES.length) {
            showStageIntro(STAGES[stageIndex], stageIndex);
        } else {
            computeAndFinish();
        }
    }

    function savePartialResult() { // Function to save partial results
        const payload = {
            hw_time_1, hw_time_2, hw_time_3,
            hw_answer_1, hw_answer_2, hw_answer_3,
            hw_score_1, hw_score_2, hw_score_3
        };
        localStorage.setItem("gonogo_progress", JSON.stringify({ stageIndex, payload }));
    }

    function computeAndFinish() { // Function to compute final results and finish the game
        const a1 = hw_answer_1 || 0, a2 = hw_answer_2 || 0, a3 = hw_answer_3 || 0;
        const s1 = hw_score_1 || 0, s2 = hw_score_2 || 0, s3 = hw_score_3 || 0;
        let total_homewor = (a1 + a2) !== 0 ? (a1 * a2) / (a1 + a2) : 0;
        let Interference = a3 - total_homewor;
        let total_gonogo = ((s1 + s2 + s3) / 3).toFixed(3);
        let total_gonogo_answer = ((a1 + a2 + a3) / 3).toFixed(3);
        let climb = 'Bajo';
        if (total_gonogo > 0.87) climb = 'Alto';
        else if (total_gonogo > 0.44) climb = 'Medio';

    const finalPayload = {
        hw_time_1, hw_time_2, hw_time_3,
        hw_answer_1, hw_answer_2, hw_answer_3,
        hw_score_1, hw_score_2, hw_score_3,
        total_homewor: +total_homewor.toFixed(3),
        Interference: +Interference.toFixed(3),
        total_gonogo: +total_gonogo,
        total_gonogo_answer: +total_gonogo_answer,
        climb
    };

    // === Cálculos extra (PC*, Interference formal) ===
    const PC = hw_score_3 || 0;
    const C = hw_score_2 || 0;
    const PC_star = (PC + C) !== 0 ? (PC / (PC + C)) : 0;
    const InterferenceCalc = PC - PC_star;

    finalPayload.PC = +PC.toFixed(3);
    finalPayload.C = +C.toFixed(3);
    finalPayload["PC*"] = +PC_star.toFixed(3);
    finalPayload.Interference = +InterferenceCalc.toFixed(3);

    // Guardar en localStorage
    localStorage.setItem("gonogo_final", JSON.stringify(finalPayload));

    // 🔹 Enviar a la base de datos (opcional)
    fetch("/api/gonogo_results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload)
    })
    .then(res => res.json())
    .then(data => console.log("Resultados Go/No-Go guardados:", data))
    .catch(err => console.error("Error al guardar resultados:", err));

    el.results.innerHTML = '<b>¡Juego finalizado!</b>';
    el.nextStageBtn.textContent = "Siguiente test";
    el.nextStageBtn.classList.remove('d-none');
    el.nextStageBtn.onclick = () => {
        window.location.href = "/tower";
    };
}



        // === Listeners ===
        const responseMap = [
            ['#si', 'si'], ['#no', 'no'], ['#otro', 'otro'],
            ['#rojo', 'rojo'], ['#azul', 'azul'], ['#otro-color', 'otro'],
            ['#xl', '>'], ['#l', '/'], ['#xx', 'x'], ['#otro-signo', 'otro']
        ];
        responseMap.forEach(([sel, resp]) => {
            const btn = container.querySelector(sel);
            if (btn) {
                btn.addEventListener('click', () => {
                    // Visual feedback
                    btn.classList.add('pressed');
                    setTimeout(() => btn.classList.remove('pressed'), 150);

                    // Record response
                    recordResponse(resp);
                });
            }
        });

    }

    // === Listeners ===
    const responseMap = [
        ['#si', 'si'], ['#no', 'no'], ['#otro', 'otro'],
        ['#rojo', 'rojo'], ['#azul', 'azul'], ['#otro-color', 'otro'],
        ['#xl', '>'], ['#l', '/'], ['#xx', 'x'], ['#otro-signo', 'otro']
    ];
    responseMap.forEach(([sel, resp]) => {
        const btn = container.querySelector(sel);
        if (btn) btn.addEventListener('click', () => recordResponse(resp));
    });
    el.startBtn.addEventListener('click', () => start());

    function start() { // Function to start the game
        // Validate previous progress
        const saved = JSON.parse(localStorage.getItem("gonogo_progress") || "null");
        if (saved) {
            stageIndex = saved.stageIndex;
            Object.assign({
                hw_time_1, hw_time_2, hw_time_3,
                hw_answer_1, hw_answer_2, hw_answer_3,
                hw_score_1, hw_score_2, hw_score_3
            }, saved.payload);
        } else stageIndex = 0;

        if (stageIndex < STAGES.length) showStageIntro(STAGES[stageIndex], stageIndex);
        else computeAndFinish();
    }


    return { start };

