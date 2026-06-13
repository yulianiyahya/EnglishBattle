import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { VocabularyService } from '../services/vocabulary';
import { GameService } from '../services/game';
import { PlayerService } from '../services/player';
import { SoundService } from '../services/sound';
import { BlastWord } from '../models/word';

@Component({
  selector: 'app-word-blast',
  templateUrl: './word-blast.page.html',
  styleUrls: ['./word-blast.page.scss'],
  standalone: false,
})
export class WordBlastPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private vocabService = inject(VocabularyService);
  private gameService = inject(GameService);
  private playerService = inject(PlayerService);
  private soundService = inject(SoundService);
  private toastCtrl = inject(ToastController);

  private nextWordTimeout: any;
  private backButtonListener: any;

  words: BlastWord[] = [];
  currentIndex: number = 0;
  score: number = 0;
  correctCount: number = 0;
  wrongCount: number = 0;
  shuffledLetters: string[] = [];
  selectedLetters: string[] = [];
  selectedIndices: number[] = [];
  timeLeft: number = 15;
  timer: any;
  gameOver: boolean = false;
  feedback: string = '';
  answered: boolean = false;

  async ionViewWillEnter() {
    console.log('[DEBUG] WordBlastPage ionViewWillEnter called');
    this.restartGame();
    await this.setupBackButton();
  }

  ionViewDidEnter() {
    console.log('[DEBUG] WordBlastPage ionViewDidEnter called');
  }

  ionViewWillLeave() {
    console.log('[DEBUG] WordBlastPage ionViewWillLeave called - clearing timeouts & back button');
    this.clearTimer();
    this.clearNextWordTimeout();
    this.clearBackButton();
  }

  ngOnInit() {
    console.log('[DEBUG] WordBlastPage ngOnInit called');
  }

  ngOnDestroy() {
    console.log('[DEBUG] WordBlastPage ngOnDestroy called - clearing timeouts & back button');
    this.clearTimer();
    this.clearNextWordTimeout();
    this.clearBackButton();
  }

  private clearNextWordTimeout() {
    if (this.nextWordTimeout) {
      clearTimeout(this.nextWordTimeout);
      this.nextWordTimeout = null;
    }
  }

  private async setupBackButton() {
    this.clearBackButton();
    this.backButtonListener = await App.addListener('backButton', () => {
      console.log('[DEBUG] WordBlastPage hardware back button pressed, navigating home');
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
    console.log('[DEBUG] WordBlastPage restartGame() called');
    this.currentIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.gameOver = false;
    this.feedback = '';
    this.answered = false;
    this.selectedLetters = [];
    this.selectedIndices = [];
    this.clearTimer();
    this.clearNextWordTimeout();
    
    this.loadGameData();
  }

  loadGameData() {
    console.log('[DEBUG] WordBlastPage loadGameData() called');
    this.words = this.vocabService.getBlastWords();
    console.log('[DEBUG] WordBlastPage words loaded. Count (questions.length):', this.words?.length);
    this.loadWord();
  }

  get currentWord(): BlastWord {
    const word = this.words[this.currentIndex];
    console.log('[DEBUG] WordBlastPage currentWord getter. Index:', this.currentIndex, 'Word (currentQuestion):', word?.word);
    return word;
  }

  get progress(): number {
    return this.words.length ? (this.currentIndex / this.words.length) : 0;
  }

  get userAnswer(): string {
    return this.selectedLetters.join('');
  }

  loadWord() {
    if (!this.currentWord) return;
    const original = this.currentWord.word;
    let shuffled = original.split('');
    
    if (original.length > 1) {
      let attempts = 0;
      while (attempts < 20) {
        // Fisher-Yates Shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Ensure it is not the same as the original word
        if (shuffled.join('') !== original) {
          break;
        }
        attempts++;
      }
    }

    this.shuffledLetters = shuffled;
    this.selectedLetters = [];
    this.selectedIndices = [];
    this.timeLeft = 15;
    this.answered = false;
    this.startTimer();
  }

  startTimer() {
    this.clearTimer();
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.clearTimer();
        this.handleWrong(true);
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  selectLetter(letter: string, index: number) {
    if (this.answered) return;
    if (this.selectedIndices.includes(index)) return;
    this.soundService.playClick();
    this.selectedLetters.push(letter);
    this.selectedIndices.push(index);

    if (this.selectedLetters.length === this.currentWord.word.length) {
      this.answered = true;
      this.checkAnswer();
    }
  }

  removeLast() {
    if (this.answered) return;
    if (this.selectedLetters.length === 0) return;
    this.selectedLetters.pop();
    this.selectedIndices.pop();
  }

  async checkAnswer() {
    this.clearTimer();
    const answer = this.userAnswer;
    const correct = this.currentWord.word;

    if (answer === correct) {
      const points = 15;
      this.score += points;
      this.correctCount++;
      this.soundService.playCorrect();
      this.feedback = `✅ CORRECT! +${points}`;
      await this.showToast(this.feedback, 'success');
    } else {
      await this.handleWrong(true);
      return;
    }

    this.nextWord();
  }

  async handleWrong(force = false) {
    if (this.answered && !force) return;
    this.clearTimer();
    this.answered = true;
    this.wrongCount++;
    this.soundService.playWrong();
    this.feedback = `❌ Jawaban: ${this.currentWord.word}`;
    await this.showToast(this.feedback, 'danger');
    this.nextWord();
  }

  nextWord() {
    this.nextWordTimeout = setTimeout(() => {
      this.nextWordTimeout = null;
      if (this.currentIndex + 1 >= this.words.length) {
        this.endGame();
      } else {
        this.currentIndex++;
        this.loadWord();
      }
    }, 1200);
  }

  endGame() {
    console.log('[DEBUG] WordBlastPage endGame() called');
    this.gameOver = true;
    const isWin = this.correctCount >= Math.floor(this.words.length * 0.6);
    if (isWin) this.soundService.playLevelUp();
    const result = this.gameService.buildResult(
      'word-blast',
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

  isSelected(index: number): boolean {
    return this.selectedIndices.includes(index);
  }
}