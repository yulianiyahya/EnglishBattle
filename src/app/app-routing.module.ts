import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LevelGuard } from './guards/level-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'vocabulary',
    loadChildren: () => import('./vocabulary/vocabulary.module').then(m => m.VocabularyPageModule)
  },
  {
    path: 'word-blast',
    loadChildren: () => import('./word-blast/word-blast.module').then(m => m.WordBlastPageModule)
  },
  {
    path: 'matching',
    loadChildren: () => import('./matching/matching.module').then(m => m.MatchingPageModule)
  },
  {
    path: 'result',
    loadChildren: () => import('./result/result.module').then(m => m.ResultPageModule)
  },
  {
    path: 'vocabulary-hard',
    canActivate: [LevelGuard],
    data: { requiredLevel: 3 },
    loadChildren: () => import('./vocabulary/vocabulary.module').then(m => m.VocabularyPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}