import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { AddeditCompaniesComponent } from './addedit-companies/addedit-companies.component';
import { CompanyRoutingModule } from './companies-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonTableModule } from 'src/app/common-table/common-table.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddCompanySubadminComponent } from './add-company-subadmin/add-company-subadmin.component';
import { CompanySubadminListComponent } from './company-subadmin-list/company-subadmin-list.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxIntlTelInputModule } from '@khazii/ngx-intl-tel-input';


@NgModule({
  declarations: [
    ListCompaniesComponent,
    AddeditCompaniesComponent,
    AddCompanySubadminComponent,
    CompanySubadminListComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    NgxIntlTelInputModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    CommonTableModule,
    EditorModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class CompaniesModule { }
