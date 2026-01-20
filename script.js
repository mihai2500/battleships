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

document.addEventListener('DOMContentLoaded', () => {
    buildGrid('playerGrid', false);
    buildGrid('enemyGrid', true);
});
