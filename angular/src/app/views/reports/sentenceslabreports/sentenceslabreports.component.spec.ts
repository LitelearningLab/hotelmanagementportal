import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenceslabreportsComponent } from './sentenceslabreports.component';

describe('SentenceslabreportsComponent', () => {
  let component: SentenceslabreportsComponent;
  let fixture: ComponentFixture<SentenceslabreportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SentenceslabreportsComponent]
    });
    fixture = TestBed.createComponent(SentenceslabreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
