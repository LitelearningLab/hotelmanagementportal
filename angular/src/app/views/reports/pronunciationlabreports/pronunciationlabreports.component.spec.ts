import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PronunciationlabreportsComponent } from './pronunciationlabreports.component';

describe('PronunciationlabreportsComponent', () => {
  let component: PronunciationlabreportsComponent;
  let fixture: ComponentFixture<PronunciationlabreportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PronunciationlabreportsComponent]
    });
    fixture = TestBed.createComponent(PronunciationlabreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
