import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PronunciatonreportperdayComponent } from './pronunciatonreportperday.component';

describe('PronunciatonreportperdayComponent', () => {
  let component: PronunciatonreportperdayComponent;
  let fixture: ComponentFixture<PronunciatonreportperdayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PronunciatonreportperdayComponent]
    });
    fixture = TestBed.createComponent(PronunciatonreportperdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
