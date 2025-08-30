import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PronunciationreportwordsComponent } from './pronunciationreportwords.component';

describe('PronunciationreportwordsComponent', () => {
  let component: PronunciationreportwordsComponent;
  let fixture: ComponentFixture<PronunciationreportwordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PronunciationreportwordsComponent]
    });
    fixture = TestBed.createComponent(PronunciationreportwordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
