import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsNewRoutingModule } from './reports-new-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxIntlTelInputModule } from '@khazii/ngx-intl-tel-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { RouterModule } from '@angular/router';
import { PronunciationlabreportComponent } from './pronunciationlabreport/pronunciationlabreport.component';

import { SentenceslabreportComponent } from './sentenceslabreport/sentenceslabreport.component';
import { LearningreportComponent } from './learningreport/learningreport.component';
import { DxDataGridModule } from 'devextreme-angular';
import { DxPopupModule, DxButtonModule, DxTemplateModule  } from 'devextreme-angular';
@NgModule({
  declarations: [
    PronunciationlabreportComponent,
    SentenceslabreportComponent,
    LearningreportComponent
  ],
  imports: [
    CommonModule,
    ReportsNewRoutingModule,
     FormsModule,
     ReactiveFormsModule,
     RouterModule,
     NgxIntlTelInputModule,
     NgSelectModule,
     TabsModule.forRoot(),
     BsDatepickerModule.forRoot(),
     DxDataGridModule,
     DxPopupModule,
     DxButtonModule,
     DxTemplateModule
     
  ]
})
export class ReportsNewModule { }
