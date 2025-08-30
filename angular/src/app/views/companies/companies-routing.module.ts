import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { AddeditCompaniesComponent } from './addedit-companies/addedit-companies.component';
import { AddCompanySubadminComponent } from './add-company-subadmin/add-company-subadmin.component';
import { title } from 'process';
import { CompanySubadminListComponent } from './company-subadmin-list/company-subadmin-list.component';
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
        component: ListCompaniesComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: AddeditCompaniesComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'edit/:id',
        component: AddeditCompaniesComponent,
        data: {
          title: 'Edit'
        }
      },
      {
        path:"addsubadmin",
        component:AddCompanySubadminComponent,
        data:{
          title:"Add Sub Admin"
        }
      },
      {
        path:"editsubadmin/:id",
        component:AddCompanySubadminComponent,
        data:{
          title:"Edit Sub Admin"
        }
      },
      {
        path:"listsubadmins",
        component:CompanySubadminListComponent,
        data:{
          title:"Sub Admins List"
        }
      },
      {
        path: 'view/:id',
        component: AddeditCompaniesComponent,
        data: {
          title: 'View'
        }
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
