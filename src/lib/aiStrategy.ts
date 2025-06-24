import * as R from 'ramda';
import { getBestMove, getRandomMove } from './gameLogic';
import { Board, Player, Difficulty } from './types';
import { DIFFICULTY_CONFIG } from './constants';

/**
 * Get difficulty configuration using functional composition
 */
const getDifficultyConfig = R.prop(R.__, DIFFICULTY_CONFIG);

/**
 * Check if AI should make optimal move based on difficulty
 */
const shouldUseOptimalMove = R.curry((difficulty: Difficulty): boolean => {
  const config = getDifficultyConfig(difficulty);
  return Math.random() < config.optimalChance;
});

/**
 * Get move based on strategy (optimal vs random) using functional composition
 */
const getMoveByStrategy = (
  board: Board,
  aiPlayer: Player,
  humanPlayer: Player,
  useOptimal: boolean
): number => {
  return useOptimal 
    ? getBestMove(board, aiPlayer, humanPlayer)
    : getRandomMove(board);
};

/**
 * Get AI move using functional composition and conditional logic
 */
export const getAIMove = (
  board: Board,
  difficulty: Difficulty,
  aiPlayer: Player = 'O',
  humanPlayer: Player = 'X'
): number => {
  const useOptimal = shouldUseOptimalMove(difficulty);
  return getMoveByStrategy(board, aiPlayer, humanPlayer, useOptimal);
};

/**
 * Get difficulty description using functional composition
 */
export const getDifficultyDescription = R.pipe(
  getDifficultyConfig,
  R.prop('description')
) as (difficulty: Difficulty) => string;

/**
 * Parse difficulty from string with validation using functional patterns
 */
export const parseDifficulty = R.cond([
  [R.includes(R.__, ['easy', 'medium', 'hard']), R.identity],
  [R.T, R.always('medium' as Difficulty)]
]) as (input: string) => Difficulty;

/**
 * Validate difficulty level using functional composition
 */
export const isValidDifficulty = R.includes(R.__, Object.keys(DIFFICULTY_CONFIG));

/**
 * Get all available difficulty levels using functional approach
 */
export const getDifficultyLevels = (): Difficulty[] => Object.keys(DIFFICULTY_CONFIG) as Difficulty[];

/**
 * Get optimal move chance for difficulty using functional composition
 */
export const getOptimalChance = R.pipe(
  getDifficultyConfig,
  R.prop('optimalChance')
) as (difficulty: Difficulty) => number; 