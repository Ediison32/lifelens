// Initial disks in tower "a"
var towers = {
    "a": ["disk_1", "disk_2", "disk_3", "disk_4", "disk_5", "disk_6", "disk_7"]
};

var totalDisks = 7;
var moveCounter = 0;
var timeLeft = 127;
var timerInterval;
var timerStarted = false; // ✅ New flag: prevents starting multiple timers

// Main initializer
function main() {
    render("a");
    initGame();
}

// Setup game
function initGame() {
    var disks = document.querySelectorAll("div#container > div > div");
    var dropZones = document.querySelectorAll("div#container > div");

    // Drag handlers
    for (var i = 0; i < disks.length; i++) {
        disks[i].addEventListener("dragstart", dragStart, false);
        disks[i].addEventListener("dragend", dragEnd, false);
    }

    // Drop handlers
    for (var i = 0; i < dropZones.length; i++) {
        dropZones[i].addEventListener("dragenter", (e) => e.preventDefault(), false);
        dropZones[i].addEventListener("dragover", (e) => e.preventDefault(), false);
        dropZones[i].addEventListener("drop", dropHandler, false);
    }

    // Update disks in C
    updateDisksInC();
}

/* Drag and Drop Functions */
function dragStart(e) {
    var parent = e.target.parentNode;
    if (parent.childNodes[0].id === e.target.id) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData("Text", e.target.id);
    }
}

function dragEnd(e) {
    e.preventDefault();
    var finalTower = document.getElementById("c"); // Winning tower is "c"
    var winMessage = document.querySelector("div#output > div");
    if (finalTower.childNodes.length === totalDisks) {
        clearInterval(timerInterval);
        winMessage.innerHTML = "🎉 YOU WON!";
    }
}

function dropHandler(e) {
    e.preventDefault();
    var target = e.target;

    // Ensure we are dropping into a tower, not onto a disk
    if (!["a", "b", "c"].includes(target.id)) {
        target = target.parentNode;
    }

    var children = target.childNodes;
    var draggedDisk = e.dataTransfer.getData("Text");

    // Check if disk can be placed
    var canDrop = canPlace(children, draggedDisk);

    if (["a", "b", "c"].includes(target.id) && draggedDisk !== '' && canDrop) {
        var diskToMove = document.getElementById(draggedDisk);
        diskToMove.parentNode.removeChild(diskToMove);
        target.innerHTML = '<div class="disk" id="' + draggedDisk + '" draggable="true"></div>' + target.innerHTML;
        moveCounter++;

        // ✅ Start timer on first move
        if (!timerStarted) {
            timerStarted = true;
            startTimer();
        }
    }

    // Update moves
    document.getElementById("moves").innerText = moveCounter;

    initGame();
}

// Render disks in initial tower
function render(tower) {
    var container = document.getElementById(tower);
    container.innerHTML = '';
    for (var i = 0; i < towers[tower].length; i++) {
        container.innerHTML += '<div class="disk" id="' + towers[tower][i] + '" draggable="true"></div>';
    }
}

// Check if disk can be placed
function canPlace(existing, newDisk) {
    if (existing[0] == undefined) {
        return true;
    } else {
        return (newDisk.split("_")[1] < existing[0].id.split("_")[1]);
    }
}

// Timer logic
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

// ✅ Helper: get all disks currently in a tower
function getDisksInTower(towerId) {
    let tower = document.getElementById(towerId);
    // Los childNodes van de arriba → abajo, pero en el juego los discos están invertidos
    let disks = Array.from(tower.childNodes).map(d => d.id);
    return disks;
}

// ✅ Mostrar pantalla final con los discos en cada torre
function goToGameOver() {
    let disksA = getDisksInTower("a");
    let disksB = getDisksInTower("b");
    let disksC = getDisksInTower("c");

    // Opción: mostrar en una nueva pantalla
    document.body.innerHTML = `
        <section style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;text-align:center;">
            <h1 style="font-size:3em;color:red;">⏰ GAME OVER</h1>
            <p style="font-size:1.5em;">You made ${moveCounter} moves.</p>

            <h2>📦 Final State of Towers:</h2>
            <div style="display:flex;gap:40px;justify-content:center;margin-top:20px;">
                
                <div>
                    <h3>🗼 Tower A</h3>
                    <ul style="font-size:1.2em;list-style:none;padding:0;">
                        ${disksA.length > 0 
                            ? disksA.map(d => `<li>🟦 ${d}</li>`).join("")
                            : "<li>❌ Empty</li>"}
                    </ul>
                </div>

                <div>
                    <h3>🗼 Tower B</h3>
                    <ul style="font-size:1.2em;list-style:none;padding:0;">
                        ${disksB.length > 0 
                            ? disksB.map(d => `<li>🟦 ${d}</li>`).join("")
                            : "<li>❌ Empty</li>"}
                    </ul>
                </div>

                <div>
                    <h3>🗼 Tower C</h3>
                    <ul style="font-size:1.2em;list-style:none;padding:0;">
                        ${disksC.length > 0 
                            ? disksC.map(d => `<li>🟦 ${d}</li>`).join("")
                            : "<li>❌ Empty</li>"}
                    </ul>
                </div>
            </div>

            <button style="margin-top:20px;padding:10px 20px;font-size:1.2em;" onclick="location.reload()">🔄 Play Again</button>
        </section>
    `;
}

window.addEventListener("load", main, false);



