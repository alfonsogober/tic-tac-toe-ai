import {
  SafeAreaView,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import { 
  COLORS,
  DIMENSIONS,
  SHADOWS,
  TYPOGRAPHY
} from '.';

// Type interfaces
export interface ThemeProps {
  isDarkMode: boolean;
}

export interface CellProps extends ThemeProps {
  cellValue: string | null;
  disabled: boolean;
}

export interface DifficultyButtonProps extends ThemeProps {
  isActive: boolean;
  color: string;
}

// Styled Components with Shared Design System
export const GradientBackground = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: ${COLORS.gradientStart};
`;

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: transparent;
`;

export const ScrollContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: DIMENSIONS.spacing.sm,
    minHeight: '100%',
  },
  showsVerticalScrollIndicator: false,
  keyboardShouldPersistTaps: 'handled',
})`
  flex: 1;
  width: 100%;
`;

export const AppContainer = styled.View<ThemeProps>`
  background-color: ${props => props.isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border-radius: ${DIMENSIONS.borderRadius.large}px;
  padding: ${DIMENSIONS.spacing.lg}px;
  margin: ${DIMENSIONS.spacing.sm}px;
  max-width: 400px;
  width: 95%;
  align-self: center;
  border: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  ${SHADOWS.large}
  elevation: 12;
`;

export const Header = styled.View`
  align-items: center;
  margin-bottom: ${DIMENSIONS.spacing.lg}px;
`;

export const Title = styled.Text<ThemeProps>`
  font-size: ${DIMENSIONS.fontSize.title + 4}px;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${COLORS.gradientStart};
  margin-bottom: ${DIMENSIONS.spacing.xs}px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
`;

export const Subtitle = styled.Text<ThemeProps>`
  font-size: ${DIMENSIONS.fontSize.lg + 2}px;
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
  color: ${props => props.isDarkMode ? COLORS.text.secondaryDark : COLORS.text.secondary};
  margin-bottom: ${DIMENSIONS.spacing.sm}px;
  text-align: center;
`;

export const SharedLibNote = styled.View`
  background-color: rgba(40, 167, 69, 0.15);
  border: 1px solid rgba(40, 167, 69, 0.3);
  padding-horizontal: ${DIMENSIONS.spacing.md + 4}px;
  padding-vertical: ${DIMENSIONS.spacing.sm + 2}px;
  border-radius: ${DIMENSIONS.borderRadius.pill}px;
  margin-bottom: ${DIMENSIONS.spacing.xl}px;
  ${SHADOWS.small}
`;

export const SharedLibText = styled.Text`
  color: ${COLORS.status.info};
  font-size: ${DIMENSIONS.fontSize.sm + 1}px;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  text-align: center;
`;

export const DifficultyContainer = styled.View`
  align-items: center;
  margin-bottom: ${DIMENSIONS.spacing.xl}px;
`;

export const DifficultyLabel = styled.Text<ThemeProps>`
  font-size: ${DIMENSIONS.fontSize.xl}px;
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  margin-bottom: ${DIMENSIONS.spacing.md}px;
  color: ${props => props.isDarkMode ? COLORS.text.primaryDark : COLORS.text.primary};
`;

export const DifficultyButtons = styled.View`
  flex-direction: row;
  gap: ${DIMENSIONS.spacing.sm}px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const DifficultyButton = styled.TouchableOpacity<DifficultyButtonProps>`
  padding-horizontal: ${DIMENSIONS.spacing.lg + 4}px;
  padding-vertical: ${DIMENSIONS.spacing.sm + 2}px;
  border-radius: ${DIMENSIONS.borderRadius.pill}px;
  border-width: 2px;
  background-color: ${props => props.isActive ? props.color : 'transparent'};
  border-color: ${props => props.color};
  ${SHADOWS.medium}
  elevation: ${props => props.isActive ? 6 : 3};
  transform: ${props => props.isActive ? 'scale(1.05)' : 'scale(1)'};
