import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UseraddeditComponent } from './useraddedit/useraddedit.component';
import { UserlistComponent } from './userlist/userlist.component';
import { UserpendinglistComponent } from './userpendinglist/userpendinglist.component';
import { UsersComponent } from './users.component';
import { BulkuploadUserComponent } from './bulkupload-user/bulkupload-user.component';


const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'list',
        component: UserlistComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'subscribe',
        component: UserpendinglistComponent,
        data: {
          title: 'Subscribe User'
        }
      },
      {
        path: 'add',
        component: UseraddeditComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'edit/:id',
        component: UseraddeditComponent,
        data: {
          title: 'Edit'
        }
      },
      {
        path:"bulkupload",
        component:BulkuploadUserComponent,
        data:{
          title:"Bulk Upload Users"
        }
      },
     
      {
        path: 'view/:id',
        component: UseraddeditComponent,
        data: {
          title: 'View'
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
export class UsersRoutingModule { }
