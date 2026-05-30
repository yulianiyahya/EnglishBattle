import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { VocabularyService } from '../services/vocabulary';
import { GameService } from '../services/game';
import { PlayerService } from '../services/player';
import { MatchPair } from '../models/word';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.page.html',
  styleUrls: ['./matching.page.scss'],
  standalone: false,
})
export class MatchingPage implements OnInit {

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

  constructor(
    private router: Router,
    private vocabService: VocabularyService,
    private gameService: GameService,
    private playerService: PlayerService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.pairs = this.vocabService.getMatchSet();
    this.englishWords = this.pairs
      .map(p => p.en)
      .sort(() => Math.random() - 0.5);
    this.indonesianWords = this.pairs
      .map(p => p.id)
      .sort(() => Math.random() - 0.5);
  }

  get progress(): number {
    return this.matchedPairs.length / this.pairs.length;
  }

  selectEn(word: string) {
    if (this.matchedPairs.includes(word)) return;
    this.selectedEn = word;
    this.tryMatch();
  }

  selectId(word: string) {
    if (this.matchedPairs.includes(
      this.pairs.find(p => p.id === word)?.en || ''
    )) return;
    this.selectedId = word;
    this.tryMatch();
  }

  async tryMatch() {
    if (!this.selectedEn || !this.selectedId) return;

    const pair = this.pairs.find(p => p.en === this.selectedEn);
    const isCorrect = pair?.id === this.selectedId;

    if (isCorrect) {
      this.matchedPairs.push(this.selectedEn);
      this.score += 20;
      await this.showToast('✅ Match! +20', 'success');

      if (this.matchedPairs.length === this.pairs.length) {
        setTimeout(() => this.endGame(), 800);
      }
    } else {
      this.mistakes++;
      this.wrongPair = [this.selectedEn, this.selectedId];
      await this.showToast('❌ Salah pasangan!', 'danger');
      setTimeout(() => {
        this.wrongPair = [];
      }, 600);
    }

    this.selectedEn = '';
    this.selectedId = '';
  }

  endGame() {
    this.gameOver = true;
    const isWin = this.mistakes <= 3;
    const result = this.gameService.buildResult(
      'matching',
      this.score,
      this.matchedPairs.length,
      this.pairs.length,
      isWin
    );
    const { leveledUp } = this.playerService.applyResult(result);
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