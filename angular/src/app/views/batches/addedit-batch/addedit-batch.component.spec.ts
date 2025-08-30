import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditBatchComponent } from './addedit-batch.component';

describe('AddeditBatchComponent', () => {
  let component: AddeditBatchComponent;
  let fixture: ComponentFixture<AddeditBatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddeditBatchComponent]
    });
    fixture = TestBed.createComponent(AddeditBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
