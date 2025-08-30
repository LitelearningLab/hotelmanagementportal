import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalDataSource } from 'src/app/common-table/table/public-api';
import { apis } from 'src/app/interface/interface';
import { PopupComponent } from 'src/app/shared/popup.component';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { TableSettingsService } from 'src/app/_helpers/table-settings.service';
import { ApiService } from 'src/app/_services/api.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-unitlist',
  templateUrl: './unitlist.component.html',
  styleUrls: ['./unitlist.component.scss']
})
export class UnitlistComponent implements OnInit {

  status: any
  getnewuserslist: any[];
  totalItems: any;
  getnewuserlistdata: any;
  getlistusers: any;
  getlistdata: any;
  event_limit: any;
  settings: any;
  env_url: any = environment.apiUrl;
  source: LocalDataSource = new LocalDataSource();
  skip: number = 0;
  limit: number = 10;
  count: number = 0;
  curentUser: any;
  settingData: any;
  default_limit: number = 10;
  userPrivilegeDetails: any;
  add_btn: boolean = true;
  edit_btn: boolean = true;
  view_btn: boolean = false;
  delete_btn: boolean = true;
  addBtnUrl: string = '/app/units/units-add';
  addBtnName: string = 'Add units';
  editUrl: string = 'app/units/units-add/';
  card_details: any[] = [];
  global_status: number = 0;
  global_search: string;
  deleteApis: apis = Apiconfig.adminattributes;
  bulk_action: boolean = true;
  restoreApis: apis = Apiconfig.adminattributes;

  constructor(private router: Router, private authService: AuthenticationService,
    private apiService: ApiService, private sanitized: DomSanitizer, private getSettings: TableSettingsService,
    private notifyService: NotificationService,) {
    this.curentUser = this.authService.currentUserValue;
    if (this.curentUser && this.curentUser.role == "subadmin" && this.curentUser.privileges) {
      if (this.router.url == '/app/units/units-list') {
        this.userPrivilegeDetails = this.curentUser.privileges.filter(x => x.alias == 'Units');
        if (!this.userPrivilegeDetails[0].status.view) {
          this.notifyService.showWarning('You are not authorized this module');
          this.router.navigate(['/app']);
        };
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
      }
    }
    this.loadsettings('')
  }


  ngOnInit(): void {
    var data = {
      limit: this.limit,
      skip: this.skip,
      status: this.status
    }
    if (!this.totalItems || typeof this.totalItems == undefined) {
      this.getUsers(data)
    }
    this.getUsers(data)
  }


  getUsers(getusers) {
    this.apiService.CommonApi(Apiconfig.unitslist.method, Apiconfig.unitslist.url, getusers).subscribe(response => {
      if (response && response.length > 0 && response[0] != 0) {
        this.getlistusers = response[0];
        this.totalItems = response[1];


        this.getlistdata = response[2];
        this.source.load(this.getlistusers);
        this.loadCard_Details(response[2][0].all[0] ? response[2][0].all[0].count : 0, response[2][0].active[0] ? response[2][0].active[0].count : 0, response[2][0].inactive[0] ? response[2][0].inactive[0].count : 0,);
      }
      else {
        this.getlistusers = []
      }
    })
  }

  onDeleteChange(event) {
    // this.ngOnInit();

    var data = {
      limit: this.limit,
      skip: this.skip,
      // status: this.status
    }
    this.getUsers(data)
    // setTimeout(() => {

    // }, 3000);

  };

  onSearchChange(event) {
    this.source = new LocalDataSource();
    this.global_search = event;
    let data = {
      'skip': this.skip,
      'limit': this.limit,
      'search': event
    }
    this.getUsers(data);
  };


  onitemsPerPageChange(event) {
    this.limit = event;
    this.skip = 0;
    this.default_limit = event;
    this.source = new LocalDataSource();
    let data = {
      'skip': this.skip,
      'limit': this.limit,
      'search': this.global_search
    }
    this.getUsers(data);
  };

  onPageChange(event) {
    this.skip = this.limit * (event - 1);
    this.source = new LocalDataSource();
    let data = {
      'skip': this.limit * (event - 1),
      'limit': this.limit,
      'search': this.global_search
    };
    this.getUsers(data);
  }


  loadCard_Details(allValue, activeValue, inactiveValue) {
    this.card_details = [
      {
        title: 'All Attributes',
        value: allValue,
        bg_color: 'clr-green',
        //icon: 'fa fa-users',
        click_val: 'all'
      },
      {
        title: 'Active Attributes',
        value: activeValue,
        bg_color: 'clr-ancblue',
        //icon: 'fa fa-user-plus',
        click_val: 'active'
      },
      {
        title: 'InActive Attributes',
        value: inactiveValue,
        bg_color: 'clr-orange',
        //icon: 'fa fa-user-times',
        click_val: 'inactive'
      },
    ];
  }

  changefeatured(id, status) {
    var data = {
      db: "attributes",
      id: id,
      value: 1
    };
    if (status == 1) {
      data.value = 2;
    }
    this.apiService.CommonApi(Apiconfig.changeStatus.method, Apiconfig.changeStatus.url, data).subscribe(response => {
      if (response && response.status == 1) {
        this.notifyService.showSuccess("Successfully Updated");
        window.location.reload();
      } else {
        this.notifyService.showError("Something went wrong. Please try again later.");
      }
    })
  }

  onheaderCardChange(event) {
    this.skip = 0;
    this.source = new LocalDataSource();
    let data = {
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
    }
    // this.loadsettings(event);
    this.getUsers(data);
  }

  loadsettings(event) {
    this.settings = {
      selectMode: 'multi',
      hideSubHeader: true,
      columns: {
        name: {
          title: 'Name',
          filter: true,
          valuePrepareFunction: value => {
            return value;
          }
        },
        // img: {
        //   title: 'Image ',
        //   filter: true,
        //   type: "html",
        //   valuePrepareFunction: image => {
        //     return '<img src="' + environment.apiUrl + image + '" width="32" height="32">';
        //   }
        // },
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
        createdAt: {
          title: 'Created Date',
          valuePrepareFunction: value => {
            if (value) {
              return new DatePipe('en-US').transform(value, 'dd-MMM-yyyy');
            } else {
              return null;
            }
          }

        }
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
    this.settings.actions.custom = this.getSettings.loadSettings(event, this.curentUser, '/app/units/units-list', this.userPrivilegeDetails, this.delete_btn, this.edit_btn, this.view_btn);
  };

}
