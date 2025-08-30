import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { ApiService } from 'src/app/_services/api.service';
import { DefaultStoreService } from 'src/app/_services/default-store.service';
import { NotificationService } from 'src/app/_services/notification.service';
import privilagedata, { PrivilagesData } from 'src/app/menu/privilages';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FirebaseServiceService } from 'src/app/_services/firebase-service.service';
import { Country, State, City } from 'country-state-city';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from '@khazii/ngx-intl-tel-input';
import { COUNTRY } from 'src/app/_services/country';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { countryMapping } from 'src/app/_helpers/countryMapper';

const phoneNumberUtil = PhoneNumberUtil.getInstance();



@Component({
  selector: 'app-addedit-companies',
  templateUrl: './addedit-companies.component.html',
  styleUrls: ['./addedit-companies.component.scss']
})
export class AddeditCompaniesComponent {
  @ViewChild('companyForm') form: NgForm;
  @ViewChild(BsDatepickerDirective, { static: false })
  datepicker: BsDatepickerDirective;
  city: any
  citynames: any = []
  rolenames: any = []
  teamnames: any = []
  CompanyDetails: any;
  pageTitle: string = 'Add Institution';
  submitebtn: boolean = false;
  viewpage: boolean = false;
  isChecked: boolean = false;
  privilagesdata: PrivilagesData[] = privilagedata;
  userPrivilegeDetails: PrivilagesData[] = [];
  curentUser: any;
  checkpassword: boolean = false;
  id: string;
  inputdesable: boolean = false;
  countrylist: { name: string; }[];
  activedata: boolean = false;
  countriesdata: any;
  states: any;
  countryisoCode: any = [];
  selectedCountries = [];
  passwordVisible = {
    password: false,
    confirm_password: false
  };
  countryCity: { country: string, city: string[] }[] = [{ country: null, city: [] }];
  startDateEndDateError: boolean = false;
  formData = {
    subscriptionstartdate: null,
    subscriptionenddate: null
  };
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  selectedCountryISO: CountryISO;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router,
    private store: DefaultStoreService,
    private authService: AuthenticationService,
    private firebaseService: FirebaseServiceService
  ) {
    this.curentUser = this.authService.currentUserValue;
    var split = this.router.url.split('/');
    if (this.curentUser && this.curentUser.role == "subadmin") {
      if (this.router.url == '/app/administrator/list' || (split.length > 0 && split[2] == 'administrator')) {
        this.userPrivilegeDetails = this.curentUser.privileges.filter(x => x.alias == 'administrator');
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
    // window.addEventListener('scroll', this.hideDialog.bind(this), true);
  }
  // hideDialog(): void {

  //   this.datepicker.hide();
  // }


  onCountryChange($event: any): void {
    console.log("Country changed:", $event);

    this.selectedCountries = Array.isArray($event) ? $event : [$event];
    // this.citynames = this.selectedCountries.map(country => {
    //   let data = State.getStatesOfCountry(country.isoCode);
    //   return data.map(state => state.name); // Assuming state object has a 'name' property
    // });

    // console.log(this.selectedCountries);
    // console.log(this.citynames);
  }



  ngOnInit(): void {

    // this.id = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.countrylist = [
      { name: "Afghanistan" }, { name: "Albania" }, { name: "Algeria" }, { name: "Andorra" }, { name: "Angola" }, { name: "Antigua and Barbuda" }, { name: "Argentina" }, { name: "Armenia" }, { name: "Australia" }, { name: "Austria" },
      { name: "Azerbaijan" }, { name: "Bahamas" }, { name: "Bahrain" }, { name: "Bangladesh" }, { name: "Barbados" }, { name: "Belarus" }, { name: "Belgium" }, { name: "Belize" }, { name: "Benin" }, { name: "Bhutan" },
      { name: "Bolivia" }, { name: "Bosnia and Herzegovina" }, { name: "Botswana" }, { name: "Brazil" }, { name: "Brunei" }, { name: "Bulgaria" }, { name: "Burkina Faso" }, { name: "Burundi" }, { name: "Cabo Verde" }, { name: "Cambodia" },
      { name: "Cameroon" }, { name: "Canada" }, { name: "Central African Republic" }, { name: "Chad" }, { name: "Chile" }, { name: "China" }, { name: "Colombia" }, { name: "Comoros" }, { name: "Congo (Congo-Brazzaville)" }, { name: "Costa Rica" },
      { name: "Croatia" }, { name: "Cuba" }, { name: "Cyprus" }, { name: "Czechia (Czech Republic)" }, { name: "Democratic Republic of the Congo" }, { name: "Denmark" }, { name: "Djibouti" }, { name: "Dominica" }, { name: "Dominican Republic" }, { name: "Ecuador" },
      { name: "Egypt" }, { name: "El Salvador" }, { name: "Equatorial Guinea" }, { name: "Eritrea" }, { name: "Estonia" }, { name: "Eswatini (fmr. Swaziland)" }, { name: "Ethiopia" }, { name: "Fiji" }, { name: "Finland" }, { name: "France" },
      { name: "Gabon" }, { name: "Gambia" }, { name: "Georgia" }, { name: "Germany" }, { name: "Ghana" }, { name: "Greece" }, { name: "Grenada" }, { name: "Guatemala" }, { name: "Guinea" }, { name: "Guinea-Bissau" },
      { name: "Guyana" }, { name: "Haiti" }, { name: "Honduras" }, { name: "Hungary" }, { name: "Iceland" }, { name: "India" }, { name: "Indonesia" }, { name: "Iran" }, { name: "Iraq" }, { name: "Ireland" },
      { name: "Israel" }, { name: "Italy" }, { name: "Jamaica" }, { name: "Japan" }, { name: "Jordan" }, { name: "Kazakhstan" }, { name: "Kenya" }, { name: "Kiribati" }, { name: "Kuwait" }, { name: "Kyrgyzstan" },
      { name: "Laos" }, { name: "Latvia" }, { name: "Lebanon" }, { name: "Lesotho" }, { name: "Liberia" }, { name: "Libya" }, { name: "Liechtenstein" }, { name: "Lithuania" }, { name: "Luxembourg" }, { name: "Madagascar" },
      { name: "Malawi" }, { name: "Malaysia" }, { name: "Maldives" }, { name: "Mali" }, { name: "Malta" }, { name: "Marshall Islands" }, { name: "Mauritania" }, { name: "Mauritius" }, { name: "Mexico" }, { name: "Micronesia" },
      { name: "Moldova" }, { name: "Monaco" }, { name: "Mongolia" }, { name: "Montenegro" }, { name: "Morocco" }, { name: "Mozambique" }, { name: "Myanmar (formerly Burma)" }, { name: "Namibia" }, { name: "Nauru" }, { name: "Nepal" },
      { name: "Netherlands" }, { name: "New Zealand" }, { name: "Nicaragua" }, { name: "Niger" }, { name: "Nigeria" }, { name: "North Korea" }, { name: "North Macedonia" }, { name: "Norway" }, { name: "Oman" }, { name: "Pakistan" },
      { name: "Palau" }, { name: "Palestine State" }, { name: "Panama" }, { name: "Papua New Guinea" }, { name: "Paraguay" }, { name: "Peru" }, { name: "Philippines" }, { name: "Poland" }, { name: "Portugal" }, { name: "Qatar" },
      { name: "Romania" }, { name: "Russia" }, { name: "Rwanda" }, { name: "Saint Kitts and Nevis" }, { name: "Saint Lucia" }, { name: "Saint Vincent and the Grenadines" }, { name: "Samoa" }, { name: "San Marino" }, { name: "Sao Tome and Principe" }, { name: "Saudi Arabia" },
      { name: "Senegal" }, { name: "Serbia" }, { name: "Seychelles" }, { name: "Sierra Leone" }, { name: "Singapore" }, { name: "Slovakia" }, { name: "Slovenia" }, { name: "Solomon Islands" }, { name: "Somalia" }, { name: "South Africa" },
      { name: "South Korea" }, { name: "South Sudan" }, { name: "Spain" }, { name: "Sri Lanka" }, { name: "Sudan" }, { name: "Suriname" }, { name: "Sweden" }, { name: "Switzerland" }, { name: "Syria" }, { name: "Taiwan" },
      { name: "Tajikistan" }, { name: "Tanzania" }, { name: "Thailand" }, { name: "Timor-Leste" }, { name: "Togo" }, { name: "Tonga" }, { name: "Trinidad and Tobago" }, { name: "Tunisia" }, { name: "Turkey" }, { name: "Turkmenistan" },
      { name: "Tuvalu" }, { name: "Uganda" }, { name: "Ukraine" }, { name: "United Arab Emirates" }, { name: "United Kingdom" }, { name: "United States of America" }, { name: "Uruguay" }, { name: "Uzbekistan" }, { name: "Vanuatu" }, { name: "Vatican City" },
      { name: "Venezuela" }, { name: "Vietnam" }, { name: "Yemen" }, { name: "Zambia" }, { name: "Zimbabwe" }
    ];

    this.ActivatedRoute.paramMap.subscribe((id) => {
      this.countriesdata = Country.getAllCountries();

      if (this.viewpage) {

        this.id = id.get('id')
        this.apiService.CommonApi(Apiconfig.getCompnay.method, Apiconfig.getCompnay.url, { data: this.id }).subscribe((result) => {
          console.log("--------------------------------------------------e ehdfudhfj---------------")
          this.CompanyDetails = result.data
          console.log(this.CompanyDetails);
          this.activedata = true

        })
      } else {
        if (id.get('id')) {
          this.id = id.get('id')
          this.checkpassword = true
          this.inputdesable = true
          // this.pageTitle = "Sub Admin " + (this.viewpage ? 'View' : 'Edit');
          this.apiService.CommonApi(Apiconfig.getCompnay.method, Apiconfig.getCompnay.url, { data: this.id }).subscribe(
            (result) => {

              if (result && Object.keys(result).length > 0) {
                console.log(result.data.countryisoCode)
                this.CompanyDetails = result.data;
                let isocodes = this.CompanyDetails.countryisoCode
                // let data=[]
                // for (let i = 0; i < isocodes.length; i++) {
                //   console.log("hiih inside")
                //   let countryData = State.getStatesOfCountry(isocodes[i]);
                //   data = [...data, ...countryData];
                //   // isocode.push($event[i].isoCode)
                this.CompanyDetails.role = this.capitalizeWords(this.CompanyDetails.role);
                this.CompanyDetails.team = this.capitalizeWords(this.CompanyDetails.team);
                // }
                // console.log("-----------------------------------------------------------")
                // console.log(data)
                // this.states=data
               // console.log(this.CompanyDetails.subscriptionenddate)
                this.countryCity = this.CompanyDetails.countryCity
                // this.form.controls['username'].setValue(this.CompanyDetails.username ? this.CompanyDetails.username : '');
                this.form.controls['name'].setValue(this.CompanyDetails.name ? this.CompanyDetails.name : '');
                this.form.controls['companyname'].setValue(this.CompanyDetails.companyname ? this.CompanyDetails.companyname : '');
                //this.form.controls['college'].setValue(this.CompanyDetails.college ? this.CompanyDetails.college : '');

                this.form.controls['email'].setValue(this.CompanyDetails.email ? this.CompanyDetails.email : '');
                this.form.controls['status'].setValue(this.CompanyDetails.status ? this.CompanyDetails.status : '')
                // this.form.controls['city'].setValue(this.CompanyDetails.city?this.CompanyDetails.city:'')
                this.form.controls['year'].setValue(this.CompanyDetails.year ? this.CompanyDetails.year : '')
                this.form.controls['course'].setValue(this.CompanyDetails.course ? this.CompanyDetails.course : '')

                //this.form.controls['subscriptionenddate'].setValue(this.CompanyDetails.subscriptionenddate ? new Date(this.CompanyDetails.subscriptionenddate) : '')
               // this.form.controls['subscriptionstartdate'].setValue(this.CompanyDetails.subscriptionstartdate ? new Date(this.CompanyDetails.subscriptionstartdate) : '')
                // this.form.controls['country'].setValue(this.CompanyDetails?.country?this.CompanyDetails?.country:'')
                // this.form.controls['state'].setValue(this.CompanyDetails?.state?this.CompanyDetails?.state:'')
                // this.form.controls['team'].setValue(this.CompanyDetails.team?this.CompanyDetails.team:'')
                this.form.controls['mobile'].setValue(this.CompanyDetails.mobile ? this.CompanyDetails.mobile : '')
                this.form.controls['activeusers'].setValue(this.CompanyDetails.activeusers ? this.CompanyDetails.activeusers : '')
                this.CompanyDetails.country = this.CompanyDetails.country.charAt(0).toUpperCase() + this.CompanyDetails.country.slice(1).toLowerCase();
                                const phoneCountry = countryMapping[this.CompanyDetails.dialCode];
                                this.selectedCountryISO = this.CompanyDetails.country?CountryISO[phoneCountry]:CountryISO['India']

                // this.checkprivilages();
                // if (this.viewpage) {
                //   this.form.form.disable();
                // }
              }
            }
          )
        } else {

          setTimeout(() => {

            this.form.controls['status'].setValue("1")

          }, 100)
        }
      }


    })



  };
  getCountryNames(data: any): string {
    return data?.map(item => this.capitalizeFirstLetter(item.country)).join(', ');
  }
  getcities(data: any): any {
    return data?.flatMap(country => country.city.map(city => this.capitalizeFirstLetter(city)));
  }

  capitalizeFirstLetter(word: string): string {
    return word?.charAt(0).toUpperCase() + word?.slice(1).toLowerCase();
  }

  capitalizeWords(input: string[]): string[] {
    return input?.map(item =>
      item.split(' ')
        .map(word => this.capitalizeFirstLetter(word))
        .join(' ')  // Join words with a space between them
        .replace(/,/g, ', ') // Add space after commas
    );
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

  addCountryCity(i) {
    console.log(i)
    this.countryCity.push({ country: null, city: [] });
  }

  // Remove a country-city pair
  removeCountryCity(index: number) {
    this.countryCity.splice(index, 1);
  }

  public onFormSubmit(companyForm: UntypedFormGroup) {
    console.log(this.countryCity);

    // Validate that the start date is not greater than the end date
    // const startDate = new Date(companyForm.value.subscriptionstartdate);
    // const endDate = new Date(companyForm.value.subscriptionenddate);

    // if (startDate > endDate) {
    //   this.notifyService.showError("Subscription start date cannot be later than the end date.");
    //   return; // Exit the function if the dates are invalid
    // }

    // Ensure that city names are in lowercase (if applicable)
    this.countryCity.forEach(item => {
      item.city = item.city.map(city => city.toLowerCase());
    });

    console.log(companyForm.value);

    if (companyForm.valid) {
      let data = companyForm.value;
      const mobileObj = data.mobile;
      delete data.mobile;
      data.mobile = mobileObj.number;
      data.dialCode = mobileObj.dialCode;

      if (this.id === undefined) {
        // New company creation
        this.firebaseService.checkmobileexsist(data.mobile).then((result) => {
          if (result === 0) {
            this.firebaseService.createAccount(data.email, data.password).subscribe((res) => {
              // Ensure team and role are in lowercase
              //let team = data.team.map(x => x.toLowerCase());
              //let role = data.role.map(x => x.toLowerCase());

              // Update the data object
              //data.team = team;
              //data.role = role;
              data.actiontype = "create";
              data.access = "company";
              data.countryCity = this.countryCity;
              data.slugname = data.name.toLowerCase();

              console.log("----------------------------------");
              console.log(data);

              this.apiService.CommonApi(Apiconfig.add_edit_company.method, Apiconfig.add_edit_company.url, data).subscribe((result) => {
                if (result.status == true) {
                  this.notifyService.showSuccess("Added successfully");
                  this.router.navigate(["app/companies/list"]);
                } else {
                  this.notifyService.showError(result.message);
                }
              });
            }, (error) => {
              this.notifyService.showError(error);
            });
          } else {
            this.notifyService.showError("Phone number already exists");
          }
        });
      } else {
        // Update existing company
        console.log(data);

        data.actiontype = "update";
        data.slugname = data.name.toLowerCase();
        data.countryisoCode = this.countryisoCode;
        data._id = this.id;
        data.access = "company";
        data.countryCity = this.countryCity;

        console.log(data);

        this.apiService.CommonApi(Apiconfig.add_edit_company.method, Apiconfig.add_edit_company.url, data).subscribe((result) => {
          if (result.status) {
            this.notifyService.showSuccess("Updated successfully");
            this.router.navigate(["app/companies/list"]);
          } else {
            this.notifyService.showError(result.message);
          }
        });
      }
    } else {
      this.notifyService.showError('Please Enter all mandatory fields');
    }
  }



  validateDates() {
    const startDate = new Date(this.formData.subscriptionstartdate);
    const endDate = new Date(this.formData.subscriptionenddate);

    // Check if start date is greater than end date
    this.startDateEndDateError = startDate > endDate;
  }



  validateInput(event: any) {

    let inputValue = event.target.value.replace(/[^0-9]/g, '');
    // Ensure the input length does not exceed 6 characters
    // if (inputValue.length > 6) {
    //     inputValue = inputValue.slice(0, 6);
    // }
    // Update the input value with the sanitized value
    event.target.value = inputValue;
  }

  togglePasswordVisibility(field: string): void {
    this.passwordVisible[field] = !this.passwordVisible[field];
    const passwordField: any = document.getElementById(field);

    if (this.passwordVisible[field]) {
      passwordField.type = 'text';
    } else {
      passwordField.type = 'password';
    }
  }
}
