import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanySubadminComponent } from './add-company-subadmin.component';

describe('AddCompanySubadminComponent', () => {
  let component: AddCompanySubadminComponent;
  let fixture: ComponentFixture<AddCompanySubadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCompanySubadminComponent]
    });
    fixture = TestBed.createComponent(AddCompanySubadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
