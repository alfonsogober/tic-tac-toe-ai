// Board configuration - easily scalable to NxN
export const BOARD_DIMENSIONS = 3; // Change this to support 4x4, 5x5, etc.
export const BOARD_SIZE = BOARD_DIMENSIONS * BOARD_DIMENSIONS;

/**
 * Generate winning combinations dynamically for any NxN board
 * This scales automatically with BOARD_DIMENSIONS
 */
const generateWinningCombinations = (n: number): number[][] => {
  const combinations: number[][] = [];
  
  // Generate rows
  for (let row = 0; row < n; row++) {
    const rowCombination: number[] = [];
    for (let col = 0; col < n; col++) {
      rowCombination.push(row * n + col);
    }
    combinations.push(rowCombination);
  }
  
  // Generate columns
  for (let col = 0; col < n; col++) {
    const colCombination: number[] = [];
    for (let row = 0; row < n; row++) {
      colCombination.push(row * n + col);
    }
    combinations.push(colCombination);
  }
  
  // Generate main diagonal (top-left to bottom-right)
  const mainDiagonal: number[] = [];
  for (let i = 0; i < n; i++) {
    mainDiagonal.push(i * n + i);
  }
  combinations.push(mainDiagonal);
  
  // Generate anti-diagonal (top-right to bottom-left)
  const antiDiagonal: number[] = [];
  for (let i = 0; i < n; i++) {
    antiDiagonal.push(i * n + (n - 1 - i));
  }
  combinations.push(antiDiagonal);
  
  return combinations;
};

export const WINNING_COMBINATIONS = generateWinningCombinations(BOARD_DIMENSIONS);

/**
 * Consolidated difficulty settings with descriptions
 * This replaces both difficultyConfig and DIFFICULTY_SETTINGS
 */
export const DIFFICULTY_CONFIG = {
  easy: { 
    optimalChance: 0.3, 
    description: 'AI makes optimal moves 30% of the time',
    baseScore: 100 // Used for dynamic minimax scoring
  },
  medium: { 
    optimalChance: 0.7, 
    description: 'AI makes optimal moves 70% of the time',
    baseScore: 100
  },
  hard: { 
    optimalChance: 1.0, 
    description: 'AI always makes optimal moves',
    baseScore: 100
  }
} as const;

export const DIFFICULTY_COLORS = {
  easy: '#4CAF50',
  medium: '#FF9800',
  hard: '#F44336'
} as const;

export const PLAYER_COLORS = {
  X: '#2196F3',
  O: '#F44336'
} as const; 