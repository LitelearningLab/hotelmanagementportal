import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditBannerComponent } from './add-edit-banner/add-edit-banner.component';
import { AddMobileBannerComponent } from './add-mobile-banner/add-mobile-banner.component';
import { BannersComponent } from './banners.component';
import { MobileBannerListComponent } from './mobile-banner-list/mobile-banner-list.component';
import { MobileListBannerComponent } from './mobile-list-banner/mobile-list-banner.component';

const routes: Routes = [{
  path: '',
  component: BannersComponent,
  children: [{
    path: 'web-add',
    component: AddEditBannerComponent,
    data: {
      title: 'Add Web Banner'
    }
  },
  {
    path: 'web-list',
    component: MobileListBannerComponent,
    data: {
      title: 'Web Banners List'
    }
  },
  {
    path: 'web-edit/:id',
    component: AddEditBannerComponent,
    data: {
      title: 'Web edit'
    }
  },
  {
    path: 'mobile-list',
    component: MobileBannerListComponent,
    data: {
      title: 'Mobile List'
    }
  },
  {
    path: 'mobile-banner-add',
    component: AddMobileBannerComponent,
    data: {
      title: 'Mobile Add'
    }
  },
  {
    path: 'mobile-banner-edit/:id',
    component: AddMobileBannerComponent,
    data: {
      title: 'Mobile Edit'
    }
  }, {
    path: '',
    redirectTo: 'web-list',
    pathMatch: 'full'
  }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannersRoutingModule { }
