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

const TOTAL_SHIP_CELLS = SHIPS.reduce((sum, ship) => sum + ship.size, 0);

let gameState = {
    playerGrid: [],
    enemyGrid: [],
    currentTurn: 'player',
    gamePhase: 'placement', // 'placement', 'battle', 'finished'
    shipsPlaced: 0,
    enemyHits: 0,
    playerHits: 0
};

function createEmptyGrid() {
    let grid = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        grid[r] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            grid[r][c] = { hasShip: false, isHit: false, shipId: null };
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

function placeShip(grid, row, col, size, horizontal, shipId = null) {
    if (horizontal) {
        for (let i = 0; i < size; i++) {
            grid[row][col + i].hasShip = true;
            grid[row][col + i].shipId = shipId;
        }
    } else {
        for (let i = 0; i < size; i++) {
            grid[row + i][col].hasShip = true;
            grid[row + i][col].shipId = shipId;
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

function clearEnemyGridMarks() {
    const cells = document.querySelectorAll('#enemyGrid .cell');
    cells.forEach((cell) => {
        cell.classList.remove('hit', 'miss');
    });
}

function clearPlayerGridMarks() {
    const cells = document.querySelectorAll('#playerGrid .cell');
    cells.forEach((cell) => {
        cell.classList.remove('hit', 'miss');
    });
}

function setShipsLegendVisible(show) {
    const legend = document.querySelector('.ship-legend');
    if (!legend) return;
    legend.style.display = show ? '' : 'none';
}

function renderShipsList() {
    const listEl = document.getElementById('shipsList');
    if (!listEl) return;

    listEl.innerHTML = '';

    // Hide already placed ships from the list
    SHIPS.forEach((ship, idx) => {
        if (shipPlacedFlags[idx]) return;

        const item = document.createElement('div');
        item.className = 'ship-item';

        const name = document.createElement('span');
        name.textContent = `${ship.name} (${ship.size})`;

        const blocks = document.createElement('div');
        blocks.className = 'ship-blocks';
        for (let i = 0; i < ship.size; i++) {
            const block = document.createElement('div');
            block.className = 'ship-block';
            blocks.appendChild(block);
        }

        item.appendChild(name);
        item.appendChild(blocks);
        listEl.appendChild(item);
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
        placeShip(gameState.playerGrid, row, col, ship.size, isHorizontal, currentShipIndex);
        updatePlayerGrid();
        
        shipPlacedFlags[currentShipIndex] = true;
        gameState.shipsPlaced++;
        renderShipsList();
        
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

function handleEnemyCellClick(event) {
    if (gameState.gamePhase !== 'battle') {
        document.getElementById('infoMessage').textContent = 'Press Start to begin attacking.';
        return;
    }

    if (gameState.currentTurn !== 'player') {
        document.getElementById('infoMessage').textContent = 'Wait for your turn.';
        return;
    }

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cellData = gameState.enemyGrid[row][col];

    if (cellData.isHit) {
        document.getElementById('infoMessage').textContent = 'You already attacked that cell.';
        return;
    }

    cellData.isHit = true;

    if (cellData.hasShip) {
        event.target.classList.add('hit');
        gameState.enemyHits++;
        document.getElementById('statusMessage').textContent = 'Hit!';

        if (gameState.enemyHits >= TOTAL_SHIP_CELLS) {
            gameState.gamePhase = 'finished';
            document.getElementById('statusMessage').textContent = 'You win! All enemy ships sunk.';
            document.getElementById('infoMessage').textContent = 'Press Reset or New Game to play again.';
            const newGameBtn = document.getElementById('newGameBtn');
            if (newGameBtn) newGameBtn.style.display = 'inline-block';
            return;
        }
    } else {
        event.target.classList.add('miss');
        document.getElementById('statusMessage').textContent = 'Miss!';
    }

    gameState.currentTurn = 'bot';
    document.getElementById('statusMessage').textContent = 'Enemy turn...';
    document.getElementById('infoMessage').textContent = 'Bot is attacking.';
    const delay = 800 + Math.random() * 1000; // 0.8-1.8 seconds
    setTimeout(botAttack, delay);
}

function addEnemyGridListeners() {
    const cells = document.querySelectorAll('#enemyGrid .cell');
    cells.forEach(cell => {
        cell.addEventListener('click', handleEnemyCellClick);
    });
}

function markPlayerCell(row, col, result) {
    const selector = `#playerGrid .cell[data-row="${row}"][data-col="${col}"]`;
    const cellEl = document.querySelector(selector);
    if (!cellEl) return;
    cellEl.classList.add(result);
}

let mode = 'random'; // default attack mode for bot
let botTargetQueue = []; // for hunt mode, stores cells to target after a hit
let botHitChain = []; // consecutive successful hits for current hunted ship
let huntOrientation = null; // 'horizontal' | 'vertical' | null
let huntShipId = null; // the ship currently being chased
let botPendingHits = []; // hits from different ships found while hunting current ship

function getAdjacentCells(row, col) {
    const adjacent = [];
    if (row > 0) adjacent.push({ row: row - 1, col });
    if (row < GRID_SIZE - 1) adjacent.push({ row: row + 1, col });
    if (col > 0) adjacent.push({ row, col: col - 1 });
    if (col < GRID_SIZE - 1) adjacent.push({ row, col: col + 1 });
    return adjacent;
}

function isQueued(row, col) {
    return botTargetQueue.some(cell => cell.row === row && cell.col === col);
}

function isPendingHit(row, col) {
    return botPendingHits.some(cell => cell.row === row && cell.col === col);
}

function enqueueIfValid(row, col) {
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;
    const cellData = gameState.playerGrid[row][col];
    if (cellData.isHit || isQueued(row, col)) return;
    botTargetQueue.push({ row, col });
}

function addHuntTargets(row, col) {
    const adjacent = getAdjacentCells(row, col);
    for (const cell of adjacent) {
        enqueueIfValid(cell.row, cell.col);
    }
}

function determineOrientationFromHits() {
    if (botHitChain.length < 2) return null;

    for (let i = 0; i < botHitChain.length; i++) {
        for (let j = i + 1; j < botHitChain.length; j++) {
            if (botHitChain[i].row === botHitChain[j].row) return 'horizontal';
            if (botHitChain[i].col === botHitChain[j].col) return 'vertical';
        }
    }

    return null;
}

function isShipSunk(grid, shipId) {
    if (shipId === null || shipId === undefined) return false;

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = grid[row][col];
            if (cell.hasShip && cell.shipId === shipId && !cell.isHit) {
                return false;
            }
        }
    }

    return true;
}

function addTargetsAlongOrientation() {
    if (!huntOrientation || botHitChain.length === 0) return;

    botTargetQueue = [];

    if (huntOrientation === 'horizontal') {
        const row = botHitChain[0].row;
        const cols = botHitChain.map(hit => hit.col);
        const minCol = Math.min(...cols);
        const maxCol = Math.max(...cols);
        enqueueIfValid(row, minCol - 1);
        enqueueIfValid(row, maxCol + 1);
    } else {
        const col = botHitChain[0].col;
        const rows = botHitChain.map(hit => hit.row);
        const minRow = Math.min(...rows);
        const maxRow = Math.max(...rows);
        enqueueIfValid(minRow - 1, col);
        enqueueIfValid(maxRow + 1, col);
    }
}

function registerBotHit(row, col) {
    const shipId = gameState.playerGrid[row][col].shipId;

    if (huntShipId === null) {
        huntShipId = shipId;
    }

    if (shipId !== huntShipId) {
        if (!isPendingHit(row, col)) {
            botPendingHits.push({ row, col, shipId });
        }
        return;
    }

    const alreadyInChain = botHitChain.some(hit => hit.row === row && hit.col === col);
    if (!alreadyInChain) {
        botHitChain.push({ row, col });
    }

    if (botHitChain.length === 1) {
        addHuntTargets(row, col);
        return;
    }

    if (!huntOrientation) {
        huntOrientation = determineOrientationFromHits();
    }

    if (huntOrientation) {
        addTargetsAlongOrientation();
    } else {
        addHuntTargets(row, col);
    }
}

function startHuntFromPendingHit() {
    while (botPendingHits.length > 0) {
        const seed = botPendingHits.pop();
        if (isShipSunk(gameState.playerGrid, seed.shipId)) {
            continue;
        }

        mode = 'hunt';
        huntShipId = seed.shipId;
        botHitChain = [{ row: seed.row, col: seed.col }];
        huntOrientation = null;
        botTargetQueue = [];
        addHuntTargets(seed.row, seed.col);
        return true;
    }

    return false;
}

function finalizeHuntIfSunk() {
    if (huntShipId !== null && isShipSunk(gameState.playerGrid, huntShipId)) {
        botTargetQueue = [];
        botHitChain = [];
        huntOrientation = null;
        huntShipId = null;

        if (!startHuntFromPendingHit()) {
            mode = 'random';
        }
    }
}

function resetBotHuntState() {
    mode = 'random';
    botTargetQueue = [];
    botHitChain = [];
    huntOrientation = null;
    huntShipId = null;
    botPendingHits = [];
}

function getHuntTarget() {
    if (botTargetQueue.length > 0) {
        return botTargetQueue.pop();
    }
    return null;
}

function randomAttack() {
    // Find a random untargeted cell
    let row = 0;
    let col = 0;
    let attempts = 0;
    do {
        row = Math.floor(Math.random() * GRID_SIZE);
        col = Math.floor(Math.random() * GRID_SIZE);
        attempts++;
    } while (gameState.playerGrid[row][col].isHit && attempts < 200);

    const cellData = gameState.playerGrid[row][col];

    // In case all cells were already hit (shouldn't happen unless finished)
    if (cellData.isHit) return;

    cellData.isHit = true;

    if (cellData.hasShip) {
        markPlayerCell(row, col, 'hit');
        mode = 'hunt'; // switch to hunt mode after a hit
        registerBotHit(row, col);
        finalizeHuntIfSunk();
        gameState.playerHits++;
        document.getElementById('statusMessage').textContent = 'Enemy hit your ship!';
        document.getElementById('infoMessage').textContent = 'Your turn to strike back.';

        if (gameState.playerHits >= TOTAL_SHIP_CELLS) {
            gameState.gamePhase = 'finished';
            document.getElementById('statusMessage').textContent = 'Defeat. Enemy sunk all your ships.';
            document.getElementById('infoMessage').textContent = 'Press Reset or New Game to try again.';
            const newGameBtn = document.getElementById('newGameBtn');
            if (newGameBtn) newGameBtn.style.display = 'inline-block';
            return;
        }
    } else {
        markPlayerCell(row, col, 'miss');
        document.getElementById('statusMessage').textContent = 'Enemy missed.';
        document.getElementById('infoMessage').textContent = 'Your turn to attack.';
    }

    gameState.currentTurn = 'player';
}

function huntAttack() {
    let target = getHuntTarget();

    if (!target) {
        if (startHuntFromPendingHit()) {
            target = getHuntTarget();
        }

        if (!target) {
            // No more targets in queue, switch back to random
            resetBotHuntState();
            randomAttack();
            return;
        }

        mode = 'hunt';
    }
    const cellData = gameState.playerGrid[target.row][target.col];

    if (cellData.isHit) {
        // If already hit, try another target
        huntAttack();
        return;
    }

    cellData.isHit = true;

    if (cellData.hasShip) {
        markPlayerCell(target.row, target.col, 'hit');
        registerBotHit(target.row, target.col);
        finalizeHuntIfSunk();
        gameState.playerHits++;
        document.getElementById('statusMessage').textContent = 'Enemy hit your ship!';
        document.getElementById('infoMessage').textContent = 'Your turn to strike back.';

        if (gameState.playerHits >= TOTAL_SHIP_CELLS) {
            gameState.gamePhase = 'finished';
            document.getElementById('statusMessage').textContent = 'Defeat. Enemy sunk all your ships.';
            document.getElementById('infoMessage').textContent = 'Press Reset or New Game to try again.';
            const newGameBtn = document.getElementById('newGameBtn');
            if (newGameBtn) newGameBtn.style.display = 'inline-block';
            return;
        }
    } else {
        markPlayerCell(target.row, target.col, 'miss');
        document.getElementById('statusMessage').textContent = 'Enemy missed.';
        document.getElementById('infoMessage').textContent = 'Your turn to attack.';
    }

    gameState.currentTurn = 'player';
}

function botAttack() {
    if (gameState.gamePhase !== 'battle') return;
    if(mode === 'random') {
        randomAttack();
    } else if(mode === 'hunt') {
        huntAttack();
    }
}

function randomPlaceShips() {
    gameState.playerGrid = createEmptyGrid();
    shipPlacedFlags = Array(SHIPS.length).fill(false);
    gameState.shipsPlaced = 0;
    
    for (let i = 0; i < SHIPS.length; i++) {
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const horizontal = Math.random() > 0.5;
            const row = Math.floor(Math.random() * GRID_SIZE);
            const col = Math.floor(Math.random() * GRID_SIZE);
            
            if (canPlaceShip(gameState.playerGrid, row, col, SHIPS[i].size, horizontal)) {
                placeShip(gameState.playerGrid, row, col, SHIPS[i].size, horizontal, i);
                shipPlacedFlags[i] = true;
                gameState.shipsPlaced++;
                placed = true;
            }
            attempts++;
        }
    }
    
    updatePlayerGrid();
    renderShipsList();
    document.getElementById('statusMessage').textContent = 'All ships placed! Click "Start Game"';
    document.getElementById('infoMessage').textContent = '';
    document.getElementById('startGameBtn').disabled = false;
    currentShipIndex = SHIPS.length;
}

function randomPlaceEnemyShips() {
    // Keep enemy layout hidden but ensure it has ships
    gameState.enemyGrid = createEmptyGrid();
    gameState.enemyHits = 0;

    for (let i = 0; i < SHIPS.length; i++) {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 100) {
            const horizontal = Math.random() > 0.5;
            const row = Math.floor(Math.random() * GRID_SIZE);
            const col = Math.floor(Math.random() * GRID_SIZE);

            if (canPlaceShip(gameState.enemyGrid, row, col, SHIPS[i].size, horizontal)) {
                placeShip(gameState.enemyGrid, row, col, SHIPS[i].size, horizontal, i);
                placed = true;
            }
            attempts++;
        }
    }
}

function startGame() {
    // Require player ships before starting
    if (gameState.shipsPlaced !== SHIPS.length) {
        document.getElementById('infoMessage').textContent = 'Place all ships first, then start the game.';
        return;
    }

    clearEnemyGridMarks();
    randomPlaceEnemyShips();
    gameState.gamePhase = 'battle';
    gameState.currentTurn = 'player';
    gameState.playerHits = 0;
    resetBotHuntState();

    const startBtn = document.getElementById('startGameBtn');
    if (startBtn) startBtn.disabled = true;

    setShipsLegendVisible(false);

    document.getElementById('statusMessage').textContent = 'Battle phase: your turn';
    document.getElementById('infoMessage').textContent = 'Click enemy cells to attack. Red = hit, blue = miss.';
}

function resetGame() {
    gameState.playerGrid = createEmptyGrid();
    gameState.enemyGrid = createEmptyGrid();
    gameState.shipsPlaced = 0;
    gameState.gamePhase = 'placement';
    gameState.currentTurn = 'player';
    gameState.enemyHits = 0;
    gameState.playerHits = 0;
    currentShipIndex = 0;
    isHorizontal = true;
    shipPlacedFlags = Array(SHIPS.length).fill(false);
    resetBotHuntState();

    updatePlayerGrid();
    updateOrientationUI();
    renderShipsList();
    setShipsLegendVisible(true);
    clearEnemyGridMarks();
    clearPlayerGridMarks();
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) newGameBtn.style.display = 'none';
    setShipsLegendVisible(true);
    
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
    addEnemyGridListeners();
    
    document.getElementById('statusMessage').textContent = 
        `Place ${SHIPS[0].name} (${SHIPS[0].size} cells) — use arrow keys to change ship`;

    updateOrientationUI();
    renderShipsList();

    // Reset button listener
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }

    // Random placement button listener
    const randomPlacementBtn = document.getElementById('randomPlacementBtn');
    if (randomPlacementBtn) {
        randomPlacementBtn.addEventListener('click', randomPlaceShips);
    }

    // Start game button listener
    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', startGame);
    }

    // New game button listener
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', resetGame);
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
