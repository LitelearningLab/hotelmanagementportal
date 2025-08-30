import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainerslistComponent } from './trainerslist/trainerslist.component';
import { AddedittrainersComponent } from './addedittrainers/addedittrainers.component';

const routes: Routes = [
  {
    path: '',
    
    children: [
      {
        path: 'list',
        component: TrainerslistComponent,
        data: {
          title: 'List'
        }
      },
     
      {
        path: 'add',
        component: AddedittrainersComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'edit/:id',
        component: AddedittrainersComponent,
        data: {
          title: 'Edit'
        }
      },
      {
        path: 'view/:id',
        component: AddedittrainersComponent,
        data: {
          title: 'View'
        }
      },
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
export class TrainersRoutingModule { }
