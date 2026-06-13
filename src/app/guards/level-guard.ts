import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PlayerService } from '../services/player';

@Injectable({
  providedIn: 'root'
})
export class LevelGuard implements CanActivate {
  private playerService = inject(PlayerService);
  private router = inject(Router);


  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredLevel = route.data['requiredLevel'] || 1;
    const player = this.playerService.getPlayer();

    if (player.level >= requiredLevel) {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
}