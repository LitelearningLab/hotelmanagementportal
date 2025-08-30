import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySubadminListComponent } from './company-subadmin-list.component';

describe('CompanySubadminListComponent', () => {
  let component: CompanySubadminListComponent;
  let fixture: ComponentFixture<CompanySubadminListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanySubadminListComponent]
    });
    fixture = TestBed.createComponent(CompanySubadminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
