import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenteceslabreportforsentenceComponent } from './senteceslabreportforsentence.component';

describe('SenteceslabreportforsentenceComponent', () => {
  let component: SenteceslabreportforsentenceComponent;
  let fixture: ComponentFixture<SenteceslabreportforsentenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SenteceslabreportforsentenceComponent]
    });
    fixture = TestBed.createComponent(SenteceslabreportforsentenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
