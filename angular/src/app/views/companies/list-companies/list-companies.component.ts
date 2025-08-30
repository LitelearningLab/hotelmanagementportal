import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'src/app/common-table/table/public-api';
import { apis } from 'src/app/interface/interface';
import { PrivilagesData } from 'src/app/menu/privilages';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { TableSettingsService } from 'src/app/_helpers/table-settings.service';
import { ApiService } from 'src/app/_services/api.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { PopupComponent } from 'src/app/shared/popup.component';
import { Tooltip } from 'chart.js';


@Component({
  selector: 'app-list-companies',
  templateUrl: './list-companies.component.html',
  styleUrls: ['./list-companies.component.scss']
})
export class ListCompaniesComponent {
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  skip: number = 0;
  limit: number = 50;
  count: number = 0;
  curentUser: any;
  settingData: any;
  default_limit: number = 50;
  userPrivilegeDetails: PrivilagesData[] = [];
  add_btn: boolean = false;
  edit_btn: boolean = true;
  view_btn:boolean=true
  delete_btn: boolean = false;
  bulk_action: boolean = false;
  activeBulkAction: boolean = false;
  addBtnUrl: string = '/app/administrator/sub-admin-add';
  addBtnName: string = 'Sub Admin Add';
  editUrl: string = '/app/companies/edit/';
  viewUrl: string = '/app/companies/view/';
  deleteApis: apis = Apiconfig.deletecompany;
  card_details: any[] = [];
  global_status: number = 3;
  global_search: string;
  archivedDetails:boolean=false;
  restoreApis: apis = Apiconfig.restoreUser;
  permanentdelete: apis = Apiconfig.user_permanet_delete
  subadminlist: any;
  deletestatus: boolean=false;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthenticationService,
    private cd: ChangeDetectorRef,
    private getSettings: TableSettingsService,
    private notifyService: NotificationService,
    
  ) {
    this.curentUser = this.authService.currentUserValue;
    let currentUserlogined:any=JSON.parse(localStorage.getItem("subAdmin"))
    if (currentUserlogined) {

      if (this.router.url == '/app/companies/list') {
        this.userPrivilegeDetails = currentUserlogined.privileges.filter(x => x.alias == 'company');
     

      
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
    this.loadsettings('');
  }

  ngOnInit(): void {
    var data = {
      'role': 'subAdmin',
      'skip': this.skip,
      'limit': this.default_limit,
      'status': this.global_status,
      'search': this.global_search
    };
    // this.getDataList(data);
    this.getCompanies(data)
  };
  
  getCompanies(data){
    this.apiService.CommonApi(Apiconfig.companies_list.method,Apiconfig.companies_list.url,data).subscribe((result)=>{
      if(result){
        
        // this.loadCard_Details(result.all,result.active,result.inactive,result.delete)    
        this.count=parseInt(result.count)
        this.subadminlist=result.data
        result.data.forEach((element:any) => {
          debugger;
          var days = Math.floor( (new Date(element.subscriptionenddate).valueOf() - (new Date()).valueOf())/(1000 * 60 * 60 * 24));
          //if(days)
        });
        this.source.load(result.data)
       
        this.cd.detectChanges();
      }
    })
  }
  // getDataList(data) {
  //   this.apiService.CommonApi(Apiconfig.adminList.method, Apiconfig.subadminList.url, data).subscribe(
  //     (result) => {
  //       if (result && result.length > 1) {
  //         this.source.load(result[0]);
  //         this.count = result[1];
  //         this.cd.detectChanges();
  //       }
  //     }
  //   )
  // };

  archiveClick(){
    var data = {
      'role': 'subadmin',
      'skip': this.skip,
      'limit': this.default_limit,
      'status': this.global_status,
      'search': this.global_search
    }
    this.archivedDetails=true;
    this.apiService.CommonApi(Apiconfig.archievelist.method, Apiconfig.archievelist.url, data).subscribe(response => {
      this.count = response[1];
      this.source.load(response[0]);
      this.card_details=[];
      this.loadsettings('');
  })

  }
  archieveBack(){
    this.archivedDetails=false;
    this.ngOnInit()
  }

  onDeleteChange(event) {
    console.log("herer i have called")
    if (event && event.status == 1) {
      // this.skip = 0;
      setTimeout(()=>{

        this.ngOnInit();
      },100)
    }
  };

  onSearchChange(event) {
    this.source = new LocalDataSource();
    this.global_search = event;
    this.skip=0
    let data = {
      'role': 'companies',
      'skip': this.skip,
      'limit': this.limit,
      'status': this.global_status,
      'search': event
    }

    this.getCompanies(data)
  };

  onitemsPerPageChange(event) {

    this.limit = event;
    this.skip = 0;
    this.default_limit = event;
    this.source = new LocalDataSource();
    let data = {
      'role': 'companies',
      'skip': this.skip,
      'limit': this.limit,
      'status': this.global_status,
      'search': this.global_search
    }
    // this.getDataList(data);
    this.getCompanies(data)

  };
  onPageChange(event) {
    console.log("hdfusaihdfasf");
    console.log(event)
    
    this.skip = this.limit * (event - 1);
    this.source = new LocalDataSource();
    let data = {
      'role': 'companies',
      'skip': this.limit * (event - 1),
      'limit': this.limit,
      'status': this.global_status,
      'search': this.global_search
    };
    // this.getDataList(data);
    this.getCompanies(data)
  }

  onheaderCardChange(event) {
    this.skip = 0;
    this.source = new LocalDataSource();
    let data = {
      'role': 'companies',
      'skip': this.skip,
      'limit': this.limit,
      'status': this.global_status,
      'search': this.global_search
    }
    if (event == 'all') {
      data.status = 3;
      this.global_status = 3;
      this.deletestatus=false
    } else if (event == 'active') {
      data.status = 1;
      this.global_status = 1;
      this.deletestatus=false
    } else if (event == 'inactive') {
      data.status = 2;
      this.global_status = 2;
      this.deletestatus=false
    } else if (event == 'delete') {
      // this.export_btn = false;
      data.status = 0;
      this.global_status = 0;
      this.deletestatus=true
    } else if (event == 'today') {
      data.status = 5;
      this.global_status = 5;
    }
    this.loadsettings(event);
    this.getCompanies(data);
  }
  changefeatured(id,status){
    let data={
      id:id,
      status:status==1?"2":"1"
    }
      this.apiService.CommonApi(Apiconfig.update_company_status.method,Apiconfig.update_company_status.url,data).subscribe((result)=>{
        if(result.status){
          this.notifyService.showSuccess("Updated successfully")
          var data = {
            'role': 'subAdmin',
            'skip': this.skip,
            'limit': this.default_limit,
            'status': this.global_status,
            'search': this.global_search
          };
          this.getCompanies(data)
        }else{
          this.notifyService.showError(result.message)
        }
      })
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
  loadsettings(event) {
    if (event == 'delete') {
      this.settings = {
        // selectMode: 'multi',
        // hideSubHeader: true,
        columns: {
          index: {
            title: 'S No',
            type: 'text',
            valuePrepareFunction: (value, row, cell) => {
              return cell.row.index + 1 + '.';
            }
          },
       
          name: {
            title: 'Name',
            filter: true,
            valuePrepareFunction: value => {
              return value?value.charAt(0).toUpperCase() + value.substr(1).toLowerCase():'-';
            }
          },
          email: {
            title: 'Email',
            filter: true,
            valuePrepareFunction: value => {
              return value?value:"-";
            }
          },
          mobile: {
            title: 'Phone',
            filter: true,
            valuePrepareFunction: value => {
              return value?value:"-";
            }
          },
          team: {
            title: 'Team',
            filter: true,
            valuePrepareFunction: value => {
              return value?value:"-";
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
          add: false,
          edit: false,
          delete: false,
          columnTitle: 'Actions',
          class: 'action-column',
          position: 'right',
          custom: [],
        },
      }
      this.settings.actions.custom = this.getSettings.loadSettings(event, this.curentUser, '/app/administrator/sub-admin-list', this.userPrivilegeDetails, this.delete_btn, this.edit_btn, false);
    } else {
      this.settings = {
        // selectMode: 'multi',
        hideSubHeader: true,
        columns: {
          index: {
            title: 'S No',
            type: 'text',
            valuePrepareFunction: (value, row, cell) => {
              return cell.row.index +this.skip+ 1 + '.';
            }
          },
          companyname: {
            title: 'Institution',
            filter: true,
            valuePrepareFunction: value => {
              return value?value.charAt(0).toUpperCase() + value.substr(1).toLowerCase():'-';
            }
          },
          
          // name: {
          //   title: 'Name',
          //   filter: true,
          //   valuePrepareFunction: value => {
          //     return value?value.charAt(0).toUpperCase() + value.substr(1).toLowerCase():'-';
          //   }
          // },
          activeusers: {//actually this is max user count for the company
            title: 'App User Limit',
            filter: true,
            valuePrepareFunction: value => {
              return value?value:0;
            }
          },
          totalusers: {
            title: 'Total Assigned App Users ',
            filter: true,
            valuePrepareFunction: value => {
              return value?value:0;
            }
          },
          activeuserscount: {
            title: 'Active App Users',
            filter: false,
            valuePrepareFunction: value => {
              return value?value:0;
            }
          },
          // clientadmincount: {                       //this count is the company subadmin count
          //   title: 'Client Admins',
          //   filter: true,
          //   valuePrepareFunction: value => {
          //     return value?value:0;
          //   }
          // },
          
          trainerscount: {
            title: 'Trainers',
            filter: true,
            valuePrepareFunction: value => {
              return value?value:0;
            }
          },
          
          subscriptionstartdate: {
            title: 'Subscription Start Date',
            filter: true,
            sort: true,
            valuePrepareFunction: value => {
              //const longDateFormat = date.toLocaleDateString('en-US', { dateStyle: 'long' });
              return value?new Date( value).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
              }).replace(/ /g, '-'):'';
            }
          },
          subscriptionenddate: {
            title: 'Subscription End Date',
            filter: true,
            valuePrepareFunction: value => {
              return value?new Date( value).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
              }).replace(/ /g, '-'):'';
            }
          },

          
          // team: {
          //   title: 'Team',
          //   filter: true,
          //   valuePrepareFunction: value => {
          //     return value?value:"-";
          //   }
          // },
          // team: {
          //   title: 'Image',
          //   filter: false,
          //   type: "html",
          //   valuePrepareFunction: value => {
          //     if (Array.isArray(value)) {
          //       let displayValue = value.length > 2 ? value.slice(0, 2).join(', ') + ', ...' : value.join(', ');
          //       return `<h6 class="teamlimit">${displayValue}</h6>`;
          //     }
          //     return `<h6 class="teamlimit">${value}</h6>`;
          //   }
          // },
          status:  {
            title: 'Status / Balance Days',
            filter: false,
            type: 'html',
            editable: true,
            valuePrepareFunction: (value, row, cell) => {
              if(value ==1){
                var num=Math.floor( (new Date(row.subscriptionenddate).valueOf() - (new Date()).valueOf() )/(1000 * 60 * 60 * 24));
                if( Math.sign(num) <= -1){
                  return "<span class='badge badge-danger badge-pill mb-1'>Deactivation Failed = "+num+"</span>"
                }
                else if(num <=90) {
                  return "<span class='badge badge-warning badge-pill mb-1'>Expiring Soon = "+num+"</span>"
                }
                else if(num >=90){
                   return "<span class='badge badge-success badge-pill mb-1'>Active = "+num+"</span>"
                }
                 
                //return Math.floor( (new Date(row.subscriptionenddate).valueOf() - (new Date()).valueOf() )/(1000 * 60 * 60 * 24));
                //return '<span class="badge badge-success badge-pill mb-1"></span>'
              }
              else{
                return "<span class='badge badge-pill badge-danger mb-1'>InActive</span>"
              }
              
            }
            
          }
          // status:  {
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
      this.settings.actions.custom = this.getSettings.loadSettings(event, this.curentUser, '/app/subadmin/list', this.userPrivilegeDetails, this.delete_btn, this.edit_btn, this.view_btn)
    };
  };
}
