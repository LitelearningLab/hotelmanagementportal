import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PronunciationlabreportComponent } from './pronunciationlabreport.component';

describe('PronunciationlabreportComponent', () => {
  let component: PronunciationlabreportComponent;
  let fixture: ComponentFixture<PronunciationlabreportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PronunciationlabreportComponent]
    });
    fixture = TestBed.createComponent(PronunciationlabreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
