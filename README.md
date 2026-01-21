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

### 🚧 To Be Implemented:
- Random Placement button
- Attack system (player clicks enemy grid)
- Hit/miss/sunk visual feedback
- AI opponent
- Win/loss conditions

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
  - `updatePlayerGrid()` - Renders visual ship placement
- **Orientation toggle**: R key switches between horizontal (left→right) and vertical (top→bottom)
- **Ship selection**: Arrow keys cycle through unplaced ships
- **Reset functionality**: `resetGame()` clears board and reinitializes placement
- **Status messaging**: Dynamic UI updates showing current ship, orientation, and instructions
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
1. Click cells on your board to place ships
2. Press **R** to toggle orientation (horizontal/vertical)
3. Use **Arrow Keys** (← →) to switch which ship to place
4. Click **Reset** to clear the board and restart placement
5. Once all 5 ships are placed, click **Start Game**

*Attack and battle phases coming soon.*

---

## 🚧 Next Steps

- [ ] Implement Random Placement button
- [ ] Add attack system (player vs enemy grid clicks)
- [ ] Show hit/miss/sunk states visually
- [ ] Create AI opponent
- [ ] Add win/loss detection
- [ ] Deploy to GitHub Pages

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
