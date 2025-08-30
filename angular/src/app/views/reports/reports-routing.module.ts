import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PronunciationlabreportsComponent } from './pronunciationlabreports/pronunciationlabreports.component';
import { PronunciationreportuserComponent } from './pronunciationreportuser/pronunciationreportuser.component';
import { PronunciatonreportperdayComponent } from './pronunciatonreportperday/pronunciatonreportperday.component';
import { PronunciationreportwordsComponent } from './pronunciationreportwords/pronunciationreportwords.component';
import { SentenceslabreportsComponent } from './sentenceslabreports/sentenceslabreports.component';
import { SentecesreportuserComponent } from './sentecesreportuser/sentecesreportuser.component';
import { SentecesreportperdayComponent } from './sentecesreportperday/sentecesreportperday.component';
import { SenteceslabreportforsentenceComponent } from './senteceslabreportforsentence/senteceslabreportforsentence.component';
import { SentancedatesenarioComponent } from './sentancedatesenario/sentancedatesenario.component';


const routes: Routes = [
  {
    path: '',
    // component: UsersComponent,
    children: [
      {
        path: 'pronunciationlabreports',
        component: PronunciationlabreportsComponent,
        data: {
          title: 'Pronunciation Lab Reports'
        }
      },
      {
        path: 'pronunciationlabreports/:id',
        component: PronunciationreportuserComponent,
        data: {
          title: 'Pronunciation Lab Reports'
        }
        
      },
      {
        path: 'pronunciationlabreports/:id/:date',
        component: PronunciatonreportperdayComponent,
        data: {
          title: 'Pronunciation Lab Reports'
        }
      },
      {
        path: 'pronunciationlabreports/:id/:date/:word',
        component: PronunciationreportwordsComponent,
        data: {
          title: 'Pronunciation Lab Reports'
        }
      },
      {
        path: 'sentenceslabreports',
        component: SentenceslabreportsComponent,
        data: {
          title: 'Sentences Lab Reports'
        }
      },
      {
        path: 'sentenceslabreports/:id',
        component: SentecesreportuserComponent,
        data: {
          title: 'Sentences Lab Reports'
        }
      },
      {
        path: 'sentenceslabreports/:id/:senarios',
        component: SentancedatesenarioComponent,
        data: {
          title: 'Sentences Lab Reports'
        }
      },

      {
        path: 'sentenceslabreports/:id/:senarios/:date',
        component: SentecesreportperdayComponent,
        data: {
          title: 'Sentences Lab Reports'
        }
      },
      {
        path: 'sentenceslabreports/:id/:senarios/:date/:sentences',
        component: SenteceslabreportforsentenceComponent,
        data: {
          title: 'Sentences Lab Reports'
        }
      },
    //   {
    //     path: 'subscribe',
    //     component: UserpendinglistComponent,
    //     data: {
    //       title: 'Subscribe User'
    //     }
    //   },
    //   {
    //     path: 'add',
    //     component: UseraddeditComponent,
    //     data: {
    //       title: 'Add'
    //     }
    //   },
    //   {
    //     path: 'edit/:id',
    //     component: UseraddeditComponent,
    //     data: {
    //       title: 'Edit'
    //     }
    //   },
    //   {
    //     path:"bulkupload",
    //     component:BulkuploadUserComponent,
    //     data:{
    //       title:"Bulk upload users"
    //     }
    //   },
    //   {
    //     path: 'view/:id',
    //     component: UseraddeditComponent,
    //     data: {
    //       title: 'View'
    //     }
    //   },
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
export class ReportsRoutingModule { }
