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
import { FeedbackreportComponent } from './feedbackreport/feedbackreport.component';

import { StarRatingModule } from 'angular-star-rating';
import { CollapseModule } from "ngx-bootstrap/collapse";

@NgModule({
  declarations: [
    PronunciationlabreportComponent,
    SentenceslabreportComponent,
    LearningreportComponent,
    FeedbackreportComponent
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
    DxTemplateModule,
    StarRatingModule.forRoot(),
    CollapseModule
]
})
export class ReportsNewModule { }
