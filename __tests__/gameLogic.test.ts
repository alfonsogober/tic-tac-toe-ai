import {
  checkWinner,
  isBoardFull,
  getAvailableMoves,
  isValidMove,
  makeMove,
  evaluateGameState,
  createEmptyBoard,
  getBestMove,
  getRandomMove
} from '../src/lib/gameLogic';
import { Board } from '../src/lib/types';

describe('Game Logic', () => {
  describe('createEmptyBoard', () => {
    it('should create an empty 9-cell board', () => {
      const board = createEmptyBoard();
      expect(board).toHaveLength(9);
      expect(board.every(cell => cell === null)).toBe(true);
    });
  });

  describe('checkWinner', () => {
    it('should return null for an empty board', () => {
      const board = createEmptyBoard();
      expect(checkWinner(board)).toBeNull();
    });

    it('should detect horizontal wins', () => {
      // Top row win
      const board1: Board = ['X', 'X', 'X', null, 'O', null, 'O', null, null];
      expect(checkWinner(board1)).toBe('X');

      // Middle row win
      const board2: Board = ['O', null, null, 'X', 'X', 'X', 'O', null, null];
      expect(checkWinner(board2)).toBe('X');

      // Bottom row win
      const board3: Board = [null, 'O', null, null, 'X', null, 'O', 'O', 'O'];
      expect(checkWinner(board3)).toBe('O');
    });

    it('should detect vertical wins', () => {
      // Left column win
      const board1: Board = ['X', 'O', null, 'X', 'O', null, 'X', null, null];
      expect(checkWinner(board1)).toBe('X');

      // Middle column win
      const board2: Board = ['O', 'X', null, null, 'X', 'O', null, 'X', null];
      expect(checkWinner(board2)).toBe('X');

      // Right column win
      const board3: Board = [null, 'X', 'O', null, null, 'O', null, null, 'O'];
      expect(checkWinner(board3)).toBe('O');
    });

    it('should detect diagonal wins', () => {
      // Top-left to bottom-right diagonal
      const board1: Board = ['X', 'O', null, 'O', 'X', null, null, null, 'X'];
      expect(checkWinner(board1)).toBe('X');

      // Top-right to bottom-left diagonal
      const board2: Board = [null, 'X', 'O', null, 'O', 'X', 'O', null, null];
      expect(checkWinner(board2)).toBe('O');
    });

    it('should return null when there is no winner', () => {
      const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
      expect(checkWinner(board)).toBeNull();
    });
  });

  describe('isBoardFull', () => {
    it('should return false for an empty board', () => {
      const board = createEmptyBoard();
      expect(isBoardFull(board)).toBe(false);
    });

    it('should return false for a partially filled board', () => {
      const board: Board = ['X', 'O', null, 'X', null, 'O', null, null, null];
      expect(isBoardFull(board)).toBe(false);
    });

    it('should return true for a completely filled board', () => {
      const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
      expect(isBoardFull(board)).toBe(true);
    });
  });

  describe('getAvailableMoves', () => {
    it('should return all indices for an empty board', () => {
      const board = createEmptyBoard();
      const moves = getAvailableMoves(board);
      expect(moves).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should return only empty cell indices', () => {
      const board: Board = ['X', null, 'O', null, 'X', null, null, 'O', null];
      const moves = getAvailableMoves(board);
      expect(moves).toEqual([1, 3, 5, 6, 8]);
    });

    it('should return empty array for a full board', () => {
      const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
      const moves = getAvailableMoves(board);
      expect(moves).toEqual([]);
    });
  });

  describe('isValidMove', () => {
    it('should return true for valid moves on empty cells', () => {
      const board: Board = ['X', null, 'O', null, null, null, null, null, null];
      expect(isValidMove(board, 1)).toBe(true);
      expect(isValidMove(board, 4)).toBe(true);
      expect(isValidMove(board, 8)).toBe(true);
    });

    it('should return false for occupied cells', () => {
      const board: Board = ['X', null, 'O', null, null, null, null, null, null];
      expect(isValidMove(board, 0)).toBe(false);
      expect(isValidMove(board, 2)).toBe(false);
    });

    it('should return false for out-of-bounds indices', () => {
      const board = createEmptyBoard();
      expect(isValidMove(board, -1)).toBe(false);
      expect(isValidMove(board, 9)).toBe(false);
      expect(isValidMove(board, 100)).toBe(false);
    });
  });

  describe('makeMove', () => {
    it('should place the player symbol in the correct position', () => {
      const board = createEmptyBoard();
      const newBoard = makeMove(board, 4, 'X');
      expect(newBoard[4]).toBe('X');
      expect(newBoard.filter(cell => cell === 'X')).toHaveLength(1);
    });

    it('should not mutate the original board', () => {
      const board = createEmptyBoard();
      const originalBoard = [...board];
      makeMove(board, 4, 'X');
      expect(board).toEqual(originalBoard);
    });

    it('should throw error for invalid moves', () => {
      const board: Board = ['X', null, null, null, null, null, null, null, null];
      expect(() => makeMove(board, 0, 'O')).toThrow('Invalid move');
      expect(() => makeMove(board, -1, 'O')).toThrow('Invalid move');
      expect(() => makeMove(board, 9, 'O')).toThrow('Invalid move');
    });
  });

  describe('evaluateGameState', () => {
    it('should return playing state for an empty board', () => {
      const board = createEmptyBoard();
      const result = evaluateGameState(board);
      expect(result.state).toBe('playing');
      expect(result.winner).toBeNull();
    });

    it('should return won state when there is a winner', () => {
      const board: Board = ['X', 'X', 'X', null, 'O', null, 'O', null, null];
      const result = evaluateGameState(board);
      expect(result.state).toBe('won');
      expect(result.winner).toBe('X');
    });

    it('should return draw state when board is full with no winner', () => {
      const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
      const result = evaluateGameState(board);
      expect(result.state).toBe('draw');
      expect(result.winner).toBeNull();
    });

    it('should return playing state for ongoing game', () => {
      const board: Board = ['X', null, 'O', null, 'X', null, null, null, null];
      const result = evaluateGameState(board);
      expect(result.state).toBe('playing');
      expect(result.winner).toBeNull();
    });
  });

  describe('getBestMove', () => {
    it('should return a winning move when available', () => {
      // X can win by playing position 2
      const board: Board = ['X', 'X', null, 'O', 'O', null, null, null, null];
      const bestMove = getBestMove(board, 'X', 'O');
      expect(bestMove).toBe(2);
    });

    it('should block opponent winning move', () => {
      // O should block X's winning move at position 2
      const board: Board = ['X', 'X', null, 'O', null, null, null, null, null];
      const bestMove = getBestMove(board, 'O', 'X');
      expect(bestMove).toBe(2);
    });

    it('should choose center when available on empty board', () => {
      const board = createEmptyBoard();
      const bestMove = getBestMove(board, 'O', 'X');
      expect(bestMove).toBe(4); // Center position
    });

    it('should throw error when no moves are available', () => {
      const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
      expect(() => getBestMove(board, 'X', 'O')).toThrow('No available moves');
    });
  });

  describe('getRandomMove', () => {
    it('should return a valid move index', () => {
      const board: Board = ['X', null, 'O', null, null, null, null, null, null];
      const move = getRandomMove(board);
      const availableMoves = getAvailableMoves(board);
      expect(availableMoves).toContain(move);
    });

    it('should return the only available move', () => {
      const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null];
      const move = getRandomMove(board);
      expect(move).toBe(8);
    });

    it('should throw error when no moves are available', () => {
      const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
      expect(() => getRandomMove(board)).toThrow('No available moves');
    });
  });

  describe('minimax algorithm', () => {
    it('should prefer winning in fewer moves', () => {
      // O can win immediately at position 2, or in 2 moves at other positions
      const board: Board = ['O', 'O', null, 'X', 'X', null, null, null, null];
      const bestMove = getBestMove(board, 'O', 'X');
      expect(bestMove).toBe(2);
    });

    it('should work correctly for both players', () => {
      // Test that minimax works for both X and O
      const board: Board = ['X', null, null, null, 'O', null, null, null, null];
      
      const bestMoveForX = getBestMove(board, 'X', 'O');
      const bestMoveForO = getBestMove(board, 'O', 'X');
      
      expect(typeof bestMoveForX).toBe('number');
      expect(typeof bestMoveForO).toBe('number');
      expect(getAvailableMoves(board)).toContain(bestMoveForX);
      expect(getAvailableMoves(board)).toContain(bestMoveForO);
    });
  });
}); 