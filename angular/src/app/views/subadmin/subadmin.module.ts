import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSubadminComponent } from './list-subadmin/list-subadmin.component';
import { AddeditSubadminComponent } from './addedit-subadmin/addedit-subadmin.component';
import { SubadminComponent } from './subadmin';
import { RouterModule } from '@angular/router';
import { SubAdminRoutingModule } from './subadmin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonTableModule } from 'src/app/common-table/common-table.module';
import { TabsModule } from 'ngx-bootstrap/tabs';




@NgModule({
  declarations: [
    ListSubadminComponent,
    AddeditSubadminComponent,
    SubadminComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SubAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonTableModule,
    TabsModule.forRoot(),
  
    
  ]
})
export class SubadminModule { }
