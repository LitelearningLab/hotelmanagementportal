import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalkthroughRoutingModule } from './walkthrough-routing.module';
import { WalkthroughListComponent } from './walkthrough-list/walkthrough-list.component';
import { AddEditWalkthroughComponent } from './add-edit-walkthrough/add-edit-walkthrough.component';
import { CommonTableModule } from 'src/app/common-table/common-table.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WalkthroughListComponent,
    AddEditWalkthroughComponent
  ],
  imports: [
    CommonModule,
    WalkthroughRoutingModule,
    CommonTableModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class WalkthroughModule { }
