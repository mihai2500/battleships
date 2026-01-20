# ⚓ Battleships Game

A web-based implementation of the classic Battleships game. Currently in development.

## 🚀 Current Status

### ✅ Completed:
- **Basic HTML structure** with container, headings, and grid placeholders
- **CSS styling** with gradient background and responsive layout
- **Two 10×10 grids** rendered side-by-side
- **Button styling** with hover effects
- **JavaScript grid generation** creating 100 cells per board dynamically

### 🚧 To Be Implemented:
- Ship placement logic
- Attack system
- AI opponent
- Hit/miss detection
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
- **Game state object** tracking grids and game phase
- **`createEmptyGrid()`** - Creates 10×10 2D array structure
- **`buildGrid()`** - Generates 100 cells per board with DOM manipulation
- **Data attributes** (`data-row`, `data-col`) for cell coordinates
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

---

## 🚧 Next Steps

- [ ] Implement ship placement
- [ ] Add attack system
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
- GitHub: [@yourusername](https://github.com/mihai2500)

---

*Portfolio project - Work in progress*
