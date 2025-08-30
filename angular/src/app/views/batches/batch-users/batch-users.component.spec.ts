import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchUsersComponent } from './batch-users.component';

describe('BatchUsersComponent', () => {
  let component: BatchUsersComponent;
  let fixture: ComponentFixture<BatchUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BatchUsersComponent]
    });
    fixture = TestBed.createComponent(BatchUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
