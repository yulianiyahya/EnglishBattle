import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WordBlastPageRoutingModule } from './word-blast-routing.module';

import { WordBlastPage } from './word-blast.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WordBlastPageRoutingModule
  ],
  declarations: [WordBlastPage]
})
export class WordBlastPageModule {}
