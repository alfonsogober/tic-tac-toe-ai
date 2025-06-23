// Simple web version for testing
import React, { useState, useEffect, useCallback } from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[];
type GameState = 'playing' | 'won' | 'draw';
type Difficulty = 'easy' | 'medium' | 'hard';

interface GameStats {
  playerWins: number;
  aiWins: number;
  draws: number;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

const App = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [winner, setWinner] = useState<Player>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [stats, setStats] = useState<GameStats>({ playerWins: 0, aiWins: 0, draws: 0 });

  const checkWinner = useCallback((currentBoard: Board): Player => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  }, []);

  const isBoardFull = useCallback((currentBoard: Board): boolean => {
    return currentBoard.every(cell => cell !== null);
  }, []);

  const getAvailableMoves = useCallback((currentBoard: Board): number[] => {
    return currentBoard.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
  }, []);

  // Minimax algorithm for AI
  const minimax = useCallback((
    currentBoard: Board,
    depth: number,
    isMaximizing: boolean,
    alpha: number = -Infinity,
    beta: number = Infinity
  ): number => {
    const winner = checkWinner(currentBoard);
    
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (isBoardFull(currentBoard)) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of getAvailableMoves(currentBoard)) {
        const newBoard = [...currentBoard];
        newBoard[move] = 'O';
        const evaluation = minimax(newBoard, depth + 1, false, alpha, beta);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of getAvailableMoves(currentBoard)) {
        const newBoard = [...currentBoard];
        newBoard[move] = 'X';
        const evaluation = minimax(newBoard, depth + 1, true, alpha, beta);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }, [checkWinner, isBoardFull, getAvailableMoves]);

  const getAIMove = useCallback((currentBoard: Board): number => {
    const availableMoves = getAvailableMoves(currentBoard);
    
    if (difficulty === 'easy') {
      if (Math.random() < 0.3) {
        let bestMove = availableMoves[0];
        let bestScore = -Infinity;
        
        for (const move of availableMoves) {
          const newBoard = [...currentBoard];
          newBoard[move] = 'O';
          const score = minimax(newBoard, 0, false);
          if (score > bestScore) {
            bestScore = score;
            bestMove = move;
          }
        }
        return bestMove;
      } else {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
    } else if (difficulty === 'medium') {
      if (Math.random() < 0.7) {
        let bestMove = availableMoves[0];
        let bestScore = -Infinity;
        
        for (const move of availableMoves) {
          const newBoard = [...currentBoard];
          newBoard[move] = 'O';
          const score = minimax(newBoard, 0, false);
          if (score > bestScore) {
            bestScore = score;
            bestMove = move;
          }
        }
        return bestMove;
      } else {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
    } else {
      let bestMove = availableMoves[0];
      let bestScore = -Infinity;
      
      for (const move of availableMoves) {
        const newBoard = [...currentBoard];
        newBoard[move] = 'O';
        const score = minimax(newBoard, 0, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      return bestMove;
    }
  }, [difficulty, getAvailableMoves, minimax]);

  const handleCellPress = (index: number) => {
    if (board[index] || gameState !== 'playing' || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameState('won');
      setStats(prev => ({ ...prev, playerWins: prev.playerWins + 1 }));
    } else if (isBoardFull(newBoard)) {
      setGameState('draw');
      setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  useEffect(() => {
    if (!isPlayerTurn && gameState === 'playing') {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(board);
        const newBoard = [...board];
        newBoard[aiMove] = 'O';
        setBoard(newBoard);
        setIsPlayerTurn(true);

        const gameWinner = checkWinner(newBoard);
        if (gameWinner) {
          setWinner(gameWinner);
          setGameState('won');
          setStats(prev => ({ ...prev, aiWins: prev.aiWins + 1 }));
        } else if (isBoardFull(newBoard)) {
          setGameState('draw');
          setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameState, board, getAIMove, checkWinner, isBoardFull]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameState('playing');
    setWinner(null);
  };

  const resetStats = () => {
    setStats({ playerWins: 0, aiWins: 0, draws: 0 });
  };

  const getDifficultyColor = (level: Difficulty) => {
    switch (level) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
    }
  };

  const renderCell = (index: number) => {
    const cellValue = board[index];
    return (
      <button
        key={index}
        style={{
          width: '100px',
          height: '100px',
          fontSize: '36px',
          fontWeight: 'bold',
          border: '2px solid #333',
          backgroundColor: cellValue ? '#f0f0f0' : '#fff',
          color: cellValue === 'X' ? '#2196F3' : '#F44336',
          cursor: isPlayerTurn && !cellValue && gameState === 'playing' ? 'pointer' : 'default'
        }}
        onClick={() => handleCellPress(index)}
        disabled={!isPlayerTurn || gameState !== 'playing'}
      >
        {cellValue}
      </button>
    );
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>🎮 Tic Tac Toe AI</h1>
        <p style={{ fontSize: '16px', color: '#666' }}>You are X, AI is O</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>Difficulty:</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
            <button
              key={level}
              style={{
                padding: '8px 15px',
                borderRadius: '20px',
                border: `2px solid ${getDifficultyColor(level)}`,
                backgroundColor: difficulty === level ? getDifficultyColor(level) : 'transparent',
                color: difficulty === level ? 'white' : getDifficultyColor(level),
                cursor: 'pointer',
                fontWeight: '600'
              }}
              onClick={() => {
                setDifficulty(level);
                resetGame();
              }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 100px)', 
        gap: '2px', 
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        {board.map((_, index) => renderCell(index))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        {gameState === 'playing' && (
          <p style={{ fontSize: '20px', fontWeight: '600' }}>
            {isPlayerTurn ? "Your turn" : "AI is thinking..."}
          </p>
        )}
        {gameState === 'won' && (
          <p style={{ fontSize: '20px', fontWeight: '600', color: '#4CAF50' }}>
            {winner === 'X' ? '🎉 You Won!' : '🤖 AI Won!'}
          </p>
        )}
        {gameState === 'draw' && (
          <p style={{ fontSize: '20px', fontWeight: '600', color: '#FF9800' }}>
            🤝 It's a Draw!
          </p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Statistics</h3>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <span>You: {stats.playerWins}</span>
          <span>AI: {stats.aiWins}</span>
          <span>Draws: {stats.draws}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button
          style={{
            padding: '12px 25px',
            borderRadius: '25px',
            border: 'none',
            backgroundColor: '#2196F3',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
          onClick={resetGame}
        >
          New Game
        </button>
        
        <button
          style={{
            padding: '12px 25px',
            borderRadius: '25px',
            border: 'none',
            backgroundColor: '#FF9800',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
          onClick={resetStats}
        >
          Reset Stats
        </button>
      </div>
    </div>
  );
};

export default App; 