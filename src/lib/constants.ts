export const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
] as const;

export const BOARD_SIZE = 9;

export const DIFFICULTY_SETTINGS = {
  easy: { optimalMoveChance: 0.3 },
  medium: { optimalMoveChance: 0.7 },
  hard: { optimalMoveChance: 1.0 }
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