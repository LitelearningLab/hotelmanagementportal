import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditCompaniesComponent } from './addedit-companies.component';

describe('AddeditCompaniesComponent', () => {
  let component: AddeditCompaniesComponent;
  let fixture: ComponentFixture<AddeditCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddeditCompaniesComponent]
    });
    fixture = TestBed.createComponent(AddeditCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
