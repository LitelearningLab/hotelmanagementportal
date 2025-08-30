import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningreportComponent } from './learningreport.component';

describe('LearningreportComponent', () => {
  let component: LearningreportComponent;
  let fixture: ComponentFixture<LearningreportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearningreportComponent]
    });
    fixture = TestBed.createComponent(LearningreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
