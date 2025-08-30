import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PronunciationlabreportsComponent } from './pronunciationlabreports/pronunciationlabreports.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgxIntlTelInputModule } from '@khazii/ngx-intl-tel-input';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonTableModule } from 'src/app/common-table/common-table.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReportsRoutingModule } from './reports-routing.module';
import { PronunciationreportuserComponent } from './pronunciationreportuser/pronunciationreportuser.component';
import { PronunciatonreportperdayComponent } from './pronunciatonreportperday/pronunciatonreportperday.component';
import { PronunciationreportwordsComponent } from './pronunciationreportwords/pronunciationreportwords.component';
import { SentenceslabreportsComponent } from './sentenceslabreports/sentenceslabreports.component';
import { SentecesreportuserComponent } from './sentecesreportuser/sentecesreportuser.component';
import { SentecesreportperdayComponent } from './sentecesreportperday/sentecesreportperday.component';
import { SenteceslabreportforsentenceComponent } from './senteceslabreportforsentence/senteceslabreportforsentence.component';
import { AccordionComponent } from 'src/app/shared/accordion.componet';
import { SentancedatesenarioComponent } from './sentancedatesenario/sentancedatesenario.component';



@NgModule({
  declarations: [
    PronunciationlabreportsComponent,
    PronunciationreportuserComponent,
    PronunciatonreportperdayComponent,
    PronunciationreportwordsComponent,
    SentenceslabreportsComponent,
    SentecesreportuserComponent,
    SentecesreportperdayComponent,
    SenteceslabreportforsentenceComponent,
    SentancedatesenarioComponent
  ],
  imports: [
  
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    NgxIntlTelInputModule,
    ImageCropperModule,
    NgSelectModule,
    CommonTableModule,
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ]
})
export class ReportsModule { }
