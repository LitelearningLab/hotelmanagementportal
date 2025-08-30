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
import { DomSanitizer, Title } from '@angular/platform-browser';
import { environment } from "src/environments/environment";
import { RootUserDetails } from 'src/app/interface/userDetails.interface';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PrivilagesData } from 'src/app/menu/privilages';
const phoneNumberUtil = PhoneNumberUtil.getInstance();
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { Country, State, City }  from 'country-state-city';
import { eventNames } from 'process';
import { DefaultStoreService } from 'src/app/_services/default-store.service';
import { countryMapping } from 'src/app/_helpers/countryMapper';

import { FirebaseServiceService } from 'src/app/_services/firebase-service.service';


@Component({
  selector: 'app-useraddedit',
  templateUrl: './useraddedit.component.html',
  styleUrls: ['./useraddedit.component.scss']
})
export class UseraddeditComponent implements OnInit {
  @ViewChild('userAddEditForm') form: NgForm;
  @ViewChild('country') country: ElementRef
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];
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
  teamdata:any=[]
  roleitmes:any=[]
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
  edituserdata: boolean=false;
  citynames: any;
  disableinput: boolean=false;
  companyadmin: boolean=false;
  countrylist:any=[]
  countriesdata:any=[]
  activedata: boolean=false;
  @ViewChild(BsDatepickerDirective, { static: false })
  datepicker: BsDatepickerDirective;
  states: any;
  companyList: any;
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private route:ActivatedRoute,
    // private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private authService: AuthenticationService,
    private store: DefaultStoreService,
    private firebaseService: FirebaseServiceService
  ) {
    this.minDate = new Date();
    let data=JSON.parse(localStorage.getItem('company'))
    if(data){
      this.companyadmin=true
      this.disableinput=true
      this.roleitmes=data.year
      this.teamdata=data.course
      this.countrylist=data.countryCity
      // this.citynames=data.city
    }
    let companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))
    if(companysubadmin){
      this.companyadmin=true,
      this.disableinput=true,
      this.roleitmes=companysubadmin.companydata[0].year
      this.teamdata=companysubadmin.companydata[0].course
      this.countrylist=companysubadmin.companydata[0].countryCity
    }
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
    window.addEventListener('scroll', this.hideDialog.bind(this), true);

  }
  hideDialog(): void {
    
    this.datepicker.hide();
  }
  // ngAfterViewInit(): void {
  //   if (!this.viewpage) {
  //     this.loadMap();
  //   }
  // };

  ngOnInit(): void {

      
    debugger;

    this.id = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.getcompany()
    // this.countriesdata = Country.getAllCountries();
  
    if (this.id) {
      // this.store.companyList.subscribe(
      //   (result) => {
      //     if (result) {
      //       this.companyList = result;
      //       console.log("++++++++++++++++++++++++++++++++++++++++++++")
      //       console.log(this.companyList)
      //     }
      //   }
      // )


      this.disableinput=true
      this.edituserdata=true
      this.pageTitle = (this.viewpage ? 'View' : 'Edit') + " User";
      if(this.viewpage){
        this.apiService.CommonApi(Apiconfig.getUser.method,Apiconfig.getUser.url,{id:this.id}).subscribe((result)=>{
          console.log(result.data)
          this.userDetails=result.data
          this.activedata=true
          let newTitle = this.pageTitle + " - " + this.userDetails.username;
          const routeData = this.route.snapshot.data;
          routeData['title'] = newTitle;

        })
          
      }else{
        this.apiService.CommonApi(Apiconfig.getUser.method,Apiconfig.getUser.url,{id:this.id}).subscribe((result)=>{
          if(result){
          
            let data=result.data
            console.log(data)
            let newTitle = this.pageTitle + " - " + data.username;
            const routeData = this.route.snapshot.data;
            routeData['title'] = newTitle;
            if(!this.companyadmin){
             
              this.form.controls['company'].setValue(data.college?data.college:null)
            }
            
            this.form.controls['username'].setValue(data.username?data.username:null)
            this.form.controls['email'].setValue(data.email?data.email:null)
            this.form.controls['city'].setValue(data.city?data.city:null)
            // this.form.controls['state'].setValue(data.state?data.state:'')
            this.form.controls['country'].setValue(data.country?data.country:null)
            // this.form.controls['team'].setValue(data.team?data.team:'')
            this.form.controls['status'].setValue(data.status?data.status:null)
            this.form.controls['course'].setValue(data.course?data.course:null)
            this.form.controls['year'].setValue(data.year?data.year:null)
            this.form.controls['imei'].setValue(data.imei?data.imei:null)
            this.form.controls['mobile'].setValue(data.mobile?data.mobile:null)
            this.form.controls['joindate'].setValue(data.joindate?new Date(data.joindate):null)
            this.form.controls['subscriptionenddate'].setValue(data.subscriptionenddate?new Date(data.subscriptionenddate):null)

            data.country = data.country.charAt(0).toUpperCase() + data.country.slice(1).toLowerCase();
            const phoneCountry = countryMapping[data.dialCode];
            this.selectedCountryISO = data.country?CountryISO[phoneCountry]:CountryISO['India']
            
            setTimeout(()=>{
              console.log(this.companynames);
              let datas=this.companynames?.filter((x)=>x._id===data.companyid)
              console.log(datas[0])
              this.countrylist=datas[0].countryCity
              console.log(this.countrylist)

              let cities=this.countrylist.filter((x)=>x.country==data.country)
              console.log("__________________________________________________________")
              console.log(cities)
              this.citynames=cities[0].city
              this.roleitmes=datas[0].year
              this.teamdata=datas[0].course
            },100)
          }
      })

      }
      
      // if (!this.viewpage) {
      //   this.apiService.CommonApi(Apiconfig.userEdit.method, Apiconfig.userEdit.url, { id: id }).subscribe(
      //     (result) => {
      //       if (result && result.status == 1) {
      //         this.userDetails = result.data.userDetails;
      //         console.log("this.userDetails", this.userDetails)
      //         this.form.controls['first_name'].setValue(this.userDetails.first_name ? this.userDetails.first_name : (this.userDetails.name ? this.userDetails.name : ''));
      //         this.form.controls['last_name'].setValue(this.userDetails.last_name ? this.userDetails.last_name : (this.userDetails.name ? this.userDetails.name : ''));
      //         this.currentEmail=this.userDetails.email
      //         this.form.controls['email'].setValue(this.userDetails.email ? this.userDetails.email : '');
      //         this.form.controls['status'].setValue(this.userDetails.status ? this.userDetails.status.toString() : '');
      //         this.form.controls['gender'].setValue(this.userDetails.gender ? this.userDetails.gender.toString() : '');
      //         // if(this.userDetails.address){
      //         //   if (this.userDetails.address.fulladres) {
      //         //     this.form.controls['address'].setValue(this.userDetails.address.fulladres ? this.userDetails.address.fulladres : '');
      //         //   } else {
      //         //     this.form.controls['address'].setValue(this.userDetails.address ? this.userDetails.address : '');
      //         //   }
      //         // }
      //         // this.emailVerifyTag = this.userDetails.email_verify ? this.userDetails.email_verify : 0;
      //         if (this.userDetails.phone && typeof this.userDetails.phone.code != 'undefined') {
      //           var codedata = this.userDetails.phone.code as string;
      //           codedata = codedata.split('+')[1];
      //           let selected = COUNTRY.filter(x => x.code == codedata);
      //           let val = selected.length > 0 ? selected[0].name : '';
      //           this.selectedCountryISO = CountryISO[val];
      //           let number = phoneNumberUtil.parseAndKeepRawInput(this.userDetails.phone.number, this.selectedCountryISO);
      //           this.form.controls["phone"].setValue(phoneNumberUtil.formatInOriginalFormat(number, this.selectedCountryISO));
      //           // this.form.controls['phone'].disable();
      //         }
      //         this.setCurrentCountryFlag();
      //         this.cd.detectChanges();

      //         this.apiService.imageExists(environment.apiUrl + this.userDetails.avatar, (exists) => {
      //           if (exists) {
      //             this.usercroppedImage = environment.apiUrl + this.userDetails.avatar;
      //           }
      //         });
      //       }

      //     }
      //   )
      // } else {
      //   this.apiService.CommonApi(Apiconfig.getUserDetails.method, Apiconfig.getUserDetails.url, { id: id }).subscribe(
      //     (result) => {
      //       if (result && result.status == 1) {
      //         this.RootUserDetails = result.data;
      //         this.address = this.RootUserDetails.userDetails.address
      //         this.apiService.imageExists(environment.apiUrl + this.RootUserDetails.userDetails.avatar, (exists) => {
      //           if (exists) {
      //             this.usercroppedImage = environment.apiUrl + this.RootUserDetails.userDetails.avatar;
      //           }
      //         });
      //       } else {

      //       }
      //     }
      //   );
      // }
    } else {
      this.setCurrentCountryFlag();
      // this.form.controls['languages'].setValue(null);
       setTimeout(()=>{
        this.form.controls['company'].setValue(null)
        this.form.controls['country'].setValue(null)
        this.form.controls['city'].setValue(null)
        this.form.controls['course'].setValue(null)
        this.form.controls['year'].setValue(null)
       },100)
    };
  };

  // onCountryChange($event): void {
  //   console.log("++++++++++++JJJJJJJJJjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
    
  //   console.log($event)
  //   this.states = State.getStatesOfCountry($event.isoCode);

  //   // this.selectedCountry = JSON.parse(this.country.nativeElement.value);
  //   // this.cities = this.selectedState = this.selectedCity = null;
  //   console.log("++++++++++++++++++++++++++++++++")
  //   console.log(this.states)
  // }
  getCity(event){
    console.log(event)
    this.form.controls['city'].setValue(null)
    this.citynames=event.city
  }
  changecompany(data:any){
    this.disableinput=true
    // this.citynames=data.city
    this.form.controls['city'].setValue(null)
    this.form.controls['country'].setValue(null)
    this.form.controls['course'].setValue(null)
    this.form.controls['year'].setValue(null)
    this.teamdata=data.course
    this.roleitmes=data.year
    // this.form.controls['city'].setValue('')
    this.countrylist=data.countryCity
    console.log(data)
  }
 
  getcompany(){
    if(!this.companyadmin){
      this.apiService.CommonApi(Apiconfig.getCompanynames.method,Apiconfig.getCompanynames.url,{}).subscribe((result)=>{
       this.companynames=result.data
      })
    }
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


  validateMobile(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
}

   onFormSubmit(userAddEditForm: NgForm) {
    debugger;
    var data = userAddEditForm.value;
    let mobileObj = data.mobile;
    //delete data.mobile;
    debugger;
    if(mobileObj){
      data.mobile = mobileObj.number;
      data.dialCode = mobileObj.dialCode;
    }
    if (userAddEditForm.valid) {
      if(this.id===null){
        data.actiontype="create"
        data.slugname=data.username
        if(!this.companyadmin){//adding the user by the admin 
          let compandydata=this.companynames.filter((x) =>x.companyname===data.company)
  
          data.companyid=compandydata[0]._id
          data.company=compandydata[0].companyname
          data.college=compandydata[0].companyname
          this.apiService.CommonApi(Apiconfig.addUser.method,Apiconfig.addUser.url,data).subscribe((result)=>{
            if(result.status===true){
              console.log(result)
              this.createUserAccGOath(result.data)
              this.router.navigate(['app/users/list'])
              this.notifyService.showSuccess("User added successfully")
            }else{
              data.mobile=mobileObj;
              this.notifyService.showError(result.message)
            }
          })
        }else{//adding the user by the companyadmin

          let companydata=JSON.parse(localStorage.getItem("company"))
          if(companydata){
            data.slugname=data.username
            data.companyid=companydata._id
            data.company=companydata.name
            data.college=companydata.name
            data.college=companydata.college
            data.mobile=data.mobile.toString()
            this.apiService.CommonApi(Apiconfig.com_add_user.method,Apiconfig.com_add_user.url,data).subscribe((result)=>{
              if(result.status){
              this.createUserAccGOath(result.data)

                this.router.navigate(['app/users/list'])
                this.notifyService.showSuccess("User added successfully")
              }else{
              data.mobile=mobileObj;

                this.notifyService.showError(result.message)
              }
            })
          }else{
            let companysubadmindata=JSON.parse(localStorage.getItem("companysubadmin"))
            data.slugname=data.username
            data.companyid=companysubadmindata.companydata[0]._id
            data.company=companysubadmindata.company
            data.college=companysubadmindata.college
            data.mobile=data.mobile.toString()
            this.apiService.CommonApi(Apiconfig.com_add_user.method,Apiconfig.com_add_user.url,data).subscribe((result)=>{
              if(result.status){
                this.createUserAccGOath(result.data)

                this.router.navigate(["app/users/list"])
                this.notifyService.showSuccess("User create successfully")
              }else{
              data.mobile=mobileObj;

                this.notifyService.showError(result.message)
              }
            })
          }
        
          
        } 
        
      }else{
        data.actiontype='edit'
        if(!this.companyadmin){
          let compandydata=this.companynames.filter((x) =>x.companyname===data.company)
          data._id=this.id
          data.companyid=compandydata[0]._id;
          //data.mobile=mobileObj;

          this.apiService.CommonApi(Apiconfig.addUser.method,Apiconfig.addUser.url,data).subscribe((result)=>{
            if(result.status){
              this.notifyService.showSuccess(result.message)
              this.router.navigate(['app/users/list'])
            }else{
              data.mobile=mobileObj;

              this.notifyService.showError(result.message)
            }
          },
          err=>{
            data.mobile=mobileObj;
          }
        )
        }else{
          let comdata=JSON.parse(localStorage.getItem("company"))
          data._id=this.id
          //data.mobile=mobileObj;

          this.apiService.CommonApi(Apiconfig.com_add_user.method,Apiconfig.com_add_user.url,data).subscribe((result)=>{
            if(result.status){
              this.router.navigate(['app/users/list'])
              this.notifyService.showSuccess("Updated successfully")
            }else{
              data.mobile=mobileObj;

              this.notifyService.showError(result.message)
            }
          },
          err=>{
            data.mobile=mobileObj;
          }
        )
        }
      
      

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
      data.mobile=mobileObj;

      this.notifyService.showError('Please Enter all mandatory fields');
    }
  };
  createUserAccGOath(data) {
    let email = data.email;
    let password = data.password;
    this.firebaseService.createAccount(email, password).subscribe((res) => {

    }, (error) => {
      this.notifyService.showError("Error while creating the google account! " + error)
    })
  }
}
