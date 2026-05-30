import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WordBlastPage } from './word-blast.page';

describe('WordBlastPage', () => {
  let component: WordBlastPage;
  let fixture: ComponentFixture<WordBlastPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WordBlastPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
