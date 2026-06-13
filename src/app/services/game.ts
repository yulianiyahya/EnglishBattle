import { Injectable } from '@angular/core';
import { GameResult, GameMode } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  calcXpGained(score: number, isWin: boolean): number {
    const bonus = isWin ? 30 : 0;
    return Math.round(score * 0.5) + bonus;
  }

  buildResult(
    mode: GameMode,
    score: number,
    correctCount: number,
    totalQuestions: number,
    isWin: boolean
  ): GameResult {
    return {
      mode,
      score,
      correctCount,
      totalQuestions,
      xpGained: this.calcXpGained(score, isWin),
      isWin
    };
  }

}