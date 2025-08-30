import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { MapViewComponent } from './map-view/map-view.component';
import { ViewsComponent } from './views.component';
import { title } from 'process';

const routes: Routes = [
  {
    path: '',
    component: ViewsComponent,
    
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'administrator',
        loadChildren: () => import('./administrators/administrators.module').then(m => m.AdministratorsModule),
        data: {
          title: 'Administrator'
        }
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        data: {
          title: 'Users'
        }
      },
      {
        path: 'subadmin',
        loadChildren: () => import('./subadmin/subadmin.module').then(m => m.SubadminModule),
        data: {
          title: 'Sub Admin'
        }
      },
      {
        path:'companies',
        loadChildren:()=>import('./companies/companies.module').then(m=>m.CompaniesModule),
        data:{
          title:"Company"
      }
      },
      {
        path:'trainers',
        loadChildren:()=>import('./trainers/trainers.module').then(m=>m.TrainersModule),
        data:{
          title:"Trainers"
        }
      },
      {
        path:'batches',
        loadChildren:()=>import('./batches/batches.module').then(m=>m.BatchesModule),
        data:{
          title:"Batches"
        }
      },
      // {
      //   path:'reports',
      //   loadChildren:()=>import('./reports/reports.module').then(m=>m.ReportsModule),
      //   data:{
      //     title:"Reports"
      //   }
      // },
      {
        path:'reports',
        loadChildren:()=>import('./reports_new/reports-new.module').then(m=>m.ReportsNewModule),
        data:{
          title:"Reports"
        }
      },
      {
        path: 'email-template',
        loadChildren: () => import('./emailtemplete/emailtemplete.module').then(m => m.EmailtempleteModule),
        data: {
          title: 'Email Template'
        }
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
        data: {
          title: 'Settings'
        }
      },
      {
        path: 'language',
        loadChildren: () => import('./language/language.module').then(m => m.LanguageModule),
        data: {
          title: 'Languages'
        }
      },
      {
        path: 'report',
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
        data: {
          title: 'Report'
        }
      },
      {
        path: 'pages',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
        data: {
          title: 'Pages'
        }
      },
      {
        path: 'subscription',
        loadChildren: () => import('./subscription/subscription.module').then(m => m.SubscriptionModule),
        data: {
          title: 'Subscription'
        }
      },
      {
        path: 'paymentgateway',
        loadChildren: () => import('./paymentgateway/paymentgateway.module').then(m => m.PaymentgatewayModule),
        data: {
          title: 'Payment Gateway'
        }
      },
      {
        path: 'support-ticket',
        loadChildren: () => import('./support-ticket/support-ticket.module').then(m => m.SupportTicketModule),
        data: {
          title: 'Support Ticket'
        }
      },
      {
        path: 'notification',
        loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule),
        data: {
          title: 'Notification'
        }
      },
      {
        path:"notificationss",
        loadChildren:()=>import("./notificationss/notificationss.module").then(m=>m.NotificationssModule),
        data: {
          title: 'Notification'
        }
      },
      {
        path: 'transaction',
        loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule),
        data: {
          title: 'Transaction'
        }
      },
      {
        path: 'brand',
        loadChildren: () => import('./brand/brand.module').then(b => b.BrandModule),
        data: {
          title: 'Brands'
        }
      },
      {
        path: 'banners',
        loadChildren: () => import('./banners/banners.module').then(b => b.BannersModule),
        data: {
          title: 'Banners'
        }
      },
      {
        path: 'category',
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
        data: {
          title: 'Category'
        }
      },
      {
        path: 'units',
        loadChildren: () => import('./units/units.module').then(u => u.UnitsModule),
        data: {
          title: 'Units'
        }
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then(u => u.OrdersModule),
        data: {
          title: 'Orders'
        }
      },
      {
        path: 'taxmanagement',
        loadChildren: () => import('./taxmanagement/taxmanagement.module').then(m => m.TaxmanagementModule),
        data: {
          title: 'Tax Management'
        }
      },
      {
        path: 'vehicle',
        loadChildren: () => import('./vehicle/vehicle.module').then(m => m.VehicleModule),
        data: {
          title: 'Vehicle'
        }
      },
      {
        path: 'coupon',
        loadChildren: () => import('./coupon/coupon.module').then(m => m.CouponModule),
        data: {
          title: 'Coupon'
        }
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
        data: {
          title: 'Products'
        }
      },
      /* {
        path: 'mapview',
        component: MapViewComponent,
        data: {
          title: 'Map View'
        }
      }, */
      {
        path: 'documentManagement',
        loadChildren: () => import('./document-management/document-management.module').then(m => m.DocumentManagementModule),
        data: {
          title: 'Document Management'
        }
      },
      {
        path: 'walkthrough_images',
        loadChildren: () => import('./walkthrough/walkthrough.module').then(m => m.WalkthroughModule),
        data: {
          title: 'Walkthrough Images'
        }
      },
      {
        path: 'cancellationreason',
        loadChildren: () => import('./cancellationreason/cancellationreason.module').then(c => c.CancellationreasonModule),
        data: {
          title: 'Cancellation Management'
        }
      },
      {
        path: 'adminearnings',
        loadChildren: () => import('./adminearnings/adminearnings.module').then(a => a.AdminearningsModule),
        data: {
          title: 'Site Earnings'
        }
      },
      {
        path: 'timeSlots',
        loadChildren: () => import('./time-slots/time-slots.module').then(m => m.TimeSlotsModule),
        data: {
          title: 'Time Slots'
        }
      },
      {
        path: 'drivers',
        loadChildren: () => import('./drivers/drivers.module').then(m => m.DriversModule),
        data: {
          title: 'Drivers'
        }
      },
      {
        path: 'cityManagement',
        loadChildren: () => import('./city-management/city-management.module').then(m => m.CityManagementModule),
        data: {
          title: 'City Management'
        }
      },
      {
        path: 'reviews/rating',
        loadChildren: () => import('./reviews-rating/reviews-rating.module').then(m => m.ReviewsRatingModule),
        data: {
          title: 'Reviews & Rating'
        }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule { }
