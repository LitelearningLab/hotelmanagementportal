import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerslistComponent } from './trainerslist/trainerslist.component';
import { AddedittrainersComponent } from './addedittrainers/addedittrainers.component';
import { TrainersRoutingModule } from './trainers-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgxIntlTelInputModule } from '@khazii/ngx-intl-tel-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonTableModule } from 'src/app/common-table/common-table.module';
import { TabsModule } from 'ngx-bootstrap/tabs';



@NgModule({
  declarations: [
    TrainerslistComponent,
    AddedittrainersComponent
  ],
  imports: [
    CommonModule,
    TrainersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    NgxIntlTelInputModule,
    TabsModule,
    NgSelectModule,
    CommonTableModule,
  ]
})
export class TrainersModule { }
