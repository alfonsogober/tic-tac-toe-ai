import { TicTacToeGame } from '../src/lib/gameManager';

describe('TicTacToeGame', () => {
  let game: TicTacToeGame;

  beforeEach(() => {
    game = new TicTacToeGame();
  });

  describe('constructor', () => {
    it('should initialize with default configuration', () => {
      const state = game.getGameState();
      expect(state.config.difficulty).toBe('medium');
      expect(state.config.playerSymbol).toBe('X');
      expect(state.config.aiSymbol).toBe('O');
      expect(state.currentPlayer).toBe('X');
      expect(state.gameState).toBe('playing');
      expect(state.winner).toBeNull();
      expect(state.board).toEqual(Array(9).fill(null));
    });

    it('should initialize with custom configuration', () => {
      const customGame = new TicTacToeGame({
        difficulty: 'hard',
        playerSymbol: 'O',
        aiSymbol: 'X'
      });
      const state = customGame.getGameState();
      expect(state.config.difficulty).toBe('hard');
      expect(state.config.playerSymbol).toBe('O');
      expect(state.config.aiSymbol).toBe('X');
      expect(state.currentPlayer).toBe('O');
    });

    it('should initialize stats to zero', () => {
      const state = game.getGameState();
      expect(state.stats).toEqual({
        playerWins: 0,
        aiWins: 0,
        draws: 0
      });
    });
  });

  describe('makePlayerMove', () => {
    it('should make a valid player move', () => {
      const result = game.makePlayerMove(4); // Center
      expect(result.newBoard[4]).toBe('X');
      expect(result.isGameOver).toBe(false);
      expect(result.gameResult.state).toBe('playing');
      
      const state = game.getGameState();
      expect(state.currentPlayer).toBe('O'); // Should switch to AI
    });

    it('should throw error for invalid move position', () => {
      expect(() => game.makePlayerMove(-1)).toThrow('Invalid move');
      expect(() => game.makePlayerMove(9)).toThrow('Invalid move');
    });

    it('should throw error for occupied cell', () => {
      game.makePlayerMove(4);
      expect(() => game.makePlayerMove(4)).toThrow('Invalid move');
    });

    it('should throw error when game is not in progress', () => {
      // Force game to end
      game['gameState'] = 'won';
      expect(() => game.makePlayerMove(0)).toThrow('Game is not in progress');
    });

    it('should throw error when not player turn', () => {
      game.makePlayerMove(0);
      expect(() => game.makePlayerMove(1)).toThrow('Not player turn');
    });

    it('should detect player win', () => {
      // Force a specific board state where player can win
      game.resetGame();
      game['board'] = ['X', 'X', null, 'O', 'O', null, null, null, null];
      game['currentPlayer'] = 'X';
      
      const result = game.makePlayerMove(2); // X wins with top row

      expect(result.isGameOver).toBe(true);
      expect(result.gameResult.state).toBe('won');
      expect(result.gameResult.winner).toBe('X');
      
      const state = game.getGameState();
      expect(state.stats.playerWins).toBe(1);
    });
  });

  describe('makeAIMove', () => {
    beforeEach(() => {
      game.makePlayerMove(4); // Player moves first
    });

    it('should make a valid AI move', () => {
      const availableMovesBefore = game.getAvailableMoves();
      
      const result = game.makeAIMove();
      
      expect(availableMovesBefore).toContain(result.newBoard.indexOf('O'));
      expect(result.newBoard.filter(cell => cell === 'O')).toHaveLength(1);
      expect(result.isGameOver).toBe(false);
      
      const state = game.getGameState();
      expect(state.currentPlayer).toBe('X'); // Should switch back to player
    });

    it('should throw error when game is not in progress', () => {
      game['gameState'] = 'won';
      expect(() => game.makeAIMove()).toThrow('Game is not in progress');
    });

    it('should throw error when not AI turn', () => {
      game.resetGame(); // Reset to player turn
      expect(() => game.makeAIMove()).toThrow('Not AI turn');
    });

    it('should detect AI win and update stats', () => {
      // Set up a scenario where AI can win
      game.resetGame();
      
      // Force a specific board state where AI (O) can win in position 2
      game['board'] = ['O', 'O', null, 'X', 'X', null, null, null, null];
      game['currentPlayer'] = 'O';
      
      const result = game.makeAIMove();
      
      expect(result.isGameOver).toBe(true);
      expect(result.gameResult.state).toBe('won');
      expect(result.gameResult.winner).toBe('O');
      expect(result.newBoard[2]).toBe('O'); // AI should choose position 2 to win
      
      const state = game.getGameState();
      expect(state.stats.aiWins).toBe(1);
    });
  });

  describe('game flow', () => {
    it('should handle a complete game resulting in draw', () => {
      // Force a board state that will result in a draw on the next move
      // Board layout: O | X | O
      //               X | X | O  
      //               X | O | null -> filling with X creates no wins
      game.resetGame();
      game['board'] = ['O', 'X', 'O', 'X', 'X', 'O', 'X', 'O', null];
      game['currentPlayer'] = 'X';
      
      const result = game.makePlayerMove(8); // Fill the last spot
      
      expect(result.isGameOver).toBe(true);
      expect(result.gameResult.state).toBe('draw');
      expect(result.gameResult.winner).toBeNull();
      
      const state = game.getGameState();
      expect(state.stats.draws).toBe(1);
    });
  });

  describe('utility methods', () => {
    it('should correctly identify player turn', () => {
      expect(game.isPlayerTurn()).toBe(true);
      expect(game.isAITurn()).toBe(false);
      
      game.makePlayerMove(0);
      
      expect(game.isPlayerTurn()).toBe(false);
      expect(game.isAITurn()).toBe(true);
    });

    it('should return false for turn checks when game is over', () => {
      game['gameState'] = 'won';
      expect(game.isPlayerTurn()).toBe(false);
      expect(game.isAITurn()).toBe(false);
    });

    it('should return available moves', () => {
      const moves1 = game.getAvailableMoves();
      expect(moves1).toHaveLength(9);
      
      game.makePlayerMove(4);
      const moves2 = game.getAvailableMoves();
      expect(moves2).toHaveLength(8);
      expect(moves2).not.toContain(4);
    });
  });

  describe('resetGame', () => {
    it('should reset game to initial state', () => {
      game.makePlayerMove(0);
      game.makeAIMove();
      
      game.resetGame();
      
      const state = game.getGameState();
      expect(state.board).toEqual(Array(9).fill(null));
      expect(state.currentPlayer).toBe('X');
      expect(state.gameState).toBe('playing');
      expect(state.winner).toBeNull();
    });

    it('should preserve stats when resetting', () => {
      // Manually set some stats
      game['stats'] = { playerWins: 5, aiWins: 3, draws: 2 };
      
      game.resetGame();
      
      const state = game.getGameState();
      expect(state.stats).toEqual({ playerWins: 5, aiWins: 3, draws: 2 });
    });
  });

  describe('setDifficulty', () => {
    it('should change difficulty and reset game', () => {
      game.makePlayerMove(0);
      game.setDifficulty('hard');
      
      const state = game.getGameState();
      expect(state.config.difficulty).toBe('hard');
      expect(state.board).toEqual(Array(9).fill(null)); // Should be reset
      expect(state.currentPlayer).toBe('X');
    });
  });

  describe('resetStats', () => {
    it('should reset all statistics to zero', () => {
      game['stats'] = { playerWins: 5, aiWins: 3, draws: 2 };
      
      game.resetStats();
      
      const state = game.getGameState();
      expect(state.stats).toEqual({ playerWins: 0, aiWins: 0, draws: 0 });
    });
  });

  describe('getGameState', () => {
    it('should return a copy of internal state', () => {
      const state1 = game.getGameState();
      const state2 = game.getGameState();
      
      // Should be equal but different objects
      expect(state1).toEqual(state2);
      expect(state1.board).not.toBe(state2.board);
      expect(state1.config).not.toBe(state2.config);
      expect(state1.stats).not.toBe(state2.stats);
    });

    it('should not allow external mutation of internal state', () => {
      const state = game.getGameState();
      state.board[0] = 'X';
      state.stats.playerWins = 100;
      
      const newState = game.getGameState();
      expect(newState.board[0]).toBeNull();
      expect(newState.stats.playerWins).toBe(0);
    });
  });
}); 