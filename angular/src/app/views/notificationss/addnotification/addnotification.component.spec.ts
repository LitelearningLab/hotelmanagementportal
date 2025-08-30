import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnotificationComponent } from './addnotification.component';

describe('AddnotificationComponent', () => {
  let component: AddnotificationComponent;
  let fixture: ComponentFixture<AddnotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddnotificationComponent]
    });
    fixture = TestBed.createComponent(AddnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
