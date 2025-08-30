import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { apis, restoreapis, exportsapi } from '../interface/interface';
import { ApiService } from '../_services/api.service';
import { NotificationService } from '../_services/notification.service';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, NgModel, NgForm } from '@angular/forms';
import { DefaultStoreService } from '../_services/default-store.service';
import { Apiconfig } from '../_helpers/api-config';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss']
})
export class CommonTableComponent implements OnInit {

  @Input() settings: any;
  @Input() db: any;
  @Input() source: any;
  @Input() count: number = 0;
  @Input() itemsPerPage: number = 50;
  @Input() itemOptionsPerPage = [5, 10, 50, 100];
  @Input() tablename: string = '';
  @Input() add_btn: boolean = false;
  @Input()add_user:boolean=false;
  @Input() template: boolean = false;
  @Input() export_btn: boolean = false;
  @Input() category: boolean = false;
  @Input() support_ticket: boolean = false;
  @Input() filter_transaction_list: boolean = false;
  @Input() addBtnUrl: string = '/';
  @Input() addBtnName: string = '';
  @Input() editUrl: string = '';
  @Input() adduserUrl:string=''
  @Input() bathlistUrl:string=''
  @Input() manageurl: string = '';
  @Input() viewUrl: string = '';
  @Input() deleteApis: apis;
  @Input() card_details: any[] = [];
  @Input() showSearch = true;
  @Input() bulk_action: boolean = false;
  @Input() activeBulkAction: boolean = false;
  @Input() exportApis: exportsapi;
  @Input() restoreApis: restoreapis;
  @Input() inactiveApis: restoreapis;
  @Input() ActiveApis: restoreapis;
  @Input() filter_action: boolean = false;
  @Input()batchlisting:boolean=false
  @Input()companybatchlisting:boolean
  @Input() filter_action_list: any[] = [];
  @Input() user_based_name: string;
  @Input() cardActive: string;
  @Input() notification_action: boolean = false;
  @Input() user_list_filter_action: boolean = false;
  @Input() permanentdelete: apis
  @Input() batchid
  @Input() deletestatus:boolean=false;
  @Output() onPageChange: EventEmitter<any> = new EventEmitter();
  @Output() onitemsPerPageChange: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteChange: EventEmitter<any> = new EventEmitter();
  @Output() onInactivechange: EventEmitter<any> = new EventEmitter();
  @Output() onheaderCardChange: EventEmitter<any> = new EventEmitter();
  @Output() onSearchChange: EventEmitter<any> = new EventEmitter();
  @Output() onNotificationAction: EventEmitter<any> = new EventEmitter();
  @Output() onFilterAction: EventEmitter<any> = new EventEmitter();
  @Output() onexportChange: EventEmitter<any> = new EventEmitter()
  @Output() changebatch:EventEmitter<any>=new EventEmitter()
  @Output() adduser:EventEmitter<any>=new EventEmitter()
  @Output() shiftbatch:EventEmitter<any>=new EventEmitter()

  maxDate = new Date();
  currentPerPage: number = 1;
  seletedRow = [];
  bulkactions: string = 'bulkaction';
  bulkSelect: boolean = false;
  username: string = '';
  password: string = '';
  restoreData: any;
  forcedelete: boolean = false;
  isCollapsed = false;
  filterForm: UntypedFormGroup
  categoryList: any[] = [];
  subcategoryList: any[] = [];
  brandsList: any[] = [];
  feedList: any[] = [];
  // cityList: any[] = [];
  url: any;
  userUrl: any
  touched: boolean = true;
  filterData = {
    City: "",
    Brands: "",
    Status: "",
    Recommended: "",
    Category: "",
    Subcategory: "",
    Company:"",
    city:"",
    country:"",
    From_Date: "",
    To_Date: "",
    id: "",
    Institution:"",
    daterange: [] as Date[] // or daterange: Date[]

  };

  feed: any;
  brands: any;
  plan: any;
  Category: any;
  Company:any
  status: any;
  subcategory: any;
  recommended: any;
  city: any;
  year:any
  course:any;
  country:any
  search_value: any = ''


