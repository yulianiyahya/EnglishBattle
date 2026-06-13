import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { PlayerService } from '../services/player';
import { GameResult, Player } from '../models/player';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
  standalone: false,
})
export class ResultPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private playerService = inject(PlayerService);

  result!: GameResult;
  player!: Player;
  leveledUp: boolean = false;
  accuracy: number = 0;
  private backButtonListener: any;

  modeLabels: Record<string, string> = {
    'vocab-easy': '📚 Vocab Battle',
    'vocab-hard': '🔥 Hard Battle',
    'word-blast': '💥 Word Blast',
    'matching': '🔗 Matching'
  };

  constructor() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as {
      result: GameResult;
      leveledUp: boolean;
    };

    if (state?.result) {
      this.result = state.result;
      this.leveledUp = state.leveledUp;
    }
  }

  async ionViewWillEnter() {
    await this.setupBackButton();
  }

  ionViewWillLeave() {
    this.clearBackButton();
  }

  ngOnInit() {
    if (!this.result) {
      this.router.navigate(['/home']);
      return;
    }

    this.player = this.playerService.getPlayer();
    this.accuracy = Math.round(
      (this.result.correctCount / this.result.totalQuestions) * 100
    );
  }

  get modeLabel(): string {
    if (!this.result) return '';
    return this.modeLabels[this.result.mode] || this.result.mode;
  }

  get resultEmoji(): string {
    if (!this.result) return '';
    if (this.result.isWin) {
      if (this.accuracy === 100) return '🏆';
      if (this.accuracy >= 80) return '⭐';
      return '✅';
    }
    return '💀';
  }

  get resultMessage(): string {
    if (!this.result) return '';
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
    console.log('[DEBUG] playAgain() called. Mode:', this.result?.mode);
    const modeRoutes: Record<string, string> = {
      'vocab-easy': '/vocabulary',
      'vocab-hard': '/vocabulary-hard',
      'word-blast': '/word-blast',
      'matching': '/matching'
    };
    const route = modeRoutes[this.result.mode] || '/home';
    console.log('[DEBUG] Navigating to:', route);
    this.router.navigate([route]);
  }

  ngOnDestroy() {
    this.clearBackButton();
  }

  private async setupBackButton() {
    this.clearBackButton();
    this.backButtonListener = await App.addListener('backButton', () => {
      console.log('[DEBUG] ResultPage hardware back button pressed, navigating home');
      this.router.navigate(['/home']);
    });
  }

  private clearBackButton() {
    if (this.backButtonListener) {
      this.backButtonListener.remove();
      this.backButtonListener = null;
    }
  }
}