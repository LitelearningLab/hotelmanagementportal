import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchListComponent } from './batch-list/batch-list.component';
import { AddeditBatchComponent } from './addedit-batch/addedit-batch.component';
import { CompanyComponent } from './company/company.component';
import { BatchUsersComponent } from './batch-users/batch-users.component';
import { AddEditBatchComponent } from './add-edit-batch/add-edit-batch.component';
import { AdduserComponent } from './adduser/adduser.component';


const routes: Routes = [
  {
    path: '',
    // component: SubadminComponent,
    children: [
      {
        path: 'list',
        component: CompanyComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        component: AddEditBatchComponent,
        data: {
          title: 'Create Batch'
        }
      },
      {
        path: 'edit/:id',
        component: AddEditBatchComponent,
        data: {
          title: 'Create Batch'
        }
      },
      {
        path: 'batchlist/:id',
        component: BatchListComponent,
        data: { 
          title: 'List'
        }
      },
      {
        path: 'viewusers/:id',
        component: BatchUsersComponent,
        data: {
          title: 'Batch User'
        }
      },
      {
        path: 'adduser/:id',
        component: AdduserComponent,
        data: {
          title: 'Add User'
        }
      },
      {
        path: 'add',
        component: AddeditBatchComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'edit',
        component: BatchListComponent,
        data: {
          title: 'Edit'
        }
      },
      // {
      //   path: 'edit/:id',
      //   component: AddeditBatchComponent,
      //   data: {
      //     title: 'Edit'
      //   }
      // },
      {
        path: 'batchlist',
        component: BatchListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: '',
        redirectTo: 'batchlist',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchesRoutingModule { }
