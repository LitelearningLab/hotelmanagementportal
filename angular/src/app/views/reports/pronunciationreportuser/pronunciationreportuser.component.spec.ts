import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PronunciationreportuserComponent } from './pronunciationreportuser.component';

describe('PronunciationreportuserComponent', () => {
  let component: PronunciationreportuserComponent;
  let fixture: ComponentFixture<PronunciationreportuserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PronunciationreportuserComponent]
    });
    fixture = TestBed.createComponent(PronunciationreportuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
