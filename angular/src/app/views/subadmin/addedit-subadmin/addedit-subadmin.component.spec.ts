import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditSubadminComponent } from './addedit-subadmin.component';

describe('AddeditSubadminComponent', () => {
  let component: AddeditSubadminComponent;
  let fixture: ComponentFixture<AddeditSubadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddeditSubadminComponent]
    });
    fixture = TestBed.createComponent(AddeditSubadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
