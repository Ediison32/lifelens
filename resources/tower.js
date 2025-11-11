// ==============================
// Game state variables
// ==============================
let towers;
let number_pieces;
let moveCounter;
let timeLeft;
let timerInterval;
let timerStarted;

// ==============================
// Public initializer (exported)
// ==============================
export function initTower() {
    // Buttons to switch views
    document.getElementById("startBtn").addEventListener("click", () => {
        showGame();
        setupGame();
    });

}

// ==============================
// Show / Hide views
// ==============================
function showGame() {
    document.getElementById("instructions").hidden = true;
    document.getElementById("game").hidden = false;
}

function showResult() {
    document.getElementById("game").hidden = true;
    document.getElementById("result").hidden = false;
    
}

// ==============================
// Setup game
// ==============================
function setupGame() {
    towers = { "a": ["disk_1", "disk_2", "disk_3", "disk_4", "disk_5", "disk_6", "disk_7"] };
    number_pieces = 7;
    moveCounter = 0;
    timeLeft = 480;
    timerInterval = null;
    timerStarted = false;

    // Render initial tower and set events
    render("a");
    initGame();

    // Reset UI counters
    document.getElementById("moves").innerText = moveCounter;
    document.getElementById("timer").innerText = timeLeft;
    document.getElementById("inC").innerText = 0;
}

// ==============================
// Drag and Drop
// ==============================
function initGame() {
    const disks = document.querySelectorAll("div#container > div > div");
    const dropZones = document.querySelectorAll("div#container > div");

    // Drag handlers
    disks.forEach(disk => {
        disk.addEventListener("dragstart", dragStart, false);
        disk.addEventListener("dragend", dragEnd, false);
    });

    // Drop handlers
    dropZones.forEach(zone => {
        zone.addEventListener("dragenter", e => e.preventDefault(), false);
        zone.addEventListener("dragover", e => e.preventDefault(), false);
        zone.addEventListener("drop", dropHandler, false);
    });
}

function dragStart(e) {
    const parent = e.target.parentNode;
    if (parent.childNodes[0].id === e.target.id) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("Text", e.target.id);
        e.target.classList.add('shaking');
    }
}

function dragEnd(e) {
    e.preventDefault();
    const finalTower = document.getElementById("c");
    e.target.classList.remove('shaking');

    if (finalTower.childNodes.length === number_pieces) {
        clearInterval(timerInterval);

        //  Generar los datos finales del juego
        const gameData = exportGameData();
        localStorage.setItem("towerGameData", JSON.stringify(gameData));

        //  Enviar resultados a la base de datos
        fetch("/api/t_hanoi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameData)
        })
        .then(res => res.json())
        .then(data => console.log(" Resultados Hanoi guardados:", data))
        .catch(err => console.error(" Error al guardar resultados:", err));

        //  Mostrar (o mantener oculto) el resumen final
        let summary = `
            <b>Juego completado</b> <br><br>
            <b>Número de piezas:</b> ${gameData.number_pieces} <br>
            <b>Piezas en otro lateral:</b> ${gameData.number_pieces_r_side} <br>
            <b>Tiempo:</b> ${gameData.time}s <br>
            <b>Calif. Tiempo:</b> ${gameData.motion_rating2} <br>
            <b>Calif. Movimiento:</b> ${gameData.motion_rating} <br>
            <b>Total Hanoi:</b> ${gameData.total_hanoi}
        `;

        const resultContainer = document.getElementById("resultData") || document.getElementById("result");
        resultContainer.innerHTML = summary;
        resultContainer.hidden = true; // Oculto al usuario

        //  Mostrar vista de resultado final
        showResult();
    }
}

function dropHandler(e) {
    e.preventDefault();
    let target = e.target;

    if (!["a", "b", "c"].includes(target.id)) {
        target = target.parentNode;
    }

    const children = target.childNodes;
    const draggedDisk = e.dataTransfer.getData("Text");

    const canDrop = canPlace(children, draggedDisk);

    if (["a", "b", "c"].includes(target.id) && draggedDisk !== "" && canDrop) {
        const diskToMove = document.getElementById(draggedDisk);
        diskToMove.parentNode.removeChild(diskToMove);
        target.innerHTML =
            '<div class="disk" id="' +
            draggedDisk +
            '" draggable="true"></div>' +
            target.innerHTML;

        moveCounter++;

        if (!timerStarted) {
            timerStarted = true;
            startTimer();
        }
    }

    document.getElementById("moves").innerText = moveCounter;
    document.getElementById("inC").innerText = document.getElementById("c").childNodes.length;

    initGame();
}

// ==============================
// Render disks
// ==============================
function render(tower) {
    const container = document.getElementById(tower);
    container.innerHTML = "";
    for (let i = 0; i < towers[tower].length; i++) {
        container.innerHTML +=
            '<div class="disk" id="' +
            towers[tower][i] +
            '" draggable="true"></div>';
    }
}

// ==============================
// Helpers
// ==============================
function canPlace(existing, newDisk) {
    if (existing[0] == undefined) {
        return true;
    } else {
        return newDisk.split("_")[1] < existing[0].id.split("_")[1];
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            goToGameOver();
        }
    }, 1000);
}

function getDisksInTower(towerId) {
    const tower = document.getElementById(towerId);
    return Array.from(tower.childNodes).map(d => d.id);
}

function exportGameData() {
    let number_pieces_r_side = getDisksInTower("c").length; // solo cantidad
    let motion_rating = (number_pieces_r_side / number_pieces) * 3.5;

    let time = 480 - timeLeft;
    let motion_rating2 = 0;

    if (time <= 60) {
        motion_rating2 = 1.5;
    } else {
        let penalty = (time - 60) * (1.5 / 420);
        motion_rating2 = Math.max(0, 1.5 - penalty);
    }

    let total_hanoi = motion_rating + motion_rating2;

    return {
        number_pieces: number_pieces,
        number_pieces_r_side: number_pieces_r_side, // ahora es número, no array
        motion_rating: parseFloat(motion_rating.toFixed(2)),
        time: time,
        motion_rating2: parseFloat(motion_rating2.toFixed(2)),
        total_hanoi: parseFloat(total_hanoi.toFixed(2))
    };
}






// ==============================
// End game
// ==============================
function goToGameOver() {
    clearInterval(timerInterval);
    const gameData = exportGameData();
    localStorage.setItem("towerGameData", JSON.stringify(gameData));

    //  Enviar resultados aunque no haya terminado
    fetch("/api/t_hanoi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gameData)
    })
    .then(res => res.json())
    .then(data => console.log(" Resultados guardados al agotarse el tiempo:", data))
    .catch(err => console.error(" Error al guardar resultados:", err));

    let summary = `
         <b>Tiempo agotado</b> <br><br>
        <b>Número de piezas:</b> ${gameData.number_pieces} <br>
        <b>Piezas en otro lateral:</b> ${gameData.number_pieces_r_side} <br>
        <b>Tiempo:</b> ${gameData.time}s <br>
        <b>Calif. Tiempo:</b> ${gameData.motion_rating2} <br>
        <b>Calif. Movimiento:</b> ${gameData.motion_rating} <br>
        <b>Total Hanoi:</b> ${gameData.total_hanoi}
    `;

    const resultContainer = document.getElementById("resultData") || document.getElementById("result");
    resultContainer.innerHTML = summary;
    resultContainer.hidden = true; // También oculto para el usuario

    showResult();
}


