
// Game state variables

// These variables hold the current state of the game.
let towers;          
let number_pieces;   
let moveCounter;     
let timeLeft;        
let timerInterval;   
let timerStarted;   


// Initializes the game when the start button is clicked.
export function initTower() {
    // Start button listener to switch view and set up the game
    document.getElementById("startBtn").addEventListener("click", () => {
        showGame();
        setupGame();
    });
}


// Show / Hide views

// Display the game view and hide the instructions
function showGame() {
    document.getElementById("instructions").hidden = true;
    document.getElementById("game").hidden = false;
}

// Display the results screen and hide the game view
function showResult() {
    document.getElementById("game").hidden = true;
    document.getElementById("result").hidden = false;
}


// Setup game

// Initializes towers, counters, and game UI.
function setupGame() {
    // Initial tower "a" with all disks
    towers = { "a": ["disk_1", "disk_2", "disk_3", "disk_4", "disk_5", "disk_6", "disk_7"] };
    number_pieces = 7;
    moveCounter = 0;
    timeLeft = 480; // 8 minutes
    timerInterval = null;
    timerStarted = false;

    // Render the first tower and attach drag/drop events
    render("a");
    initGame();

    // Reset UI counters
    document.getElementById("moves").innerText = moveCounter;
    document.getElementById("timer").innerText = timeLeft;
    document.getElementById("inC").innerText = 0;
}


// Drag and Drop

// Sets up drag-and-drop functionality for disks and towers.
function initGame() {
    const disks = document.querySelectorAll("div#container > div > div");
    const dropZones = document.querySelectorAll("div#container > div");

    // Add drag event listeners to each disk
    disks.forEach(disk => {
        disk.addEventListener("dragstart", dragStart, false);
        disk.addEventListener("dragend", dragEnd, false);
    });

    // Add drop event listeners to each tower zone
    dropZones.forEach(zone => {
        zone.addEventListener("dragenter", e => e.preventDefault(), false);
        zone.addEventListener("dragover", e => e.preventDefault(), false);
        zone.addEventListener("drop", dropHandler, false);
    });
}

// Triggered when a disk starts being dragged
function dragStart(e) {
    const parent = e.target.parentNode;
    // Only allow dragging the top disk of a tower
    if (parent.childNodes[0].id === e.target.id) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("Text", e.target.id);
        e.target.classList.add('shaking'); // Add visual effect
    }
}

// Triggered when the dragging ends
function dragEnd(e) {
    e.preventDefault();
    const finalTower = document.getElementById("c");
    e.target.classList.remove('shaking');

    // Check if all disks are in the final tower (victory condition)
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

// Handles dropping a disk into a tower
function dropHandler(e) {
    e.preventDefault();
    let target = e.target;

    // Ensure the target is a valid tower
    if (!["a", "b", "c"].includes(target.id)) {
        target = target.parentNode;
    }

    const children = target.childNodes;
    const draggedDisk = e.dataTransfer.getData("Text");

    // Check if the move is allowed
    const canDrop = canPlace(children, draggedDisk);

    if (["a", "b", "c"].includes(target.id) && draggedDisk !== "" && canDrop) {
        const diskToMove = document.getElementById(draggedDisk);
        diskToMove.parentNode.removeChild(diskToMove);

        // Place the disk at the top of the new tower
        target.innerHTML =
            '<div class="disk" id="' +
            draggedDisk +
            '" draggable="true"></div>' +
            target.innerHTML;

        moveCounter++;

        // Start the timer on the first valid move
        if (!timerStarted) {
            timerStarted = true;
            startTimer();
        }
    }

    // Update UI counters
    document.getElementById("moves").innerText = moveCounter;
    document.getElementById("inC").innerText = document.getElementById("c").childNodes.length;

    // Reinitialize drag events for new elements
    initGame();
}


// Render disks

// Renders all disks inside a tower in the UI.
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


// Helpers

// Checks if a disk can be placed on top of another tower
function canPlace(existing, newDisk) {
    if (existing[0] == undefined) {
        return true; // Tower is empty
    } else {
        // Only allow smaller disks on top of bigger ones
        return newDisk.split("_")[1] < existing[0].id.split("_")[1];
    }
}

// Starts the countdown timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            goToGameOver(); // End game if time runs out
        }
    }, 1000);
}

// Returns an array of disk IDs currently in a tower
function getDisksInTower(towerId) {
    const tower = document.getElementById(towerId);
    return Array.from(tower.childNodes).map(d => d.id);
}

// Exports current game data for summary and local storage
function exportGameData() {
    let number_pieces_r_side = getDisksInTower("c").length; 
    let motion_rating = (number_pieces_r_side / number_pieces) * 3.5;

    let time = 480 - timeLeft; 
    let motion_rating2 = 0;

    // Time-based rating calculation
    if (time <= 60) {
        motion_rating2 = 1.5;
    } else {
        let penalty = (time - 60) * (1.5 / 420);
        motion_rating2 = Math.max(0, 1.5 - penalty);
    }

    let total_hanoi = motion_rating + motion_rating2;

    return {
        number_pieces: number_pieces,
        number_pieces_r_side: number_pieces_r_side,
        motion_rating: parseFloat(motion_rating.toFixed(2)),
        time: time,
        motion_rating2: parseFloat(motion_rating2.toFixed(2)),
        total_hanoi: parseFloat(total_hanoi.toFixed(2))
    };
}


// End game

// Called when the time runs out. Saves data and shows result screen.
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

