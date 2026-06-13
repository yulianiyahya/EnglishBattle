import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { VocabularyService } from '../services/vocabulary';
import { GameService } from '../services/game';
import { PlayerService } from '../services/player';
import { SoundService } from '../services/sound';
import { MatchPair } from '../models/word';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.page.html',
  styleUrls: ['./matching.page.scss'],
  standalone: false,
})
export class MatchingPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private vocabService = inject(VocabularyService);
  private gameService = inject(GameService);
  private playerService = inject(PlayerService);
  private soundService = inject(SoundService);
  private toastCtrl = inject(ToastController);

  private endGameTimeout: any;
  private resetWrongTimeout: any;
  private backButtonListener: any;

  pairs: MatchPair[] = [];
  englishWords: string[] = [];
  indonesianWords: string[] = [];
  selectedEn: string = '';
  selectedId: string = '';
  matchedPairs: string[] = [];
  wrongPair: string[] = [];
  score: number = 0;
  mistakes: number = 0;
  gameOver: boolean = false;
  isProcessing: boolean = false;

  async ionViewWillEnter() {
    console.log('[DEBUG] MatchingPage ionViewWillEnter called');
    this.restartGame();
    await this.setupBackButton();
  }

  ionViewDidEnter() {
    console.log('[DEBUG] MatchingPage ionViewDidEnter called');
  }

  ionViewWillLeave() {
    console.log('[DEBUG] MatchingPage ionViewWillLeave called - clearing timeouts & back button');
    this.clearTimeouts();
    this.clearBackButton();
  }

  ngOnInit() {
    console.log('[DEBUG] MatchingPage ngOnInit called');
  }

  ngOnDestroy() {
    console.log('[DEBUG] MatchingPage ngOnDestroy called - clearing timeouts & back button');
    this.clearTimeouts();
    this.clearBackButton();
  }

  private clearTimeouts() {
    if (this.endGameTimeout) {
      clearTimeout(this.endGameTimeout);
      this.endGameTimeout = null;
    }
    if (this.resetWrongTimeout) {
      clearTimeout(this.resetWrongTimeout);
      this.resetWrongTimeout = null;
    }
  }

  private async setupBackButton() {
    this.clearBackButton();
    this.backButtonListener = await App.addListener('backButton', () => {
      console.log('[DEBUG] MatchingPage hardware back button pressed, navigating home');
      this.router.navigate(['/home']);
    });
  }

  private clearBackButton() {
    if (this.backButtonListener) {
      this.backButtonListener.remove();
      this.backButtonListener = null;
    }
  }

  restartGame() {
    console.log('[DEBUG] MatchingPage restartGame() called');
    this.selectedEn = '';
    this.selectedId = '';
    this.matchedPairs = [];
    this.wrongPair = [];
    this.score = 0;
    this.mistakes = 0;
    this.gameOver = false;
    this.isProcessing = false;
    this.clearTimeouts();
    
    this.loadQuestions();
  }

  loadQuestions() {
    console.log('[DEBUG] MatchingPage loadQuestions() called');
    this.pairs = this.vocabService.getMatchSet();
    console.log('[DEBUG] MatchingPage pairs loaded. Count (questions.length):', this.pairs?.length);
    this.englishWords = this.pairs
      .map(p => p.en)
      .sort(() => Math.random() - 0.5);
    this.indonesianWords = this.pairs
      .map(p => p.id)
      .sort(() => Math.random() - 0.5);
  }

  get progress(): number {
    return this.pairs.length ? (this.matchedPairs.length / this.pairs.length) : 0;
  }

  selectEn(word: string) {
    if (this.isProcessing || this.gameOver) return;
    if (this.matchedPairs.includes(word)) return;
    
    this.soundService.playClick();
    if (this.selectedEn === word) {
      this.selectedEn = '';
    } else {
      this.selectedEn = word;
      this.tryMatch();
    }
  }

  selectId(word: string) {
    if (this.isProcessing || this.gameOver) return;
    if (this.matchedPairs.includes(
      this.pairs.find(p => p.id === word)?.en || ''
    )) return;

    this.soundService.playClick();
    if (this.selectedId === word) {
      this.selectedId = '';
    } else {
      this.selectedId = word;
      this.tryMatch();
    }
  }

  async tryMatch() {
    if (!this.selectedEn || !this.selectedId) return;

    const pair = this.pairs.find(p => p.en === this.selectedEn);
    const isCorrect = pair?.id === this.selectedId;

    if (isCorrect) {
      this.matchedPairs.push(this.selectedEn);
      this.score += 20;
      this.soundService.playCorrect();
      await this.showToast('✅ Match! +20', 'success');

      if (this.matchedPairs.length === this.pairs.length) {
        this.endGameTimeout = setTimeout(() => {
          this.endGameTimeout = null;
          this.endGame();
        }, 800);
      }
    } else {
      this.isProcessing = true;
      this.mistakes++;
      this.wrongPair = [this.selectedEn, this.selectedId];
      this.soundService.playWrong();
      await this.showToast('❌ Salah pasangan!', 'danger');
      this.resetWrongTimeout = setTimeout(() => {
        this.resetWrongTimeout = null;
        this.wrongPair = [];
        this.isProcessing = false;
      }, 600);
    }

    this.selectedEn = '';
    this.selectedId = '';
  }

  endGame() {
    console.log('[DEBUG] MatchingPage endGame() called');
    this.gameOver = true;
    const isWin = this.mistakes <= 3;
    if (isWin) this.soundService.playLevelUp();
    const result = this.gameService.buildResult(
      'matching',
      this.score,
      this.matchedPairs.length,
      this.pairs.length + this.mistakes,
      isWin
    );
    const { leveledUp } = this.playerService.applyResult(result);
    console.log('[DEBUG] Navigating to result page with result:', result);
    this.router.navigate(['/result'], { state: { result, leveledUp } });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 900,
      color,
      position: 'top'
    });
    await toast.present();
  }

  isMatched(word: string, type: 'en' | 'id'): boolean {
    if (type === 'en') return this.matchedPairs.includes(word);
    return this.matchedPairs.includes(
      this.pairs.find(p => p.id === word)?.en || ''
    );
  }

  isWrong(word: string): boolean {
    return this.wrongPair.includes(word);
  }

  getEnClass(word: string): string {
    if (this.isMatched(word, 'en')) return 'matched';
    if (this.isWrong(word)) return 'wrong';
    if (this.selectedEn === word) return 'selected';
    return '';
  }

  getIdClass(word: string): string {
    if (this.isMatched(word, 'id')) return 'matched';
    if (this.isWrong(word)) return 'wrong';
    if (this.selectedId === word) return 'selected';
    return '';
  }
}