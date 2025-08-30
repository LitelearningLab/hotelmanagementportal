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

@Component({
  selector: 'app-list-subadmin',
  templateUrl: './list-subadmin.component.html',
  styleUrls: ['./list-subadmin.component.scss']
})
export class ListSubadminComponent {
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  skip: number = 0;
  limit: number = 10;
  count: number = 0;
  curentUser: any;
  settingData: any;
  default_limit: number = 10;
  userPrivilegeDetails: PrivilagesData[] = [];
  add_btn: boolean = false;
  edit_btn: boolean = true;
  delete_btn: boolean = true;
  addBtnUrl: string = '/app/administrator/sub-admin-add';
  addBtnName: string = 'Sub Admin Add';
  editUrl: string = '/app/subadmin/edit/';
  viewurl:string="/app/subadmin/view/"

  deleteApis: apis = Apiconfig.subadminDelete;
  card_details: any[] = [];
  global_status: number = 0;
  global_search: string;
  archivedDetails:boolean=false;
  restoreApis: apis = Apiconfig.subadmin_restore;
  subadminlist: any;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthenticationService,
    private cd: ChangeDetectorRef,
    private getSettings: TableSettingsService,
    private notifyService: NotificationService,
  ) {
    this.curentUser = this.authService.currentUserValue;
    if (this.curentUser && this.curentUser.role == "subadmin") {
      if (this.router.url == '/app/administrator/sub-admin-list') {
        this.userPrivilegeDetails = this.curentUser.privileges.filter(x => x.alias == 'administrator');
        if (!this.userPrivilegeDetails[0].status.view) {
          this.notifyService.showWarning('You are not authorized this module');
          this.router.navigate(['/app']);
        };
        if (this.userPrivilegeDetails[0].status.add) {
          this.add_btn = true;
        } else {
          this.add_btn = false;
        }
        if (this.userPrivilegeDetails[0].status.edit) {
          this.edit_btn = true;
        } else {
          this.edit_btn = false;
        }
        if (this.userPrivilegeDetails[0].status.delete) {
          this.delete_btn = true;
        } else {
          this.delete_btn = false;
        }
      }
    }
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
    this.getSubadminlist(data)
  };
  getSubadminlist(data){
    this.apiService.CommonApi(Apiconfig.sub_admin_list.method,Apiconfig.sub_admin_list.url,data).subscribe((result)=>{
      if(result){
        console.log();
        this.count=parseInt(result.count)
        this.subadminlist=result.data
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
    if (event && event.status == 1) {
      this.skip = 0;
      this.ngOnInit();
    }
  };

  onSearchChange(event) {
    this.source = new LocalDataSource();
    this.global_search = event;
    let data = {
      'role': 'subadmin',
      'skip': this.skip,
      'limit': this.limit,
      'status': this.global_status,
      'search': event
    }
    console.log(this.global_search)
    // this.getD  ataList(data);
    this.getSubadminlist(data)
  };

  onitemsPerPageChange(event) {

    this.limit = event;
    this.skip = 0;
    this.default_limit = event;
    this.source = new LocalDataSource();
    let data = {
      'role': 'subadmin',
      'skip': this.skip,
      'limit': this.limit,
      'status': this.global_status,
      'search': this.global_search
    }
    // this.getDataList(data);
    this.getSubadminlist(data)

  };
  onPageChange(event) {
    console.log("hdfusaihdfasf");
    console.log(event)
    
    this.skip = this.limit * (event - 1);
    this.source = new LocalDataSource();
    let data = {
      'role': 'subadmin',
      'skip': this.limit * (event - 1),
      'limit': this.limit,
      'status': this.global_status,
      'search': this.global_search
    };
    // this.getDataList(data);
    this.getSubadminlist(data)
  }

  onheaderCardChange(event) {
    this.skip = 0;
    this.source = new LocalDataSource();
    let data = {
      'role': 'subadmin',
      'skip': this.skip,
      'limit': this.limit,
      'status': this.global_status,
      'search': this.global_search
    }
    if (event == 'all') {
      data.status = 0;
      this.global_status = 0;
    } else if (event == 'active') {
      data.status = 1;
      this.global_status = 1;
    } else if (event == 'inactive') {
      data.status = 2;
      this.global_status = 2;
    } else if (event == 'delete') {
      data.status = 4;
      this.global_status = 4;
    } else if (event == 'today') {
      data.status = 5;
      this.global_status = 5;
    }
    this.loadsettings(event);
    // this.getDataList(data);
  }

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
              return cell.row.index + 1 + '.';
            }
          },
          name: {
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
          status: {
            title: 'status',
            filter: true,
            type:"html",
            valuePrepareFunction: value => {
              if(value==1){
                return `<span class="badge badge-success">Active</span>`
              }else{
                return `<span class="badge badge-danger">In Active</span>`
              }
            }
          },
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
          //       // this.changefeatured(row._id, row.status);
          //     });
          //   }
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
      this.settings.actions.custom = this.getSettings.loadSettings(event, this.curentUser, '/app/subadmin/list', this.userPrivilegeDetails, this.delete_btn, this.edit_btn, true)
    };
  };

}
