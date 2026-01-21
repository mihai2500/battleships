# ⚓ Battleships Game

A web-based implementation of the classic Battleships game. Currently in development.

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
 - **Bot opponent (baseline)**: random placement at start, random firing with a 0.8–1.8s delay
 - **New Game flow**: show "New Game" after win/loss; start/reset hides it
 - **Ships legend hides during battle** and reappears in placement phase

### 🚧 To Be Implemented:
- Smarter bot attack algorithm (non-random targeting)
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
- **Status messaging**: Dynamic UI updates showing current ship, orientation, and instructions; shows win/loss prompts
- **Legend visibility**: hides during battle, shows in placement
- Initialized on `DOMContentLoaded`

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
3. Bot waits ~1s then fires randomly back at your board
4. Win by hitting all enemy ship cells; lose if the bot hits all of yours
5. "New Game" appears after win/loss; Reset always returns to placement

---

## 🚧 Next Steps

- [ ] Smarter bot targeting (hunt + chase)
- [ ] Add sunk-ship state/visuals
- [ ] Deploy to GitHub Pages
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
