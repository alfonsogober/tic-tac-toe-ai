import { getAIMove, getDifficultyDescription, parseDifficulty } from '../src/lib/aiStrategy';
import { createEmptyBoard } from '../src/lib/gameLogic';
import { Board } from '../src/lib/types';

// Mock the random function for deterministic testing
const mockMath = Object.create(global.Math);
let mockRandom: jest.SpyInstance;

beforeAll(() => {
  global.Math = mockMath;
  mockRandom = jest.spyOn(Math, 'random');
});

afterAll(() => {
  global.Math = Math;
  mockRandom.mockRestore();
});

describe('AI Strategy', () => {
  describe('getAIMove', () => {
    beforeEach(() => {
      mockRandom.mockReset();
    });

    it('should return a valid move index', () => {
      const board: Board = ['X', null, null, null, 'O', null, null, null, null];
      mockRandom.mockReturnValue(0.5); // 50% - should use optimal move for medium
      
      const move = getAIMove(board, 'medium', 'O', 'X');
      
      expect(typeof move).toBe('number');
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
      expect(board[move]).toBeNull();
    });

    it('should use optimal move on easy difficulty when random < 0.3', () => {
      // AI can win by playing position 2
      const board: Board = ['O', 'O', null, 'X', 'X', null, null, null, null];
      mockRandom.mockReturnValue(0.2); // 20% - should use optimal move
      
      const move = getAIMove(board, 'easy', 'O', 'X');
      
      expect(move).toBe(2); // Winning move
    });

    it('should use random move on easy difficulty when random >= 0.3', () => {
      const board: Board = ['O', 'O', null, 'X', 'X', null, null, null, null];
      mockRandom.mockReturnValueOnce(0.8); // 80% - should use random move
      mockRandom.mockReturnValueOnce(0.6); // For random move selection
      
      const move = getAIMove(board, 'easy', 'O', 'X');
      
      // Should be a valid move but might not be optimal
      expect(typeof move).toBe('number');
      expect(board[move]).toBeNull();
    });

    it('should use optimal move on medium difficulty when random < 0.7', () => {
      const board: Board = ['O', 'O', null, 'X', 'X', null, null, null, null];
      mockRandom.mockReturnValue(0.5); // 50% - should use optimal move
      
      const move = getAIMove(board, 'medium', 'O', 'X');
      
      expect(move).toBe(2); // Winning move
    });

    it('should use random move on medium difficulty when random >= 0.7', () => {
      const board: Board = ['O', 'O', null, 'X', 'X', null, null, null, null];
      mockRandom.mockReturnValueOnce(0.9); // 90% - should use random move
      mockRandom.mockReturnValueOnce(0.3); // For random move selection
      
      const move = getAIMove(board, 'medium', 'O', 'X');
      
      expect(typeof move).toBe('number');
      expect(board[move]).toBeNull();
    });

    it('should always use optimal move on hard difficulty', () => {
      const board: Board = ['O', 'O', null, 'X', 'X', null, null, null, null];
      mockRandom.mockReturnValue(0.9); // 90% - but should still use optimal on hard
      
      const move = getAIMove(board, 'hard', 'O', 'X');
      
      expect(move).toBe(2); // Should always choose winning move on hard
    });

    it('should work with swapped player symbols', () => {
      const board: Board = ['X', 'X', null, 'O', 'O', null, null, null, null];
      mockRandom.mockReturnValue(0.1); // Should use optimal move
      
      const move = getAIMove(board, 'hard', 'X', 'O');
      
      expect(move).toBe(2); // Should find winning move for X
    });

    it('should block opponent winning move when not going for own win', () => {
      // X can win, O should block
      const board: Board = ['X', 'X', null, 'O', null, null, null, null, null];
      mockRandom.mockReturnValue(0.1); // Should use optimal move
      
      const move = getAIMove(board, 'hard', 'O', 'X');
      
      expect(move).toBe(2); // Should block X's winning move
    });

    it('should choose center on empty board when using optimal strategy', () => {
      const board = createEmptyBoard();
      mockRandom.mockReturnValue(0.1); // Should use optimal move
      
      const move = getAIMove(board, 'hard', 'O', 'X');
      
      expect(move).toBe(4); // Center is optimal first move
    });
  });

  describe('getDifficultyDescription', () => {
    it('should return correct description for easy', () => {
      const description = getDifficultyDescription('easy');
      expect(description).toBe('AI makes optimal moves 30% of the time');
    });

    it('should return correct description for medium', () => {
      const description = getDifficultyDescription('medium');
      expect(description).toBe('AI makes optimal moves 70% of the time');
    });

    it('should return correct description for hard', () => {
      const description = getDifficultyDescription('hard');
      expect(description).toBe('AI always makes optimal moves');
    });
  });

  describe('parseDifficulty', () => {
    it('should return valid difficulty when input is valid', () => {
      expect(parseDifficulty('easy')).toBe('easy');
      expect(parseDifficulty('medium')).toBe('medium');
      expect(parseDifficulty('hard')).toBe('hard');
    });

    it('should return medium as default for invalid input', () => {
      expect(parseDifficulty('invalid')).toBe('medium');
      expect(parseDifficulty('')).toBe('medium');
      expect(parseDifficulty('HARD')).toBe('medium'); // Case sensitive
      expect(parseDifficulty('123')).toBe('medium');
    });

    it('should handle edge cases', () => {
      expect(parseDifficulty('Easy')).toBe('medium'); // Case sensitive
      expect(parseDifficulty(' easy ')).toBe('medium'); // Whitespace
      expect(parseDifficulty('easymode')).toBe('medium'); // Partial match
    });
  });

  describe('integration with game logic', () => {
    it('should make strategically sound moves across difficulties', () => {
      // Test that AI makes reasonable moves across different scenarios
      const testScenarios = [
        {
          board: ['X', null, null, null, 'O', null, null, null, null] as Board,
          description: 'Early game scenario'
        },
        {
          board: ['X', 'O', 'X', null, 'O', null, 'O', null, 'X'] as Board,
          description: 'Late game scenario'
        },
        {
          board: ['X', 'X', null, 'O', 'O', null, null, null, null] as Board,
          description: 'Multiple threat scenario'
        }
      ];

      const difficulties = ['easy', 'medium', 'hard'] as const;

      testScenarios.forEach(scenario => {
        difficulties.forEach(difficulty => {
          mockRandom.mockReturnValue(0.1); // Force optimal moves for testing
          const move = getAIMove(scenario.board, difficulty, 'O', 'X');
          
          expect(typeof move).toBe('number');
          expect(move).toBeGreaterThanOrEqual(0);
          expect(move).toBeLessThan(9);
          expect(scenario.board[move]).toBeNull();
        });
      });
    });
  });
}); 