import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationssRoutingModule } from './notificationss-routing.module';
import { AddnotificationComponent } from './addnotification/addnotification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgxIntlTelInputModule } from '@khazii/ngx-intl-tel-input';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonTableModule } from 'src/app/common-table/common-table.module';
import { NotificationlistComponent } from './notificationlist/notificationlist.component';



@NgModule({
  declarations: [
    AddnotificationComponent,
    NotificationlistComponent
  ],
  imports: [
    CommonModule,
    NotificationssRoutingModule,
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
export class NotificationssModule { }
