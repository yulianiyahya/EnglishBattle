import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { App } from '@capacitor/app';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { VocabularyService } from '../services/vocabulary';
import { GameService } from '../services/game';
import { PlayerService } from '../services/player';
import { SoundService } from '../services/sound';
import { VocabWord } from '../models/word';

@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.page.html',
  styleUrls: ['./vocabulary.page.scss'],
  standalone: false,
})
export class VocabularyPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private vocabService = inject(VocabularyService);
  private gameService = inject(GameService);
  private playerService = inject(PlayerService);
  private soundService = inject(SoundService);
  private toastCtrl = inject(ToastController);

  private nextQuestionTimeout: any;
  private backButtonListener: any;

  words: VocabWord[] = [];
  currentIndex: number = 0;
  score: number = 0;
  lives: number = 3;
  correctCount: number = 0;
  wrongCount: number = 0;
  isHard: boolean = false;
  answered: boolean = false;
  selectedOption: string = '';
  gameOver: boolean = false;
  feedback: string = '';
  shuffledOptions: string[] = [];

  async ionViewWillEnter() {
    console.log('[DEBUG] VocabularyPage ionViewWillEnter called');
    this.restartGame();
    await this.setupBackButton();
  }

  ionViewDidEnter() {
    console.log('[DEBUG] VocabularyPage ionViewDidEnter called');
  }

  ionViewWillLeave() {
    console.log('[DEBUG] VocabularyPage ionViewWillLeave called - clearing timeouts & back button');
    this.clearNextQuestionTimeout();
    this.clearBackButton();
  }

  ngOnInit() {
    console.log('[DEBUG] VocabularyPage ngOnInit called');
  }

  ngOnDestroy() {
    console.log('[DEBUG] VocabularyPage ngOnDestroy called - clearing timeouts & back button');
    this.clearNextQuestionTimeout();
    this.clearBackButton();
  }

  private clearNextQuestionTimeout() {
    if (this.nextQuestionTimeout) {
      clearTimeout(this.nextQuestionTimeout);
      this.nextQuestionTimeout = null;
    }
  }

  private async setupBackButton() {
    this.clearBackButton();
    this.backButtonListener = await App.addListener('backButton', () => {
      console.log('[DEBUG] VocabularyPage hardware back button pressed, navigating home');
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
    console.log('[DEBUG] VocabularyPage restartGame() called');
    this.currentIndex = 0;
    this.score = 0;
    this.lives = 3;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.answered = false;
    this.selectedOption = '';
    this.gameOver = false;
    this.feedback = '';
    this.clearNextQuestionTimeout();
    
    this.loadVocabulary();
  }

  loadVocabulary() {
    console.log('[DEBUG] VocabularyPage loadVocabulary() called');
    this.isHard = this.router.url.includes('vocabulary-hard');
    console.log('[DEBUG] VocabularyPage url:', this.router.url, 'isHard:', this.isHard);

    this.words = this.isHard
      ? this.vocabService.getVocabHard()
      : this.vocabService.getVocabEasy();
    
    console.log('[DEBUG] VocabularyPage words loaded. Count (questions.length):', this.words?.length);
    this.shuffleOptions();
  }

  get currentWord(): VocabWord {
    const word = this.words[this.currentIndex];
    console.log('[DEBUG] VocabularyPage currentWord getter. Index:', this.currentIndex, 'Word (currentQuestion):', word?.word);
    return word;
  }

  get progress(): number {
    return this.words.length ? (this.currentIndex / this.words.length) : 0;
  }

  shuffleOptions() {
    if (this.currentWord) {
      this.shuffledOptions = [...this.currentWord.options]
        .sort(() => Math.random() - 0.5);
    }
  }

  async selectAnswer(option: string) {
    if (this.answered) return;

    this.answered = true;
    this.selectedOption = option;
    const isCorrect = option === this.currentWord.translation;

    if (isCorrect) {
      const points = 10;
      this.score += points;
      this.correctCount++;
      this.soundService.playCorrect();
      this.feedback = `✅ CORRECT! +${points}`;
      await this.showToast(this.feedback, 'success');
    } else {
      this.lives--;
      this.wrongCount++;
      this.soundService.playWrong();
      this.feedback = `❌ WRONG! Jawaban: ${this.currentWord.translation}`;
      await this.showToast(this.feedback, 'danger');
    }

    this.nextQuestionTimeout = setTimeout(() => {
      this.nextQuestionTimeout = null;
      if (this.lives <= 0) {
        this.endGame();
      } else if (this.currentIndex + 1 >= this.words.length) {
        this.endGame();
      } else {
        this.currentIndex++;
        this.answered = false;
        this.selectedOption = '';
        this.feedback = '';
        this.shuffleOptions();
      }
    }, 1200);
  }

  endGame() {
    console.log('[DEBUG] VocabularyPage endGame() called');
    this.gameOver = true;
    const isWin = this.lives > 0 &&
      this.correctCount >= Math.floor(this.words.length * 0.6);
    if (isWin) this.soundService.playLevelUp();
    const result = this.gameService.buildResult(
      this.isHard ? 'vocab-hard' : 'vocab-easy',
      this.score,
      this.correctCount,
      this.words.length,
      isWin
    );
    const { leveledUp } = this.playerService.applyResult(result);
    console.log('[DEBUG] Navigating to result page with result:', result);
    this.router.navigate(['/result'], { state: { result, leveledUp } });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  getOptionClass(option: string): string {
    if (!this.answered) return '';
    if (option === this.currentWord.translation) return 'correct';
    if (option === this.selectedOption) return 'wrong';
    return '';
  }
}