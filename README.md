# Sweet Bonanza Therapeutic Simulation

## 🎯 Project Overview

A high-fidelity, non-monetary simulation clone of the "Sweet Bonanza" slot game designed for therapeutic exposure to gambling addiction behavioral triggers. This application provides a safe environment to experience gambling mechanics without financial risk.

## ⚠️ Important Notice

**This application is intended for therapeutic purposes only and contains no real money gambling mechanics.**

## 🌟 Features

### Core Game Mechanics
- **6x5 Grid Structure**: 30-position game grid with 8 distinct candy/fruit symbols
- **Cluster Pays System**: Wins based on total symbol count (minimum 8 matching symbols)
- **Tumble Feature**: Winning symbols disappear, remaining symbols fall down, new symbols fill gaps
- **Free Spins**: Triggered by 4+ scatter symbols (Lollipop 🍭)
- **Multiplier Bombs**: x2 to x100 multipliers available during free spins only

### Visual & Animation Features
- **Win Animations**: Rapid flash, scale, and disappear effects for winning symbols
- **Multiplier Visuals**: Glowing, pulsating multiplier bombs with distinct borders
- **Tumble Animation**: Smooth cascade effect using CSS transitions
- **Big Win Effect**: Screen-wide celebration overlay with confetti and screen shake
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop

### Therapeutic Design
- **Virtual Currency**: Uses "Puan" (Points) instead of real money
- **No Payment Integration**: Completely isolated from financial systems
- **Prominent Warning**: Clear therapeutic purpose disclaimer
- **Reset Functionality**: Easy balance reset for repeated sessions

## 🎮 Game Symbols

- 🍒 Cherry
- 🍌 Banana  
- 🍇 Grape
- 🍉 Watermelon
- ❤️ Red Heart Candy
- 🟣 Purple Square Candy
- 🌟 Green Star Candy
- 🍭 Lollipop (Scatter Symbol)

## 🎲 Payout Structure

| Symbol Count | Payout (Points) |
|--------------|-----------------|
| 8-9 symbols  | 20 points      |
| 10-11 symbols| 50 points      |
| 12+ symbols  | 100 points     |

## 🆓 Free Spins & Multipliers

- **Free Spin Trigger**: 4+ scatter symbols = 10 free spins
- **Re-trigger**: 3+ scatters during free spins = +5 additional spins
- **Multiplier Bombs**: Only appear during free spins
- **Multiplier Values**: 2x, 3x, 5x, 10x, 25x, 50x, 100x
- **Calculation**: All multiplier values on screen are summed and applied to total win

## 🛠️ Technology Stack

- **Frontend**: React 18 (Functional Components & Hooks)
- **Styling**: Tailwind CSS
- **State Management**: React useState hooks
- **Animations**: CSS keyframes and Tailwind utilities
- **Build**: Single HTML file with CDN dependencies

## 🚀 Installation & Usage

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/Deus09/sweetbonanza.git
   cd sweetbonanza
   ```

2. Start the development server:
   ```bash
   npm start
   # or
   python3 -m http.server 8080
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

### Alternative Setup
Simply open `index.html` directly in any modern web browser.

## 🎮 How to Play

1. **Initial Balance**: Start with 5000 virtual points
2. **Place Bet**: Each spin costs 20 points
3. **Spin**: Click "Döndür" to start a spin
4. **Wins**: Match 8+ identical symbols anywhere on the grid
5. **Tumbles**: Winning symbols disappear, new ones fall down
6. **Free Spins**: Collect 4+ lollipop scatters to trigger free spins
7. **Multipliers**: During free spins, multiplier bombs can appear
8. **Reset**: Use "Sanal Bakiyeyi Sıfırla" to reset your balance

## 🎨 Visual Features

### Animations
- **Symbol Win Animation**: Pulse, scale, and glow effects
- **Tumble Effect**: Smooth falling animation for cascading symbols
- **Big Win Celebration**: Full-screen overlay with confetti
- **Multiplier Glow**: Pulsating border effect for multiplier bombs

### Responsive Design
- Mobile-first approach
- Scalable font sizes and UI elements
- Touch-friendly controls
- Optimized for all screen sizes

## 🧠 Therapeutic Purpose

This simulation is designed to:
- Provide exposure to gambling mechanics in a safe environment
- Remove financial risk while maintaining psychological triggers
- Allow therapeutic analysis of gambling behaviors
- Support addiction recovery through controlled exposure

## 📁 File Structure

```
sweetbonanza/
├── index.html          # Main application file
├── SweetBonanzaGame.jsx # React component (for reference)
├── package.json        # Project configuration
└── README.md          # Documentation
```

## 🔧 Customization

### Modifying Payouts
Edit the `getPayoutForSymbol()` function to adjust payout values.

### Adding New Symbols
Update the `SYMBOLS` object and ensure proper emoji rendering.

### Adjusting Multipliers
Modify the `multiplierValues` array in `generateMultipliers()` function.

### Animation Timing
Adjust timeout values in the `spin()` function for different animation speeds.

## 📱 Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

This is a therapeutic tool. Contributions should focus on:
- Improving accessibility
- Enhancing therapeutic value
- Bug fixes and stability
- Documentation improvements

## 📄 License

MIT License - See LICENSE file for details.

## ⚖️ Disclaimer

**WARNING: This application is a therapeutic simulation only. It involves no real money risk and is not intended for entertainment gambling. If you or someone you know has a gambling problem, please seek professional help.**

## 📞 Support

For therapeutic use questions or technical support, please open an issue on GitHub.

---

*This project is designed to support gambling addiction recovery through safe, controlled exposure therapy. It should be used under appropriate therapeutic guidance.*