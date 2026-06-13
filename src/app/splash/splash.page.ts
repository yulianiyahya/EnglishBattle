import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: false,
})
export class SplashPage implements OnInit, OnDestroy {
  private router = inject(Router);

  showContent = false;
  loadingProgress = 0;
  private intervalId: any;
  private showContentTimeout: any;
  private redirectTimeout: any;

  ngOnInit() {
    this.showContentTimeout = setTimeout(() => {
      this.showContentTimeout = null;
      this.showContent = true;
    }, 100);

    // Animasi loading bar
    this.intervalId = setInterval(() => {
      this.loadingProgress += 2;
      if (this.loadingProgress >= 100) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.redirectTimeout = setTimeout(() => {
          this.redirectTimeout = null;
          this.router.navigate(['/home'], { replaceUrl: true });
        }, 300);
      }
    }, 50); // 50ms x 50 steps = ~2.5 detik
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.showContentTimeout) {
      clearTimeout(this.showContentTimeout);
      this.showContentTimeout = null;
    }
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout);
      this.redirectTimeout = null;
    }
  }
}