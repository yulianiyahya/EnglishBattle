import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { PlayerService } from '../services/player';
import { Player } from '../models/player';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  private router = inject(Router);
  private playerService = inject(PlayerService);

  player!: Player;
  xpProgress: number = 0;
  private backButtonListener: any;

  ngOnInit() {
    this.loadPlayer();
  }

  async ionViewWillEnter() {
    this.loadPlayer();
    await this.setupBackButton();
  }

  ionViewWillLeave() {
    this.clearBackButton();
  }

  ngOnDestroy() {
    this.clearBackButton();
  }

  private async setupBackButton() {
    this.clearBackButton();
    this.backButtonListener = await App.addListener('backButton', () => {
      console.log('[DEBUG] HomePage hardware back button pressed, minimizing app');
      App.minimizeApp();
    });
  }

  private clearBackButton() {
    if (this.backButtonListener) {
      this.backButtonListener.remove();
      this.backButtonListener = null;
    }
  }

  loadPlayer() {
    this.player = this.playerService.getPlayer();
    this.xpProgress = this.playerService.xpProgress(this.player.xp);
  }

  goTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}