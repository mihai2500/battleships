# ⚓ Battleships Game

A web-based implementation of the classic Battleships game. Currently in development.

**Live demo:** https://mihai2500.github.io/battleships/

## 🚀 Current Status

### ✅ Completed:
- **Basic HTML structure** with container, headings, and grid placeholders
- **CSS styling** with gradient background and responsive layout
- **Two 10×10 grids** rendered side-by-side
- **Button styling** with hover effects
- **JavaScript grid generation** creating 100 cells per board dynamically
- **Ship placement system (manual)** with orientation toggle (R key) and arrow-key ship selection
- **Placement validation** (bounds + no overlap) with clear error messaging
- **Reset button** to clear board and restart placement
- **Dynamic status messaging** showing current ship and placement instructions
- **Random Placement button** - Automatically places all ships randomly on the board
 - **Ships list auto-updates** hiding already placed ships (works with manual and random placement)
 - **Attack system**: player clicks enemy grid; blocks repeat shots
 - **Hit/Miss visuals** on both boards
 - **Win/Loss detection** for both sides
 - **Bot opponent (improved)**: random placement at start, random + hunt firing with a 0.8–1.8s delay
 - **Orientation-aware bot hunting**: after multiple hits, bot continues along ship direction instead of checking all neighbors
 - **Ship-aware bot targeting**: bot tracks a specific discovered ship until it is sunk
 - **Adjacent-ship handling**: incidental hits on nearby ships are queued and hunted next (instead of being lost)
 - **New Game flow**: show "New Game" after win/loss; start/reset hides it
 - **Ships legend hides during battle** and reappears in placement phase

### 🚧 To Be Implemented:
- Better random-search strategy (parity/probability heatmap)
- Sunk-ship feedback/animation
- Deployment (e.g., GitHub Pages)

---

## 🛠️ Technologies

### HTML
- Semantic structure with proper heading hierarchy
- Grid containers (`#playerGrid`, `#enemyGrid`)
- Control buttons (Random Placement, Reset, Start Game)
- Status display areas

### CSS
- **CSS Grid** for side-by-side board layout (`grid-template-columns: 1fr 1fr`)
- **Flexbox** for centering and button groups
- **Gradient background** (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`)
- **Custom colors** for different cell states
- **Hover effects** with transitions
- **Responsive design** ready for future implementation

### JavaScript
- **Constants**: Grid size (10), ship definitions (5 ships)
- **Game state object** tracking grids, game phase, and ships placed
- **`createEmptyGrid()`** - Creates 10×10 2D array structure
- **`buildGrid()`** - Generates 100 cells per board with DOM manipulation
- **Placement logic**: 
  - `canPlaceShip()` - Validates placement (bounds checking + overlap detection)
  - `placeShip()` - Writes ship to grid
  - `randomPlaceShips()` - Automatically places all 5 ships at random positions with random orientations
  - `updatePlayerGrid()` - Renders visual ship placement
- **Orientation toggle**: R key switches between horizontal (left→right) and vertical (top→bottom)
- **Ship selection**: Arrow keys cycle through unplaced ships
- **Reset functionality**: `resetGame()` clears board and reinitializes placement
- **Random placement functionality**: `randomPlaceShips()` auto-places all ships and readies the game
- **Battle logic**: `handleEnemyCellClick()` for player shots; `botAttack()` for enemy shots; prevents repeat shots and checks win/loss
- **Bot hunt system**:
  - Two modes: random search + hunt/chase mode
  - Direction inference after consecutive hits (`horizontal`/`vertical`)
  - Continues chasing one ship until sunk using per-cell `shipId`
  - Queues hits from adjacent ships and resumes them after current ship is sunk
- **Status messaging**: Dynamic UI updates showing current ship, orientation, and instructions; shows win/loss prompts
- **Legend visibility**: hides during battle, shows in placement
- Initialized on `DOMContentLoaded`

---

## 🧠 Hunt Algorithm (Bot AI)

The bot uses a two-phase attack strategy and keeps internal state between turns:

1. **Random Search Phase**
  - Bot selects an unhit cell at random.
  - On **miss**, it stays in random mode.
  - On **hit**, it switches to hunt mode and starts tracking that ship.

2. **Hunt/Chase Phase**
  - The first hit adds the four orthogonal neighbors as candidates.
  - After a second aligned hit, the bot infers orientation (`horizontal` or `vertical`).
  - Once orientation is known, it only targets the two open ends of the current hit chain.

3. **Ship-Scoped Tracking**
  - Each ship cell has a `shipId`.
  - Hunt mode is locked to one `huntShipId`, so hits from different ships are not mixed.
  - The bot keeps chasing that same ship until all its cells are hit (sunk check).

4. **Adjacent-Ship Edge Case Handling**
  - If a shot during hunt mode hits a different adjacent ship, that hit is saved in a pending queue.
  - After the current hunted ship is sunk, the bot resumes from queued hits before returning to random mode.

5. **Reset Rules**
  - Hunt state resets on `Start Game` and `Reset Game`.
  - If no hunt targets and no pending hits remain, bot falls back to random search.

This avoids the classic bug where the bot loses direction after finding part of a ship or incorrectly abandons a discovered target.

---

## 📁 Project Structure

```
battleships/
├── index.html       # Main HTML structure
├── style.css        # Styling and layout
├── script.js        # Game logic (in progress)
└── README.md        # Documentation
```

---

## 💡 Learning Goals

- DOM manipulation and dynamic element creation
- CSS Grid and Flexbox layouts
- State management in vanilla JavaScript
- 2D array data structures
- Game logic and algorithms
- Keyboard event handling and user interaction

---

## 🎮 How to Play (In Progress)

**Ship Placement Phase:**
1. **Manual Placement**: Click cells on your board to place ships
   - Press **R** to toggle orientation (horizontal/vertical)
   - Use **Arrow Keys** (← →) to switch which ship to place
  - The ships list shows only ships you still need to place
2. **Quick Setup**: Click **Random Placement** to automatically place all ships; the ships list will clear
3. Click **Reset** to clear the board and restart placement (list repopulates)
4. Once all 5 ships are placed, click **Start Game**

**Battle Phase:**
1. Click enemy cells to attack (no repeat shots)
2. Red = hit, dark blue = miss
3. Bot waits ~1s then fires back using random search + hunt/chase behavior
4. Win by hitting all enemy ship cells; lose if the bot hits all of yours
5. "New Game" appears after win/loss; Reset always returns to placement

---

## 🚧 Next Steps

- [ ] Improve random search with parity/probability targeting
- [ ] Add sunk-ship state/visuals
- [ ] Audio feedback for hits/misses

---

## 📝 Installation

```bash
git clone https://github.com/mihai2500/battleships.git
cd battleships
```

Open `index.html` in your browser.

---

## 👨‍💻 Author

**Mihai Oprea**
- GitHub: [@mihai2500](https://github.com/mihai2500)

---

*Portfolio project - Work in progress*
