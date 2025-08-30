import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponComponent } from './coupon.component';
import { CouponaddeditComponent } from './couponaddedit/couponaddedit.component';
import { CouponlistComponent } from './couponlist/couponlist.component';
import { CouponviewComponent } from './couponview/couponview.component';

const routes: Routes = [{
  path: '',
  component: CouponComponent,
  children: [
    {
      path: 'couponlist',
      component: CouponlistComponent,
      data: {
        title: 'couponlist'
      }
    },
    {
      path: 'couponadd',
      component: CouponaddeditComponent,
      data: {
        title: 'couponadd'
      }
    },
    {
      path: 'couponedit/:id',
      component: CouponaddeditComponent,
      data: {
        title: 'couponedit'
      }
    },
    {
      path: 'couponview/:id',
      component: CouponviewComponent,
      data: {
        title: 'couponview'
      }
    },{
      path: '',
      redirectTo: 'couponlist',
      pathMatch: 'full'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponRoutingModule { }
