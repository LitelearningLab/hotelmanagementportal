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



@Component({
  selector: 'app-trainerslist',
  templateUrl: './trainerslist.component.html',
  styleUrls: ['./trainerslist.component.scss']
})
export class TrainerslistComponent {
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  skip: number = 0;
  limit: number = 10;
  count: number = 0;
  curentUser: any;
  settingData: any;
  default_limit: number = 10;
  userPrivilegeDetails: PrivilagesData[];
  bulk_action: boolean = false;
  activeBulkAction: boolean = false;
  add_btn: boolean = false;
  category: boolean = true;
  delete_btn: boolean = true;
  edit_btn: boolean = true;
  view_btn: boolean = true;

  addBtnUrl: string = '/app/users/add';
  addBtnName: string = 'User Add';
  editUrl: string = '/app/trainers/edit/';
  viewUrl: string = '/app/trainers/view/';
  deleteApis: apis = Apiconfig.delete_trainer;
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
  deletestatus: boolean=false;
  companydate: any;
  companysubadmin: any;

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
    private store: DefaultStoreService
  ) {
    this.companydate=JSON.parse(localStorage.getItem('company'))
    this.companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))
    this.loader.loadingSpinner.next(true);
    this.curentUser = this.authService.currentUserValue;
    let currentUserlogined:any=JSON.parse(localStorage.getItem("subAdmin"))
    if (currentUserlogined) {

      if (this.router.url == '/app/trainers/list') {
        this.userPrivilegeDetails = currentUserlogined.privileges.filter(x => x.alias == 'trainer');
     

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
          name: 'Status',
          tag: 'select',
          type: '',
        }
      ]
    }else if(this.companysubadmin){
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
          name: 'Status',
          tag: 'select',
          type: '',
        }
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
          name: 'Status',
          tag: 'select',
          type: '',
        }
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

      // this.getTrainerList(data)
   

    
  };

  getTrainerList(data) {
    let company:any=JSON.parse(localStorage.getItem('company'))  
    if(company){
      data.company=company
      
      this.apiService.CommonApi(Apiconfig.com_trainer_list.method,Apiconfig.com_trainer_list.url,data).subscribe((result)=>{
        if(result.status){
          // this.loadCard_Details(result.all??0,result.active??0,result.inactive??0,result.delete??0)  
          this.source.load(result.data);
            this.count = result.count;
  
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
            // setTimeout(() => {
            //   // this.loader.loadingSpinner.next(false);
            // }, 1000);
            this.cd.detectChanges();
        }
      })

    }else if(this.companysubadmin){
      data.company=this.companysubadmin.companydata[0]
      
      this.apiService.CommonApi(Apiconfig.com_trainer_list.method,Apiconfig.com_trainer_list.url,data).subscribe((result)=>{
        if(result.status){
          // this.loadCard_Details(result.all??0,result.active??0,result.inactive??0,result.delete??0)  
          this.source.load(result.data);
            this.count = result.count;
  
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
            // setTimeout(() => {
            //   // this.loader.loadingSpinner.next(false);
            // }, 1000);
            this.cd.detectChanges();
        }
      })
    }
    else if(localStorage.getItem("Admin")||localStorage.getItem("subAdmin")){
      
      
      this.apiService.CommonApi(Apiconfig.trainer_list.method, Apiconfig.trainer_list.url, data).subscribe(
        (result) => {
          if (result) {     
            // this.loadCard_Details(result.all??0,result.active??0,result.inactive??0,result.delete??0)  
            this.source.load(result.data);
            this.count = result.count;
  
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
    if (event && event.status == 1) {
      // this.skip = 0;
      this.ngOnInit();
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
    let data = {
      'skip': this.skip,
      'limit': this.limit,
      'status': this.global_status,
      'search': event,
      'filter': this.global_filter,
      'filter_action': this.global_filter_action,

    }
    
    this.getTrainerList(data);
  };

  onitemsPerPageChange(event) {
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
    this.getTrainerList(data);
  };
  onPageChange(event) {
    console.log("hjihihdhfaisodfausdfhjadfluahihfn");
    
    console.log(event);
    
    this.skip = this.limit * (event - 1);
    this.source = new LocalDataSource();
    let data = {
      'skip': this.limit * (event - 1),
      'limit': this.limit,
      'status': this.global_status,
      'search': this.global_search,
      'filter': this.global_filter,
      'filter_action': this.global_filter_action,

    };
    this.getTrainerList(data);
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
      this.activeBulkAction = true
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
    this.getTrainerList(data);
  }

  onFilterAction(event) {

    console.log(event,"EVENTTT");
    
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
    if(!this.global_filter_action.City && !this.global_filter_action.Status && !this.global_filter_action.Country&& !this.global_filter_action.Company ){
      this.source.load([]);
      this.count = 0;
    }else{

      this.getTrainerList(data);
    }
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
        hideSubHeader: true,
        columns: {
          // username: {
          //   title: 'Name',
          //   filter: true,
          //   type: 'html',
          //   valuePrepareFunction: (value, row) => {
          //     return `<div class="overflow-text">${(row.first_name.charAt(0).toUpperCase() + row.first_name.substr(1).toLowerCase()) + " " + (row.last_name.charAt(0).toUpperCase() + row.last_name.substr(1).toLowerCase())}</div>`;

          //     // return `<div class="overflow-text">${(value.charAt(0).toUpperCase() + value.substr(1).toLowerCase() + (typeof row.last_name != 'undefined' ? row.last_name : ''))}</div>`;
          //   }
          // },
          name: {
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
                return `<div class="overflow-text">${value ? value : '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
          company: {
            title: 'Company',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? this.toTitleCase(value): '-'}</div>`;
              } else {
                return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              }
            }
          },
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
    } else {
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
          
          name  : {
            title: 'Username',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              // if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
              // } else {
              //   return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              // }
            }
          },
          email: {
            title: 'Email',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              // if (this.add_btn || this.edit_btn) {
                return `<div >${value ? value : '-'}</div>`;
              // } else {
              //   return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              // }
            }
          },
          company: {
            title: 'Company',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              // if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? this.toTitleCase(value) : '-'}</div>`;
              // } else {
              //   return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              // }
            }
          },
          mobile: {
            title: 'Mobile',
            filter: true,
            type: 'html',
            valuePrepareFunction: value => {
              // if (this.add_btn || this.edit_btn) {
                return `<div class="overflow-text">${value ? value : '-'}</div>`;
              // } else {
              //   return `<div class="overflow-text">XXXXX@gmail.com</div>`;
              // }
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
      let data={
      id:id,
      status:status==1?"2":"1"
    }
    console.log(status)
    console.log(data)
    this.apiService.CommonApi(Apiconfig.update_trainer_status.method,Apiconfig.update_trainer_status.url,data).subscribe((result)=>{
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
        this.getTrainerList(data)
      }else{
        this.notifyService.showError(result.message)
      }
    })
  }
  ngAfterViewInit(): void {
  
  
    
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
}
