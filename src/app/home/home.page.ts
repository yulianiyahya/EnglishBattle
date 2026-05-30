import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../services/player';
import { Player } from '../models/player';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  player!: Player;
  xpProgress: number = 0;
  dailyStreak: number = 0;
  lastPlayedDate: string = '';

  constructor(
    private router: Router,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    this.loadPlayer();
  }

  ionViewWillEnter() {
    this.loadPlayer();
  }

  loadPlayer() {
    this.player = this.playerService.getPlayer();
    this.xpProgress = this.playerService.xpProgress(this.player.xp);
    this.loadStreak();
  }

  loadStreak() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('eb_streak');
    const data = stored ? JSON.parse(stored) : { streak: 0, lastDate: '' };
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (data.lastDate === today) {
      this.dailyStreak = data.streak;
    } else if (data.lastDate === yesterday) {
      const newStreak = data.streak + 1;
      localStorage.setItem('eb_streak', JSON.stringify({
        streak: newStreak,
        lastDate: today
      }));
      this.dailyStreak = newStreak;
    } else {
      this.dailyStreak = 0;
      localStorage.setItem('eb_streak', JSON.stringify({
        streak: 0,
        lastDate: ''
      }));
    }

    this.lastPlayedDate = data.lastDate;
  }

  goTo(page: string) {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('eb_streak');
    const data = stored ? JSON.parse(stored) : { streak: 0, lastDate: '' };

    if (data.lastDate !== today) {
      localStorage.setItem('eb_streak', JSON.stringify({
        streak: this.dailyStreak,
        lastDate: today
      }));
    }

    this.router.navigate([`/${page}`]);
  }

  resetProgress() {
    this.playerService.resetPlayer();
    localStorage.removeItem('eb_streak');
    this.loadPlayer();
  }

  getStreakEmoji(): string {
    if (this.dailyStreak >= 100) return '🏆';
    if (this.dailyStreak >= 60) return '🌟';
    if (this.dailyStreak >= 30) return '👑';
    if (this.dailyStreak >= 14) return '💎';
    if (this.dailyStreak >= 7) return '🔥';
    if (this.dailyStreak >= 3) return '⚡';
    if (this.dailyStreak >= 1) return '✨';
    return '💤';
  }

  getStreakMessage(): string {
    if (this.dailyStreak >= 100) return 'Legenda Sejati!';
    if (this.dailyStreak >= 60) return 'Luar biasa sekali!';
    if (this.dailyStreak >= 30) return 'Master!';
    if (this.dailyStreak >= 14) return 'Luar biasa!';
    if (this.dailyStreak >= 7) return 'Keren banget!';
    if (this.dailyStreak >= 3) return 'Terus semangat!';
    if (this.dailyStreak >= 1) return 'Bagus!';
    return 'Mulai hari ini!';
  }

  getNextMilestone(): number {
    const milestones = [3, 7, 14, 30, 60, 100];
    return milestones.find(m => m > this.dailyStreak) || this.dailyStreak + 10;
  }

  getMilestoneProgress(): number {
    const milestones = [3, 7, 14, 30, 60, 100];
    const next = milestones.find(m => m > this.dailyStreak) || this.dailyStreak + 10;
    const prev = [...milestones].reverse().find(m => m <= this.dailyStreak) || 0;
    return (this.dailyStreak - prev) / (next - prev);
  }
}