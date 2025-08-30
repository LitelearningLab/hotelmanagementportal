import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from '@khazii/ngx-intl-tel-input';
import { ApiService } from 'src/app/_services/api.service';
import { COUNTRY } from 'src/app/_services/country';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { interest, language } from "src/app/interface/interface";
import { NotificationService } from 'src/app/_services/notification.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from "src/environments/environment";
import { RootUserDetails } from 'src/app/interface/userDetails.interface';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PrivilagesData } from 'src/app/menu/privilages';
import { Country } from 'country-state-city';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
const phoneNumberUtil = PhoneNumberUtil.getInstance();
import swal from 'sweetalert2';
import {
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
  DxButtonModule, DxPopupModule, DxPopoverModule, getElement,DxDataGridComponent
} from 'devextreme-angular';

interface IRange {
  value: Date[];
  label: string;
}
@Component({
  selector: 'app-add-edit-batch',
  templateUrl: './add-edit-batch.component.html',
  styleUrls: ['./add-edit-batch.component.scss']
})
export class AddEditBatchComponent {
  @ViewChild('batchAddEditForm') form: NgForm;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  selectedCountryISO: CountryISO;

  userimageChangedEvent: any = '';
  usercroppedImage: any = 'assets/image/user.jpg';
  interestList: interest[] = [];
  languageList: language[] = [];
  test = 'Select Your languages'
  coverimageChangedEvent: any = '';
  coverCroppedImage: any = 'assets/image/coverimg.png';
  coverfinalImage: File;
  userfinalImage: File;
  userDetails: any;
  RootUserDetails: RootUserDetails;
  pageTitle: string = 'Create Batch';
  submitebtn: boolean = false;
  viewpage: boolean = false;
  imageurl: string = environment.apiUrl;
  emailVerifyTag: number = 2;
  minDate: Date = new Date();
  @ViewChild('search') public searchElementRef: ElementRef;
  public latitude: number;
  public longitude: number;
  private geoCoder;
  curentUser: any;
  userPrivilegeDetails: PrivilagesData[];
  checkpassword: boolean = false;
  agm_address = {
    fulladres: ""
  }
  address: { fulladres: string; };
  user_image: any;
  croppedImage: any;
  currentEmail: any;
  removerPhoto: boolean=false;
  companynames: any;
  id: any;
  roleitmes:any
  teamdata:any
  edituserdata: boolean=false;
  citynames: any;
  disableinput: boolean=false;
  showdatapicker: boolean=false;
  companydisable: boolean;
  companydata: any;
  companyadmin: boolean=false;
  trainerData: any;
  traineradmin: boolean=false;
  shortnameshow: boolean=false;
  disablecompany: boolean=false;
  filterForm: FormGroup;
  batchForm:FormGroup
  filteredUsers = [];
  selectedUsers = [];
  countryList: any;
  cityList: string[] = []; //
  roleList: any=[];
  teamList: any=[];
  userList: any=[];
  showTable: boolean=false;
  showerror: boolean=false;
  showbatchform: boolean=false;
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false
  };
  editbatchboolean: boolean=false;
  companysubadmin: any;
  submitfilterform: boolean=false;
  @ViewChild('dataGridVar', { static: false }) dataGridVar: DxDataGridComponent;
  isViewCratedUsers=false;
  ranges: IRange[] = [{
    value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
    label: 'Last 7 Days'
  }, {
    value: [new Date(new Date().setDate(new Date().getDate() - 14)), new Date()],
    label: 'Last 2 Weeks'
  },
  {
    value: [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()],
    label: 'Last 1 Month'
  },
  {
    value: [new Date(new Date().setDate(new Date().getDate() - 180)), new Date()],
    label: 'Last 6 Months'
  },
  {
    value: [new Date(new Date().setDate(new Date().getDate() - 360)), new Date()],
    label: 'Last 1 Year'
  },
];
  constructor(
    private fb:FormBuilder,
    private ActivatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    // private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private authService: AuthenticationService,
  ) {
    this.curentUser = this.authService.currentUserValue;
    var split = this.router.url.split('/');
   
    if (this.curentUser && this.curentUser.role == "subadmin") {
      if (this.router.url == '/app/users/add' || (split.length > 0 && split[2] == 'users')) {
        this.userPrivilegeDetails = this.curentUser.privileges.filter(x => x.alias == 'users');
        if (!this.userPrivilegeDetails[0].status.view) {
          this.notifyService.showWarning('You are not authorized this module');
          this.router.navigate(['/app']);
          return;
        };
        if (!this.userPrivilegeDetails[0].status.add && !this.ActivatedRoute.snapshot.paramMap.get('id')) {
          this.notifyService.showWarning('You are not authorized this module');
          this.router.navigate(['/app']);
          return;
        };
        if (!this.userPrivilegeDetails[0].status.edit && this.ActivatedRoute.snapshot.paramMap.get('id')) {
          this.notifyService.showWarning('You are not authorized this module');
          this.router.navigate(['/app']);
          return;
        };
      };
    };
    if (split && split.length > 3) {
     
      if ('view' == split[3]) {
        this.viewpage = true;
    
      }
    };
    this.companydata=JSON.parse(localStorage.getItem("company"))
    this.trainerData=JSON.parse(localStorage.getItem("Trainer Login"))
    this.companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))
    if(this.companydata){
      
      const cityArray = this.companydata.countryCity.flatMap(country => country.city);
     
      this.teamList=this.companydata.team
      this.companyadmin=true
      this.disableinput=true
      this.cityList=cityArray
    
      // this.teamdata=this.companydata.team
      this.roleList=this.companydata.year
    }
    if(this.companysubadmin){
      const cityArray=this.companysubadmin.companydata[0].countryCity.flatMap(country=>country.city)
      this.companyadmin=true
      this.disableinput=true
      this.teamList=this.companysubadmin.companydata[0].team
      this.cityList=cityArray
      this.roleList=this.companysubadmin.companydata[0].year
      this.companydata=this.companysubadmin.companydata[0];
      

    }
    if(this.trainerData){
      this.traineradmin=true
      this.companyadmin=true
      this.disableinput=true
      this.companydata=this.trainerData.companydata
      const cityArray = this.companydata.countryCity.flatMap(country => country.city);

    // this.getcompanydata(this.trainerData.companyid)
    this.cityList=cityArray
    this.roleList=this.companydata.year;
      
    }
  }
  contentReady = (e) => {
  
    e.component.getVisibleRows().forEach((row) => {
    });
    // e.refresh();
    //this.dataGrid.instance.refresh();
  };
  getcompanydata(data:string){
    this.apiService.CommonApi(Apiconfig.trainercompany.method,Apiconfig.trainercompany.ur1,{id:data}).subscribe((result)=>{
      if(result.status){
        console.log(result.data)
        this.companydata=result.data
        this.citynames=result.data.city
        this.roleitmes=result.data.role
        this.teamdata=result.data.team


      }
    })
  }
  // ngAfterViewInit(): void {
  //   if (!this.viewpage) {
  //     this.loadMap();
  //   }
  // };

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      company: [null,[Validators.required]],
      city: [[] ,[Validators.required]],
      // country: [null,[Validators.required]],
      startdate: ['' ],
      enddate: [''],
      // team:[null],
      role:[[]],
      userjoiningdate: ['',[Validators.required]]
    }, { 
      validator: this.endDateValidator('startdate', 'enddate') 
    });
    this.batchForm=this.fb.group({
      companyid:[null,[Validators.required]],
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
    this.id = this.ActivatedRoute.snapshot.paramMap.get('id');

    this.getcompany()

    if(this.id){
      if(!this.viewpage){
        let newTitle = 'Edit Batch';
        const routeData = this.ActivatedRoute.snapshot.data;
        routeData['title'] = newTitle;

      }
      this.editbatchboolean=true
      this.showbatchform=true
      setTimeout(()=>{
        this.apiService.CommonApi(Apiconfig.get_batch_details.method,Apiconfig.get_batch_details.url,{id:this.id}).subscribe((res)=>{
          if(res.status){
             
              let data=res.data
              let result=this.companynames.filter(x=>x._id===data.companyid)
              if(result.length>0){
                let data=[]
                for (let i = 0; i < result[0].countryCity.length; i++) {
                  const cities = result[0].countryCity[i].city;
                  data.push(...cities);
                }
                this.batchForm.controls['companyid'].disable()
                this.batchForm.controls['city'].disable()  
                this.batchForm.controls['role'].disable()  
                this.batchForm.controls['team'].disable()  
                // this.batchForm.controls['team'].disable()  
                this.cityList=data
                this.roleList=result[0].year
                this.teamList=result[0].team
              }
              this.pageTitle=data.shortname
              this.batchForm.patchValue({
                companyid:data.companyid,
                remarks:data.remarks,
                startdate:new Date(data.startdate),
                enddate:new Date(data.enddate),
                team:data.team,
                role:data.role,
                status:data.status,
                city:data.city
              })
          }
        })
      },100)
     
    }
    if(this.companysubadmin){
      this.filterForm.controls['company'].setValue(this.companysubadmin.companyid);
    }
    if(this.trainerData){
      this.filterForm.controls['company'].setValue(this.trainerData.companyid);
    }
    if(this.companydata){
      this.filterForm.controls['company'].setValue(this.companydata._id);
    }
    // if (this.id) {
    //   this.disablecompany=true
    //   this.disableinput=true
    //   this.companydisable=true
    //   this.shortnameshow=true
    //   this.edituserdata=true
    //   this.pageTitle = (this.viewpage ? 'View' : 'Edit') + " Batch";
    //   this.apiService.CommonApi(Apiconfig.get_batch_details.method,Apiconfig.get_batch_details.url,{id:this.id}).subscribe((result)=>{
    //     if(result){
    //       // console.log("response has gotten here eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    //       let data=result.data
    //       // console.log(data);
    //       if(!this.companyadmin){

    //         this.form.controls['company'].setValue(data.company?data.company:'')
    //         setTimeout(()=>{
    //           console.log(this.companynames);
              
    //           let datas=this.companynames?.filter((x)=>x._id===data.companyid)
    //           console.log(datas)
    //           this.citynames=datas[0]?.city
    //           this.roleitmes=datas[0]?.role
    //           this.teamdata=datas[0]?.team
    //         },100)
    //       }
    //       this.form.controls['name'].setValue(data.name?data.name:'')
    //       this.form.controls['city'].setValue(data.city?data.city:'')
    //       this.form.controls['team'].setValue(data.team?data.team:'')
    //       this.form.controls['status'].setValue(data.status?data.status:'')
    //       this.form.controls['shortname'].setValue(data.shortname?data.shortname:'')
    //       this.form.controls['role'].setValue(data.role?data.role:'')
    //       this.form.controls['date'].setValue(data.date?data.date:'')
         
          
    //     }
    // })
    
    // } else {
    //   // this.setCurrentCountryFlag();
    //   // this.form.controls['languages'].setValue(null);

    // };
  };
  CreatedBachdata:any[]=[];
  viewBatch() {
      debugger;
      this.isViewCratedUsers=false;
      this.showerror=false;
      // console.log(this.filterForm.value)
      // console.log(this.filterForm.valid)
      // console.log(this.companydata._id)
      this.submitfilterform=true

      if(this.filterForm.valid){
      this.filterForm.patchValue({company:this.companydata._id})
      this.batchForm.patchValue({companyid:this.companydata._id})
      let data=this.filterForm.value;
      
      this.batchForm.patchValue({city:data.city})
      this.batchForm.patchValue({role:data.role})
      debugger;
      
      this.apiService.CommonApi(Apiconfig.get_created_batch.method,Apiconfig.get_created_batch.url,data).subscribe((result)=>{
        
        if(result.status){

          console.log(result.data)
          if(result.data.users !=null){
            this.isViewCratedUsers=true;
            debugger;
            this.CreatedBachdata=[];
            let html="";
            //html +=`<table class="table" style="font-size:12px !important;"><thead><tr><th>Name</th><th>E-mail</th><th>Date of Joining(DOJ)</th><th>Team</th></tr></thead><tbody>`;
            this.CreatedBachdata=result.data.users;

            // result.data.users.forEach(e => {
            //   var checkcon=result.data.batchdata.filter(o=>o.userid == e._id)[0];
            //   if(checkcon != undefined){
            //    // html +=`<tr><td>${checkcon.userdata.username}</td><td>${checkcon.userdata.email}</td><td>${checkcon.userdata.joindate}</td><td>${checkcon.userdata.team}</td></tr>`
            //     this.CreatedBachdata.push(checkcon.userdata);
            //   }
            // });
            //html +=`</tbody></table>`
            // swal.fire({
              
            //   width: '900px',
            //   html: html,
            //   showCloseButton: true,
              
            // });

            debugger;
          }
        
        }
      });
    }
    else{
      this.filterForm.markAllAsTouched();
    }
  
  }

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







  onFilter(){
    this.isViewCratedUsers=false;
    this.showerror=false;
    // console.log(this.filterForm.value)
    // console.log(this.filterForm.valid)
    // console.log(this.companydata._id)
    this.submitfilterform=true
   
    if(this.filterForm.valid){
      this.filterForm.patchValue({company:this.companydata._id})
      this.batchForm.patchValue({companyid:this.companydata._id})
      let data=this.filterForm.value
      console.log("++++++++++++++++++++++++++++++++++++++")
      console.log(data.city)
      console.log(data.role)
      this.batchForm.patchValue({city:data.city})
      this.batchForm.patchValue({role:data.role})
      this.apiService.CommonApi(Apiconfig.create_batch.method,Apiconfig.create_batch.url,data).subscribe((result)=>{
        
        if(result.status){

          console.log(result.data)
          if(result.data.length>0){
            this.userList=result.data
           
            this.showTable=true
            this.showerror=false
          
          }else{
            this.showTable=false
            this.showerror=true
          }
        
        }else{
          this.showTable=false
        }
      })
    }else{
      this.filterForm.markAllAsTouched();
    }
  }
  submitBatchuser(){
 
    if(this.selectedUsers.length>0){
      this.userList=this.selectedUsers
      this.showbatchform=true
     console.log(this.batchForm.value)
    }else{
      this.notifyService.showError("Please select a user")
    }
  }
  submitBatch(){
   
  
   if(this.id){
      if(this.batchForm.valid){
      
        let data=this.batchForm.value
        data._id=this.id
        console.log(data)
        this.apiService.CommonApi(Apiconfig.edit_batch.method,Apiconfig.edit_batch.url,data).subscribe((res)=>{
          this.submitfilterform=false
          if(res.status){
            this.notifyService.showSuccess("Updated Successfully")
            this.router.navigate(["app/batches/edit"])
          }
        })
      }else{
        this.batchForm.markAllAsTouched()
      }
   }else{
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
      this.apiService.CommonApi(Apiconfig.add_batch.method,Apiconfig.add_batch.url,data).subscribe((res)=>{
        this.submitfilterform=false
        if(res.status){
          // this.notifyService.showSuccess(res.message)
          swal.fire({
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
        }else{
          this.notifyService.showError("Somthign went wrong")
        }
      })
    }else{
      this.batchForm.markAllAsTouched();
    }
   }
    
  }
  clearForm(){
    this.filterForm.reset()
    this.userList=[]
    this.showTable=false
    this.showbatchform=false
  }
  isSelected(user) {
    return this.selectedUsers.includes(user);
  }
  
  // Check if all users are selected
  areAllSelected() {
    return this.userList.length && this.userList.every(user => this.isSelected(user));
  }
  
  // Select/Deselect all users
  toggleSelectAll(event) {
    if (event.target.checked) {
      this.selectedUsers = [...this.userList]; // Select all users
    } else {
      this.selectedUsers = []; // Deselect all users
    }
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
    console.log(this.selectedUsers)
  }


  getCountry(event:any){
    console.log(event)
    this.companydata=event
 
    this.countryList=event.countryCity

    this.filterForm.patchValue({role:"",city:""})
    this.batchForm.patchValue({companyid:event._id})
   
    this.roleList=event.year
    this.teamList=event.team
    let data=[]
    
    for (let i = 0; i < event.countryCity.length; i++) {
      const cities = event.countryCity[i].city;
      data.push(...cities);
    }

    this.cityList=data

  }

 
  changecompany(data:any){

    this.disableinput=true
    this.citynames=data.city
    this.teamdata=data.team
    this.roleitmes=data.role
    this.form.controls['city'].setValue('')
    this.form.controls['team'].setValue('')
    this.form.controls['role'].setValue('')

  }
  getcompany(){
    this.apiService.CommonApi(Apiconfig.getCompanynames.method,Apiconfig.getCompanynames.url,{}).subscribe((result)=>{
     this.companynames=result.data
    })
  }

  toTitleCase(str: string): string {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }


  changedateselect(data:any){

    if(data.target.value==="custom"){
      this.showdatapicker=true
    }else{
      this.showdatapicker=false
    }
  }

 



  getaddresscomponents(address_components: any, component, type: string[]): any {
    var element = ""
    for (let i = 0; i < address_components.length; i++) {
      if (address_components[i].types[0] == type[0]) {
        element = (component == 'short') ? address_components[i].short_name : address_components[i].long_name;
      }
    }
    return element;
  }


  fileoploadclick() {
    let profileimg = <HTMLElement>document.querySelector('.file-upload');
    profileimg.click();
  };
  coverimageClick() {
    let profileimg = <HTMLElement>document.querySelector('.cover-file-upload');
    profileimg.click();
  };

  fileChangeEvent(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      // if (event.target.files[0].size <= 1024 * 1024 * 2) {
      if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/png' || event.target.files[0].type == 'image/jpg') {
        this.userimageChangedEvent = event;
      } else {
        this.notifyService.showError('Photo only allows file types of PNG, JPG and JPEG ');
      }
      // } else {
      //   this.notifyService.showError('The file size can not exceed 2MiB.');
      // }
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl || event.base64 || '');
    console.log(event);
    console.log(event.base64,'this is that');
    console.log(this.croppedImage.base64,'this is croppedImage');
    this.usercroppedImage = event.base64;
    // this.userfinalImage = this.dataURLtoFile(event.base64, 'userimage.png');
  }

  coverFileChangeEvent(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      // if (event.target.files[0].size <= 1024 * 1024 * 2) {
      if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/png' || event.target.files[0].type == 'image/jpg') {
        this.coverimageChangedEvent = event;
      } else {
        this.notifyService.showError('Photo only allows file types of PNG, JPG and JPEG ');
      }
      // } else {
      //   this.notifyService.showError('The file size can not exceed 2MiB.');
      // }
    }
  }



  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

   onFormSubmit(userAddEditForm:NgForm) {
    
    var data = userAddEditForm.value;

    if (userAddEditForm.valid) {
      if(this.id===null){
        if(this.companyadmin){
          data.company=this.companydata.name
          data.companyid=this.companydata._id
          data.slugname=data.name.toLowerCase()
          data.actiontype="create"
          this.apiService.CommonApi(Apiconfig.com_add_batch.method,Apiconfig.com_add_batch.url,data).subscribe((result)=>{
            if(result.status){
              this.notifyService.showSuccess("Added Successfully")
              this.router.navigate(['app/batches/batchlist'])
            }
          })
        }else{
          let compandydata=this.companynames.filter((x) =>x.name===data.company)
          data.actiontype="create"
          data.companyid=compandydata[0]._id
          data.slugname=data.name.toLowerCase()
          console.log(data)
          this.apiService.CommonApi(Apiconfig.add_edit_batch.method,Apiconfig.add_edit_batch.url,data).subscribe((result)=>{
            if(result.status===true){
              console.log(result)
              this.router.navigate(['app/batches/list'])
            }else{
              this.notifyService.showError(result.message)
            }
          })
        }
       
      }else{
        


        data.actiontype='update'
        data._id=this.id
        data.slugname=data.name.toLowerCase() 
        console.log(data)
        this.apiService.CommonApi(Apiconfig.add_edit_batch.method,Apiconfig.add_edit_batch.url,data).subscribe((result)=>{
          if(result){
            this.notifyService.showSuccess(result.message)
            let data=localStorage.getItem("company")
            
         
            
            if(data){ //this is used to navigate based on conditon if it is login by the company  
              this.router.navigate(['app/batches/batchlist'])
            }else if(this.traineradmin){
              this.router.navigate(['app/batches/batchlist'])
            }else{

              this.router.navigate(['app/batches/list'])
            }
          }else{
            this.notifyService.showError(result.message)
          }
        })

      }
    

     
    } else {
      this.notifyService.showError('Please Enter all mandatory fields');
    }
  };
}
