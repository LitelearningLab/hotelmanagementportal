import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchListComponent } from './batch-list/batch-list.component';
import { AddeditBatchComponent } from './addedit-batch/addedit-batch.component';
import { BatchesRoutingModule } from './batches-routing.modules';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonTableModule } from 'src/app/common-table/common-table.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CompanyComponent } from './company/company.component';
import { BatchUsersComponent } from './batch-users/batch-users.component';
import { AddEditBatchComponent } from './add-edit-batch/add-edit-batch.component';
import { AdduserComponent } from './adduser/adduser.component';
import { DxDataGridModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    BatchListComponent,
    AddeditBatchComponent,
    CompanyComponent,
    BatchUsersComponent,
    AddEditBatchComponent,
    AdduserComponent
  ],
  imports: [
    CommonModule,
    BatchesRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonTableModule,
    EditorModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    DxDataGridModule
  ]
})
export class BatchesModule { }
