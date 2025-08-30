export interface PrivilagesData {
	alias?: string;
	icon?: string;
	name: string;
	url: string;
	children?: PrivilagesData[];
	status?: { add: boolean, edit: boolean, view: boolean, delete: boolean };
}
const data: PrivilagesData[] = [
	// {
	// 	alias : "dashboard",
	// 	name: 'Dashboard',
	// 	url: '/app/dashboard',
	// 	icon: 'fa fa-tachometer',
	// 	status: {
	// 		add: true,
	// 		edit: true,
	// 		view: true,
	// 		delete: true
	// 	}
	//   },
	{
		alias: "users",
		name: 'Users',
		url: '/app/users',
		icon: 'fa fa-user',
		children: [
			{
				name: 'User List',
				url: '/app/users/list',
				icon: 'fa fa-th-list'
			},
			{
				name: 'Add User',
				url: '/app/users/add',
				icon: 'fa fa-plus-circle',
			},
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: "company",
		name: 'Company',
		url: '/app/users',
		icon: 'fa fa-user',
		children: [
			{
				name: 'Companies List',
				url: '/app/companies/list',
				icon: ''
			  },
			  {
				name: 'Add Company',
				url: '/app/companies/add',
				icon: '',
			  },
			  {
				name: 'Add Companies Sub Admin',
				url: '/app/companies/addsubadmin',
				icon: '',
			  },
			  {
				name: 'Sub Admin List' ,
				url: '/app/companies/listsubadmins',
				icon: '',
			  },
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: "batch",
		name: 'Batch',
		url: '/app/batches',
		icon: 'fa fa-user',
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
				
			  },
		],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	{
		alias: "trainer",
		name: 'Trainer',
		url: '/app/trainers',
		icon: 'fa fa-user',
		children: [
			{
			  name: 'Trainers List ',
			  url: '/app/trainers/list',
			  icon: ''
			},
			{
			  name: 'Add Trainers',
			  url: '/app/trainers/add',
			  icon: '',
		
			}
		  ],
		status: {
			add: false,
			edit: false,
			view: false,
			delete: false
		}
	},
	// {
	// 	alias: "Brand",
	// 	name: 'Brand',
	// 	url: '/app/brand',
	// 	icon: 'fa fa-cubes',
	// 	children: [
	// 		{
	// 			name: 'Brand List',
	// 			url: '/app/brand/brand-list',
	// 			icon: 'fa fa-th-list'
	// 		},
	// 		{
	// 			name: 'Brand Add',
	// 			url: '/app/brand/brand-add',
	// 			icon: 'fa fa-plus-circle'
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "Banners",
	// 	name: 'Banners',
	// 	url: '/app/banners',
	// 	icon: 'fa fa-picture-o',
	// 	children: [
	// 		{
	// 			name: 'Add Web Banner',
	// 			url: '/app/banners/web-add',
	// 			icon: 'fa fa-plus-circle'
	// 		},
	// 		{
	// 			name: 'Web banner List',
	// 			url: '/app/banners/web-list',
	// 			icon: 'fa fa-th-list'
	// 		},
	// 		{
	// 			name: 'Add Mobile banner',
	// 			url: '/app/banners/mobile-banner-add',
	// 			icon: 'fa fa-plus-circle'
	// 		},
	// 		{
	// 			name: 'Mobile Banner List',
	// 			url: '/app/banners/mobile-list',
	// 			icon: 'fa fa-th-list'
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "category",
	// 	name: 'Categorys',
	// 	url: '/app/category',
	// 	icon: 'fa fa-lightbulb-o',
	// 	children: [
	// 		{
	// 			name: 'Category List',
	// 			url: '/app/category/category-list',
	// 			icon: 'fa fa-list'
	// 		},
	// 		{
	// 			name: 'Add Category',
	// 			url: '/app/category/category-add',
	// 			icon: 'fa fa-plus-circle',
	// 		},
	// 		{
	// 			name: 'Sub Category List',
	// 			url: '/app/category/sub-category-list',
	// 			icon: 'fa fa-list'
	// 		},
	// 		{
	// 			name: 'Add Sub Category',
	// 			url: '/app/category/sub-category-add',
	// 			icon: 'fa fa-plus-circle',
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "Cancellation Reason",
	// 	name: 'Cancellation Reason',
	// 	url: '/app/cancellationreason',
	// 	icon: 'fa fa-close',
	// 	children: [
	// 		{
	// 			name: 'Cancellation Reason List',
	// 			url: '/app/cancellationreason/cancellationlist',
	// 			icon: 'fa fa-play'
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "City Management",
	// 	name: 'City Management',
	// 	url: '/app/cityManagement',
	// 	icon: 'fa fa-industry',
	// 	children: [
	// 		{
	// 			name: 'City Dashboard',
	// 			url: '/app/cityManagement/city_dashboard',
	// 			icon: 'fa fa-tachometer'
	// 		},
	// 		{
	// 			name: 'City List',
	// 			url: '/app/cityManagement/list',
	// 			icon: 'fa fa-list-ul'
	// 		},
	// 		{
	// 			name: 'Add City',
	// 			url: '/app/cityManagement/add',
	// 			icon: 'fa fa-plus-circle'
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "Coupon Management",
	// 	name: 'Coupon Management',
	// 	url: '/app/coupon',
	// 	icon: 'fa fa-gift',
	// 	children: [
	// 		{
	// 			name: 'Coupon List',
	// 			url: '/app/coupon/couponlist',
	// 			icon: 'fa fa-list-ul'
	// 		},
	// 		{
	// 			name: 'Coupon Add',
	// 			url: '/app/coupon/couponadd',
	// 			icon: 'fa fa-plus-circle'
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "reviewsRatings",
	// 	name: 'Reviews Ratings',
	// 	url: '/app/reviews/rating',
	// 	icon: 'fa fa-pencil-square',
	// 	children: [
	// 	  {
	// 		name: 'Reviews Ratings List',
	// 		url: '/app/reviews/rating/list',
	// 		icon: ''
	// 	  },
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	//   },
	// {
	// 	alias: "Drivers ",
	// 	name: 'Drivers',
	// 	url: '/app/drivers',
	// 	icon: 'fa fa-truck',
	// 	children: [
	// 		{
	// 			name: 'Driver dashboard',
	// 			url: '/app/drivers/driverdashboard',
	// 			icon: 'fa fa-tachometer'
	// 		},
	// 		{
	// 			name: 'Drivers List',
	// 			url: '/app/drivers/driverslist',
	// 			icon: 'fa fa-th-list'
	// 		},
	// 		{
	// 			name: 'Add Drivers',
	// 			url: '/app/drivers/adddriver',
	// 			icon: 'fa fa-plus-circle'
	// 		},
	// 		{
	// 			name: 'UnApproved Driverlist',
	// 			url: '/app/drivers/unapprovedriverlist',
	// 			icon: 'fa fa-window-close'
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "Document Management",
	// 	name: 'Document Management',
	// 	url: '/app/documentManagement',
	// 	icon: 'fa fa-file',
	// 	children: [
	// 		{
	// 			name: 'Document List',
	// 			url: '/app/documentManagement/list',
	// 			icon: 'fa fa-list-ul'
	// 		},
	// 		{
	// 			name: 'Add Document',
	// 			url: '/app/documentManagement/add',
	// 			icon: 'fa fa-plus-circle'
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "products",
	// 	name: 'Products',
	// 	url: '/app/products',
	// 	icon: 'fa fa-cubes',
	// 	children: [
	// 		{
	// 			name: 'Products List',
	// 			url: '/app/products/list',
	// 			icon: 'fa fa-th-list'
	// 		},
	// 		{
	// 			name: 'Add Product',
	// 			url: '/app/products/add',
	// 			icon: 'fa fa-plus-circle',
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "email-template",
	// 	name: 'Email Template',
	// 	url: '/app/email-template',
	// 	icon: 'fa fa-envelope-open-o',
	// 	children: [
	// 		{
	// 			name: 'Template List',
	// 			url: '/app/email-template/list',
	// 			icon: 'fa fa-bars'
	// 		},
	// 		{
	// 			name: 'Add Template',
	// 			url: '/app/email-template/add',
	// 			icon: 'fa fa-plus-circle',
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "pages",
	// 	name: 'Page Management',
	// 	url: '/app/pages',
	// 	icon: 'fa fa-folder',
	// 	children: [
	// 		{
	// 			name: 'Page List',
	// 			url: '/app/pages/list',
	// 			icon: 'fa fa-list-ul'
	// 		},
	// 		{
	// 			name: 'Add Page',
	// 			url: '/app/pages/add',
	// 			icon: 'fa fa-plus-circle',
	// 		},
	// 		{
	// 			name: 'Driver Landing Page',
	// 			url: '/app/pages/driver-landing-page',
	// 			icon: 'fa fa-plus-circle',
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "paymentgateway",
	// 	name: 'Payment Gateway',
	// 	url: '/app/paymentgateway',
	// 	icon: 'fa fa-credit-card-alt',
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "vehicle",
	// 	name: 'Vehicle',
	// 	url: '/app/vehicle',
	// 	icon: 'fa fa-car',
	// 	children: [
	// 		{
	// 			name: 'Vehicle List',
	// 			url: '/app/vehicle/list',
	// 			icon: 'fa fa-list-ul'
	// 		},
	// 		{
	// 			name: 'Add Vehicle',
	// 			url: '/app/vehicle/add',
	// 			icon: 'fa fa-plus-circle'
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "notification",
	// 	name: 'Push Notification',
	// 	url: '/app/notification',
	// 	icon: 'fa fa-send',
	// 	children: [
	// 		{
	// 			name: 'User',
	// 			url: '/app/notification/list',
	// 			icon: 'fa fa-user-o'
	// 		},
	// 		{
	// 			name: 'Template',
	// 			url: '/app/notification/templete',
	// 			icon: 'fa fa-list-alt'
	// 		},
	// 		{
	// 			name: 'driver',
	// 			url: '/app/notification/driverlist',
	// 			icon: 'fa fa-user-o'
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "language",
	// 	name: 'Languages',
	// 	url: '/app/language',
	// 	icon: 'fa fa-language',
	// 	children: [
	// 		{
	// 			name: 'Language List',
	// 			url: '/app/language/list',
	// 			icon: 'fa fa-th-list'
	// 		},
	// 		{
	// 			name: 'Add Language',
	// 			url: '/app/language/add',
	// 			icon: 'fa fa-plus-circle',
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "mapview",
	// 	name: 'Map View',
	// 	url: '/app/mapview',
	// 	icon: 'fa fa-map-marker',
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "Units",
	// 	name: 'Units/Metrics',
	// 	url: '/app/units',
	// 	icon: 'fa fa-bars',
	// 	children: [
	// 		{
	// 			name: 'units-add',
	// 			url: '/app/units/units-add',
	// 			icon: 'fa fa-list-ul'
	// 		},
	// 		{
	// 			name: 'units-list',
	// 			url: '/app/units/units-list',
	// 			icon: 'fa fa-plus-circle'
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "Orders",
	// 	name: 'Orders',
	// 	url: '/app/orders',
	// 	icon: 'fa fa-tasks',
	// 	children: [
	// 		{
	// 			name: 'Orders Dashboard',
	// 			url: '/app/orders/orders-dashboard',
	// 			icon: 'fa fa-tachometer'
	// 		}, {
	// 			name: 'User Cancelled Orders',
	// 			url: '/app/orders/usercancelledorders',
	// 			icon: 'fa fa-ban'
	// 		},
	// 		{
	// 			name: 'Delivered Orders',
	// 			url: '/app/orders/deliveredorders',
	// 			icon: 'fa fa-check'
	// 		},
	// 		{
	// 			name: 'cancel Orders',
	// 			url: '/app/orders/cancelorders',
	// 			icon: 'fa fa-ban'
	// 		},
	// 		{
	// 			name: 'Order Pick Up',
	// 			url: '/app/orders/orderpickup',
	// 			icon: 'fa fa-map-pin'
	// 		},
	// 		{
	// 			name: 'New Orders',
	// 			url: '/app/orders/neworders',
	// 			icon: 'fa fa-plus-circle'
	// 		},
	// 		{
	// 			name: 'Packed Orders',
	// 			url: '/app/orders/packedorders',
	// 			icon: 'fa fa-cube'
	// 		}
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },
	// {
	// 	alias: "taxmanagement",
	// 	name: 'Tax Management',
	// 	url: '/app/taxmanagement',
	// 	icon: 'fa fa-bar-chart',
	// 	children: [
	// 		{
	// 			name: 'Tax List',
	// 			url: '/app/taxmanagement/list',
	// 			icon: 'fa fa-list-ul'
	// 		},
	// 		{
	// 			name: 'Add Tax',
	// 			url: '/app/taxmanagement/add',
	// 			icon: 'fa fa-plus-circle'
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },

	// {
	// 	alias: "Time Slots",
	// 	name: 'Time Slots',
	// 	url: '/app/timeSlots',
	// 	icon: 'fa fa-clock-o',
	// 	children: [
	// 		{
	// 			name: 'Time Slots List',
	// 			url: '/app/timeSlots/list',
	// 			icon: 'fa fa-list-ul'
	// 		},
	// 		{
	// 			name: 'Add Time Slot',
	// 			url: '/app/timeSlots/add',
	// 			icon: 'fa fa-plus-circle'
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },

	// {
	// 	alias: "Site Earnings",
	// 	name: 'Site Earnings',
	// 	url: '/app/adminearnings',
	// 	icon: 'fa fa-envelope',
	// 	children: [
	// 		{
	// 			name: 'Admin Earnings',
	// 			url: '/app/adminearnings/adminearningslist',
	// 			icon: 'fa fa-list-alt'
	// 		},
	// 	],
	// 	status: {
	// 		add: false,
	// 		edit: false,
	// 		view: false,
	// 		delete: false
	// 	}
	// },

];
export default data;