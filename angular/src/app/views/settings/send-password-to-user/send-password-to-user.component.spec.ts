import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPasswordToUserComponent } from './send-password-to-user.component';

describe('SendPasswordToUserComponent', () => {
  let component: SendPasswordToUserComponent;
  let fixture: ComponentFixture<SendPasswordToUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendPasswordToUserComponent]
    });
    fixture = TestBed.createComponent(SendPasswordToUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
