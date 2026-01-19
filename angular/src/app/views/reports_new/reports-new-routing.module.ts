import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PronunciationlabreportComponent  } from './pronunciationlabreport/pronunciationlabreport.component';
import { SentenceslabreportComponent } from './sentenceslabreport/sentenceslabreport.component';
import { LearningreportComponent } from './learningreport/learningreport.component';
import { FeedbackreportComponent } from './feedbackreport/feedbackreport.component';



const routes: Routes = [
  {
    path: '',
    // component: UsersComponent,
    children: [
      {
        path: 'pronunciationlabreports',
        component: PronunciationlabreportComponent,
        data: {
          title: 'Pronunciation Lab Report'
        }
      }, 
      {
        path: 'sentenceslabreports',
        component: SentenceslabreportComponent,
        data: {
          title: 'Sentence Lab Report'
        }
      },
      {
        path: 'learninghoursreports',
        component: LearningreportComponent,
        data: {
          title: 'Learning Hours Report'
        }
      },
      {
        path: 'feedbackreports',
        component: FeedbackreportComponent,
        data: {
          title: 'Feedback Report'
        }
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsNewRoutingModule { }