// Tambola Game Engine Configuration
const drawnNumbers = [];
const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

// --- 1. RANDOM NUMBER DRAW ENGINE ---
function drawNextNumber() {
    if (drawnNumbers.length >= 90) {
        alert("All numbers have been drawn!");
        return null;
    }
    
    // Filter out numbers that have already been pulled
    let availableNumbers = allNumbers.filter(n => !drawnNumbers.includes(n));
    let randomIndex = Math.floor(Math.random() * availableNumbers.length);
    let drawn = availableNumbers[randomIndex];
    
    drawnNumbers.push(drawn);
    announceNumber(drawn);
    updateBoardUI(drawn);
    return drawn;
}

// Speaks the number aloud and displays it on the big display board
function announceNumber(num) {
    // Uses standard browser audio to speak out the number
    const speech = new SpeechSynthesisUtterance(`Number ${num}`);
    window.speechSynthesis.speak(speech);
    
    const visualDisplay = document.getElementById("current-number");
    if (visualDisplay) visualDisplay.innerText = num;
}

// Turns the cell grid item green on the master 1-90 board
function updateBoardUI(num) {
    const cell = document.getElementById(`cell-${num}`);
    if (cell) cell.classList.add("called");
}

// --- 2. TAMBOLA TICKET GENERATION LOGIC ---
function generateTambolaTicket() {
    let ticket = Array.from({ length: 3 }, () => Array(9).fill(0));
    
    // Generate valid sorted numbers for each of the 9 vertical columns
    let columns = [];
    for (let i = 0; i < 9; i++) {
        let min = i * 10 + 1;
        let max = (i === 8) ? 90 : (i + 1) * 10;
        let pool = [];
        for (let n = min; n <= max; n++) pool.push(n);
        
        // Shuffle the column pool random numbers
        pool.sort(() => Math.random() - 0.5);
        columns.push(pool.slice(0, 3).sort((a, b) => a - b));
    }
    
    // Uniformly distribute exactly 5 numbers per row across the matrix
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
    // Generate the master board layout numbers grid dynamically (1 to 90)
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

    // Generate and render a unique 15-number ticket for the player
    const myTicket = generateTambolaTicket();
    const ticketContainer = document.getElementById("ticket");
    if (ticketContainer) {
        ticketContainer.innerHTML = "";
        myTicket.forEach(row => {
            row.forEach(cellValue => {
                let cell = document.createElement("div");
                cell.className = "ticket-cell";
                cell.innerText = cellValue === 0 ? "" : cellValue;
                ticketContainer.appendChild(cell);
            });
        });
    }
}

// Fire up the screen setup as soon as page elements render completely
document.addEventListener("DOMContentLoaded", initGame);
