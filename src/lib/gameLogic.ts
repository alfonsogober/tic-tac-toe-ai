import * as R from 'ramda';
import { Player, Board, GameResult } from './types';
import { WINNING_COMBINATIONS, BOARD_SIZE } from './constants';

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
 */
export const checkWinner = (board: Board): Player => {
  const hasWinningCombo = (player: Player) =>
    WINNING_COMBINATIONS.some(([a, b, c]) => 
      board[a] === player && board[b] === player && board[c] === player);
  
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
 * Minimax algorithm with alpha-beta pruning
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
  
  // Terminal states
  if (winner === maxPlayer) return 10 - depth;
  if (winner === minPlayer) return depth - 10;
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
 * Strategic move priorities (center, corners, edges)
 */
const getMovePriority = (move: number): number => {
  if (move === 4) return 3; // Center
  if ([0, 2, 6, 8].includes(move)) return 2; // Corners
  return 1; // Edges
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