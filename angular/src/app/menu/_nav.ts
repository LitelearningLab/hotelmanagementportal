import { INavData } from 'src/app/layout/public-api';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/app/dashboard',
    icon: 'fi fi-rr-apps',
  },
  {
    id: "reports",
    name: 'Reports',
    url: '/app/reports',
    icon: 'fi fi-rr-envelope-open',
    children: [
      {
        name: 'Pronunciation Lab Reports',
        url: '/app/reports/pronunciationlabreports',
        icon: ''
      },
      {
        name: 'Sentences Lab Reports',
        url: '/app/reports/sentenceslabreports',
        icon: ''
      },
      {
        name: 'Learning Hours Reports',
        url: '/app/reports/learninghoursreports',
        icon: ''
      },
      // {
      //   name: 'Add Template',
      //   url: '/app/email-template/add',
      //   icon: '',
      //   id: "add"
      // },
    ]
  },
  // {
  //   id: "administrator",
  //   name: 'Administrators',
  //   url: '/app/administrator',
  //   icon: 'fi fi-rr-mode-portrait',
  //   children: [
  //     {
  //       name: 'Admin List',
  //       url: '/app/administrator/list',
  //       icon: ''
  //     },
  //     {
  //       name: 'Sub Admin List',
  //       url: '/app/administrator/sub-admin-list',
  //       icon: ''
  //     }
  //   ]
  // },

  // {
  //   id: "Banners",
  //   name: 'Banners',
  //   url: '/app/banners',
  //   icon: 'fi fi-rr-picture',
  //   children: [
  //     {
  //       name: 'Add Web Banner',
  //       url: '/app/banners/web-add',
  //       icon: '',
  //       id: "add"
  //     },
  //     {
  //       name: 'Web Banner List',
  //       url: '/app/banners/web-list',
  //       icon: ''
  //     },
  //   ]
  // },
  
 
   {
    id: "users",
    name: 'Users',
    url: '/app/users',
    icon: 'fi fi-rr-users',
    children: [
      {
        name: 'Add User',
        url: '/app/users/add',
        icon: '',
        id: "add"
      },
      {
        name: 'Bulk Upload New Users',
        url: '/app/users/bulkupload',
        icon: '',
        id: ""
      },
      {
        name: 'Edit Users',
        url: '/app/users/list',
        icon: ''
      },
    ]
  },
  {
    id: "batches",
    name: 'Batch',
    url: '/app/batches',
    icon: 'fi fi-rr-users',
    children: [
      {
        name: 'Create Batch',
        url: '/app/batches/create',
        icon: ''
      },
      {
        name: 'Edit Batches',
        url: '/app/batches/edit',
        icon: '',
        id: "add"
      },
      // {
      //   name: 'Company',
      //   url: '/app/batches/list',
      //   icon: ''
      // },
      // {
      //   name: 'Add Batches',
      //   url: '/app/batches/add',
      //   icon: '',
      //   id: "add"
      // },
    ]
  },
  {
    id: "batches",
    name: 'Batches',
    url: '/app/batches',
    icon: 'fi fi-rr-users',
    children: [
      {
        name: 'Create Batch',
        url: '/app/batches/create',
        icon: ''
      },
      {
        name: 'Edit Batches',
        url: '/app/batches/edit',
        icon: '',
        id: "add"
      },
      // {
      //   name: 'Batches',
      //   url: '/app/batches/batchlist',
      //   icon: ''
      // },
      // {
      //   name: 'Add Batches',
      //   url: '/app/batches/add',
      //   icon: '',
      //   id: "add"
      // },
    ]
  },
  {
    id: "trainers",
    name: 'Lecturer',
    url: '/app/trainers',
    icon: 'fi fi-rr-users',
    children: [
      {
        name: 'Lecturer List',
        url: '/app/trainers/list',
        icon: ''
      },
      {
        name: 'Add Lecturer',
        url: '/app/trainers/add',
        icon: '',
        id: "add"
      },
    ]
  },
  
  
  {
    id: "companies",
    name: 'Institution',
    url: '/app/companies',
    icon: 'fa fa-building',
    children: [
      {
        name: 'Institution List',
        url: '/app/companies/list',
        icon: ''
      },
      {
        name: 'Add Institution',
        url: '/app/companies/add',
        icon: '',
        id: "add"
      },
      {
        name: 'Add Institution Sub Admin',
        url: '/app/companies/addsubadmin',
        icon: '',
        id: "add"
      },
      {
        name: 'Sub Admin List' ,
        url: '/app/companies/listsubadmins',
        icon: '',
        id: ""
      },
    ]
  },
  {
    id: "subadmin",
    name: 'Profluent Sub Admin',
    url: '/app/subadmin',
    icon: 'fi fi-rr-mode-portrait',
    children: [
      {
        name: 'Sub Admin List',
        url: '/app/subadmin/list',
        icon: ''
      },
      {
        name: 'Add Sub Admin',
        url: '/app/subadmin/add',
        icon: '',
        id: "add"
      },
    ]
  },
 
  {
    id: "notification",
    name: 'Notification',
    url: '/app/notificationss',
    icon: 'fi fi-rr-bell',
    children: [
      {
        name: 'Create Notification',
        url: '/app/notificationss/create',
        icon: ''
      },
      {
        name: 'List Notitification',
        url: '/app/notificationss/list',
        icon: ''
      },
      // {
      //   name: 'Add Trainers',
      //   url: '/app/trainers/add',
      //   icon: '',
      //   id: "add"
      // },
    ]
  },
  {
    id: "email-template",
    name: 'Email Template',
    url: '/app/email-template',
    icon: 'fi fi-rr-envelope-open',
    children: [
      {
        name: 'Template List',
        url: '/app/email-template/list',
        icon: ''
      },
      // {
      //   name: 'Add Template',
      //   url: '/app/email-template/add',
      //   icon: '',
      //   id: "add"
      // },
    ]
  },
  
  {
    id: "settings",
    name: 'Settings',
    url: '/app/settings',
    icon: 'fi fi-rr-settings',
    children: [
      // {
      //   name: 'General Setting',
      //   url: '/app/settings/gentralsetting',
      //   icon: ''
      // },
      {
        name: 'SMTP',
        url: '/app/settings/smtpsetting',
        icon: ''
      },
      {
        name: 'SMS',
        url: '/app/settings/smssetting',
        icon: ''
      },
      // {
      //   name: 'Social Network',
      //   url: '/app/settings/social-network',
      //   icon: ''
      // },
      // {
      //   name: 'S3 Setting',
      //   url: '/app/settings/s3-setting',
      //   icon: ''
      // },
      // {
      //   name: 'SEO',
      //   url: '/app/settings/seosetting',
      //   icon: ''
      // },
      {
        name:'Change Password',
        url:"/app/settings/change-password",
        icon:''
      },
      {
        name:'Profile',
        url:"/app/settings/profile",
        icon:''
      },
       {
        name:'Send Password',
        url:"/app/settings/sendinfo",
        icon:''
      }
      // {
      //   name: 'Return Reason',
      //   url: '/app/settings/return-reason',
      //   icon: ''
      // },
      // {
      //   name: 'Appearance',
      //   url: '/app/settings/appearance',
      //   icon: ''
      // },
      // {
      //   id: "postheader",
      //   name: 'Post Header',
      //   url: '/app/settings/postheaderlist',
      //   icon: '',
      // },
      // {
      //   name: 'Widgets',
      //   url: '/app/settings/widgets',
      //   icon: ''
      // },
    ]
  },
  {
    id: "setting",
    name: 'Setting',
    url: '/app/settings',
    icon: 'fi fi-rr-settings',
    children: [
      // {
      //   name: 'General Setting',
      //   url: '/app/settings/gentralsetting',
      //   icon: ''
      // },
      // {
      //   name: 'SMTP',
      //   url: '/app/settings/smtpsetting',
      //   icon: ''
      // },
      // {
      //   name: 'SMS',
      //   url: '/app/settings/smssetting',
      //   icon: ''
      // },
      // {
      //   name: 'Social Network',
      //   url: '/app/settings/social-network',
      //   icon: ''
      // },
      // {
      //   name: 'S3 Setting',
      //   url: '/app/settings/s3-setting',
      //   icon: ''
      // },
      // {
      //   name: 'SEO',
      //   url: '/app/settings/seosetting',
      //   icon: ''
      // },
      {
        name:'Change Password',
        url:"/app/settings/change-password",
        icon:''
      },
      {
        name:'Profile',
        url:"/app/settings/profile",
        icon:''
      },
      {
        name:'sendinfo',
        url:"/app/settings/sendinfo",
        icon:''
      }
      // {
      //   name: 'Return Reason',
      //   url: '/app/settings/return-reason',
      //   icon: ''
      // },
      // {
      //   name: 'Appearance',
      //   url: '/app/settings/appearance',
      //   icon: ''
      // },
      // {
      //   id: "postheader",
      //   name: 'Post Header',
      //   url: '/app/settings/postheaderlist',
      //   icon: '',
      // },
      // {
      //   name: 'Widgets',
      //   url: '/app/settings/widgets',
      //   icon: ''
      // },
    ]
  },
  // {
  //   id: "Site Earnings",
  //   name: 'Site Earnings',
  //   url: '/app/adminearnings',
  //   icon: 'fi fi-rr-money',
  //   children: [
  //     {
  //       name: 'Admin Earnings',
  //       url: '/app/adminearnings/adminearningslist',
  //       icon: ''
  //     },
  //   ]
  // },
  // {
  //   id: "pages",
  //   name: 'Page Management',
  //   url: '/app/pages',
  //   icon: 'fi fi-rr-file',
  //   children: [
  //     {
  //       name: 'Page List',
  //       url: '/app/pages/list',
  //       icon: ''
  //     },
  //     {
  //       name: 'Add Page',
  //       url: '/app/pages/add',
  //       icon: '',
  //       id: "add"
  //     },
  //     // {
  //     //   name: 'Driver Landing Page',
  //     //   url: '/app/pages/driver-landing-page',
  //     //   icon: '',
  //     //   id: "add"
  //     // },
  //   ]
  // },
  //  {
  //     id: "notification",
  //     name: 'Push Notification',
  //     url: '/app/notification',
  //     icon: 'fi fi-rr-bell',
  //     children: [
  //       {
  //         name: 'User',
  //         url: '/app/notification/list',
  //         icon: ''
  //       },
  //       {
  //         name: 'Template',
  //         url: '/app/notification/templete',
  //         icon: ''
  //       },
  //       // {
  //       //   name: 'driver',
  //       //   url: '/app/notification/driverlist',
  //       //   icon: ''
  //       // },
  //     ]
  //   },
  {
    id: "paymentgateway",
    name: 'Payment Gateway',
    url: '/app/paymentgateway',
    icon: 'fi fi-rr-credit-card',
    children: [
      {
        name: 'Payment gateway ',
        url: '/app/paymentgateway',
        icon: ''
      },
      // {
      //   name: 'Add payment gateway',
      //   url: '/app/paymentgateway/add',
      //   icon: '',
      //   id: "add"
      // },
      // {
      //   name: 'Driver Landing Page',
      //   url: '/app/pages/driver-landing-page',
      //   icon: '',
      //   id: "add"
      // },
    ]
  },

  // {
  //   id: "taxmanagement",
  //   name: 'Tax Management',
  //   url: '/app/taxmanagement',
  //   icon: 'fi fi-rr-dollar',
  //   children: [
  //     {
  //       name: 'Tax List',
  //       url: '/app/taxmanagement/list',
  //       icon: ''
  //     },
  //     {
  //       name: 'Add Tax',
  //       url: '/app/taxmanagement/add',
  //       icon: '',
  //       id: "add"
  //     },
  //   ]
  // },
  // {
  //   id: "Time Slots",
  //   name: 'Time Slots',
  //   url: '/app/timeSlots',
  //   icon: 'fi fi-rr-time-fast',
  //   children: [
  //     {
  //       name: 'Time Slots List',
  //       url: '/app/timeSlots/list',
  //       icon: ''
  //     },
  //     {
  //       name: 'Add Time Slot',
  //       url: '/app/timeSlots/add',
  //       icon: '',
  //       id: "add"
  //     },
  //   ]
  // },
  // {
  //   id: "Units",
  //   name: 'Units/Metrics',
  //   url: '/app/units',
  //   icon: 'fi fi-rr-settings-sliders',
  //   children: [
  //     {
  //       name: 'Units List',
  //       url: '/app/units/units-list',
  //       icon: ''
  //     },
  //     {
  //       name: 'Units Add',
  //       url: '/app/units/units-add',
  //       icon: '',
  //       id: "add"
  //     },
  //   ]
  // },
  // {
  //   id: "vehicle",
  //   name: 'Vehicle',
  //   url: '/app/vehicle',
  //   icon: 'fi fi-rr-taxi',
  //   children: [
  //     {
  //       name: 'Vehicle List',
  //       url: '/app/vehicle/list',
  //       icon: ''
  //     },
  //     {
  //       name: 'Add Vehicle',
  //       url: '/app/vehicle/add',
  //       icon: '',
  //       id: "add"
  //     },
  //   ]
  // },
];
