import React, { useState, useEffect, useCallback } from 'react';

// Symbol types for the game
const SYMBOLS = {
  CHERRY: '🍒',
  BANANA: '🍌', 
  GRAPE: '🍇',
  WATERMELON: '🍉',
  RED_HEART: '❤️',
  PURPLE_SQUARE: '🟣',
  GREEN_STAR: '🌟',
  LOLLIPOP: '🍭' // Scatter symbol
};

const SYMBOL_NAMES = {
  '🍒': 'CHERRY',
  '🍌': 'BANANA',
  '🍇': 'GRAPE', 
  '🍉': 'WATERMELON',
  '❤️': 'RED_HEART',
  '🟣': 'PURPLE_SQUARE',
  '🌟': 'GREEN_STAR',
  '🍭': 'LOLLIPOP'
};

const SweetBonanzaGame = () => {
  // Game state
  const [grid, setGrid] = useState([]);
  const [balance, setBalance] = useState(5000);
  const [freeSpins, setFreeSpins] = useState(0);
  const [sessionWins, setSessionWins] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState('Oyuna başlamak için döndür!');
  const [multipliers, setMultipliers] = useState([]);
  const [winningSymbols, setWinningSymbols] = useState(new Set());
  const [showBigWin, setShowBigWin] = useState(false);
  const [isTumbling, setIsTumbling] = useState(false);
  const [explosiveWins, setExplosiveWins] = useState(new Set());
  const [particles, setParticles] = useState([]);
  const [shockwaves, setShockwaves] = useState([]);
  const [sparkles, setSparkles] = useState([]);

  const BET_AMOUNT = 20;
  const GRID_ROWS = 5;
  const GRID_COLS = 6;

  // Initialize grid with random symbols
  const generateRandomSymbol = useCallback(() => {
    const symbolValues = Object.values(SYMBOLS);
    return symbolValues[Math.floor(Math.random() * symbolValues.length)];
  }, []);

  const initializeGrid = useCallback(() => {
    const newGrid = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const gridRow = [];
      for (let col = 0; col < GRID_COLS; col++) {
        gridRow.push({
          symbol: generateRandomSymbol(),
          id: `${row}-${col}`,
          isWinning: false,
          multiplier: null
        });
      }
      newGrid.push(gridRow);
    }
    return newGrid;
  }, [generateRandomSymbol]);

  // Initialize grid on component mount
  useEffect(() => {
    setGrid(initializeGrid());
  }, [initializeGrid]);

  // Create explosive effects for winning symbols
  const createExplosiveEffects = (winningPositions) => {
    const newParticles = [];
    const newShockwaves = [];
    const newSparkles = [];

    winningPositions.forEach(pos => {
      const [row, col] = pos.split('-').map(Number);
      const key = `${row}-${col}`;
      
      // Create particles for each winning position
      for (let i = 0; i < 8; i++) {
        newParticles.push({
          id: `${key}-particle-${i}`,
          row,
          col,
          type: (i % 5) + 1,
          delay: Math.random() * 0.5
        });
      }

      // Create shockwave
      newShockwaves.push({
        id: `${key}-shockwave`,
        row,
        col,
        delay: 0.2
      });

      // Create sparkles
      for (let i = 0; i < 5; i++) {
        newSparkles.push({
          id: `${key}-sparkle-${i}`,
          row,
          col,
          delay: Math.random() * 1.0
        });
      }
    });

    setParticles(newParticles);
    setShockwaves(newShockwaves);
    setSparkles(newSparkles);

    // Clear effects after animation
    setTimeout(() => {
      setParticles([]);
      setShockwaves([]);
      setSparkles([]);
    }, 2500);
  };

  // Payout calculation based on symbol count
  const getPayoutForSymbol = (count) => {
    if (count >= 12) return 100;
    if (count >= 10) return 50;
    if (count >= 8) return 20;
    return 0;
  };

  // Calculate wins on the grid
  const calculateWins = (currentGrid) => {
    const symbolCounts = {};
    const winningPositions = new Set();
    
    // Count symbols
    currentGrid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.symbol !== SYMBOLS.LOLLIPOP) { // Exclude scatter from regular wins
          const symbol = cell.symbol;
          if (!symbolCounts[symbol]) {
            symbolCounts[symbol] = [];
          }
          symbolCounts[symbol].push(`${rowIndex}-${colIndex}`);
        }
      });
    });

    let totalWin = 0;
    // Check for winning combinations (8+ symbols)
    Object.entries(symbolCounts).forEach(([symbol, positions]) => {
      if (positions.length >= 8) {
        const payout = getPayoutForSymbol(positions.length);
        totalWin += payout;
        positions.forEach(pos => winningPositions.add(pos));
      }
    });

    return { totalWin, winningPositions };
  };

  // Count scatter symbols
  const countScatters = (currentGrid) => {
    let scatterCount = 0;
    currentGrid.forEach(row => {
      row.forEach(cell => {
        if (cell.symbol === SYMBOLS.LOLLIPOP) {
          scatterCount++;
        }
      });
    });
    return scatterCount;
  };

  // Generate multiplier bombs during free spins
  const generateMultipliers = (currentGrid) => {
    if (freeSpins === 0) return currentGrid;
    
    const multiplierValues = [2, 3, 5, 10, 25, 50, 100];
    const newGrid = currentGrid.map(row => [...row]);
    
    // Randomly add multipliers to some positions (10% chance)
    newGrid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (Math.random() < 0.1) {
          newGrid[rowIndex][colIndex].multiplier = 
            multiplierValues[Math.floor(Math.random() * multiplierValues.length)];
        }
      });
    });
    
    return newGrid;
  };

  // Calculate total multiplier from all bombs on grid
  const calculateTotalMultiplier = (currentGrid) => {
    let totalMultiplier = 0;
    currentGrid.forEach(row => {
      row.forEach(cell => {
        if (cell.multiplier) {
          totalMultiplier += cell.multiplier;
        }
      });
    });
    return totalMultiplier || 1;
  };

  // Remove winning symbols and apply gravity
  const applyGravityAndRefill = (currentGrid, winningPositions) => {
    const newGrid = currentGrid.map(row => [...row]);
    
    // Remove winning symbols
    winningPositions.forEach(pos => {
      const [row, col] = pos.split('-').map(Number);
      newGrid[row][col] = null;
    });

    // Apply gravity (move symbols down)
    for (let col = 0; col < GRID_COLS; col++) {
      const column = [];
      for (let row = GRID_ROWS - 1; row >= 0; row--) {
        if (newGrid[row][col] !== null) {
          column.push(newGrid[row][col]);
        }
      }
      
      // Fill column from bottom up
      for (let row = GRID_ROWS - 1; row >= 0; row--) {
        if (column.length > 0) {
          newGrid[row][col] = column.shift();
        } else {
          newGrid[row][col] = {
            symbol: generateRandomSymbol(),
            id: `${row}-${col}`,
            isWinning: false,
            multiplier: null
          };
        }
      }
    }
    
    return newGrid;
  };

  // Main spin function
  const spin = async () => {
    if (isSpinning || isTumbling) return;
    
    // Check if we have enough balance or free spins
    if (freeSpins === 0 && balance < BET_AMOUNT) {
      setMessage('Yetersiz bakiye!');
      return;
    }

    setIsSpinning(true);
    setMessage('Döndürülüyor...');

    // Deduct bet if not using free spins
    if (freeSpins === 0) {
      setBalance(prev => prev - BET_AMOUNT);
    } else {
      setFreeSpins(prev => prev - 1);
    }

    let currentGrid = initializeGrid();
    
    // Add multipliers during free spins
    if (freeSpins > 0) {
      currentGrid = generateMultipliers(currentGrid);
    }
    
    setGrid(currentGrid);

    // Process tumbles
    let totalSpinWin = 0;
    let hasWins = true;
    
    while (hasWins) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Animation delay
      
      const { totalWin, winningPositions } = calculateWins(currentGrid);
      
      if (totalWin > 0) {
        setWinningSymbols(winningPositions);
        setExplosiveWins(winningPositions);
        totalSpinWin += totalWin;
        
        // Create explosive effects for winning symbols
        createExplosiveEffects(winningPositions);
        
        await new Promise(resolve => setTimeout(resolve, 2200)); // Extended time for explosion effects
        
        setIsTumbling(true);
        currentGrid = applyGravityAndRefill(currentGrid, winningPositions);
        setGrid(currentGrid);
        setWinningSymbols(new Set());
        setExplosiveWins(new Set());
        
        await new Promise(resolve => setTimeout(resolve, 1200)); // Tumble animation
        setIsTumbling(false);
      } else {
        hasWins = false;
      }
    }

    // Apply multiplier if during free spins
    if (freeSpins > 0 && totalSpinWin > 0) {
      const multiplier = calculateTotalMultiplier(currentGrid);
      totalSpinWin *= multiplier;
      if (multiplier > 1) {
        setMessage(`${multiplier}x Çarpanla Büyük Kazanç! +${totalSpinWin} Puan`);
      }
    }

    // Check for scatter triggers
    const scatterCount = countScatters(currentGrid);
    if (scatterCount >= 4) {
      setFreeSpins(prev => prev + 10);
      setMessage(`${scatterCount} Scatter! 10 Ücretsiz Spin Kazandınız!`);
    } else if (scatterCount >= 3 && freeSpins > 0) {
      setFreeSpins(prev => prev + 5);
      setMessage(`${scatterCount} Scatter! 5 Ek Ücretsiz Spin!`);
    }

    // Update balance and session wins
    if (totalSpinWin > 0) {
      setBalance(prev => prev + totalSpinWin);
      setSessionWins(prev => prev + totalSpinWin);
      
      if (totalSpinWin >= 200) {
        setShowBigWin(true);
        setTimeout(() => setShowBigWin(false), 3000);
      }
      
      if (!message.includes('Scatter') && !message.includes('Çarpan')) {
        setMessage(`Kazandınız! +${totalSpinWin} Puan`);
      }
    } else if (!message.includes('Scatter')) {
      setMessage('Kazanamadınız');
    }

    setIsSpinning(false);
  };

  // Reset balance
  const resetBalance = () => {
    setBalance(5000);
    setFreeSpins(0);
    setSessionWins(0);
    setMessage('Bakiye sıfırlandı!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-2 sm:p-4">
      {/* Big Win Overlay */}
      {showBigWin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-bounce text-center">
            <div className="text-8xl font-bold text-yellow-400 animate-pulse">
              BÜYÜK KAZANÇ!
            </div>
            <div className="text-4xl text-white mt-4">🎉🎊🎉</div>
          </div>
        </div>
      )}

      <div className="max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto">
        {/* Header Dashboard - Kompakt Mobil Tasarım */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 mb-4 shadow-2xl">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-2 rounded-lg shadow-lg">
              <div className="text-xs font-medium">Sanal Bakiye</div>
              <div className="text-sm font-bold">{balance.toLocaleString()} Puan</div>
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-2 rounded-lg shadow-lg">
              <div className="text-xs font-medium">Ücretsiz Spin</div>
              <div className="text-sm font-bold">{freeSpins}</div>
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-2 rounded-lg shadow-lg">
              <div className="text-xs font-medium">Oturum Kazancı</div>
              <div className="text-sm font-bold">{sessionWins.toLocaleString()} Puan</div>
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="grid grid-cols-6 gap-2 max-w-4xl mx-auto">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    relative aspect-square bg-gradient-to-br from-pink-100 to-purple-100 
                    rounded-xl flex items-center justify-center text-4xl md:text-5xl 
                    border-4 border-white shadow-lg transition-all duration-300
                    ${winningSymbols.has(`${rowIndex}-${colIndex}`) ? 
                      'animate-pulse scale-110 border-yellow-400 bg-yellow-200' : ''}
                    ${isTumbling ? 'animate-bounce' : ''}
                  `}
                >
                  <span className="drop-shadow-lg">{cell.symbol}</span>
                  {cell.multiplier && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 
                                  text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white
                                  animate-pulse shadow-lg">
                      {cell.multiplier}x
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <button
              onClick={spin}
              disabled={isSpinning || isTumbling || (balance < BET_AMOUNT && freeSpins === 0)}
              className={`
                px-8 py-4 text-xl font-bold rounded-xl transition-all duration-300 transform
                ${isSpinning || isTumbling || (balance < BET_AMOUNT && freeSpins === 0)
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105 shadow-lg'
                }
              `}
            >
              {freeSpins > 0 ? 'FS Kullan' : 'Döndür (20 Puan)'}
            </button>
            
            <button
              onClick={resetBalance}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white 
                       font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Sanal Bakiyeyi Sıfırla
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-2xl">
          <div className="text-center text-xl font-semibold text-gray-800">
            {message}
          </div>
        </div>

        {/* Therapeutic Warning */}
        <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl">
          <div className="text-center font-bold">
            ⚠️ UYARI: Bu uygulama sadece terapötik amaçlı bir simülasyondur. Gerçek para riski içermez. ⚠️
          </div>
        </div>
      </div>
    </div>
  );
};

export default SweetBonanzaGame;