import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, NgForm } from '@angular/forms';
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
const phoneNumberUtil = PhoneNumberUtil.getInstance();
@Component({
  selector: 'app-addedit-batch',
  templateUrl: './addedit-batch.component.html',
  styleUrls: ['./addedit-batch.component.scss']
})
export class AddeditBatchComponent {
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
  pageTitle: string = 'Add Batch';
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

  constructor(
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
    this.id = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.getcompany()
    
    if (this.id) {
      this.disablecompany=true
      this.disableinput=true
      this.companydisable=true
      this.shortnameshow=true
      this.edituserdata=true
      this.pageTitle = (this.viewpage ? 'View' : 'Edit') + " Batch";
      this.apiService.CommonApi(Apiconfig.get_batch_details.method,Apiconfig.get_batch_details.url,{id:this.id}).subscribe((result)=>{
        if(result){
          // console.log("response has gotten here eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
          let data=result.data
          // console.log(data);
          if(!this.companyadmin){

            this.form.controls['company'].setValue(data.company?data.company:'')
            setTimeout(()=>{
              console.log(this.companynames);
              
              let datas=this.companynames?.filter((x)=>x._id===data.companyid)
              console.log(datas)
              this.citynames=datas[0]?.city
              this.roleitmes=datas[0]?.role
              this.teamdata=datas[0]?.team
            },100)
          }else{
            // this.companydata=JSON.parse(localStorage.getItem("company"))
            // this.trainerData=JSON.parse(localStorage.getItem("Trainer Login"))
              console.log(this.companydata,"company");
              
              this.citynames=this.companydata.city
              this.teamdata=this.companydata.team
            this.roleitmes=this.companydata.role
        
          }
          this.form.controls['name'].setValue(data.name?data.name:'')
          this.form.controls['city'].setValue(data.city?data.city:'')
          this.form.controls['team'].setValue(data.team?data.team:'')
          this.form.controls['status'].setValue(data.status?data.status:'')
          this.form.controls['shortname'].setValue(data.shortname?data.shortname:'')
          this.form.controls['role'].setValue(data.role?data.role:'')
          this.form.controls['date'].setValue(data.date?data.date:'')
         
          
        }
    })
    
    } else {
      this.setCurrentCountryFlag();
      // this.form.controls['languages'].setValue(null);

    };
  };
  changecompany(data:any){
    console.log(data)
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
  setCurrentCountryFlag() {
    if (typeof this.selectedCountryISO == 'undefined') {
      this.apiService.getIPAddress().subscribe((res: any) => {
        if (res && typeof res.country != 'undefined') {
          let selected = COUNTRY.filter((x) => {
            if (x.iso2 == res.country) {
              return x;
            }
          });
          let val = selected.length > 0 ? selected[0].name : 'India';
          if (typeof CountryISO[val] != 'undefined') {
            this.selectedCountryISO = CountryISO[val];
          } else {
            this.selectedCountryISO = CountryISO['India'];
          };
        };
      });
    }
  };

  phoneNumberChange(event) {
    if (this.form.form.controls["phone"].value && this.form.form.controls["phone"].value.number && this.form.form.controls["phone"].value.number.length > 3) {
      let number = phoneNumberUtil.parseAndKeepRawInput(this.form.form.controls["phone"].value.number, this.form.form.controls["phone"].value.countryCode);
      this.form.form.controls["phone"].setValue(phoneNumberUtil.formatInOriginalFormat(number, this.form.form.controls["phone"].value.countryCode));
    }
  };
  changedateselect(data:any){

    if(data.target.value==="custom"){
      this.showdatapicker=true
    }else{
      this.showdatapicker=false
    }
  }

  loadMap() {
    /* this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.getAddress(this.latitude, this.longitude);
        });
      });
    }); */
  };

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.agm_address['fulladres'] = results[0].formatted_address;
          this.agm_address['city'] = this.getaddresscomponents(results[0].address_components, 'short', ['locality']);
          this.agm_address['state'] = this.getaddresscomponents(results[0].address_components, 'short', ['administrative_area_level_1']);
          this.agm_address['zipcode'] = this.getaddresscomponents(results[0].address_components, 'short', ['postal_code']);
          this.agm_address['country'] = this.getaddresscomponents(results[0].address_components, 'short', ['country']);
          this.agm_address['lat'] = this.latitude;
          this.agm_address['lng'] = this.longitude;
        }
      }
    });
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

  // imageCroppedCover(event: ImageCroppedEvent) {
  //   this.coverCroppedImage = event.base64;
  //   this.coverfinalImage = this.dataURLtoFile(event.base64, 'coverimage.png');
  // }

  // removeImage(){
  //   this.removerPhoto=true;
  //   this.usercroppedImage='assets/image/user.jpg';
  //   this.croppedImage='';
  // }

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
    

      // let phone = { code: "", number: "" };
      // console.log(this.usercroppedImage,'usercroppedImage');
      // console.log(this.userimageChangedEvent,'userimageChangedEvent');
      // if ( this.userimageChangedEvent) {
      //   data.avatarBase64 = this.usercroppedImage;
      // }
      // if (!this.userimageChangedEvent && this.userDetails && this.userDetails.avatar) {
      //   data.avatar = this.userDetails.avatar
      // }
      // if(this.removerPhoto){
      //   data.avatar='';
      // }
      // console.log(this.currentEmail,'currentEmail');
      // data.email=this.currentEmail
      // data.gender = data.gender;
      // phone.code = data.phone ? data.phone.dialCode : (this.userDetails.phone ? this.userDetails.phone.code : undefined);
      // phone.number = data.phone ? data.phone.number.replace(/\s/g, "") : (this.userDetails.phone ? this.userDetails.phone.number.replace(/\s/g, "") : undefined);
   
      // data._id = this.ActivatedRoute.snapshot.paramMap.get('id');
      // data.phone = phone;
      // console.log(data,'DATAA');
     
      // this.apiService.CommonApi(Apiconfig.userSave.method, Apiconfig.userSave.url, data).subscribe(
      //   (result) => {
      //     if (result && result.status == 1) {
      //       this.router.navigate(['/app/users/list']);
      //       this.notifyService.showSuccess(result.message);
      //     } else {
      //       this.notifyService.showError(result.message);
      //     }
      //     this.submitebtn = false;
      //   }
      // )
    } else {
      this.notifyService.showError('Please Enter all mandatory fields');
    }
  };

  toTitleCase(str: string): string {
    // Check if the string is empty
    if (!str) return str;

    // Capitalize the first letter of each word, handling both single and multi-word strings
    return str
      .split(' ')  // Split by spaces
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitalize first letter
      .join(' ');  // Join back into a single string
  }

}
