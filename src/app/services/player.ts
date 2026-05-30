import { Injectable } from '@angular/core';
import { Player, GameResult } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private readonly STORAGE_KEY = 'english_battle_player';

  private defaultPlayer: Player = {
    xp: 0,
    level: 1,
    highScore: 0,
    totalGamesPlayed: 0
  };

  getPlayer(): Player {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : { ...this.defaultPlayer };
  }

  savePlayer(player: Player): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(player));
  }

  calcLevel(xp: number): number {
    return Math.floor(xp / 100) + 1;
  }

  xpProgress(xp: number): number {
    return (xp % 100);
  }

  applyResult(result: GameResult): { player: Player; leveledUp: boolean } {
    const player = this.getPlayer();
    const oldLevel = player.level;

    player.xp += result.xpGained;
    player.level = this.calcLevel(player.xp);
    player.totalGamesPlayed += 1;

    if (result.score > player.highScore) {
      player.highScore = result.score;
    }

    this.savePlayer(player);

    return {
      player,
      leveledUp: player.level > oldLevel
    };
  }

  resetPlayer(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}