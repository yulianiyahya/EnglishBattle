export interface Player {
  xp: number;
  level: number;
  highScore: number;
  totalGamesPlayed: number;
}

export interface GameResult {
  mode: GameMode;
  score: number;
  correctCount: number;
  totalQuestions: number;
  xpGained: number;
  isWin: boolean;
}

export type GameMode = 'vocab-easy' | 'vocab-hard' | 'word-blast' | 'matching';