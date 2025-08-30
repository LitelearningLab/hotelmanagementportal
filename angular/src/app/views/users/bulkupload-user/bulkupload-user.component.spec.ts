import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkuploadUserComponent } from './bulkupload-user.component';

describe('BulkuploadUserComponent', () => {
  let component: BulkuploadUserComponent;
  let fixture: ComponentFixture<BulkuploadUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulkuploadUserComponent]
    });
    fixture = TestBed.createComponent(BulkuploadUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
