import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentecesreportuserComponent } from './sentecesreportuser.component';

describe('SentecesreportuserComponent', () => {
  let component: SentecesreportuserComponent;
  let fixture: ComponentFixture<SentecesreportuserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SentecesreportuserComponent]
    });
    fixture = TestBed.createComponent(SentecesreportuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
