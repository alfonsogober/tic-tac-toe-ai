export type Player = 'X' | 'O' | null;
export type Board = Player[];
export type GameState = 'playing' | 'won' | 'draw';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameStats {
  playerWins: number;
  aiWins: number;
  draws: number;
}

export interface GameResult {
  state: GameState;
  winner: Player;
}

export interface GameConfig {
  difficulty: Difficulty;
  playerSymbol: Player;
  aiSymbol: Player;
}

export interface MoveResult {
  newBoard: Board;
  gameResult: GameResult;
  isGameOver: boolean;
} 