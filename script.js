// Game constants
const GRID_SIZE = 10;
const SHIP_SIZES = [5, 4, 3, 3, 2];

const SHIPS = [
    { name: 'Carrier', size: 5 },
    { name: 'Battleship', size: 4 },
    { name: 'Cruiser', size: 3 },
    { name: 'Submarine', size: 3 },
    { name: 'Destroyer', size: 2 }
];

let gameState = {
    playerGrid: [],
    enemyGrid: [],
    currentTurn: 'player',
    gamePhase: 'placement', // 'placement' or 'battle'
    shipsPlaced: 0
};

function createEmptyGrid() {
    let grid = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        grid[r] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            grid[r][c] = { hasShip: false, isHit: false };
        }
    }
    return grid;
}

function buildGrid(containerId, isEnemy = false) {
    const gridEl = document.getElementById(containerId);
    gridEl.innerHTML = '';
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell' + (isEnemy ? ' enemy-cell' : '');
            cell.dataset.row = r;
            cell.dataset.col = c;
            gridEl.appendChild(cell);
        }
    }
}

let currentShipIndex = 0;
let isHorizontal = true;
let shipPlacedFlags = Array(SHIPS.length).fill(false);

function findNextAvailable(startIndex, step) {
    let idx = startIndex;
    for (let i = 0; i < SHIPS.length; i++) {
        idx = (idx + step + SHIPS.length) % SHIPS.length;
        if (!shipPlacedFlags[idx]) return idx;
    }
    return startIndex;
}

function updateOrientationUI() {
    const orientationText = isHorizontal ? 'Horizontal (left → right)' : 'Vertical (top → bottom)';
    const infoEl = document.getElementById('infoMessage');
    if (infoEl) {
        infoEl.textContent = `Placement: ${orientationText} — press R to switch orientation`;
    }
}

function toggleOrientation() {
    isHorizontal = !isHorizontal;
    updateOrientationUI();
    document.getElementById('infoMessage').textContent = `Placement: ${isHorizontal ? 'Horizontal (left → right)' : 'Vertical (top → bottom)'} — press R to switch orientation`;
}

function canPlaceShip(grid, row, col, size, horizontal) {
    if (horizontal) {
        // Check if ship goes out of bounds
        if (col + size > GRID_SIZE) return false;
        // Check for overlapping ships
        for (let i = 0; i < size; i++) {
            if (grid[row][col + i].hasShip) return false;
        }
    } else {
        // Vertical placement
        if (row + size > GRID_SIZE) return false;
        for (let i = 0; i < size; i++) {
            if (grid[row + i][col].hasShip) return false;
        }
    }
    return true;
}

function placeShip(grid, row, col, size, horizontal) {
    if (horizontal) {
        for (let i = 0; i < size; i++) {
            grid[row][col + i].hasShip = true;
        }
    } else {
        for (let i = 0; i < size; i++) {
            grid[row + i][col].hasShip = true;
        }
    }
}

function updatePlayerGrid() {
    const cells = document.querySelectorAll('#playerGrid .cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        
        if (gameState.playerGrid[row][col].hasShip) {
            cell.classList.add('ship');
        } else {
            cell.classList.remove('ship');
        }
    });
}

function handleCellClick(event) {
    if (gameState.gamePhase !== 'placement') return;
    if (currentShipIndex >= SHIPS.length) return;
    if (shipPlacedFlags[currentShipIndex]) return;
    
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const ship = SHIPS[currentShipIndex];
    
    if (canPlaceShip(gameState.playerGrid, row, col, ship.size, isHorizontal)) {
        placeShip(gameState.playerGrid, row, col, ship.size, isHorizontal);
        updatePlayerGrid();
        
        shipPlacedFlags[currentShipIndex] = true;
        gameState.shipsPlaced++;
        
        if (gameState.shipsPlaced === SHIPS.length) {
            document.getElementById('statusMessage').textContent = 
                'All ships placed! Click "Start Game"';
            document.getElementById('infoMessage').textContent = '';
            document.getElementById('startGameBtn').disabled = false;
        } else {
            currentShipIndex = findNextAvailable(currentShipIndex, 1);
            document.getElementById('statusMessage').textContent = 
                `Place ${SHIPS[currentShipIndex].name} (${SHIPS[currentShipIndex].size} cells) — use arrow keys to change ship`;
            document.getElementById('infoMessage').textContent = `Placement: ${isHorizontal ? 'Horizontal (left → right)' : 'Vertical (top → bottom)'} — press R to switch orientation`;
        }
    } else {
        document.getElementById('infoMessage').textContent = 
            'Cannot place ship here!';
    }
}

function addPlayerGridListeners() {
    const cells = document.querySelectorAll('#playerGrid .cell');
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

function resetGame() {
    gameState.playerGrid = createEmptyGrid();
    gameState.shipsPlaced = 0;
    currentShipIndex = 0;
    isHorizontal = true;
    shipPlacedFlags = Array(SHIPS.length).fill(false);

    updatePlayerGrid();
    updateOrientationUI();
    
    document.getElementById('statusMessage').textContent = 
        `Place ${SHIPS[0].name} (${SHIPS[0].size} cells) — use arrow keys to change ship`;
    document.getElementById('startGameBtn').disabled = true;
}

document.addEventListener('DOMContentLoaded', () => {
    gameState.playerGrid = createEmptyGrid();
    gameState.enemyGrid = createEmptyGrid();
    
    buildGrid('playerGrid', false);
    buildGrid('enemyGrid', true);
    
    addPlayerGridListeners();
    
    // Set initial message
    document.getElementById('statusMessage').textContent = 
        `Place ${SHIPS[0].name} (${SHIPS[0].size} cells) — use arrow keys to change ship`;

    updateOrientationUI();

    // Reset button listener
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }

    document.addEventListener('keydown', (event) => {
        if (gameState.shipsPlaced === SHIPS.length) return; // disable navigation after all ships placed

        if (event.key === 'r' || event.key === 'R') {
            toggleOrientation();
        } else if (event.key === 'ArrowLeft') {
            currentShipIndex = findNextAvailable(currentShipIndex, -1);
            document.getElementById('statusMessage').textContent = 
                `Place ${SHIPS[currentShipIndex].name} (${SHIPS[currentShipIndex].size} cells) — use arrow keys to change ship`;
        } else if (event.key === 'ArrowRight') {
            currentShipIndex = findNextAvailable(currentShipIndex, 1);
            document.getElementById('statusMessage').textContent = 
                `Place ${SHIPS[currentShipIndex].name} (${SHIPS[currentShipIndex].size} cells) — use arrow keys to change ship`;
        }
    });
});
