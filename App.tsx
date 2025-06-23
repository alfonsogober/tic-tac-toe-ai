import React, { useState, useEffect, useCallback } from 'react';
import {
  StatusBar,
  useColorScheme,
  Vibration,
} from 'react-native';
import { 
  TicTacToeGame, 
  Difficulty,
  COLORS,
} from './src/lib';
import {
  GradientBackground,
  Container,
  ScrollContainer,
  AppContainer,
  Header,
  Title,
  Subtitle,
  SharedLibNote,
  SharedLibText,
  DifficultyContainer,
  DifficultyLabel,
  DifficultyButtons,
  DifficultyButton,
  DifficultyButtonText,
  BoardContainer,
  Board,
  Cell,
  CellText,
  GameStatus,
  StatusText,
  WinText,
  DrawText,
  Stats,
  StatsTitle,
  StatsRow,
  StatsText,
  Buttons,
  Button,
  ButtonText,
} from './src/lib/StyledComponents';

const App = () => {
  const [game] = useState(() => new TicTacToeGame());
  const [gameState, setGameState] = useState(game.getGameState());
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  // Update component state when game state changes
  const updateGameState = useCallback(() => {
    setGameState(game.getGameState());
  }, [game]);

  const handleCellPress = async (index: number) => {
    if (!game.isPlayerTurn() || isProcessingAI) return;

    try {
      const result = game.makePlayerMove(index);
      updateGameState();

      if (result.gameResult.winner === 'X') {
        try {
          Vibration.vibrate(100);
        } catch (error) {
          console.log('Vibration not available:', error);
        }
      } else if (!result.isGameOver && game.isAITurn()) {
        // AI turn
        setIsProcessingAI(true);
      }
    } catch (error) {
      console.log('Invalid move:', error);
    }
  };

  // Handle AI turn
  useEffect(() => {
    if (game.isAITurn() && !isProcessingAI) {
      setIsProcessingAI(true);
    }
  }, [game, gameState.currentPlayer, gameState.gameState, isProcessingAI]);

  useEffect(() => {
    if (isProcessingAI && game.isAITurn()) {
      const timer = setTimeout(() => {
        try {
          const result = game.makeAIMove();
          updateGameState();
          
          if (result.gameResult.winner === 'O') {
            try {
              Vibration.vibrate([100, 100, 100]);
            } catch (error) {
              console.log('Vibration not available:', error);
            }
          }
        } catch (error) {
          console.log('AI move error:', error);
        } finally {
          setIsProcessingAI(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [game, isProcessingAI, updateGameState]);

  const handleDifficultyChange = (difficulty: Difficulty) => {
    game.setDifficulty(difficulty);
    updateGameState();
    setIsProcessingAI(false);
  };

  const handleNewGame = () => {
    game.resetGame();
    updateGameState();
    setIsProcessingAI(false);
  };

  const handleResetStats = () => {
    game.resetStats();
    updateGameState();
  };

  const renderCell = (index: number) => {
    const cellValue = gameState.board[index];
    const isDisabled = !game.isPlayerTurn() || isProcessingAI;
    
    return (
      <Cell
        key={index}
        isDarkMode={isDarkMode}
        cellValue={cellValue}
        disabled={isDisabled}
        onPress={() => handleCellPress(index)}
      >
        <CellText 
          isDarkMode={isDarkMode} 
          cellValue={cellValue}
          disabled={isDisabled}
        >
          {cellValue}
        </CellText>
      </Cell>
    );
  };

  const renderStatusText = () => {
    if (gameState.gameState === 'playing') {
      if (isProcessingAI) {
        return (
          <StatusText isDarkMode={isDarkMode}>
            AI is thinking...
          </StatusText>
        );
      } else {
        return (
          <StatusText isDarkMode={isDarkMode}>
            {game.isPlayerTurn() ? "Your turn" : "Waiting..."}
          </StatusText>
        );
      }
    } else if (gameState.gameState === 'won') {
      return (
        <WinText>
          {gameState.winner === 'X' ? '🎉 You Won!' : '🤖 AI Won!'}
        </WinText>
      );
    } else if (gameState.gameState === 'draw') {
      return (
        <DrawText>
          🤝 It's a Draw!
        </DrawText>
      );
    }
    return null;
  };

  return (
    <Container>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'light-content'} />
      
      <GradientBackground>
        <ScrollContainer>
          <AppContainer isDarkMode={isDarkMode}>
            <Header>
              <Title isDarkMode={isDarkMode}>
                Tic Tac Toe AI
              </Title>
              <Subtitle isDarkMode={isDarkMode}>
                Cross-Platform Demo
              </Subtitle>
              <SharedLibNote>
                <SharedLibText>
                  ✨ Same Logic as Web Version
                </SharedLibText>
              </SharedLibNote>
            </Header>

            <DifficultyContainer>
              <DifficultyLabel isDarkMode={isDarkMode}>
                Difficulty:
              </DifficultyLabel>
              <DifficultyButtons>
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                  <DifficultyButton
                    key={level}
                    isDarkMode={isDarkMode}
                    isActive={gameState.config.difficulty === level}
                    color={COLORS.difficulty[level]}
                    onPress={() => handleDifficultyChange(level)}
                  >
                    <DifficultyButtonText
                      isDarkMode={isDarkMode}
                      isActive={gameState.config.difficulty === level}
                      color={COLORS.difficulty[level]}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </DifficultyButtonText>
                  </DifficultyButton>
                ))}
              </DifficultyButtons>
            </DifficultyContainer>

            <BoardContainer>
              <Board>
                {gameState.board.map((_, index) => renderCell(index))}
              </Board>
            </BoardContainer>

            <GameStatus>
              {renderStatusText()}
            </GameStatus>

            <Stats>
              <StatsTitle isDarkMode={isDarkMode}>Statistics</StatsTitle>
              <StatsRow>
                <StatsText isDarkMode={isDarkMode}>
                  You: {gameState.stats.playerWins}
                </StatsText>
                <StatsText isDarkMode={isDarkMode}>
                  AI: {gameState.stats.aiWins}
                </StatsText>
                <StatsText isDarkMode={isDarkMode}>
                  Draws: {gameState.stats.draws}
                </StatsText>
              </StatsRow>
            </Stats>

            <Buttons>
              <Button color={COLORS.button.primary} onPress={handleNewGame}>
                <ButtonText>New Game</ButtonText>
              </Button>
              
              <Button color={COLORS.button.secondary} onPress={handleResetStats}>
                <ButtonText>Reset Stats</ButtonText>
              </Button>
            </Buttons>
          </AppContainer>
        </ScrollContainer>
      </GradientBackground>
    </Container>
  );
};

export default App; 