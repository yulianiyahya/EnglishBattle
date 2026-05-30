import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../services/player';
import { GameResult, Player } from '../models/player';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
  standalone: false,
})
export class ResultPage implements OnInit {

  result!: GameResult;
  player!: Player;
  leveledUp: boolean = false;
  accuracy: number = 0;

  modeLabels: Record<string, string> = {
    'vocab-easy': '📚 Vocab Battle',
    'vocab-hard': '🔥 Hard Battle',
    'word-blast': '💥 Word Blast',
    'matching': '🔗 Matching'
  };

  constructor(
    private router: Router,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as {
      result: GameResult;
      leveledUp: boolean;
    };

    if (state?.result) {
      this.result = state.result;
      this.leveledUp = state.leveledUp;
    } else {
      this.router.navigate(['/home']);
      return;
    }

    this.player = this.playerService.getPlayer();
    this.accuracy = Math.round(
      (this.result.correctCount / this.result.totalQuestions) * 100
    );
  }

  get modeLabel(): string {
    return this.modeLabels[this.result.mode] || this.result.mode;
  }

  get resultEmoji(): string {
    if (this.result.isWin) {
      if (this.accuracy === 100) return '🏆';
      if (this.accuracy >= 80) return '⭐';
      return '✅';
    }
    return '💀';
  }

  get resultMessage(): string {
    if (this.result.isWin) {
      if (this.accuracy === 100) return 'SEMPURNA!';
      if (this.accuracy >= 80) return 'LUAR BIASA!';
      return 'BAGUS!';
    }
    return 'COBA LAGI!';
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  playAgain() {
    const modeRoutes: Record<string, string> = {
      'vocab-easy': '/vocabulary',
      'vocab-hard': '/vocabulary-hard',
      'word-blast': '/word-blast',
      'matching': '/matching'
    };
    this.router.navigate([modeRoutes[this.result.mode] || '/home']);
  }
}