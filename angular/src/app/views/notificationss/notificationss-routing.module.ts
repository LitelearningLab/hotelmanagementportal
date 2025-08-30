import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddnotificationComponent } from './addnotification/addnotification.component';
import { NotificationlistComponent } from './notificationlist/notificationlist.component';


const routes: Routes = [
  {
    path: '',
    
    children: [
      {
        path: 'create',
        component: AddnotificationComponent,
        data: {
          title: 'Create'
        }
      },
     
      {
        path: 'list',
        component: NotificationlistComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'edit/:id',
        component: AddnotificationComponent,
        data: {
          title: 'Edit'
        }
      },
      // {
      //   path: 'edit/:id',
      //   component: AddedittrainersComponent,
      //   data: {
      //     title: 'Edit'
      //   }
      // },
      // {
      //   path: 'view/:id',
      //   component: AddedittrainersComponent,
      //   data: {
      //     title: 'Edit'
      //   }
      // },
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
  export class NotificationssRoutingModule { }
  