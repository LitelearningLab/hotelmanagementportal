import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSubadminComponent } from './list-subadmin/list-subadmin.component';
import { AddeditSubadminComponent } from './addedit-subadmin/addedit-subadmin.component';
import { SubadminComponent } from './subadmin';
// import { UseraddeditComponent } from './useraddedit/useraddedit.component';
// import { UserlistComponent } from './userlist/userlist.component';
// import { UserpendinglistComponent } from './userpendinglist/userpendinglist.component';
// import { UsersComponent } from './users.component';

const routes: Routes = [
  {
    path: '',
    // component: SubadminComponent,
    children: [
      {
        path: 'list',
        component: ListSubadminComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: AddeditSubadminComponent,
        data: {
          title: 'Add Sub admin'
        }
      },
      {
        path: 'edit/:id',
        component: AddeditSubadminComponent,
        data: {
          title: 'Edit'
        }
      },
      {
        path: 'view/:id',
        component: AddeditSubadminComponent,
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
export class SubAdminRoutingModule { }
