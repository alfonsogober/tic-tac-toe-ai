import { COLORS, DIMENSIONS, SHADOWS, TYPOGRAPHY } from './sharedStyles';

// Base component interfaces that both platforms should implement
export interface BaseComponentProps {
  isDarkMode: boolean;
}

export interface CellComponentProps extends BaseComponentProps {
  cellValue: string | null;
  disabled: boolean;
}

export interface DifficultyButtonProps extends BaseComponentProps {
  isActive: boolean;
  color: string;
}

export interface ButtonProps {
  color: string;
}

// Component style configurations
export const componentStyles = {
  gradientBackground: {
    colors: [COLORS.gradientStart, COLORS.gradientEnd],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  appContainer: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? COLORS.background.cardDark : COLORS.background.card,
    borderRadius: DIMENSIONS.borderRadius.large,
    padding: DIMENSIONS.spacing.xxl,
    maxWidth: 500,
    alignSelf: 'center' as const,
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)', // Web
    ...SHADOWS.large, // React Native
  }),

  title: {
    fontSize: DIMENSIONS.fontSize.title,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.gradientStart,
    marginBottom: DIMENSIONS.spacing.xs,
    textAlign: 'center' as const,
  },

  subtitle: (isDarkMode: boolean) => ({
    fontSize: DIMENSIONS.fontSize.lg,
    color: isDarkMode ? COLORS.text.secondaryDark : COLORS.text.secondary,
    marginBottom: DIMENSIONS.spacing.sm,
  }),

  sharedLibNote: {
    backgroundColor: COLORS.status.infoBg,
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingVertical: DIMENSIONS.spacing.sm,
    borderRadius: DIMENSIONS.borderRadius.pill,
    marginBottom: DIMENSIONS.spacing.xl,
  },

  sharedLibText: {
    color: COLORS.status.info,
    fontSize: DIMENSIONS.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },

  difficultyButton: (isActive: boolean, color: string) => ({
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.sm,
    borderRadius: DIMENSIONS.borderRadius.pill,
    borderWidth: 2,
    backgroundColor: isActive ? color : 'transparent',
    borderColor: color,
    ...SHADOWS.small,
  }),

  difficultyButtonText: (isActive: boolean, color: string) => ({
    fontSize: DIMENSIONS.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: isActive ? 'white' : color,
  }),

  board: {
    width: DIMENSIONS.board.size,
    height: DIMENSIONS.board.size,
    borderRadius: DIMENSIONS.borderRadius.medium,
    overflow: 'hidden' as const,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)', // Web
    ...SHADOWS.medium, // React Native
  },

  cell: (cellValue: string | null, isDarkMode: boolean, disabled: boolean) => ({
    width: (DIMENSIONS.board.size - DIMENSIONS.board.cellGap * 2) / 3,
    height: (DIMENSIONS.board.size - DIMENSIONS.board.cellGap * 2) / 3,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    margin: DIMENSIONS.board.cellGap / 2,
    backgroundColor: cellValue 
      ? (isDarkMode ? COLORS.cell.filledDark : COLORS.cell.filled)
      : (isDarkMode ? COLORS.cell.emptyDark : COLORS.cell.empty),
    borderRadius: DIMENSIONS.borderRadius.small / 2,
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer', // Web only
    transition: 'all 0.3s ease', // Web only
  }),

  cellText: (cellValue: string | null) => ({
    fontSize: 48,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: cellValue === 'X' 
      ? COLORS.player.X 
      : cellValue === 'O' 
        ? COLORS.player.O 
        : 'transparent',
  }),

  statusText: (isDarkMode: boolean) => ({
    fontSize: DIMENSIONS.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: isDarkMode ? COLORS.text.primaryDark : COLORS.text.primary,
  }),

  winText: {
    fontSize: DIMENSIONS.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.status.won,
  },

  drawText: {
    fontSize: DIMENSIONS.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.status.draw,
  },

  statsTitle: (isDarkMode: boolean) => ({
    fontSize: DIMENSIONS.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: isDarkMode ? COLORS.text.primaryDark : COLORS.text.primary,
    marginBottom: DIMENSIONS.spacing.md,
  }),

  statsText: (isDarkMode: boolean) => ({
    fontSize: DIMENSIONS.fontSize.md,
    color: isDarkMode ? COLORS.text.secondaryDark : COLORS.text.secondary,
  }),

  button: (color: string) => ({
    paddingHorizontal: DIMENSIONS.spacing.lg + 5,
    paddingVertical: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.pill,
    backgroundColor: color,
    cursor: 'pointer' as const, // Web only
    transition: 'all 0.3s ease', // Web only
    ...SHADOWS.button,
  }),

  buttonText: {
    color: 'white',
    fontSize: DIMENSIONS.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },

  // Web-specific hover effects (to be applied via CSS)
  webHoverEffects: {
    difficultyButton: {
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      },
    },
    
    cell: {
      '&:hover:not(:disabled)': {
        backgroundColor: '#e9ecef',
        transform: 'scale(1.05)',
      },
    },
    
    button: {
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      },
    },
  },

  // Layout configurations
  layout: {
    spacing: {
      xs: DIMENSIONS.spacing.xs,
      sm: DIMENSIONS.spacing.sm,
      md: DIMENSIONS.spacing.md,
      lg: DIMENSIONS.spacing.lg,
      xl: DIMENSIONS.spacing.xl,
      xxl: DIMENSIONS.spacing.xxl,
    },
    
    flexRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    
    flexColumn: {
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
    },
    
    flexWrap: {
      flexWrap: 'wrap' as const,
    },
  },
};

// Utility functions for common styling patterns
export const getResponsiveSize = (size: number, isMobile: boolean) => {
  return isMobile ? size * 0.8 : size;
};

export const getTextColor = (isDarkMode: boolean, variant: 'primary' | 'secondary' = 'primary') => {
  if (variant === 'primary') {
    return isDarkMode ? COLORS.text.primaryDark : COLORS.text.primary;
  }
  return isDarkMode ? COLORS.text.secondaryDark : COLORS.text.secondary;
};

export const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
  return COLORS.difficulty[difficulty];
};

export const getPlayerColor = (player: 'X' | 'O') => {
  return COLORS.player[player];
}; 