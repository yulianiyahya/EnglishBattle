import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { VocabularyService } from '../services/vocabulary';
import { GameService } from '../services/game';
import { PlayerService } from '../services/player';
import { VocabWord } from '../models/word';

@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.page.html',
  styleUrls: ['./vocabulary.page.scss'],
  standalone: false,
})
export class VocabularyPage implements OnInit {

  words: VocabWord[] = [];
  currentIndex: number = 0;
  score: number = 0;
  streak: number = 0;
  lives: number = 3;
  correctCount: number = 0;
  isHard: boolean = false;
  answered: boolean = false;
  selectedOption: string = '';
  gameOver: boolean = false;
  feedback: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private vocabService: VocabularyService,
    private gameService: GameService,
    private playerService: PlayerService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.isHard = this.router.url.includes('vocabulary-hard');
    this.words = this.isHard
      ? this.vocabService.getVocabHard()
      : this.vocabService.getVocabEasy();
  }

  get currentWord(): VocabWord {
    return this.words[this.currentIndex];
  }

  get progress(): number {
    return (this.currentIndex / this.words.length);
  }

  async selectAnswer(option: string) {
    if (this.answered) return;

    this.answered = true;
    this.selectedOption = option;
    const isCorrect = option === this.currentWord.translation;

    if (isCorrect) {
      this.streak++;
      const points = this.gameService.calcStreakBonus(this.streak, 10);
      this.score += points;
      this.correctCount++;
      this.feedback = this.streak >= 3 ? `🔥 STREAK x${this.streak}! +${points}` : '✅ CORRECT!';
      await this.showToast(this.feedback, 'success');
    } else {
      this.streak = 0;
      this.lives--;
      this.feedback = `❌ WRONG! Jawaban: ${this.currentWord.translation}`;
      await this.showToast(this.feedback, 'danger');
    }

    setTimeout(() => {
      if (this.lives <= 0) {
        this.endGame();
      } else if (this.currentIndex + 1 >= this.words.length) {
        this.endGame();
      } else {
        this.currentIndex++;
        this.answered = false;
        this.selectedOption = '';
        this.feedback = '';
      }
    }, 1200);
  }

  endGame() {
    this.gameOver = true;
    const isWin = this.lives > 0 && this.correctCount >= Math.floor(this.words.length * 0.6);
    const result = this.gameService.buildResult(
      this.isHard ? 'vocab-hard' : 'vocab-easy',
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

  getOptionClass(option: string): string {
    if (!this.answered) return '';
    if (option === this.currentWord.translation) return 'correct';
    if (option === this.selectedOption) return 'wrong';
    return '';
  }
}