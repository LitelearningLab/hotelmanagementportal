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
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss']
})
export class BatchListComponent {
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
  adduser:boolean=true
  view_btn: boolean = true;
  deletestatus: boolean=false;
  companydate: any;
  addBtnUrl: string = '/app/users/add';
  addBtnName: string = 'User Add';
  editUrl: string = '/app/batches/edit/'
  viewUrl: string = '/app/users/view/';
  adduserUrl:string="/app/batches/adduser"
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
  batchbutton: boolean=true;
  batchlisting:boolean=true
  companybatchlisting:boolean=false;

  selectedUsers: any=[];
  trainerdata: any;
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
    private store: DefaultStoreService,
    
  ) {

    this.companydate=JSON.parse(localStorage.getItem('company'))
    this.trainerdata=JSON.parse(localStorage.getItem("Trainer Login"))
    this.companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))
    
  
    this.loader.loadingSpinner.next(true);
    this.curentUser = this.authService.currentUserValue;
    
    let currentUserlogined:any=JSON.parse(localStorage.getItem("subAdmin"))
    if (currentUserlogined) {
      

      if (this.router.url == '/app/batches/edit') {
        this.userPrivilegeDetails = currentUserlogined.privileges.filter(x => x.alias == 'batch');
     

        // if (!this.userPrivilegeDetails[0].status.view) {
        //   this.notifyService.showWarning('You are not authorized this module');
        //   this.router.navigate(['/app']);
        // };


        // if (this.userPrivilegeDetails[0].status.delete) {
        //   this.delete_btn = true;
        // } else {
        //   this.delete_btn = false;
        // }
        if (this.userPrivilegeDetails[0].status.edit) {
          this.edit_btn = true;
        } else {
          this.edit_btn = false;
        }
        if (this.userPrivilegeDetails[0].status.add) {
          this.adduser = true;
        } else {
          this.adduser = false;
        }




        // if (this.add_btn || this.edit_btn) {
        //   this.export_btn = true;
        // } else {
        //   this.export_btn = false;
        // }
      }
    };

      if(this.companydate ||this.companysubadmin){
        console.log("inside")
       this.companybatchlisting=true
        this.filter_action_list = [
        
          // {
          //   name: 'Country',
          //   tag: 'select',
          //   type: '',
          // },
          {
            name: 'City',
            tag: 'select',
            type: '',
          },
          {
            name: 'Role',
            tag: 'select',
            type: '',
          },
          // {
          //   name: 'Team',
          //   tag: 'select',
          //   type: '',
          // },
       
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
          // {
          //   name: 'Status',
          //   tag: 'select',
          //   type: '',
          // }, 
         
        ]
      }
      else if(this.trainerdata){
        this.companybatchlisting=true
        this.filter_action_list = [
        
          // {
          //   name: 'Country',
          //   tag: 'select',
          //   type: '',
          // },
          {
            name: 'City',
            tag: 'select',
            type: '',
          },
          {
            name: 'Role',
            tag: 'select',
            type: '',
          },
          // {
          //   name: 'Team',
          //   tag: 'select',
          //   type: '',
          // },
       
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
          // {
          //   name: 'Status',
          //   tag: 'select',
          //   type: '',
          // }, 
         
        ]
      }
      else{
        this.filter_action_list = [
          {
            name: 'Company',
            tag: 'select',
            type: '',
          },
          // {
          //   name: 'Country',
          //   tag: 'select',
          //   type: '',
          // },
          {
            name: 'City',
            tag: 'select',
            type: '',
          },
          {
            name: 'Role',
            tag: 'select',
            type: '',
          },
          // {
          //   name: 'Team',
          //   tag: 'select',
          //   type: '',
          // },
       
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
          // {
          //   name: 'Status',
          //   tag: 'select',
          //   type: '',
          // }, 
         
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
    debugger;
    var data = {
      'skip': this.skip,
      'limit': this.default_limit,
      'status': this.global_status,
      'search': this.global_search,
      'filter': this.global_filter,
      'filter_action': this.global_filter_action,
      

    };

      // this.getUserList(data)
   
      let batchListData = JSON.parse(localStorage.getItem('batchlist'));

      if (batchListData) {
       
        this.getUserList(batchListData);
      }
    
    
  };

  getUserList(data) {
    let company: any = JSON.parse(localStorage.getItem('company'));
    let subadmin = JSON.parse(localStorage.getItem('subAdmin'));
  
    if (company) {
      // Save company data to local storage
      localStorage.setItem('batchlist', JSON.stringify(data));
      
      data.filter_action.Company = company._id;
  
      this.apiService.CommonApi(Apiconfig.batch_list.method, Apiconfig.batch_list.url, data).subscribe(
        (result) => {
          if (result) {
            console.log(result);
            this.source.load(result.data);
            this.count = result.count;
  
            setTimeout(() => {
              this.loader.loadingSpinner.next(false);
            }, 1000);
            this.cd.detectChanges();
          }
        }
      );
  
    } else if (this.companysubadmin) {
      // Save company data from companysubadmin to local storage
      localStorage.setItem('batchlist', JSON.stringify(data));
  
      data.filter_action.Company = this.companysubadmin.companydata[0]._id;
  
      this.apiService.CommonApi(Apiconfig.batch_list.method, Apiconfig.batch_list.url, data).subscribe(
        (result) => {
          if (result) {
            console.log(result);
            this.source.load(result.data);
            this.count = result.count;
  
            setTimeout(() => {
              this.loader.loadingSpinner.next(false);
            }, 1000);
            this.cd.detectChanges();
          }
        }
      );
      
    } else if (localStorage.getItem("Trainer Login")) {
      this.view_btn = true;
      this.traineractive = true;
  
      let trainerData = JSON.parse(localStorage.getItem("Trainer Login"));
      // Save trainerData to local storage
      localStorage.setItem('batchlist', JSON.stringify(data));
  
      data.filter_action.Company = trainerData.companyid;
      data.companyid = trainerData.companyid;
  
      this.apiService.CommonApi(Apiconfig.batch_list.method, Apiconfig.batch_list.url, data).subscribe(
        (result) => {
          if (result) {
            console.log(result);
            this.source.load(result.data);
            this.count = result.count;
  
            setTimeout(() => {
              this.loader.loadingSpinner.next(false);
            }, 1000);
            this.cd.detectChanges();
          }
        }
      );
    } else if (localStorage.getItem("Admin") || subadmin) {
      // Save subadmin data to local storage
      localStorage.setItem('batchlist', JSON.stringify(data));
  
      this.apiService.CommonApi(Apiconfig.batch_list.method, Apiconfig.batch_list.url, data).subscribe(
        (result) => {
          if (result) {
            console.log(result);
            this.source.load(result.data);
            this.count = result.count;
  
            setTimeout(() => {
              this.loader.loadingSpinner.next(false);
            }, 1000);
            this.cd.detectChanges();
          }
        }
      );
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
    this.limit=0
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
    console.log("here i have reached");
    
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

  // changefeatured(id, status) {
  //   let data = {
  //     id: id,
  //     status: status == 1 ? "2" : "1"
  //   }
  //   this.apiService.CommonApi(Apiconfig.update_batch_status.method, Apiconfig.update_batch_status.url, data).subscribe((result) => {
  //     if (result.status) {
  //       // this.notifyService.showSuccess("Updated Successfully")
  //       if(this.companydata){
  //         let data = {
  //           'role': '',
  //           'skip': this.skip,
  //           'limit': this.default_limit,
  //           'status': this.global_status,
  //           'search': this.global_search,
  //           id:this.companydata._id
  //         };
  //         this.getBatchList(data)
  //       }else{
  //         let data = {
  //           'role': '',
  //           'skip': this.skip,
  //           'limit': this.default_limit,
  //           'status': this.global_status,
  //           'search': this.global_search,
  //           id:this.companyid
  //         };
  //         this.getBatchList(data)
  //       }
       
  //     } else {
  //       this.notifyService.showError(result.message)
  //     }
  //   })
  // }
  loadsettings(event) {
    if (event == 'delete') {
      this.settings = {
        selectMode: 'multi',
        hideSubHeader: true,
        columns: {
          username: {
            title: 'Admin Name',
            filter: true,
            valuePrepareFunction: value => {
              return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
            }
          },
          email: {
            title: 'Email',
            filter: true,
            valuePrepareFunction: value => {
              return value;
            }
          },
          activity: {
            title: 'Last Login Date',
            filter: true,
            valuePrepareFunction: value => {
              if (value) {
                var date = value.last_login ? value.last_login : new Date();
                return new DatePipe('en-US').transform(date, 'MMM dd, yyyy');
              } else {
                return null;
              }
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
      this.settings.actions.custom = this.getSettings.loadSettings(event, this.curentUser, '/app/administrator/sub-admin-list', this.userPrivilegeDetails, this.delete_btn, this.edit_btn,  this.batchbutton, false, false);
    } else {
      this.settings = {
        // selectMode: 'multi',
        hideSubHeader: true,
        columns: {
          index: {
            title: 'S No',
            type: 'text',
            valuePrepareFunction: (value, row, cell) => {
              return cell.row.index + 1 +this.skip+ '.';
            }
          },
          // name: {
          //   title: 'Name',
          //   filter: true,
          //   valuePrepareFunction: value => {
          //     return value ? value.charAt(0).toUpperCase() + value.substr(1).toLowerCase() : '-';
          //   }
          // },
          // email: {
          //   title: 'Email',
          //   filter: true,
          //   valuePrepareFunction: value => {
          //     return value ? value : "-";
          //   }
          // },
          shortname: {
            title: 'Batch Name',
            filter: true,
            valuePrepareFunction: value => {
              return value ? value : "-";
            }
          },
         
          city: {
            title: 'City',
            filter: true,
            valuePrepareFunction: value => {
              if (Array.isArray(value)) {
                return value
                  .map(city => 
                    city
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(' ')
                  )
                  .join(', ');
              }
              return value ? value : "-";
            }
          },
          usercount: {
            title: 'Users Count',
            filter: true,
            valuePrepareFunction: value => {
              return value ? value : "-";
            }
          },
          remarks: {
            title: 'Remarks',
            filter: true,
            valuePrepareFunction: value => {
              const maxLength = 100;
              if (value) {
                // Capitalize the first letter of the remarks
                value = value.charAt(0).toUpperCase() + value.slice(1);
          
                // Truncate the value if it exceeds maxLength
                return  value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
              }
              return "-";
            }
          },
          startDate: {
            title: 'Training Start & End Date',
            filter: true,
            valuePrepareFunction: (value, row) => {
                const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                };
        
                const startDateFormatted = formatDate(row.startdate);
                const endDateFormatted = formatDate(row.enddate);
                return `${startDateFormatted} to ${endDateFormatted}`;
            }
        },
       
        
          // status: {
          //   title: 'status',
          //   filter: true,
          //   valuePrepareFunction: value => {
          //     if(value==1){
          //       return "active"
          //     }else{
          //       return "inactive"
          //     }
          //   }
          // },

          // status: {
          //   title: 'Status',
          //   filter: false,
          //   type: 'custom',
          //   renderComponent: PopupComponent,
          //   sort: false,
          //   editable: true,
          //   onComponentInitFunction: (instance: any) => {
          //     instance.save.subscribe(row => {
          //       console.log(row)
          //       this.changefeatured(row._id, row.status);
          //     });
          //   }
          // }
          // activitys: {
          //   title: 'Last Login Date',
          //   filter: true,
          //   valuePrepareFunction: value => {
          //     if (value) {
          //       var date = value.last_login ? value.last_login : new Date();
          //       return new DatePipe('en-US').transform(date, 'MMM dd, yyyy');
          //     } else {
          //       return null;
          //     }
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
      this.settings.actions.custom = this.getSettings.loadSettings(event, this.curentUser, '/app/subadmin/list', this.userPrivilegeDetails, this.delete_btn, this.edit_btn,false,this.adduser , true)
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
}
