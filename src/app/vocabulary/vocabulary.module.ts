import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VocabularyPageRoutingModule } from './vocabulary-routing.module';

import { VocabularyPage } from './vocabulary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VocabularyPageRoutingModule
  ],
  declarations: [VocabularyPage]
})
export class VocabularyPageModule {}
