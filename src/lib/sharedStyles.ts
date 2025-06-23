// Shared color palette and styling constants
export const COLORS = {
  // Gradient colors
  gradientStart: '#667eea',
  gradientEnd: '#764ba2',
  
  // Background colors
  background: {
    light: '#f5f5f5',
    dark: '#121212',
    card: '#ffffff',
    cardDark: '#1e1e1e',
  },
  
  // Text colors
  text: {
    primary: '#333333',
    primaryDark: '#ffffff',
    secondary: '#666666',
    secondaryDark: '#cccccc',
  },
  
  // Difficulty colors
  difficulty: {
    easy: '#4CAF50',
    medium: '#FF9800',
    hard: '#F44336',
  },
  
  // Player colors
  player: {
    X: '#2196F3',
    O: '#F44336',
  },
  
  // Status colors
  status: {
    won: '#4CAF50',
    draw: '#FF9800',
    info: '#28a745',
    infoBg: '#d4edda',
  },
  
  // Button colors
  button: {
    primary: '#2196F3',
    secondary: '#FF9800',
  },
  
  // Cell colors
  cell: {
    empty: '#f8f9fa',
    emptyDark: '#2c2c2c',
    filled: '#ffffff',
    filledDark: '#3c3c3c',
    border: '#e9ecef',
    borderDark: '#555555',
  },
};

// Shared dimensions
export const DIMENSIONS = {
  borderRadius: {
    small: 10,
    medium: 15,
    large: 20,
    pill: 25,
  },
  
  spacing: {
    xs: 5,
    sm: 10,
    md: 15,
    lg: 20,
    xl: 30,
    xxl: 40,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    title: 40,
  },
  
  board: {
    size: 280,
    cellGap: 3,
  },
};

// Shared shadow styles
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
};

// Animation configs
export const ANIMATIONS = {
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  easing: {
    ease: 'ease',
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
  },
};

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Platform-specific utilities
export const getGradientBackground = (platform: 'web' | 'native') => {
  if (platform === 'web') {
    return `linear-gradient(135deg, ${COLORS.gradientStart} 0%, ${COLORS.gradientEnd} 100%)`;
  } else {
    // For React Native, we'll need to use a different approach
    return {
      colors: [COLORS.gradientStart, COLORS.gradientEnd],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    };
  }
};

export const getGradientText = (platform: 'web' | 'native') => {
  if (platform === 'web') {
    return {
      background: `linear-gradient(45deg, ${COLORS.gradientStart}, ${COLORS.gradientEnd})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    };
  } else {
    // For React Native, we'll use a solid color as fallback
    return {
      color: COLORS.gradientStart,
    };
  }
}; 