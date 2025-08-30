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
import data, { PrivilagesData } from 'src/app/menu/privilages';
import { DefaultStoreService } from 'src/app/_services/default-store.service';
import { PopupComponent } from 'src/app/shared/popup.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-batch-users',
  templateUrl: './batch-users.component.html',
  styleUrls: ['./batch-users.component.scss']
})
export class BatchUsersComponent {
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
  activeBulkAction: boolean = true;
  add_btn: boolean = false;
  add_user:boolean=false;
  category: boolean = true;
  delete_btn: boolean = false;
  edit_btn: boolean = false;
  view_btn: boolean = false;
  pageTitle: string = 'Batch user';
  addBtnUrl: string = '/app/users/add';
  addBtnName: string = 'User Add';
  editUrl: string = '/app/users/edit/';
  viewUrl: string = '/app/users/view/';
  deleteApis: apis = Apiconfig.batch_user_delete;
  permanentdelete: apis = Apiconfig.UserPermanentDele
  exportApis: apis = Apiconfig.userExport;
  restoreApis: apis = Apiconfig.userRestore;
  inactiveApis: apis = Apiconfig.userInactive;
  userActive: apis = Apiconfig.userActive
  card_details: any[] = [];
  global_status: number = 0;
  global_search: string;
  global_filter: string;
  selectedRow: any;
  filter_action: boolean = false;
  filter_action_list: any[] = [];
  global_filter_action = {} as any;
  user_list_filter_action: boolean = true;
  batchid: any;
  userList: any=[];
  selectedUsers: any=[];
  filterForm: FormGroup;
  showfilter: boolean=false;
  currentPage = 1;
  pageSize = 10;
  totalPages: number=0;
  cityList=[]
  roleList: any=[];
  showbathlist: boolean=false;
  companyid: any;
  shiftingbatch: any;
  data: any;
  filterbatch: any;
  AllSelected:boolean=false
  batchForm:FormGroup
  showbatchform: boolean=false;
  companyadmin: boolean=false;
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
    private fb:FormBuilder,
  ) {
    this.loader.loadingSpinner.next(true);
    this.curentUser = this.authService.currentUserValue;
    if (this.curentUser && this.curentUser.role == "subadmin") {
      if (this.router.url == '/app/users/list') {
        this.userPrivilegeDetails = this.curentUser.privileges.filter(x => x.alias == 'users');
        // console.log(this.userPrivilegeDetails);

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
    this.filter_action_list = [
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
      //   name: 'Category',
      //   tag: 'select',
      //   type: '',
      // }
    ]
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
    this.filterForm = this.fb.group({
      company: [null,[Validators.required]],
   
      city: [[] ,[Validators.required]],
      // country: [null,[Validators.required]],
      startdate: ['' ,[Validators.required]],
      enddate: ['',[Validators.required]],
      // team:[null],
      role:[[]]
    });
    this.ActivatedRoute.paramMap.subscribe((result)=>{
      this.batchid=result.get("id")
      console.log("id is hsoe sherererrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
      
      console.log(this.batchid)
    })
    var data = {
      'skip': this.skip,
      'limit': this.default_limit,
      'status': this.global_status,
      'search': this.global_search,
      'filter': this.global_filter,
      'filter_action': this.global_filter_action,
      id:this.batchid
    };
    this.getUserList(data);
   
    this.batchForm=this.fb.group({
      companyid:[null,[Validators.required]],
     // currentbatchid: [null,[Validators.required]],
      city:[[],Validators.required],
      role:[[],Validators.required],
      team:[[]],
      startdate:['',Validators.required],
      enddate:['',Validators.required],
     remarks:[''],
     status:['1',Validators.required],
     
    },{
      validator: this.endDateValidator('startdate', 'enddate') 
    }
  )
  this.getcompany();
  };
  endDateValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
  
      if (matchingControl.errors && !matchingControl.errors.endDateValidator) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
  
      if (control.value && matchingControl.value && new Date(matchingControl.value) < new Date(control.value)) {
        matchingControl.setErrors({ endDateValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  isAllSelected(event:any){
    console.log(event.target.checked)
    if(event.target.checked){
      this.AllSelected =true
      console.log(this.userList)
      this.selectedUsers=[]
      this.selectedUsers=[...this.userList]
    }else{
      this.AllSelected =false
      this.selectedUsers=[]
    }

  }


  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.userList.slice(startIndex, endIndex);
  }

  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }

 // userstr:string="";
  getUserList(data) {    
    this.apiService.CommonApi(Apiconfig.batch_users_list.method, Apiconfig.batch_users_list.url, data).subscribe(
      (result) => {
        
        if (result) {   
          console.log(("resul if thr apoi is got hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"));
          console.log(result);
          this.userList=result.data
         // this.userstr=JSON.stringify(result.data)
          this.pageTitle=result.batchdata.shortname
          this.totalPages = Math.ceil(this.userList.length / this.pageSize);
          if(result.batchdata){
            this.cityList = result.companydata.countryCity.flatMap(country => country.city);
            this.roleList=result.companydata.role
            this.companyid=result.companydata._id
              this.filterForm.patchValue({company:result.companydata._id})
           
          }
          // this.loadCard_Details(result[2].allValue || 0, result[2].activeValue || 0, result[2].deactivateValue || 0, result[2].deletedUsers || 0);
          // this.source.load(result.data);
          // this.count = result.count;

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
      }
    )
  }
  onSelectUser(user, event) {
    if (event.target.checked) {
      this.selectedUsers.push(user);
    } else {
      const index = this.selectedUsers.indexOf(user);
      if (index > -1) {
        this.selectedUsers.splice(index, 1);
      }
    }
    this.updateSelectAllState();
   
  }
  private updateSelectAllState(): void {
 
    this.AllSelected = this.selectedUsers.length === this.userList.length;
  }
 
  clearForm(){
    this.selectedUsers = [];
    this.showfilter=false
    this.showbathlist=false
  
  }
  submitBatchuser(){
    this.showbatchform=false;
    this.filterForm.reset()
    if(this.selectedUsers.length>0){
      this.showfilter=true
    }else{
      this.notifyService.showError("Please select a user")
    }
  }
  getbathlist(){
    this.filterForm.patchValue({company:this.companyid})
    if(this.filterForm.valid){
      let data=this.filterForm.value

      data.batchid=this.batchid
      data.limit=this.default_limit,
      data.skip=this.skip
      this.apiService.CommonApi(Apiconfig.batch_list_shift.method, Apiconfig.batch_list_shift.url,data ).subscribe(
        (result) => {
          if (result) {   
            this.showbathlist=true 
            console.log(result) 
            // // this.loadCard_Details(result.all,result.active,result.inactive,result.delete)    
            this.source.load(result.data);
            this.count = result.count;
  
            // setTimeout(() => {
            //   this.loader.loadingSpinner.next(false);
            // }, 1000);
            // this.cd.detectChanges();
          }
        }
      )
    }else{
      this.filterForm.markAllAsTouched()
    }
  }
  shiftingbatchlist(data){
    this.apiService.CommonApi(Apiconfig.batch_list_shift.method, Apiconfig.batch_list_shift.url,data ).subscribe(
      (result) => {
        if (result) {   
          this.showbathlist=true 
          // // this.loadCard_Details(result.all,result.active,result.inactive,result.delete)    
          this.source.load(result.data);
          this.count = result.count;

        }
      }
    )
  }
  onFilter(){
    console.log(this.filterForm.value)
    // let data = {
    //   'skip': this.skip,
    //   'limit': this.default_limit,
    //   'status': this.global_status,
    //   'search': this.global_search,
    //   'filter': this.global_filter,
    //   'filter_action': this.global_filter_action,
    // };
    this.filterForm.patchValue({company:this.companyid})
    if(this.filterForm.valid){
      this.filterbatch=this.filterForm.value
      
      let data=this.filterForm.value
      
     data.batchid=this.batchid
      data.limit=this.default_limit,
      data.skip=this.skip
      this.shiftingbatchlist(data)
     
    }else{
      this.filterForm.markAllAsTouched()
    }
  }
  shiftBatch(event:any){
    let data:any={}
    data.currentbatchid=this.batchid
    data.userData=this.selectedUsers
    data.shiftingbatch=event
    this.shiftingbatch = event
    this.apiService.CommonApi(Apiconfig.shiftBatch.method,Apiconfig.shiftBatch.url,data).subscribe((result)=>{
      if(result.status){
        this.notifyService.showSuccess("User Moved Successfully")
        this.filterForm.reset()
        this.showbathlist=false
        this.showfilter=false
        var data = {
          'skip': this.skip,
          'limit': this.limit, 
          'status': this.global_status,
          'search': this.global_search,
          'filter': this.global_filter,
          'filter_action': this.global_filter_action,
          id:this.batchid
        };
        this.getUserList(data);
        // this.getUserList()
      }
    })
    console.log(event)
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
    let data=this.filterbatch
    data.skip=this.skip
    data.limit=this.limit
    data.search=this.global_search
    // let data = {
    //   'skip': this.skip,
    //   'limit': this.limit,
    //   'status': this.global_status,
    //   'search': event,
    //   'filter': this.global_filter,
    //   'filter_action': this.global_filter_action,
    //   id:this.batchid

    // }
    
    this.shiftingbatchlist(data)
  };

  onitemsPerPageChange(event) {
    this.limit = event;
    // this.skip = 0;
    this.default_limit = event;
    this.source = new LocalDataSource();
    let data=this.filterbatch
    data.skip=this.skip
    data.limit=this.limit
    data.search=this.global_search
    //  data = {
    //   'skip': this.skip,
    //   'limit': this.limit,
    //   'status': this.global_status,
    //   'search': this.global_search,
    //   'filter': this.global_filter,
    //   'filter_action': this.global_filter_action,
    //    id:this.batchid,
    //   // currentbatchid :this.batchid,
    //   // userData:this.selectedUsers,
    //   // shiftingbatch:this.shiftingbatch
    // }
    this.shiftingbatchlist(data)
   
    
  };
  onPageChange(event) {
    console.log("hjihihdhfaisodfausdfhjadfluahihfn");
    
    console.log(event);
    
    this.skip = this.limit * (event - 1);
    this.source = new LocalDataSource();
    // let data = {
    //   'skip': this.limit * (event - 1),
    //   'limit': this.limit,
    //   'status': this.global_status,
    //   'search': this.global_search,
    //   'filter': this.global_filter,
    //   'filter_action': this.global_filter_action,
    //   id:this.batchid

    // };
    let data=this.filterbatch
    data.skip=this.skip
    data.limit=this.limit
    data.search=this.global_search
    console.log(data)
    this.shiftingbatchlist(data)
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
      id:this.batchid

    }
    if (event == 'all') {
      data.status = 0;
      this.global_status = 0;
      this.user_list_filter_action = true
      this.activeBulkAction = true
    } else if (event == 'active') {
      data.status = 1;
      this.global_status = 1;
      this.user_list_filter_action = true
      this.activeBulkAction = false
    } else if (event == 'inactive') {
      data.status = 2;
      this.global_status = 2;
      this.user_list_filter_action = false
      this.activeBulkAction = true
    } else if (event == 'delete') {
      // this.export_btn = false;
      data.status = 4;
      this.global_status = 4;
      this.user_list_filter_action = false
      this.activeBulkAction = false
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
      this.settings.actions.custom = this.getSettings.loadSettings(event, this.curentUser, '/app/administrator/sub-admin-list', this.userPrivilegeDetails, this.delete_btn, this.edit_btn,  false, false, false);
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
                const maxLength = 50;
                if (value) {
                    return value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
                }
                return "-";
            }},
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
      this.settings.actions.custom = this.getSettings.loadSettings(event, this.curentUser, '/app/subadmin/list', this.userPrivilegeDetails, this.delete_btn, this.edit_btn,false,false , false,true)
    };
  };

  changebatchevent(datas){
    console.log("emieter value")
    // console.log(data)
    var data = {
      'skip': this.skip,
      'limit': this.default_limit,
      'status': this.global_status,
      'search': this.global_search,
      'filter': this.global_filter,
      'filter_action': this.global_filter_action,
      id:this.batchid
    };
    this.getUserList(data);
  }
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

  delUser(u){
    debugger;
    Swal.fire({
      title: "Are you sure want to unassign this user from this batch?",
      //text: "You won't to delete the user!",
      icon: "error",
      html:`<label>Username: ${u.username}</label><br><label>Email: ${u.email}</label><br><label>Batch: ${this.pageTitle}</label>`,
      showCancelButton: true,
      confirmButtonColor: "#4dbd74",
      cancelButtonColor: "#c8ced3",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        var id=[];
        id.push(u._id);
        var data={ids:id};
        this.apiService.CommonApi(Apiconfig.batch_user_delete.method, Apiconfig.batch_user_delete.url, data).subscribe(
          (result) => {
            Swal.fire({
              title: "Unassigned!",
              //text: "User has been unassigned!",
              icon: "success",
              confirmButtonColor: "#c8ced3",
            });
            this.ngOnInit();
          }
        );
      }
    });
  }
  companynames: any;
  getcompany(){
    this.apiService.CommonApi(Apiconfig.getCompanynames.method,Apiconfig.getCompanynames.url,{}).subscribe((result)=>{
     this.companynames=result.data
    })
  }
submitBatch(){
   
  debugger;
  this.batchForm.patchValue({
    companyid: this.companyid, 
   // currentbatchid:this.batchid,
  });
  // this.batchForm.patchValue({
   
  //   // formControlName2: myValue2 (can be omitted)
  // });
    if(this.batchForm.valid){
      console.log("+++++++++++++++++++++++++*************************")
      console.log(this.batchForm.valid)
      let batchdata=this.batchForm.value
      console.log(batchdata)
       let data:any={}
       let companyselected= this.companynames.filter((x)=>x._id===batchdata.companyid)
       batchdata.company=companyselected[0].companyname
       data.selectedusers=this.selectedUsers
       data.batchdata=batchdata
       data.currentbatchid=this.batchid;
      this.apiService.CommonApi(Apiconfig.batchcreateandmove.method,Apiconfig.batchcreateandmove.url,data).subscribe((res)=>{
        //this.submitfilterform=false
        if(res.status){
          // this.notifyService.showSuccess(res.message)
          Swal.fire({
            // position: "top-end",
          
            icon: "success",
            title: res.message,
            text: '"Batch Name Format" - Company Name: 2 letters, City: 2 letters, Roles: 2 letters, Batch Start Date (DD-MM-YY)',
            showConfirmButton: true, // Show the "OK" button
            confirmButtonText: "OK",
            confirmButtonColor: "#c8ced3",
           
          });
          this.clearForm()
          this.showbatchform=false
          this.batchForm.reset()
          this.ngOnInit();
        }else{
          this.notifyService.showError("Somthign went wrong")
        }
      })
    }else{
      this.batchForm.markAllAsTouched();
    }
   //}
    
  }
  showcreatebatch(){
    this.showfilter=false;

    if(this.selectedUsers.length>0){
      this.showbatchform=true;
    }
    else{
      this.notifyService.showError("Please select a user")
    }
  }

  // ngAfterViewInit(): void {
  //   var data = {
  //     'skip': 0,
  //     'limit': 50,
  //     'status': 0,
  //   }
  //   this.apiService.CommonApi(Apiconfig.interestList.method, Apiconfig.interestList.url, data).subscribe(
  //     (result) => {
  //       if (result && result.status == 1) {
  //         this.store.categoryList.next(result.data.userData ? result.data.userData : []);
  //       }
  //     }
  //   );
  // }
}
