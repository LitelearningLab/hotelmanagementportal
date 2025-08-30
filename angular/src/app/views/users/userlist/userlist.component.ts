import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { LocalDataSource } from 'src/app/common-table/table/public-api';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { apis } from 'src/app/interface/interface';
import { TableSettingsService } from 'src/app/_helpers/table-settings.service';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { WebSocketService } from 'src/app/_services/webSocketService.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { CommonModalComponent } from 'src/app/shared/common-modal.component';
import { PrivilagesData } from 'src/app/menu/privilages';
import { DefaultStoreService } from 'src/app/_services/default-store.service';
import { PopupComponent } from 'src/app/shared/popup.component';
import { eventNames } from 'process';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {

  settings: any;
  source: LocalDataSource = new LocalDataSource();
  skip: number = 0;
  limit: number = 50;
  count: number = 0;
  curentUser: any;
  settingData: any;
  default_limit: number = 50;
  userPrivilegeDetails: PrivilagesData[];
  bulk_action: boolean = false;
  activeBulkAction: boolean = false;
  add_btn: boolean = false;
  category: boolean = true;
  delete_btn: boolean = false;
  edit_btn: boolean = true;
  view_btn: boolean = true;
  deletestatus: boolean=false;
  companydate: any;
  trainerdata: any;
  companysubadmindata: any;
;
  addBtnUrl: string = '/app/users/add';
  addBtnName: string = 'User Add';
  editUrl: string = '/app/users/edit/';
  viewUrl: string = '/app/users/view/';
  deleteApis: apis = Apiconfig.userDelete;
  permanentdelete: apis = Apiconfig.user_permanet_delete
  exportApis: apis = Apiconfig.userExport;
  restoreApis: apis = Apiconfig.restoreUser;
  inactiveApis: apis = Apiconfig.userInactive;
  userActive: apis = Apiconfig.userActive
  card_details: any[] = [];
  global_status: number = 3;
  global_search: string;
  global_filter: string;
  selectedRow: any;
  filter_action: boolean = true;
  filter_action_list: any[] = [];
  global_filter_action = {} as any;
  user_list_filter_action: boolean = true;
  traineractive: boolean=false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthenticationService,
    private cd: ChangeDetectorRef,
    private getSettings: TableSettingsService,
    private loader: SpinnerService,
    private socketService: WebSocketService,
    private notifyService: NotificationService,
    private ActivatedRoute: ActivatedRoute,
    private store: DefaultStoreService,
    
  ) {
    this.companydate=JSON.parse(localStorage.getItem('company'))
    this.trainerdata=JSON.parse(localStorage.getItem('Trainer Login'))
    this.companysubadmindata=JSON.parse(localStorage.getItem("companysubadmin"))

    
  
    this.loader.loadingSpinner.next(true);
    this.curentUser = this.authService.currentUserValue;
    let currentUserlogined:any=JSON.parse(localStorage.getItem("subAdmin"))
    if (currentUserlogined) {
      if (this.router.url == '/app/users/list') {
        this.userPrivilegeDetails = currentUserlogined.privileges.filter(x => x.alias == 'users');
        console.log("privilages datat si showing here mer suhaierladjfeifjaflijefijafjas")
        
        console.log(this.userPrivilegeDetails);

        // if (!this.userPrivilegeDetails[0].status.view) {
        //   this.notifyService.showWarning('You are not authorized this module');
        //   this.router.navigate(['/app']);
        // };
        if (this.userPrivilegeDetails[0].status.delete) {
          this.delete_btn = true;
        } else {
          this.delete_btn = false;
        }
        if (this.userPrivilegeDetails[0].status.edit) {
          this.edit_btn = true;
        } else {
          this.edit_btn = false;
        }
        if (this.userPrivilegeDetails[0].status.view) {
          this.view_btn = true;
        } else {
          this.view_btn = false;
        }
        // if (this.add_btn || this.edit_btn) {
        //   this.export_btn = true;
        // } else {
        //   this.export_btn = false;
        // }
      }
    };
    console.log(this.trainerdata)
      if(this.companydate){
        this.filter_action_list = [
        
          {
            name: 'Country',
            tag: 'select',
            type: '',
          },
          {
            name: 'City',
            tag: 'select',
            type: '',
          },
          {
            name: 'Year',
            tag: 'select',
            type: '',
          },
          {
            name: 'Course',
            tag: 'select',
            type: '',
          },
       
          {
            name: 'From Date',
            tag: 'input',
            type: 'date',
          },
          {
            name: 'To Date',
            tag: 'input',
            type: 'date',
          },   
          {
            name: 'Status',
            tag: 'select',
            type: '',
          }, 
         
        ]
      }else if(this.companysubadmindata){
        console.log("inside of  this")
        this.filter_action_list = [
        
          {
            name: 'Country',
            tag: 'select',
            type: '',
          },
          {
            name: 'City',
            tag: 'select',
            type: '',
          },
          {
            name: 'Year',
            tag: 'select',
            type: '',
          },
          {
            name: 'Course',
            tag: 'select',
            type: '',
          },
       
          {
            name: 'From Date',
            tag: 'input',
            type: 'date',
          },
          {
            name: 'To Date',
            tag: 'input',
            type: 'date',
          },   
          {
            name: 'Status',
            tag: 'select',
            type: '',
          }, 
         
        ]


      }


      else if(this.trainerdata){
        this.filter_action_list = [
        
          {
            name: 'Country',
            tag: 'select',
            type: '',
          },
          {
            name: 'City',
            tag: 'select',
            type: '',
          },
          {
            name: 'Year',
            tag: 'select',
            type: '',
          },
          {
            name: 'Course',
            tag: 'select',
            type: '',
          },
       
          {
            name: 'From Date',
            tag: 'input',
            type: 'date',
          },
          {
            name: 'To Date',
            tag: 'input',
            type: 'date',
          },   
          {
            name: 'Status',
            tag: 'select',
            type: '',
          }, 
        ]
      }
      else{
        this.filter_action_list = [
          {
            name: 'Institution',
            tag: 'select',
            type: '',
          },
          {
            name: 'Country',
            tag: 'select',
            type: '',
          },
          {
            name: 'City',
            tag: 'select',
            type: '',
          },
          {
            name: 'Year',
            tag: 'select',
            type: '',
          },
          {
            name: 'Course',
            tag: 'select',
            type: '',
          },
       
          {
            name: 'From Date',
            tag: 'input',
            type: 'date',
          },
          {
            name: 'To Date',
            tag: 'input',
            type: 'date',
          },   
          {
            name: 'Status',
            tag: 'select',
            type: '',
          }, 
        
        ]
      }
    
    this.loadsettings('');
    this.socketService.listen('new_user_created').subscribe(data => {
      if (data && data != '') {
        if (data.message && data.message != '') {
          this.notifyService.showInfo(data.message);
          this.ngOnInit();
        }
      }
    });
    this.ActivatedRoute.queryParams.subscribe(params => {
      if (params && params['selected']) {
        this.global_filter = params['selected'];
      }
    });
  }

  ngOnInit(): void {
    var data = {
      'skip': this.skip,
      'limit': this.default_limit,
      'status': this.global_status,
      'search': this.global_search,
      'filter': this.global_filter,
      'filter_action': this.global_filter_action,
    };

    console.log(this.global_filter_action,'final')

      // this.getUserList(data)
   

    
  };

  getUserList(data) {
    debugger;
    console.log("here mr shuhai")
    let company:any=JSON.parse(localStorage.getItem('company'))
    let companysubadmin:any=JSON.parse(localStorage.getItem("companysubadmin"))

    if(company||localStorage.getItem("companysubadmin")){
      
      if(company){

        data.company=company
      }else{
        data.company=companysubadmin.companydata[0]
      }
      
      this.apiService.CommonApi(Apiconfig.com_user_list.method,Apiconfig.com_user_list.url,data).subscribe((result)=>{
        if(result.status){
          this.source.load(result.data);
          this.count = result.count;
          // this.loadCard_Details(result.all??0,result.active??0,result.inactive??0,result.delete??0)  
          this.cd.detectChanges();
        }
      })

    }else if(localStorage.getItem("Trainer Login")){
      this.view_btn = true;;

      this.traineractive=true
      let trainerData=JSON.parse(localStorage.getItem("Trainer Login"))
      data.companyid=trainerData.companyid
      this.apiService.CommonApi(Apiconfig.trainer_user_list.method, Apiconfig.trainer_user_list.url, data).subscribe(
        (result) => {
          if (result) {     
            // this.loadCard_Details(result.all,result.active,result.inactive,result.delete)    
       
            this.source.load(result.data);
            this.count = result.count;
            setTimeout(() => {
              this.loader.loadingSpinner.next(false);
            }, 1000);
            this.cd.detectChanges();
          }
        }
      )
    }
    else if(localStorage.getItem("Admin")||localStorage.getItem("subAdmin")){
      console.log("herer we have reached here");
      console.log(data)
      
      this.apiService.CommonApi(Apiconfig.userList.method, Apiconfig.userList.url, data).subscribe(
        (result) => {
          if (result) {    
            console.log(result) 
            // this.loadCard_Details(result.all,result.active,result.inactive,result.delete)    
            this.source.load(result.data);
            this.count = result.count;
            // this.notifyService.showSuccess("Fetched successfully")
  
            // if (result[0].length == 0) {
            //   this.export_btn = false;
            // }
            // if (data.status == 4) {
            // this.export_btn = false;
            // } 
            // else {
            //   this.export_btn = true;
            // }
            // this.from = 'userlsit';
            setTimeout(() => {
              this.loader.loadingSpinner.next(false);
            }, 1000);
            this.cd.detectChanges();
          }
        }
      )
    }

  
  }

  onDeleteChange(event) {
    console.log("------------------------------")
    console.log(event)
    if (event && event.status == true) {
      
      // this.skip = 0;
      // this.ngOnInit();
      var data = {
        'skip': this.skip,
        'limit': this.default_limit,
        'status': this.global_status,
        'search': this.global_search,
        'filter': this.global_filter,
        'filter_action': this.global_filter_action,
      };
      this.getUserList(data);
    }
  };

  onInactivechange(event) {

    console.log("bgbhsdfgsd", event)
    if (event && event.status == 1) {
      // this.skip = 0;
      this.ngOnInit();
    }
  }


  onSearchChange(event) {
    this.source = new LocalDataSource();
    this.global_search = event;
    // this.limit=0
    this.skip =0
    let data = {
      'skip': this.skip,
      'limit': this.limit,
      'status': this.global_status,
      'search': event,
      'filter': this.global_filter,
      'filter_action': this.global_filter_action,

    }
    
    this.getUserList(data);
  };

  onitemsPerPageChange(event) {
    debugger;
    this.limit = event;
    this.skip = 0;
    this.default_limit = event;
    this.source = new LocalDataSource();
    let data = {
      'skip': this.skip,
      'limit': this.limit,
      'status': this.global_status,
      'search': this.global_search,
      'filter': this.global_filter,
      'filter_action': this.global_filter_action
    }
    this.getUserList(data);
  };
  onPageChange(event) {
    debugger;
    console.log("hjihihdhfaisodfausdfhjadfluahihfn");
    
    console.log(event);
    
    this.skip = this.limit * (event - 1);
    this.source = new LocalDataSource();
    let data = {
      'skip': this.limit * (event - 1),
      'limit': this.limit*event,
      'status': this.global_status,
      'search': this.global_search,
      'filter': this.global_filter,
      'filter_action': this.global_filter_action,

    };
    this.getUserList(data);
  }

  onheaderCardChange(event) {
    this.skip = 0;
    this.source = new LocalDataSource();
    let data = {
      'skip': this.skip,
      'limit': this.limit,
      'status': this.global_status,
      'search': this.global_search,
      'filter': this.global_filter,
      'filter_action': this.global_filter_action,

    }
    if (event == 'all') {
      data.status = 3;
      this.global_status = 3;
      this.user_list_filter_action = true
      this.activeBulkAction = 
      this.deletestatus=false
    } else if (event == 'active') {
      data.status = 1;
      this.global_status = 1;
      this.user_list_filter_action = true
      this.activeBulkAction = false
      this.deletestatus=false
    } else if (event == 'inactive') {
      data.status = 2;
      this.global_status = 2;
      this.user_list_filter_action = false
      this.activeBulkAction = true
      this.deletestatus=false
    } else if (event == 'delete') {
      // this.export_btn = false;
      data.status = 0;
      this.global_status = 0;
      this.user_list_filter_action = false
      this.activeBulkAction = false
      this.deletestatus=true
    } else if (event == 'today') {
      data.status = 5;
      this.global_status = 5;
    }
    this.loadsettings(event);
    this.getUserList(data);
  }

  onFilterAction(event) {
    this.source = new LocalDataSource();
    if (event && event != '') {
      this.global_filter_action = event;
    } else {
      this.global_filter_action = {};
    }
    var data = {
      'skip': this.skip,
      'limit': this.default_limit,
      'status': this.global_status,
      'search': this.global_search,
      'filter': this.global_filter,
      'filter_action': this.global_filter_action,
    };
    this.getUserList(data);
  }

  loadCard_Details(allUsers, activeUsers, inactiveUsers, deletedUsers) {
    this.card_details = [
      {
        title: 'ALL USERS',
        value: allUsers,
        bg_color: 'clr-green',
        //icon: 'fa fa-users',
        click_val: 'all'
      },
      {
        title: 'ACTIVE USERS',
        value: activeUsers,
        bg_color: 'clr-ancblue',
        //icon: 'fa fa-user-plus',
        click_val: 'active'
      },
      {
        title: 'INACTIVE USERS',
        value: inactiveUsers,
        bg_color: 'clr-orange',
        //icon: 'fa fa-user-times',
        click_val: 'inactive'
      },
      {
        title: 'DELETED USERS',
        value: deletedUsers,
        bg_color: 'clr-red',
        //icon: 'fa fa-trash-o',
        click_val: 'delete'
      },
      // {
      //   title: "TODAY'S USERS",
      //   value: todayUsers,
      //   bg_color: 'delete-user',
      //   icon: 'fa fa-user-circle-o',
      //   click_val: 'today'
      // },
    ];
  }


   toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }
  loadsettings(event) {
    if (event == 'delete') {
      // this.delete_btn=false
      this.settings = {
        selectMode: 'multi',
        // hideSubHeader: true,
        columns: {
          index: {
            title: 'S No',
            type: 'text',
            valuePrepareFunction: (value, row, cell) => {
              // console.log(cell)
              return cell.row.index+this.skip + 1 + '.';
            }
          },
          username: {
            title: 'Username',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
          email: {
            title: 'Email',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (this.add_btn || this.edit_btn) {
                return `<div class="">${value ? value : '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
          // company: {
          //   title: 'Company',
          //   filter: true,
          //   type: 'html',
          //   valuePrepareFunction: value => {
          //     if (this.add_btn || this.edit_btn) {
          //       return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
          //     } else {
          //       return `<div class="overflow-text">XXXXX@gmail.com</div>`;
          //     }
          //   }
          // },

          mobile: {
            title: 'Mobile',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? value : '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
          city: {
            title: 'City',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
          year: {
            title: 'Year',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
          status: {
            title: 'Status',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              return "<span class='badge badge-danger badge-pill mb-1'>Deleted</span>";
            }
          },
        },
        pager: {
          display: true,
          perPage: this.default_limit
        },
        actions: {
          add: true,
          edit: false,
          delete: false,
          columnTitle: 'Actions',
          class: 'action-column',
          position: 'right',
          custom: [],
        },
      }
      this.settings.actions.custom = this.getSettings.loadSettings(event, this.curentUser, '/app/users/list', this.userPrivilegeDetails, this.delete_btn, this.edit_btn, this.view_btn);
    }else if(localStorage.getItem("Trainer Login")){
      this.settings = {
        // selectMode: 'multi',
        hideSubHeader: true,
        columns: {
          index: {
            title: 'S No',
            type: 'text',
            valuePrepareFunction: (value, row, cell) => {
              // console.log(cell)
              return cell.row.index+this.skip + 1 + '.';
            }
          },
          
          username: {
            title: 'Username',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
          email: {
            title: 'Email',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (this.add_btn || this.edit_btn) {
                return `<div class="">${value ? value : '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
          // company: {
          //   title: 'Company',
          //   filter: true,
          //   type: 'html',
          //   valuePrepareFunction: value => {
          //     if (this.add_btn || this.edit_btn) {
          //       return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
          //     } else {
          //       return `<div class="overflow-text">XXXXX@gmail.com</div>`;
          //     }
          //   }
          // },
          mobile: {
            title: 'Mobile',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? value : '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
          city: {
            title: 'City',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
          year: {
            title: 'Year',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
          status: {
            title: 'Status',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (value==="1") {
                return `<span class='badge badge-success badge-pill mb-1'>Active</span>`;
                
              } else {
                return `<span class='badge badge-danger badge-pill mb-1'>Avtive</span>`;
              }
            }
          }
          
          // status: {
          //   title: 'Status',
          //   filter: false,
          //   type: 'custom',
          //   renderComponent: PopupComponent,
          //   sort: false,
          //   editable: true,
          //   onComponentInitFunction: (instance: any) => {
          //     instance.save.subscribe(row => {
          //       this.changefeatured(row._id, row.status);
          //     });
          //   }
           
          // },
        },
       
        pager: {
          display: true,
          perPage: this.default_limit
        },
        actions: {
          add: false,
          edit: false,
          delete: false,
          columnTitle: 'Actions',
          class: 'action-column',
          position: 'right',
          custom: [],
        },
      }
      this.settings.actions.custom = this.getSettings.loadSettings(event, this.curentUser, '/app/users/list', this.userPrivilegeDetails, false/**delete button */ , false/**edit button */, true);

      
    }
     else {
      // console.log(this.traineractive)
      this.settings = {
        // selectMode: 'multi',
        hideSubHeader: true,
        columns: {
          index: {
            title: 'S No',
            type: 'text',
            valuePrepareFunction: (value, row, cell) => {
              // console.log(cell)
             
              return cell.row.index+this.skip + 1 + '.';
            }
          },
          
          username: {
            title: 'Username',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              // if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
              // } else {
                // return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              // }
            }
          },
          email: {
            title: 'Email',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              // if (this.add_btn || this.edit_btn) {
                return `<div class="">${value ? value : '-'}</div>`;
              // } else {
                // return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              // }
            }
          },
          // company: {
          //   title: 'Company',
          //   filter: true,
          //   type: 'html',
          //   valuePrepareFunction: value => {
          //     // if (this.add_btn || this.edit_btn) {
          //       return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
          //     // } else {
          //       // return `<div class="overflow-text">XXXXX@gmail.com</div>`;
          //     // }
          //   }
          // },
          mobile: {
            title: 'Mobile',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              // if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? value : '-'}</div>`;
              // } else {
                // return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              // }
            }
          },
          city: {
            title: 'City',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
          year: {
            title: 'Year',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
        
          status: {
            title: 'Status',
            filter: false,
            type: 'custom',
            renderComponent: PopupComponent,
            sort: false,
            editable: true,
            onComponentInitFunction: (instance: any) => {
              instance.save.subscribe(row => {
                this.changefeatured(row._id, row.status);
              });
            }
           
          },
        },
       
        pager: {
          display: true,
          perPage: this.default_limit
        },
        actions: {
          add: false,
          edit: false,
          delete: false,
          columnTitle: 'Actions',
          class: 'action-column',
          position: 'right',
          custom: [],
        },
      }
      this.settings.actions.custom = this.getSettings.loadSettings(event, this.curentUser, '/app/users/list', this.userPrivilegeDetails, this.delete_btn, this.edit_btn, this.view_btn);
    };
  };

  changefeatured(id, status) {
    // var data = {
    //   db: "users",
    //   id: id,
    //   value: 1
    // };
    // if (status == 1) {
    //   data.value = 2;
    // }
    // this.apiService.CommonApi(Apiconfig.changeStatus.method, Apiconfig.changeStatus.url, data).subscribe(response => {
    //   if (response && response.status == 1) {
    //     this.notifyService.showSuccess("Successfully Updated");
    //     this.ngOnInit()
    //     // window.location.reload();
    //   } else {
    //     this.notifyService.showError("Something went wrong. Please try again later.");
    //   }
    // })
    
      let data={
      id:id,
      status:status==1?"2":"1"
    }
    this.apiService.CommonApi(Apiconfig.update_user_status.method,Apiconfig.update_user_status.url,data).subscribe((result)=>{
      if(result.status===true){
        this.notifyService.showSuccess("Updated successfully")
        var data = {
          'skip': this.skip,
          'limit': this.default_limit,
          'status': this.global_status,
          'search': this.global_search,
          'filter': this.global_filter,
          'filter_action': this.global_filter_action,
    
        };
        this.getUserList(data)
      }else{
        this.notifyService.showError(result.message)
      }
    })
  }



  ngAfterViewInit(): void {
    // var data = {
    //   'skip': 0,
    //   'limit': 50,
    //   'status': 0,
    // }
  
   if(this.companydate){
    this.store.companyList.next(this.companydate?[this.companydate]:[]);
   }else{

     this.apiService.CommonApi(Apiconfig.getCompanynames.method,Apiconfig.getCompanynames.url,{}).subscribe((result)=>{
       // console.log("---------------------------------------------")
       // console.log(result
 
       this.store.companyList.next(result.data ? result.data : []);
      })
   }
  //  this.cd.detectChanges()
  
  }
  
};