  @ViewChild('deleteModal', { static: false }) deleteModal: ModalDirective;
  @ViewChild("changebatchModal",{static:false}) changebatchModal:ModalDirective
  @ViewChild("addUserModal",{static:false}) addUserModal:ModalDirective
  @ViewChild('restoreModal', { static: false }) restoreModal: ModalDirective;
  @ViewChild('inactiveModal', { static: false }) inactiveModal: ModalDirective;
  @ViewChild('searchfeild', { static: false }) searchfield;
  @ViewChild("currentBatch") currentBatch:ElementRef
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  @ViewChild('useradd') userSelect: NgSelectComponent;
  // @ViewChild("shiftbatch") shiftedbatch:ElementRef
  modalName: any;
  valueChange: number;
  batchlist: any=[]
  userid: any;
  batchids: string;
  userList: any=[];
  companyid: void;
  errorstatus: boolean;
  useradd: any=null;
  rangedatepiker: any;

  acitivebulkbutton: boolean=true;
  companyList: any[]=[];
  cityList:any[]=[]
  countryList: any[]=[];
  roleList: any[]=[];
  teamList: any[]=[];
  companyadmin: boolean=false;
  companyData: any;
  traineradmin: boolean=false;
  bsConfig: Partial<BsDatepickerConfig>;
  // shiftbatch:any
  constructor(
    private router: Router,
    private apiService: ApiService,
    private notifyService: NotificationService,
    private formBuilder: UntypedFormBuilder,
    private store: DefaultStoreService,
    private activateRoute:ActivatedRoute
  ) {
   
    // console.log(this.router.url);
    this.url = this.router.url
    this.userUrl = '/app/users/list'


    this.bsConfig = {
      dateInputFormat: 'DD-MMM-YYYY',
      containerClass: 'theme-blue',
      showWeekNumbers: false,
      customTodayClass: 'custom-today-class',
      // minMode: 'day',
      showTodayButton:true,
      todayPosition :'right'

      // maxDate: new Date(), // Optional: Uncomment if you want to restrict future dates
    };
  }

