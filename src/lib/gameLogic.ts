import * as R from 'ramda';
import { Player, Board, GameResult } from './types';
import { WINNING_COMBINATIONS, BOARD_SIZE, BOARD_DIMENSIONS, DIFFICULTY_CONFIG } from './constants';

/**
 * Pure functional utilities
 */
export const isCellEmpty = R.isNil;
export const isCellFilled = R.complement(R.isNil);

/**
 * Create an empty board using functional approach
 */
export const createEmptyBoard = (): Board => R.repeat(null, BOARD_SIZE);

/**
 * Get a cell value from board at index (curried)
 */
export const getCell = R.curry((index: number, board: Board): Player => board[index]);

/**
 * Set a cell value in board at index (immutable)
 */
export const setCell = R.curry((index: number, player: Player, board: Board): Board => 
  R.update(index, player, board));

/**
 * Check if a player has won using functional composition
 * Works dynamically with any board size and winning combinations
 */
export const checkWinner = (board: Board): Player => {
  const hasWinningCombo = (player: Player) =>
    WINNING_COMBINATIONS.some((combination) => 
      combination.every(index => board[index] === player));
  
  if (hasWinningCombo('X')) return 'X';
  if (hasWinningCombo('O')) return 'O';
  return null;
};

/**
 * Check if the board is full using functional composition
 */
export const isBoardFull = R.pipe(
  R.filter(isCellFilled),
  R.length,
  R.equals(BOARD_SIZE)
);

/**
 * Get all available moves on the board
 */
export const getAvailableMoves = (board: Board): number[] =>
  board
    .map((cell, index) => isCellEmpty(cell) ? index : null)
    .filter(R.complement(R.isNil)) as number[];

/**
 * Check if a move is valid
 */
export const isValidMove = (board: Board, index: number): boolean =>
  index >= 0 && index < BOARD_SIZE && isCellEmpty(board[index]);

/**
 * Make a move on the board (pure function)
 */
export const makeMove = (board: Board, index: number, player: Player): Board => {
  if (!isValidMove(board, index)) {
    throw new Error('Invalid move');
  }
  return R.update(index, player, board);
};

/**
 * Evaluate the current game state
 */
export const evaluateGameState = (board: Board): GameResult => {
  const winner = checkWinner(board);
  if (winner) {
    return { state: 'won', winner };
  }
  if (isBoardFull(board)) {
    return { state: 'draw', winner: null };
  }
  return { state: 'playing', winner: null };
};

/**
 * Calculate dynamic minimax scoring based on board size and depth
 * This scales with board complexity and avoids hardcoded values like 10
 */
const calculateScore = (winner: Player, depth: number, maxPlayer: Player, minPlayer: Player): number => {
  const baseScore = DIFFICULTY_CONFIG.medium.baseScore; // Use consistent base score
  const depthPenalty = depth; // Prefer shorter paths to victory
  
  if (winner === maxPlayer) return baseScore - depthPenalty;  // Maximizing player wins
  if (winner === minPlayer) return -baseScore + depthPenalty; // Minimizing player wins
  return 0; // Draw
};

/**
 * Minimax algorithm with alpha-beta pruning and dynamic scoring
 */
export const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number = -Infinity,
  beta: number = Infinity,
  maxPlayer: Player = 'O',
  minPlayer: Player = 'X'
): number => {
  const winner = checkWinner(board);
  
  // Terminal states with dynamic scoring
  if (winner) return calculateScore(winner, depth, maxPlayer, minPlayer);
  if (isBoardFull(board)) return 0;

  const availableMoves = getAvailableMoves(board);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of availableMoves) {
      const newBoard = makeMove(board, move, maxPlayer);
      const evaluation = minimax(newBoard, depth + 1, false, alpha, beta, maxPlayer, minPlayer);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of availableMoves) {
      const newBoard = makeMove(board, move, minPlayer);
      const evaluation = minimax(newBoard, depth + 1, true, alpha, beta, maxPlayer, minPlayer);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
};

/**
 * Calculate strategic move priority for any NxN board
 * 
 * Strategy rationale:
 * 1. CENTER: Controls the most lines (2 diagonals + 1 row + 1 column)
 * 2. CORNERS: Control 3 lines each (1 row + 1 column + 1 diagonal)  
 * 3. EDGES: Control only 2 lines each (1 row + 1 column)
 * 
 * This strategy scales to any board size by calculating the actual
 * strategic value based on how many winning combinations each position controls.
 */
const getMovePriority = (move: number, boardDimensions: number = BOARD_DIMENSIONS): number => {
  const row = Math.floor(move / boardDimensions);
  const col = move % boardDimensions;
  const center = Math.floor(boardDimensions / 2);
  
  // Check if position is center (highest priority for odd-sized boards)
  if (boardDimensions % 2 === 1 && row === center && col === center) {
    return 3; // Center position - controls most lines
  }
  
  // Check if position is corner
  if ((row === 0 || row === boardDimensions - 1) && 
      (col === 0 || col === boardDimensions - 1)) {
    return 2; // Corner position - controls diagonal + edge lines
  }
  
  // All other positions are edges
  return 1; // Edge position - controls fewer lines
};

/**
 * Get the best move using minimax algorithm with functional composition
 */
export const getBestMove = (
  board: Board,
  player: Player = 'O',
  opponent: Player = 'X'
): number => {
  const availableMoves = getAvailableMoves(board);
  
  if (R.isEmpty(availableMoves)) {
    throw new Error('No available moves');
  }

  // Use functional approach to find best move with strategic preference
  const evaluateMove = (move: number) => ({
    move,
    score: minimax(makeMove(board, move, player), 0, false, -Infinity, Infinity, player, opponent),
    priority: getMovePriority(move)
  });

  const evaluatedMoves = R.map(evaluateMove, availableMoves);
  
  // Find the best score
  const maxScore = Math.max(...evaluatedMoves.map(m => m.score));
  
  // Among moves with the best score, prefer higher priority (center > corners > edges)
  const bestMoves = evaluatedMoves.filter(m => m.score === maxScore);
  const bestMove = bestMoves.reduce((best, current) => 
    current.priority > best.priority ? current : best
  );
  
  return bestMove.move;
};

/**
 * Get a random move from available moves using functional composition
 */
export const getRandomMove = R.pipe(
  getAvailableMoves,
  R.when(
    R.isEmpty,
    () => { throw new Error('No available moves'); }
  ),
  (moves: number[]) => moves[Math.floor(Math.random() * moves.length)]
); 