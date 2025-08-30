import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedittrainersComponent } from './addedittrainers.component';

describe('AddedittrainersComponent', () => {
  let component: AddedittrainersComponent;
  let fixture: ComponentFixture<AddedittrainersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddedittrainersComponent]
    });
    fixture = TestBed.createComponent(AddedittrainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
