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

@Component({
  selector: 'app-senteceslabreportforsentence',
  templateUrl: './senteceslabreportforsentence.component.html',
  styleUrls: ['./senteceslabreportforsentence.component.scss']
})
export class SenteceslabreportforsentenceComponent {
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
  pageTitle: string = 'Sentence Lab & Call Flow Lab (Speech Lab)';
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
  userid: any;
  batchid:any
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
  companynames: any=[];
  teamList: any=[];
  resultdata: any=[];
  paginatedData: any=[];
  date: string;
  word: string;
  sentences: string;
  senarios: string;

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
 
    this.ActivatedRoute.paramMap.subscribe((result)=>{
      this.userid=result.get("id")
      this.senarios=result.get("senarios")
      this.date=result.get("date")
      this.sentences=result.get("sentences")
      console.log(this.userid)
      console.log(this.sentences)
      
     
      this.pronunciationlabreportofaday(this.userid,this.senarios,this.date,this.sentences)
    })
  

  };
  pronunciationlabreportofaday(id:any,senarios:any,date:any,sentences:any){
    this.apiService.CommonApi(Apiconfig.sentenceslabsentences.method,Apiconfig.sentenceslabsentences.url,{userid:id,scenario:senarios,date:date,sentence:sentences}).subscribe((result)=>{
      console.log(result)
      if(result.status){
        this.resultdata=result.data
        this.paginatedData=this.resultdata.slice(this.skip,this.limit)
        setTimeout(()=>{
          this.source.load(this.paginatedData);
          this.count = result.count;
        },100)
      }
    })

  }

  getCountry(data:any){
    if(data!=undefined){

      this.cityList=data.countryCity.flatMap(country=>country.city)
      this.roleList=data.role
      this.teamList=data.team
     
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

  getUserList(data) {    
    // this.apiService.CommonApi(Apiconfig.batch_users_list.method, Apiconfig.batch_users_list.url, data).subscribe(
    //   (result) => {
        
    //     if (result) {   
         
    //       console.log(result);
    //       this.userList=result.data
    //       this.pageTitle=result.batchdata.shortname
    //       this.totalPages = Math.ceil(this.userList.length / this.pageSize);
    //       if(result.batchdata){
    //         this.cityList = result.companydata.countryCity.flatMap(country => country.city);
    //         this.roleList=result.companydata.role
    //         this.companyid=result.companydata._id
    //           this.filterForm.patchValue({company:result.companydata._id})
           
    //       }
      
    //       this.cd.detectChanges();
    //     }
    //   }
    // )
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
    
   
  }
 
  clearForm(){
    this.selectedUsers = [];
    this.showfilter=false
    this.showbathlist=false
  
  }
  submitBatchuser(){
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
  getpronounciatonlist(data:any){
    this.apiService.CommonApi(Apiconfig.pronunciatonlaboverall.method, Apiconfig.pronunciatonlaboverall.url,data ).subscribe(
      (result) => {
        if (result) {   
          this.showbathlist=true 
          console.log(result) 
          // // this.loadCard_Details(result.all,result.active,result.inactive,result.delete)    
          this.source.load(result.data[0].data);
          this.count = result.data[0].total[0].count;

          // setTimeout(() => {
          //   this.loader.loadingSpinner.next(false);
          // }, 1000);
          // this.cd.detectChanges();
        }
      }
    )

  }
  onFilter(){
    console.log(this.filterForm.value)
 
    if(this.filterForm.valid){

      let data=this.filterForm.value
      // data.batchid=this.batchid
      data.limit=this.default_limit,
      data.skip=this.skip
      this.getpronounciatonlist(data)
      
    
    }else{
      this.filterForm.markAllAsTouched()
    }
  }
  shiftBatch(event:any){
    let data:any={}
    data.currentbatchid=this.batchid
    data.userData=this.selectedUsers
    data.shiftingbatch=event
    this.apiService.CommonApi(Apiconfig.shiftBatch.method,Apiconfig.shiftBatch.url,data).subscribe((result)=>{
      if(result.status){
        this.notifyService.showSuccess("User shifted successfully")
        this.filterForm.reset()
        this.showbathlist=false
        this.showfilter=false
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
    console.log(event)
    let data:any={}
    data.limit=this.limit
    data.skip= 0;
    data.search=this.global_search
    this.paginationsearch(data)
    
 
  };

  onitemsPerPageChange(event) {
    this.limit = event;
    this.skip = 0;
    this.default_limit = event;
    this.source = new LocalDataSource();
    // let data = {
    //   'skip': this.skip,
    //   'limit': this.limit,
    //   'status': this.global_status,
    //   'search': this.global_search,
    //   'filter': this.global_filter,
    //   'filter_action': this.global_filter_action,
    //   id:this.batchid
    // }
    let  data:any={}
      data.limit=this.limit
      data.skip=this.skip
      data.search=this.global_search
      this.paginationsearch(data)
  };
  
  paginationsearch(data){

    console.log(data)
    const searchTerm = data.search?.toLowerCase() || '';
    let filteredData = this.resultdata;

    if (searchTerm) {
      filteredData = this.resultdata.filter(item => {
          console.log(item);
          return (
              (item.successRatio?.toString().includes(searchTerm) || '') ||
              (item.date?.toString().includes(searchTerm) || '') ||
              (item.pracatt?.toString().includes(searchTerm) || '') ||
              (item.correct?.toString().includes(searchTerm) || '') ||
              (item.listatt?.toString().includes(searchTerm) || '')
          );
      });
  }

    this.paginatedData=filteredData.slice(data.skip,data.limit)
    setTimeout(()=>{
      this.source.load(this.paginatedData);
    })
  }

  onPageChange(event) {
    console.log("hjihihdhfaisodfausdfhjadfluahihfn");
    
    console.log(event);
    
    this.skip = this.limit * (event - 1);
    this.source = new LocalDataSource();
    // let data=this.filterForm.value
    let data:any={}
    data.limit=this.limit
    data.skip= this.limit * (event - 1);
    data.search=this.global_search
    this.paginationsearch(data)
    // this.getpronounciatonlist(data)
    // let data = {
    //   'skip': this.limit * (event - 1),
    //   'limit': this.limit,
    //   'status': this.global_status,
    //   'search': this.global_search,
    //   'filter': this.global_filter,
    //   'filter_action': this.global_filter_action,
    //   id:this.batchid

    // };
    // this.getUserList(data);
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
    
    ];
  }
  onUsernameClick(data:any){
    console.log(data)
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
        hideSubHeader: false,
        columns: {
          index: {
            title: 'S No',
            type: 'text',
            valuePrepareFunction: (value, row, cell) => {
              return cell.row.index + 1 +this.skip+ '.';
            }
          },
          date: {
            title: 'Dates',
            filter: true,
            // type:"html",
            valuePrepareFunction: value => {
              return value?value:"-"
            }
      
          },
         
          time: {
            title: 'Time',
            filter: true,
            valuePrepareFunction: value => {
              return value ? value : '-';
            }},
            focusWords: {
              title: 'Focus Words',
              filter: true,
              valuePrepareFunction: (value) => { // 'value' is the array of focus words
                  if (!value || value.length === 0) {
                      return "-";  // If no focus words, return "-"
                  }
                  return value.filter(word => word !== "NA").join(', '); // Filter out "NA" and join the rest
              }
          },
          score: {
              title: 'Average Score %',
              filter: true,
              valuePrepareFunction: (value) => {
                  return value ? `${value} %` : '-'; // If value is present, append '%' otherwise return '-'
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
      this.settings.actions.custom = this.getSettings.loadSettings(event, this.curentUser, '/app/subadmin/list', this.userPrivilegeDetails, this.delete_btn, this.edit_btn,false,false , false,false)
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
}
