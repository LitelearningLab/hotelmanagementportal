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

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent {
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
  pageTitle: string = 'Add User';
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
  isAllSelected = false
  editbatchboolean: boolean=false;
  submitfilter: boolean=false;
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
    if(this.companydata){
      this.companyadmin=true
      this.disableinput=true
      this.citynames=this.companydata.city
      this.teamdata=this.companydata.team
    this.roleitmes=this.companydata.role
    }
    if(this.trainerData){
      this.traineradmin=true
      this.companyadmin=true
      this.disableinput=true
    
    this.getcompanydata(this.trainerData.companyid)
    }
  }
  getcompanydata(data:string){
    this.apiService.CommonApi(Apiconfig.trainercompany.method,Apiconfig.trainercompany.ur1,{id:data}).subscribe((result)=>{
      if(result.status){
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
      startdate: ['' ,[Validators.required]],
      enddate: ['',[Validators.required]],
      // team:[null],
      role:[[],[Validators.required]]
    },{
      validator: this.endDateValidator('startdate', 'enddate') 
    });
    this.batchForm=this.fb.group({
      companyid:[null,[Validators.required]],
      city:[null,Validators.required],
      role:[null,Validators.required],
      team:[''],
      startdate:['',Validators.required,],
      enddate:['',Validators.required],
     remarks:[''],
     status:['1',Validators.required]
    },{
      validator: this.endDateValidator('startdate', 'enddate') 
    })
    this.id = this.ActivatedRoute.snapshot.paramMap.get('id');

    this.getcompany()

    if(this.id){
      console.log(this.id)
      // this.editbatchboolean=true
      // this.showbatchform=true
      this.getbatchdetails(this.id)
      
     
    }
    

  };

  getbatchdetails(id:any){
    setTimeout(()=>{
      this.apiService.CommonApi(Apiconfig.get_batch_details.method,Apiconfig.get_batch_details.url,{id:id}).subscribe((res)=>{
        if(res.status){
          console.log(res.data)
          let data=res.data
          this.filterForm.patchValue({company:data.companyid})
          this.cityList=data.city
          this.roleList=data.role
          console.log(this.cityList)
        }
      })
    },100)
  }

  onFilter(){
    this.submitfilter=true
    console.log(this.filterForm.value)
    console.log(this.filterForm.valid)
    if(this.filterForm.valid){

      let data=this.filterForm.value
      data.access="Admin"
      this.apiService.CommonApi(Apiconfig.bath_newuser_list.method,Apiconfig.bath_newuser_list.url,data).subscribe((result)=>{
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
      // this.apiService.CommonApi(Apiconfig.create_batch.method,Apiconfig.create_batch.url,data).subscribe((result)=>{
        
      //   if(result.status){
      //     console.log(result.data)
      //     if(result.data.length>0){
      //       this.userList=result.data
           
      //       this.showTable=true
      //       this.showerror=false
          
      //     }else{
      //       this.showTable=false
      //       this.showerror=true
      //     }
        
      //   }else{
      //     this.showTable=false
      //   }
      // })
    }else{
      this.filterForm.markAllAsTouched();
    }
  }
  submitBatchuser(){
    if(this.selectedUsers.length>0){
      this.showbatchform=true
      this.selectedUsers
      let userlist=this.selectedUsers
      let companyid=this.filterForm.value.company
      let data:any={}
      data.company= companyid
      data.selectedUsers=userlist
      data.batchid=this.id

     this.apiService.CommonApi(Apiconfig.addusertobatch.method,Apiconfig.addusertobatch.url,data).subscribe((res)=>{
      if(res.status){
        this.filterForm.reset()
        this.submitfilter=false

        // this.filterForm.patchValue({company:})
        this.userList=[]
        this.notifyService.showSuccess("User Added Successfully")
        this.showTable=false
        this.getbatchdetails(this.id)
      }
     })
    }else{
      this.notifyService.showError("Please select a user")
    }
  }
  // submitBatch(){
  
  //  if(this.id){
  //     if(this.batchForm.valid){
  //       let data=this.batchForm.value
  //       data._id=this.id
  //       console.log(data)
  //       this.apiService.CommonApi(Apiconfig.edit_batch.method,Apiconfig.edit_batch.url,data).subscribe((res)=>{
  //         if(res.status){
  //           this.notifyService.showSuccess("Updated Successfully")
  //           this.router.navigate(["app/batches/edit"])
  //         }
  //       })
  //     }else{
  //       this.batchForm.markAllAsTouched()
  //     }
  //  }else{
  //   if(this.batchForm.valid){

  //     let batchdata=this.batchForm.value
  //     console.log(batchdata)
  //      let data:any={}
  //      let companyselected= this.companynames.filter((x)=>x._id===batchdata.companyid)
  //      batchdata.company=companyselected[0].companyname
  //      data.selectedusers=this.selectedUsers
  //      data.batchdata=batchdata
  //     this.apiService.CommonApi(Apiconfig.add_batch.method,Apiconfig.add_batch.url,data).subscribe((res)=>{
  //       if(res.status){
  //         this.notifyService.showSuccess(res.message)
  //         this.clearForm()
  //         this.showbatchform=false
  //         this.batchForm.reset()
  //       }else{
  //         this.notifyService.showError("Somthign went wrong")
  //       }
  //     })
  //   }else{
  //     this.batchForm.markAllAsTouched();
  //   }
  //  }
    
  // }
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



  clearForm(){
    this.filterForm.reset()
    this.userList=[]
    this.showTable=false
    this.submitfilter=false;
    this.getbatchdetails(this.id)
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
    this.updateSelectAllState();
  }
  toggleSelectAll(event: any): void {
    this.isAllSelected = event.target.checked;
    if (this.isAllSelected) {
      this.selectedUsers=[]
      this.selectedUsers = [...this.userList]; // Select all users
    } else {
      this.selectedUsers = []; // Deselect all users
    }
  }
  private updateSelectAllState(): void {
 
    this.isAllSelected = this.selectedUsers.length === this.userList.length;
  }


  getCountry(event:any){
 
    this.countryList=event.countryCity

    this.filterForm.patchValue({role:"",city:""})
    this.batchForm.patchValue({companyid:event._id})
   
    this.roleList=event.role
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
