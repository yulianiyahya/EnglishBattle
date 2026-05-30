import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WordBlastPage } from './word-blast.page';

const routes: Routes = [
  {
    path: '',
    component: WordBlastPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WordBlastPageRoutingModule {}
