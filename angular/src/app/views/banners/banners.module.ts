import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannersRoutingModule } from './banners-routing.module';
import { AddEditBannerComponent } from './add-edit-banner/add-edit-banner.component';
import { MobileListBannerComponent } from './mobile-list-banner/mobile-list-banner.component';
import { CommonTableModule } from 'src/app/common-table/common-table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MobileBannerListComponent } from './mobile-banner-list/mobile-banner-list.component';
import { AddMobileBannerComponent } from './add-mobile-banner/add-mobile-banner.component';


@NgModule({
  declarations: [
    AddEditBannerComponent,
    MobileListBannerComponent,
    MobileBannerListComponent,
    AddMobileBannerComponent
  ],
  imports: [
    CommonModule,
    BannersRoutingModule,
    CommonTableModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class BannersModule { }