`;

export const DifficultyButtonText = styled.Text<DifficultyButtonProps>`
  font-size: ${DIMENSIONS.fontSize.md}px;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${props => props.isActive ? 'white' : props.color};
`;

export const BoardContainer = styled.View`
  align-items: center;
  margin-bottom: ${DIMENSIONS.spacing.xl}px;
`;

export const Board = styled.View`
  width: ${DIMENSIONS.board.size}px;
  height: ${DIMENSIONS.board.size}px;
  border-radius: ${DIMENSIONS.borderRadius.medium}px;
  background-color: #2c3e50;
  padding: 8px;
  ${SHADOWS.large}
  flex-direction: row;
  flex-wrap: wrap;
`;

export const Cell = styled.TouchableOpacity<CellProps>`
  width: ${(DIMENSIONS.board.size - 40) / 3}px;
  height: ${(DIMENSIONS.board.size - 40) / 3}px;
  align-items: center;
  justify-content: center;
  margin: 4px;
  background-color: ${props => {
    if (props.cellValue) {
      return props.isDarkMode ? '#34495e' : '#ecf0f1';
    }
    return props.isDarkMode ? '#34495e' : '#ffffff';
  }};
  border: 2px solid ${props => props.isDarkMode ? '#95a5a6' : '#bdc3c7'};
  border-radius: ${DIMENSIONS.borderRadius.small}px;
  opacity: ${props => props.disabled ? 0.7 : 1};
  ${SHADOWS.medium}
  elevation: 4;
`;

export const CellText = styled.Text<CellProps>`
  font-size: 56px;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${props => {
    if (props.cellValue === 'X') return '#3498db';
    if (props.cellValue === 'O') return '#e74c3c';
    return 'transparent';
  }};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

export const GameStatus = styled.View`
  margin-bottom: ${DIMENSIONS.spacing.xl}px;
  align-items: center;
  min-height: 40px;
  justify-content: center;
`;

export const StatusText = styled.Text<ThemeProps>`
  font-size: ${DIMENSIONS.fontSize.xl + 2}px;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${props => props.isDarkMode ? COLORS.text.primaryDark : COLORS.text.primary};
  text-align: center;
`;

export const WinText = styled.Text`
  font-size: ${DIMENSIONS.fontSize.xl + 4}px;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${COLORS.status.won};
  text-align: center;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
`;

export const DrawText = styled.Text`
  font-size: ${DIMENSIONS.fontSize.xl + 4}px;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${COLORS.status.draw};
  text-align: center;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
`;

export const Stats = styled.View`
  align-items: center;
  margin-bottom: ${DIMENSIONS.spacing.xl}px;
`;

export const StatsTitle = styled.Text<ThemeProps>`
  font-size: ${DIMENSIONS.fontSize.xl + 2}px;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${props => props.isDarkMode ? COLORS.text.primaryDark : COLORS.text.primary};
  margin-bottom: ${DIMENSIONS.spacing.md + 2}px;
  text-align: center;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  gap: ${DIMENSIONS.spacing.xl + 4}px;
  justify-content: center;
  align-items: center;
`;

export const StatsText = styled.Text<ThemeProps>`
  font-size: ${DIMENSIONS.fontSize.md + 1}px;
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  color: ${props => props.isDarkMode ? COLORS.text.primaryDark : COLORS.text.primary};
  text-align: center;
`;

export const Buttons = styled.View`
  flex-direction: row;
  gap: ${DIMENSIONS.spacing.md}px;
  justify-content: center;
`;

export const Button = styled.TouchableOpacity<{ color: string }>`
  padding-horizontal: ${DIMENSIONS.spacing.lg + 8}px;
  padding-vertical: ${DIMENSIONS.spacing.md + 4}px;
  border-radius: ${DIMENSIONS.borderRadius.pill}px;
  background-color: ${props => props.color};
  ${SHADOWS.button}
  elevation: 6;
  min-width: 120px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: ${DIMENSIONS.fontSize.md + 1}px;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`; 