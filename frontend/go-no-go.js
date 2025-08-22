    document.addEventListener('DOMContentLoaded', () => {
        const stimulus = document.getElementById('stimulus');
        const results = document.getElementById('results');
        const instructions = document.getElementById('instructions');
        const startBtn = document.getElementById('start');
        const correctCountEl = document.getElementById('correct-count');
        const errorCountEl = document.getElementById('error-count');
        const stageIntro = document.getElementById('stage-intro');
        const stageTitle = document.getElementById('stage-title');
        const stageInstructions = document.getElementById('stage-instructions');
        const stageProgress = document.getElementById('stage-progress');
        const beginStageBtn = document.getElementById('begin-stage');


        // Botones
        const siBtn = document.getElementById('si');
        const noBtn = document.getElementById('no');
        const otroBtn = document.getElementById('otro');
        const rojoBtn = document.getElementById('rojo');
        const azulBtn = document.getElementById('azul');
        const otroColorBtn = document.getElementById('otro-color');
        const xlBtn = document.getElementById('xl');
        const lBtn = document.getElementById('l');
        const xxBtn = document.getElementById('xx');
        const otroSignoBtn = document.getElementById('otro-signo');
        const nextStageBtn = document.getElementById('next-stage');

        let data = [];
        let running = false;
        let trialTimeout = null;
        let currentStimulus = '';
        let startTime = null;
        let responded = false;
        let stageIndex = 0;

        // Etapas
        const stages = [
            {
                name: 'Palabras',
                stimuli: ['SI','NO','SU','NU','NI','SE','NA','NE','SA'],
                getExpectedResponse: (s) => {
                    if (s === 'SI') return 'no';
                    if (s === 'NO') return 'si';
                    return 'otro';
                },
                renderStimulus: (s) => {
                    resetStimulusStyle();
                    stimulus.textContent = s;
                    stimulus.style.display = 'block';
                },
                instructions: 'Marca "NO" cuando veas "SI", "SÍ" cuando veas "NO" y "OTRO" con cualquier otra sílaba.'
            },
            {
                name: 'Colores Invertidos',
                stimuli: ['red', 'blue', 'yellow', 'green'],
                getExpectedResponse: (c) => {
                    if (c === 'red') return 'azul';
                    if (c === 'blue') return 'rojo';
                    return 'otro';
                },
                renderStimulus: (c) => {
                    resetStimulusStyle();
                    stimulus.textContent = '';
                    stimulus.style.backgroundColor = c;
                    stimulus.style.borderRadius = '50%';
                    stimulus.style.width = '100px';
                    stimulus.style.height = '100px';
                    stimulus.style.margin = '20px auto';
                    stimulus.style.display = 'block';
                },
                instructions: 'Presiona "AZUL" si ves ROJO, "ROJO" si ves AZUL, o "OTRO" para cualquier otro color (amarillo o verde).'
            },
            {
                name: 'Signos',
                stimuli: ['>', '/', '()', 'x', '&', '%'],
                getExpectedResponse: (s) => {
                    if (s === '/') return '>';
                    if (s === '>') return '/';
                    if (s === '()') return 'x';
                    if (s === 'x') return '()';
                    return 'otro';
                },
                renderStimulus: (s) => {
                    resetStimulusStyle();
                    stimulus.textContent = s;
                    stimulus.style.display = 'block';
                },
                instructions: 'Marca ">" cuando aparece "/", "/" cuando aparece ">", "x" cuando aparece "()", y "OTRO" en cualquier otro símbolo (&, %).'
            },
        ];

        function showStageIntro(stage, index) {
        // Ocultar botones y estímulos
        resetStimulusStyle();
        showButtonsForStage('');
        instructions.textContent = '';
        results.innerHTML = '';

        // Mostrar info
        stageTitle.textContent = `Etapa ${index + 1}: ${stage.name}`;
        stageInstructions.textContent = stage.instructions;
        stageProgress.textContent = `Etapa ${index + 1} de ${stages.length}`;
        
        stageIntro.classList.remove('d-none'); // <-- CAMBIA hidden por d-none

        // Al hacer clic en "Comenzar Etapa"
        beginStageBtn.onclick = () => {
            stageIntro.classList.add('d-none'); // <-- CAMBIA hidden por d-none
            runStage(stage);
        };
    }


        function resetStimulusStyle() {
            stimulus.style.borderRadius = '';
            stimulus.style.width = '';
            stimulus.style.height = '';
            stimulus.style.margin = '';
            stimulus.style.background = '';
            stimulus.style.backgroundColor = '';
            stimulus.style.display = 'none';
            stimulus.textContent = '';
        }

        function showButtonsForStage(stageName) {
            const sectionSiNoOtro = document.getElementById('section-si-no-otro');
            const sectionColores = document.getElementById('section-colores');
            const sectionSignals = document.getElementById('section-signals');

            // Ocultar todo
            sectionSiNoOtro.classList.add('d-none'); // <-- CAMBIA hidden por d-none
            sectionColores.classList.add('d-none');
            sectionSignals.classList.add('d-none');

            if (stageName === 'Palabras') {
                sectionSiNoOtro.classList.remove('d-none');
            } else if (stageName === 'Colores' || stageName === 'Colores Invertidos') {
                sectionColores.classList.remove('d-none');
            } else if (stageName === 'Signos') {
                sectionSignals.classList.remove('d-none');
            }
        }

        function runStage(stage) {
            data = [];
            correctCountEl.textContent = '0';
            errorCountEl.textContent = '0';
            results.innerHTML = '';
            instructions.textContent = stage.instructions || '';
            startBtn.style.display = 'none';
            nextStageBtn.classList.add('d-none'); // <-- CAMBIA hidden por d-none
            showButtonsForStage(stage.name);
            running = true;
            nextTrial(stage);
        }

        function nextTrial(stage) {
            if (!running) return;
            resetStimulusStyle();
            responded = false;
            currentStimulus = stage.stimuli[Math.floor(Math.random() * stage.stimuli.length)];
            stage.renderStimulus(currentStimulus);
            startTime = Date.now();
            trialTimeout = setTimeout(() => {
                if (!responded) {
                    recordResponse('timeout', stage);
                }
            }, 3000);
        }

        function recordResponse(response, stage) {
            if (!running || responded) return;
            responded = true;
            clearTimeout(trialTimeout);
            const expected = stage.getExpectedResponse(currentStimulus);
            const correct = response === expected;
            data.push({
                stimulus: currentStimulus,
                response,
                expected,
                correct,
                rt: Date.now() - startTime
            });
            if (correct) {
                correctCountEl.textContent = parseInt(correctCountEl.textContent) + 1;
            } else {
                errorCountEl.textContent = parseInt(errorCountEl.textContent) + 1;
            }
            if (data.length >= 10) {
                running = false;
                showResults(stage.name);
            } else {
                nextTrial(stage);
            }
        }

        function showResults(stageName) {
            resetStimulusStyle();
            showButtonsForStage('');
            nextStageBtn.classList.remove('d-none'); // <-- CAMBIA hidden por d-none
            let correct = data.filter(d => d.correct).length;
            let errors = data.length - correct;
            let avgRt = data.filter(d => d.correct).reduce((sum, d) => sum + d.rt, 0) / (correct || 1);
            results.innerHTML = `
                <b>Etapa: ${stageName}</b><br>
                Trials: ${data.length}<br>
                Aciertos: ${correct}<br>
                Errores: ${errors}<br>
                Tiempo promedio (aciertos): ${avgRt.toFixed(2)} ms
            `;
        }

        // Eventos de botones
        siBtn.addEventListener('click', () => recordResponse('si', stages[stageIndex]));
        noBtn.addEventListener('click', () => recordResponse('no', stages[stageIndex]));
        otroBtn.addEventListener('click', () => recordResponse('otro', stages[stageIndex]));
        rojoBtn.addEventListener('click', () => recordResponse('rojo', stages[stageIndex]));
        azulBtn.addEventListener('click', () => recordResponse('azul', stages[stageIndex]));
        otroColorBtn.addEventListener('click', () => recordResponse('otro', stages[stageIndex]));
        xlBtn.addEventListener('click', () => recordResponse('>', stages[stageIndex]));
        lBtn.addEventListener('click', () => recordResponse('/', stages[stageIndex]));
        xxBtn.addEventListener('click', () => recordResponse('x', stages[stageIndex]));
        otroSignoBtn.addEventListener('click', () => recordResponse('otro', stages[stageIndex]));

        // Inicializar
        showButtonsForStage('');

        startBtn.addEventListener('click', () => {
            stageIndex = 0;
            showStageIntro(stages[stageIndex], stageIndex);
        });
        nextStageBtn.addEventListener('click', () => {
        stageIndex++;
        if (stageIndex < stages.length) {
            showStageIntro(stages[stageIndex], stageIndex);
        } else {
            instructions.textContent = '¡Juego finalizado!';
            nextStageBtn.classList.add('d-none'); // <-- CAMBIA hidden por d-none
            startBtn.style.display = 'inline-block';
            showButtonsForStage('');
        }
    });
    });