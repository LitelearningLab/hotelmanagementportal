import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentancedatesenarioComponent } from './sentancedatesenario.component';

describe('SentancedatesenarioComponent', () => {
  let component: SentancedatesenarioComponent;
  let fixture: ComponentFixture<SentancedatesenarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SentancedatesenarioComponent]
    });
    fixture = TestBed.createComponent(SentancedatesenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
