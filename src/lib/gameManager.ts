import * as R from 'ramda';
import { 
  Board, 
  Player, 
  GameState, 
  MoveResult, 
  GameResult,
  GameConfig,
  GameStats 
} from './types';
import { 
  createEmptyBoard, 
  makeMove, 
  isValidMove, 
  evaluateGameState
} from './gameLogic';
import { getAIMove } from './aiStrategy';

/**
 * Default game configuration using functional approach
 */
const defaultConfig: GameConfig = {
  difficulty: 'medium',
  playerSymbol: 'X',
  aiSymbol: 'O'
};

/**
 * Initial game statistics using functional approach
 */
const initialStats: GameStats = {
  playerWins: 0,
  aiWins: 0,
  draws: 0
};

/**
 * Create initial game state using functional composition
 */
const createInitialState = (config: GameConfig = defaultConfig) => ({
  board: createEmptyBoard(),
  currentPlayer: config.playerSymbol,
  gameState: 'playing' as GameState,
  winner: null as Player,
  config,
  stats: initialStats
});

/**
 * Update game statistics based on result using functional composition
 */
const updateStats = (gameResult: GameResult, stats: GameStats): GameStats => {
  if (gameResult.winner === 'X') {
    return { ...stats, playerWins: stats.playerWins + 1 };
  } else if (gameResult.winner === 'O') {
    return { ...stats, aiWins: stats.aiWins + 1 };
  } else if (gameResult.state === 'draw') {
    return { ...stats, draws: stats.draws + 1 };
  }
  return stats;
};

/**
 * Create move result using functional composition
 */
const createMoveResult = (
  board: Board, 
  gameResult: GameResult,
  isGameOver: boolean
): MoveResult => ({
  newBoard: [...board],
  gameResult,
  isGameOver
});

/**
 * TicTacToe Game Manager with functional programming approach
 */
export class TicTacToeGame {
  private board: Board;
  private currentPlayer: Player;
  private gameState: GameState;
  private winner: Player;
  private config: GameConfig;
  private stats: GameStats;

  constructor(config: Partial<GameConfig> = {}) {
    this.config = {
      difficulty: config.difficulty || 'medium',
      playerSymbol: config.playerSymbol || 'X',
      aiSymbol: config.aiSymbol || 'O'
    };
    
    const initialState = createInitialState(this.config);
    this.board = initialState.board;
    this.currentPlayer = initialState.currentPlayer;
    this.gameState = initialState.gameState;
    this.winner = initialState.winner;
    this.stats = initialState.stats;
  }

  /**
   * Get current game state using functional composition
   */
  getGameState() {
    return {
      board: [...this.board],
      currentPlayer: this.currentPlayer,
      gameState: this.gameState,
      winner: this.winner,
      config: { ...this.config },
      stats: { ...this.stats }
    };
  }

  /**
   * Make player move using functional composition
   */
  makePlayerMove(index: number): MoveResult {
    if (!isValidMove(this.board, index)) {
      throw new Error('Invalid move');
    }

    if (this.gameState !== 'playing') {
      throw new Error('Game is not in progress');
    }

    if (this.currentPlayer !== this.config.playerSymbol) {
      throw new Error('Not player turn');
    }

    // Make the move using functional approach
    const newBoard = makeMove(this.board, index, this.currentPlayer);
    const gameResult = evaluateGameState(newBoard);
    const gameOver = gameResult.state !== 'playing';

    // Update state
    this.board = newBoard;
    this.currentPlayer = this.config.aiSymbol;
    this.gameState = gameResult.state;
    this.winner = gameResult.winner;

    // Update stats if game is over
    if (gameOver) {
      this.stats = updateStats(gameResult, this.stats);
    }

    return createMoveResult(this.board, gameResult, gameOver);
  }

  /**
   * Make AI move using functional composition
   */
  makeAIMove(): MoveResult {
    if (this.gameState !== 'playing') {
      throw new Error('Game is not in progress');
    }

    if (this.currentPlayer !== this.config.aiSymbol) {
      throw new Error('Not AI turn');
    }

    // Get AI move using functional approach
    const aiMoveIndex = getAIMove(
      this.board, 
      this.config.difficulty, 
      this.config.aiSymbol, 
      this.config.playerSymbol
    );

    // Make the move
    const newBoard = makeMove(this.board, aiMoveIndex, this.currentPlayer);
    const gameResult = evaluateGameState(newBoard);
    const gameOver = gameResult.state !== 'playing';

    // Update state
    this.board = newBoard;
    this.currentPlayer = this.config.playerSymbol;
    this.gameState = gameResult.state;
    this.winner = gameResult.winner;

    // Update stats if game is over
    if (gameOver) {
      this.stats = updateStats(gameResult, this.stats);
    }

    return createMoveResult(this.board, gameResult, gameOver);
  }

  /**
   * Reset game using functional composition
   */
  resetGame(): void {
    const newState = createInitialState(this.config);
    this.board = newState.board;
    this.currentPlayer = newState.currentPlayer;
    this.gameState = newState.gameState;
    this.winner = newState.winner;
    // Keep existing stats
  }

  /**
   * Change difficulty and reset game
   */
  setDifficulty(difficulty: string): void {
    this.config.difficulty = difficulty as any;
    this.resetGame();
  }

  /**
   * Update game configuration using functional composition
   */
  updateConfig(newConfig: Partial<GameConfig>): void {
    this.config = R.mergeDeepRight(this.config, newConfig);
    this.resetGame();
  }

  /**
   * Check if it's the player's turn
   */
  isPlayerTurn(): boolean {
    return this.currentPlayer === this.config.playerSymbol && this.gameState === 'playing';
  }

  /**
   * Check if it's the AI's turn
   */
  isAITurn(): boolean {
    return this.currentPlayer === this.config.aiSymbol && this.gameState === 'playing';
  }

  /**
   * Get available moves using functional composition
   */
  getAvailableMoves(): number[] {
    return this.board
      .map((cell, index) => cell === null ? index : null)
      .filter(R.complement(R.isNil)) as number[];
  }

  /**
   * Check if move is valid using functional composition
   */
  isValidMove(index: number): boolean {
    return isValidMove(this.board, index);
  }

  /**
   * Get current board state
   */
  getBoard(): Board {
    return [...this.board];
  }

  /**
   * Get game statistics
   */
  getStats(): GameStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics using functional approach
   */
  resetStats(): void {
    this.stats = { ...initialStats };
  }
} 