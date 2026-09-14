// Upgraded Tambola Game Engine - Interactive Ticket Edition
const drawnNumbers = [];
const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

// --- 1. RANDOM NUMBER DRAW ENGINE ---
function drawNextNumber() {
    if (drawnNumbers.length >= 90) {
        alert("All numbers have been drawn!");
        return null;
    }
    
    let availableNumbers = allNumbers.filter(n => !drawnNumbers.includes(n));
    let randomIndex = Math.floor(Math.random() * availableNumbers.length);
    let drawn = availableNumbers[randomIndex];
    
    drawnNumbers.push(drawn);
    announceNumber(drawn);
    updateBoardUI(drawn);
    return drawn;
}

function announceNumber(num) {
    const speech = new SpeechSynthesisUtterance(`Number ${num}`);
    window.speechSynthesis.speak(speech);
    
    const visualDisplay = document.getElementById("current-number");
    if (visualDisplay) visualDisplay.innerText = num;
}

function updateBoardUI(num) {
    const cell = document.getElementById(`cell-${num}`);
    if (cell) cell.classList.add("called");
}

// --- 2. TAMBOLA TICKET GENERATION LOGIC ---
function generateTambolaTicket() {
    let ticket = Array.from({ length: 3 }, () => Array(9).fill(0));
    let columns = [];
    
    for (let i = 0; i < 9; i++) {
        let min = i * 10 + 1;
        let max = (i === 8) ? 90 : (i + 1) * 10;
        let pool = [];
        for (let n = min; n <= max; n++) pool.push(n);
        
        pool.sort(() => Math.random() - 0.5);
        columns.push(pool.slice(0, 3).sort((a, b) => a - b));
    }
    
    for (let row = 0; row < 3; row++) {
        let placedIndices = [];
        while (placedIndices.length < 5) {
            let colIdx = Math.floor(Math.random() * 9);
            if (!placedIndices.includes(colIdx) && columns[colIdx].length > 0) {
                placedIndices.push(colIdx);
            }
        }
        
        placedIndices.forEach(colIdx => {
            ticket[row][colIdx] = columns[colIdx].pop();
        });
    }
    return ticket;
}

// --- 3. RUN THE GAME BOOT INITIALIZATION ---
function initGame() {
    const boardContainer = document.getElementById("board");
    if (boardContainer) {
        boardContainer.innerHTML = "";
        for (let i = 1; i <= 90; i++) {
            let cell = document.createElement("div");
            cell.id = `cell-${i}`;
            cell.className = "board-cell";
            cell.innerText = i;
            boardContainer.appendChild(cell);
        }
    }

    const myTicket = generateTambolaTicket();
    const ticketContainer = document.getElementById("ticket");
    if (ticketContainer) {
        ticketContainer.innerHTML = "";
        myTicket.forEach(row => {
            row.forEach(cellValue => {
                let cell = document.createElement("div");
                cell.className = "ticket-cell";
                
                if (cellValue === 0) {
                    cell.innerText = "";
                } else {
                    cell.innerText = cellValue;
                    // NEW: Add a touch/click event listener to cross numbers off manually
                    cell.addEventListener("click", function() {
                        cell.classList.toggle("marked");
                    });
                }
                ticketContainer.appendChild(cell);
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", initGame);
