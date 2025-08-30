import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenceslabreportComponent } from './sentenceslabreport.component';

describe('SentenceslabreportComponent', () => {
  let component: SentenceslabreportComponent;
  let fixture: ComponentFixture<SentenceslabreportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SentenceslabreportComponent]
    });
    fixture = TestBed.createComponent(SentenceslabreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
