import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { VocabularyService } from '../services/vocabulary';
import { GameService } from '../services/game';
import { PlayerService } from '../services/player';
import { BlastWord } from '../models/word';

@Component({
  selector: 'app-word-blast',
  templateUrl: './word-blast.page.html',
  styleUrls: ['./word-blast.page.scss'],
  standalone: false,
})
export class WordBlastPage implements OnInit, OnDestroy {

  words: BlastWord[] = [];
  currentIndex: number = 0;
  score: number = 0;
  streak: number = 0;
  correctCount: number = 0;
  shuffledLetters: string[] = [];
  selectedLetters: string[] = [];
  selectedIndices: number[] = [];
  timeLeft: number = 15;
  timer: any;
  gameOver: boolean = false;
  feedback: string = '';
  showFeedback: boolean = false;

  constructor(
    private router: Router,
    private vocabService: VocabularyService,
    private gameService: GameService,
    private playerService: PlayerService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.words = this.vocabService.getBlastWords();
    this.loadWord();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  get currentWord(): BlastWord {
    return this.words[this.currentIndex];
  }

  get progress(): number {
    return this.currentIndex / this.words.length;
  }

  get userAnswer(): string {
    return this.selectedLetters.join('');
  }

  loadWord() {
    this.shuffledLetters = this.currentWord.word
      .split('')
      .sort(() => Math.random() - 0.5);
    this.selectedLetters = [];
    this.selectedIndices = [];
    this.timeLeft = 15;
    this.startTimer();
  }

  startTimer() {
    this.clearTimer();
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.clearTimer();
        this.handleWrong();
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
    if (this.selectedIndices.includes(index)) return;
    this.selectedLetters.push(letter);
    this.selectedIndices.push(index);

    if (this.selectedLetters.length === this.currentWord.word.length) {
      this.checkAnswer();
    }
  }

  removeLast() {
    if (this.selectedLetters.length === 0) return;
    this.selectedLetters.pop();
    this.selectedIndices.pop();
  }

  async checkAnswer() {
    this.clearTimer();
    const answer = this.userAnswer;
    const correct = this.currentWord.word;

    if (answer === correct) {
      this.streak++;
      const points = this.gameService.calcStreakBonus(this.streak, 15);
      this.score += points;
      this.correctCount++;
      this.feedback = this.streak >= 3 ? `🔥 STREAK x${this.streak}! +${points}` : `✅ CORRECT! +${points}`;
      await this.showToast(this.feedback, 'success');
    } else {
      await this.handleWrong();
      return;
    }

    this.nextWord();
  }

  async handleWrong() {
    this.streak = 0;
    this.feedback = `❌ Jawaban: ${this.currentWord.word}`;
    await this.showToast(this.feedback, 'danger');
    this.nextWord();
  }

  nextWord() {
    setTimeout(() => {
      if (this.currentIndex + 1 >= this.words.length) {
        this.endGame();
      } else {
        this.currentIndex++;
        this.loadWord();
      }
    }, 1200);
  }

  endGame() {
    this.gameOver = true;
    const isWin = this.correctCount >= Math.floor(this.words.length * 0.6);
    const result = this.gameService.buildResult(
      'word-blast',
      this.score,
      this.correctCount,
      this.words.length,
      isWin
    );
    const { leveledUp } = this.playerService.applyResult(result);
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