  actionclicked(){
    console.log("inside of this function")
    this.acitivebulkbutton=false
  }
  ngOnInit(): void {
    let data=JSON.parse(localStorage.getItem('company'))
    let subadmin=JSON.parse(localStorage.getItem("subAdmin"))
    let trainerdata=JSON.parse(localStorage.getItem('Trainer Login'))
    let companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))
    console.log(this.companybatchlisting,'asd1234asdasdasd');
    
    if(data || subadmin){
      this.companyData=data
      this.companyadmin=true
      this.roleList=data.year
      this.teamList=data.course
      this.cityList = data.city
      this.countryList=data.countryCity
      
      if(this.companybatchlisting){
        let cityies=data.countryCity.flatMap(country=>country.city)
        this.cityList=cityies
      }
    }
    if(companysubadmin){
      console.log(companysubadmin)
      this.companyData=companysubadmin.companydata[0]
      this.companyadmin=true
      this.roleList=companysubadmin.companydata[0].year
      this.teamList=companysubadmin.companydata[0].course
      this.countryList=companysubadmin.companydata[0].countryCity
      if(this.companybatchlisting){
        let cityies=companysubadmin.companydata[0].countryCity.flatMap(country=>country.city)
        this.cityList=cityies
      }
    }
    if(trainerdata){
      this.traineradmin=true
        this.companyData=trainerdata.companydata
        this.roleList=this.companyData.year
        this.teamList=this.companyData.course
        this.countryList=this.companyData.countryCity
        if(this.companybatchlisting){
          let cityies=this.companyData.countryCity.flatMap(country=>country.city)
          this.cityList=cityies
        }
    }

    this.search_value = ''
    this.feed = '';
    this.brands = '';
    this.plan = '';
    this.Category = '';
   
   
    this.status = '';
    this.subcategory = '';
    this.recommended = '';
    // this.city = '';
    this.maxDate.setDate(this.maxDate.getDate())
    this.filterForm = this.formBuilder.group({
      field_0: [new Date()] 
    });
   
    
    this.filter_action_list.forEach((item, index) => {
      this.filterForm.addControl(`field_${index}`, new UntypedFormControl(''))
    });
    this.store.companyList.subscribe(
      (result) => {
        if (result) {
          this.companyList = result;
          // this.cityList = result.city0
          console.log(this.companyList)
        }
      }
    )
    this.store.categoryList.subscribe(
      (result) => {
        if (result) {
          this.categoryList = result;
        }
      }
    )
    this.store.brandsList.subscribe(
      (result) => {
        if (result) {
          this.brandsList = result;
        }
      }
    )
    // this.store.cityList.subscribe(
    //   (result) => {
    //     if (result) {
    //       this.cityList = result;

    //     }
    //   }
    // )
    this.activateRoute.paramMap.subscribe((result)=>{
      console.log(result)
      this.batchids=result.get("id")
    })
    

  };
  getCountry(dataid){

    
    if(this.batchlisting){
      
      let companydata=this.companyList.filter((data)=>data._id==dataid)
      
      this.roleList=companydata[0].role
      console.log(companydata)
      let data=[]
      // this.Company=null;
      this.city = null;
      this.year = null;
      this.course = null;
    for (let i = 0; i < companydata[0].countryCity.length; i++) {
      const cities = companydata[0].countryCity[i].city;
      data.push(...cities);
    }
    

    this.cityList=data
    }else{
      if(dataid===null){
     
        this.countryList=[]
        this.roleList=[]
        this.teamList=[]
        
      }else{
  
        let companydata=this.companyList.filter((data)=>data._id==dataid)
        console.log(companydata)
        // this.cityList=companydata[0].city;
        this.countryList=companydata[0].countryCity
        this.roleList=companydata[0].year
        this.teamList=companydata[0].course
        // console.log(this.cityList)
      }
    }
   

  }
  getCity(country){
    console.log("----------------------------")
    let data=this.countryList.filter((x)=>x.country===country)
   this.city=null
    if(data.length>0){

      this.cityList=data[0].city
    }

  }
  filterSubmite() {
    
debugger;
    console.log("filter_action_list", this.filter_action_list)

    console.log(this.filterForm,'filter form for me...')

    if(this.filterForm.controls.field_0.value === null){
      this.notifyService.showError("Select a Company")
      return
    }

    this.filter_action_list.forEach((item, index) => {
      this.filterData[item.name.split(" ").join("_")] = this.filterForm.value[`field_${index}`];
    })

    let today =  new Date()
    

    if(!this.companyadmin&&!this.traineradmin){
      if(this.batchlisting){
        
        if(this.filterData.Institution===''||this.filterData.Institution===undefined){
          return this.notifyService.showError("Select a Company")
        }
        if(this.filterData.From_Date===""||this.filterData.To_Date==""){
          this.notifyService.showError("Select the date range")
          return
        }
        if(this.filterData.From_Date >= this.filterData.To_Date){
          this.notifyService.showError("To Date should be greater than from date")
          return
        }
      }
      if(this.filterData.Institution===""||this.filterData.Institution===undefined){
        this.notifyService.showError("Select a Company")


    }else{
      console.log("+++++++++++++++++++++++++++++++++++++++++++++++++")
      this.onFilterAction.emit(this.filterData);
    }
    }else{
     
      this.onFilterAction.emit(this.filterData);
    }
    


  };
  selectdate(event){
    console.log(event)
  }
  showAddModal(){
    this.apiService.CommonApi(Apiconfig.user_add_to_batchlist.method,Apiconfig.user_add_to_batchlist.url,{batchid:this.batchid}).subscribe((res)=>{
      if(res.status){
        this.userList=res.data
        this.companyid=res.companyid
        this.addUserModal.show()
      }
    })
  }

  clearformData() {
    this.filterData = {
      City: null,
      Category: null,
      Company:null,
      city:null,
      country:null,
      Subcategory: "",
      Brands: "",
      From_Date: "",
      To_Date: "",
      Status: "",
      Recommended: "",
      id: "",
      Institution:"",
      daterange: [] as Date[] // or daterange: Date[]
    }

    this.onFilterAction.emit(this.filterData);
    setTimeout(() => {
      this.feed = '';
      this.brands = '';
      this.plan = '';
      this.Category = '';
      this.Company=null;
      this.city=null,
      this.country=null,
      this.status = '';
      this.subcategory = '';
      this.recommended = '';
      this.city = null;
      this.country=null
    }, 1000);

  }
  customClassAdd(length) {
    if (length == 3 || length == 4) {
      return 'col-sm-4 col-lg-3'
    } else if (length == 5) {
      return 'custom-class-col-5'
    } else if (length == 6) {
      return 'custom-class-col-6'
    } else if (length == 7) {
      return 'custom-class-col-7'
    }
  }
  getbathces(data:any){
    this.userid=data._id
    this.apiService.CommonApi(Apiconfig.change_batchs_details.method,Apiconfig.change_batchs_details.url,data).subscribe((result)=>{
      console.log(result)
      this.currentBatch.nativeElement.value = result.currentbatch.name
      this.batchlist=result.batchlist
      this.changebatchModal.show();
    })
  }
  onCustomAction(event) {
    console.log(event)
    console.log(event, 'sdsadJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');
    console.log(event.data._id)
    if (event.action == 'editaction') {
      if (this.editUrl != '') {
        this.router.navigate([this.editUrl, event.data._id]);
      }
    }else if(event.action==="batchaction"){
     this.router.navigate([this.bathlistUrl,event.data._id])
    }
    else if(event.action==="addusertobatch"){
      this.router.navigate(["/app/batches/adduser",event.data._id])

    }
    else if(event.action==="user list"){
      this.router.navigate(["/app/batches/viewusers/",event.data._id])

    }
    else if(event.action==="batchchange"){
      console.log(event.data)
      // this.getbathces(event.data)
      this.shiftbatch.emit(event.data)
    
     
    }
     else if (event.action == 'deleteaction') {
      this.seletedRow = [event.data];
      this.forcedelete = false;

      this.deleteModal.show();
    }
    else if (event.action == 'viewaction') {
      if (this.viewUrl != '') {
        if (event.data.foods && event.data.foods.status && (event.data.foods.status == 16 || event.data.foods.status == 17 || event.data.foods.status == 18)) {
          if (event.data.foods.status == 16) {
            console.log(event.data.foods.return_date, 'event.data.foods.return_date');
            const time = new Date(event.data.foods.return_date);
            // Get the timestamp
            const timestamp = time.getTime();
            console.log(timestamp);
            this.router.navigate([this.viewUrl, event.data._id, timestamp, event.data.foods.status]);
          }
          else if (event.data.foods.status == 17) {
            const time = new Date(event.data.foods.collected_date);
            // Get the timestamp
            const timestamp = time.getTime();
            console.log(timestamp);
            this.router.navigate([this.viewUrl, event.data._id, timestamp, event.data.foods.status]);
          }
          else {
            const time = new Date(event.data.foods.refund_date);
            // Get the timestamp
            const timestamp = time.getTime();
            console.log(timestamp);
            this.router.navigate([this.viewUrl, event.data._id, timestamp, event.data.foods.status]);
          }
        } else {
          this.router.navigate([this.viewUrl, event.data._id]);
        }
      }
    }
    else if (event.action == 'restoreaction') {
      this.restoreModal.show();
      this.restoreData = event.data;
    }
    else if (event.action == 'forcedeleteaction') {
      this.deleteModal.show();
      this.forcedelete = true;
      this.seletedRow = [event.data];
    }
    else if (event.action == 'manageaction') {
      if (this.manageurl != '') {
        this.router.navigate([this.manageurl, event.data.code]);
      }
    }
  };
  changepart(data){
    // console.log(this.shiftedbatch)
  }
  sendMailNotify(type) {
    if (this.seletedRow.length == 0) {
      if (type == 'mail') {
        this.notifyService.showError('Please select user to send email');
        return;
      } else {
        this.notifyService.showError('Please select user to send notification');
        return;
      }
    } else {
      let data = {
        type: type,
        data: this.seletedRow
      };
      this.onNotificationAction.emit(data);
    }
  };

  headercardfun(event) {
    this.currentPerPage = 1;
    this.onheaderCardChange.emit(event);
    this.cardActive = event;
  }

  Pagechange(event) {
    if (event && typeof event.page != 'undefined') {
      this.currentPerPage = event.page;
      this.onPageChange.emit(event.page);
    }
  }

  PerPagechange(event) {
    if (event && event.pagingConf && event.pagingConf.perPage) {
      this.currentPerPage = 1;
      this.onitemsPerPageChange.emit(event.pagingConf.perPage);
    }
  }

  onUserRowSelect(event) {
    this.seletedRow = event.selected;
    if (event.selected && event.selected.length > 0) {
      this.bulkSelect = true;
    } else {
      this.bulkSelect = false;
    }
    // this.deleteModal.show();
  }
  timer = null;
  onSearchKeyUp(event) {
    console.log('sdfksdkfskd', this.timer);

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.currentPerPage = 1;
      this.onSearchChange.emit(event);
      this.onFilterAction.emit(this.filterData);

    }, 1000);
  };
  bulkActionChange() {
    console.log("inside of thies")
    if (this.bulkactions != 'bulkaction') {
      if (this.bulkactions && this.bulkactions == 'delete') {
        this.username = '';
        this.password = ''
        this.deleteModal.show();
      } else {
        if (this.bulkactions && this.bulkactions == 'inactive') {
          this.username = '';
          this.password = ''
          this.inactiveModal.show()
          this.modalName = "Inactive"
        } else {
          if (this.bulkactions && this.bulkactions == 'active') {
            this.modalName = "Active"
            this.username = '';
            this.password = ''
            this.inactiveModal.show()
          } else {

          }
        }
      }
    } else {
      this.notifyService.showError('Please choose any one action');
    }
  }
  datachange(data){  

    this.errorstatus=false
   
  }

  changeBatch(data:NgModel){
    let res=data.valid
   if(data.valid){

    this.errorstatus=false
     this.apiService.CommonApi(Apiconfig.shiftBatch.method,Apiconfig.shiftBatch.url,{batchid:data.value,userid:this.userid}).subscribe((result)=>{
       if(result.status){
        this.changebatchModal.hide()
        this.batchlist=[]
        this.changebatch.emit(true)
        this.notifyService.showSuccess("Shifted  successfully")
        this.ngSelectComponent.handleClearClick();
        
        
       }
     })

   }else{
    this.errorstatus=true
    this.notifyService.showError("Please select a Batch")
   }
  }

  addUser(data:NgModel){
  if(data.valid){
    this.errorstatus=false
    let datas={
      data:data.value,
      batchid:this.batchid,
      companyid:this.companyid
    }
    // this.ngSelectComponent.handleClearClick();
    this.apiService.CommonApi(Apiconfig.user_add_to_batch.method,Apiconfig.user_add_to_batch.url,datas).subscribe((result)=>{
      if(result.status){
        this.addUserModal.hide()
        this.changebatch.emit(true)
        this.notifyService.showSuccess("Userd added successfully")
        
        data.reset()
      }
    })
  }else{
    this.errorstatus=true
  }
}
  confirm() {
    // if (this.bulkSelect) {
    //   if (this.username == '' || typeof this.username == 'undefined') {
    //     this.notifyService.showError('Please enter Username');
    //     return false;
    //   }
    //   if (this.password == '' || typeof this.password == 'undefined') {
    //     this.notifyService.showError('Please enter Password');
    //     return false;
    //   }
    // };
    var data = this.seletedRow.map(x => x._id);
    console.log(this.forcedelete, 'this is force delete');
    // console.log(this.permanentdelete.method, 'this.permanentdelete.method');
    // console.log(this.permanentdelete.url, 'this.permanentdelete.url');

    if (this.deletestatus) {
      console.log("hi this is okke?");
      this.apiService.CommonApi(this.permanentdelete.method, this.permanentdelete.url, { ids: data, username: this.username, password: this.password, forcedelete: this.forcedelete }).subscribe(
        (result) => {
          if(result.status){
            this.notifyService.showSuccess("Deleted successfully.");
            this.deleteModal.hide();
            this.onDeleteChange.emit(result);
          }
        //   if (result && result.ok == 1) {

        //     this.forcedelete = false;
        //     this.bulkSelect = false;
        //     this.bulkactions = 'bulkaction';
        //     this.notifyService.showSuccess("Deleted successfully.");
        //     this.deleteModal.hide();
        //     // this.username = ''
        //     // this.password = ''

        //     this.onDeleteChange.emit(result);
        //   } else if (result && result.status == 1) {

        //     this.forcedelete = false;
        //     this.bulkSelect = false;
        //     this.bulkactions = 'bulkaction';
        //     this.notifyService.showSuccess("Deleted successfully.");
        //     this.deleteModal.hide();
        //     // this.username = ''
        //     // this.password = ''

        //     this.onDeleteChange.emit(result);
        //   }
        //   else {

        //     this.bulkactions = 'bulkaction';
        //     this.notifyService.showSuccess("Deleted successfully.");
        //     this.deleteModal.hide();
        //     // this.username = ''
        //     // this.password = ''

        //     this.onDeleteChange.emit(result);
        //   }
        },
        (error) => {
          this.notifyService.showError(error.msg);
        }
      )
    } else {
      this.apiService.CommonApi(this.deleteApis.method, this.deleteApis.url, { ids: data, username: this.username, password: this.password, forcedelete: this.forcedelete }).subscribe(
        (result) => {
        

          if (result && result.ok == 1) {

            this.forcedelete = false;
            this.bulkSelect = false;
            this.bulkactions = 'bulkaction';
            this.notifyService.showSuccess("Deleted successfully.");
            // this.username = ''
            // this.password = ''
            this.deleteModal.hide();


            this.onDeleteChange.emit(result);
          } else if (result && result.status == 1) {

            this.forcedelete = false;
            this.bulkSelect = false;
            this.bulkactions = 'bulkaction';
            this.notifyService.showSuccess("Deleted successfully.");
            // this.username = ''
            // this.password = ''
            this.deleteModal.hide();


            this.onDeleteChange.emit(result);
          }
          else if (result.status == false) {
            this.notifyService.showError(result.msg);
          }
          else {
            this.notifyService.showSuccess("Deleted successfully.");
            this.deleteModal.hide();
            // this.username = ''
            // this.password = ''

            this.onDeleteChange.emit(result);
          }
        },
        (error) => {
          this.notifyService.showError(error.msg);
        }
      )
    }

  };

  confirmInActive() {
    if (this.bulkSelect) {
      if (this.username == '' || typeof this.username == 'undefined') {
        this.notifyService.showError('Please enter Username');
        return false;
      }
      if (this.password == '' || typeof this.password == 'undefined') {
        this.notifyService.showError('Please enter Password');
        return false;
      }


    }

    if (this.bulkactions == 'active') {
      this.valueChange = 1
    }


    if (this.bulkactions == 'inactive') {
      this.valueChange = 2
    }


    var changedata = {};
    var data = this.seletedRow.map(x => x._id);
    if (this.inactiveApis.url == "admins/multichangeStatus") {
      changedata = { ids: data, value: this.valueChange, db: this.db ? this.db : this.inactiveApis.db };
    } else {
      changedata = { ids: data, username: this.username, password: this.password };
    }
    this.apiService.CommonApi(this.inactiveApis.method, this.inactiveApis.url, changedata).subscribe(
      (result) => {
        // console.log("sdfwsefresult", result)
        if (result && result.status == 1) {
          this.bulkactions = 'bulkaction'
          console.log("sdfwsef", this.bulkactions)
          // this.forcedelete = false;
          this.bulkSelect = false;
          // this.bulkactions = ""
          if (this.inactiveApis.db && this.inactiveApis.db == 'users') {

            this.notifyService.showSuccess("User status updated");
          } else {
            this.notifyService.showSuccess(result.message);

          }
          this.inactiveModal.hide();
          // this.username = ''
          // this.password = ''
          this.onInactivechange.emit(result);
        } else {
          this.notifyService.showError(result.message);
        }
      },
      (error) => {
        this.notifyService.showError(error.message);
      }
    )

  }

  confirmRestore() {
    if (this.restoreData && this.restoreData._id) {
      var data = {};
      if (this.restoreApis.url == 'admins/changeStatus') {
        data = { id: this.restoreData._id, value: this.restoreApis.value, db: this.restoreApis.db }
      } else {
        data = { ids: this.restoreData._id };
      }
      this.apiService.CommonApi(this.restoreApis.method, this.restoreApis.url, data).subscribe(
        (result) => {
          if (result && result.status) {
            this.bulkSelect = false;
            this.notifyService.showSuccess(result.message ? result.message : "Successfully updated.");
            this.restoreModal.hide();
            // this.username = ''
            // this.password = ''
            this.onDeleteChange.emit(result);
          } else {
            this.notifyService.showError(result.message);
          }
        },
        (error) => {
          this.notifyService.showError(error.message);
        }
      )
    }
  }

  exportFunction(key) {
    var data = {};
    if (this.exportApis.url == Apiconfig.exportdashboardorder.url) {
      data = { status: this.filterData.Status, start_date: this.filterData.From_Date, end_date: this.filterData.To_Date, city: this.filterData.City }
    }
    this.onexportChange.emit(data)

  }
  downloadFile(url) {
    window.open(url);
  }
  getsubcategory(value) {
    if (value)
      this.apiService.CommonApi("post", "scategory/get_all_sub", { id: value }).subscribe(
        (result) => {
          console.log("comming not  in the else part of the get sub category function ", result)
          if (result && result.length > 0) {
            this.subcategoryList = result;


          } else {
            this.subcategoryList = []
            // console.log("comming in the else part of the get sub category function ", this.subcategoryList)
          }
        },
        (error) => {
          this.notifyService.showError(error.message);
        }
      )
  }
  destroySearc() {
    setTimeout(() => {
      this.searchfield.nativeElement.value = '';
    }, 500);
  }
}
