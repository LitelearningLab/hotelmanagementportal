import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentecesreportperdayComponent } from './sentecesreportperday.component';

describe('SentecesreportperdayComponent', () => {
  let component: SentecesreportperdayComponent;
  let fixture: ComponentFixture<SentecesreportperdayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SentecesreportperdayComponent]
    });
    fixture = TestBed.createComponent(SentecesreportperdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
