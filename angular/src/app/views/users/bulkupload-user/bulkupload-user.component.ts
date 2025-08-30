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
import { error, log } from 'console';
//import generator from 'generate-password';
@Component({
  selector: 'app-bulkupload-user',
  templateUrl: './bulkupload-user.component.html',
  styleUrls: ['./bulkupload-user.component.scss']
})
export class BulkuploadUserComponent {
  @ViewChild('bulkupload') form: NgForm;

  adminDetails: any;
  pageTitle: string = 'Bulk Upload';
  submitebtn: boolean = false;
  viewpage: boolean = false;
  isChecked: boolean = false;
  privilagesdata: PrivilagesData[] = privilagedata;
  userPrivilegeDetails: PrivilagesData[] = [];
  curentUser: any;
  checkpassword: boolean = false;
  id: string;
  companynames: any;
  excelfile: any;
  inputdisable: boolean=false;
  companyadmin: boolean=false;
  minDate: Date;
  fileError: string | null = null;
  disablesubmit: boolean=false;
  skippeddocumets: any;
  skipped: boolean=false;
  company = null;
  SelectedCompany:any ={};
  iscompany=false;

  companysubadmin: any;
  trainerData:any;
  companydata: any;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router,
    private store: DefaultStoreService,
    private authService: AuthenticationService,
    private firebaseService: FirebaseServiceService
  ) {
     this.companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))
    this.trainerData = JSON.parse(localStorage.getItem("Trainer Login"));
    this.companydata=JSON.parse(localStorage.getItem("company"))

    this.minDate = new Date();
    let data=JSON.parse(localStorage.getItem('company'))
    if(data){
      this.inputdisable=true
      this.companyadmin=true
    }
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
  }

  ngOnInit(): void {
     if (this.companysubadmin) {
      this.SelectedCompany=this.companysubadmin.companyid;
      this.getCompanyDetailsFromServer(this.SelectedCompany);
    }
    else if (this.trainerData) {
      this.SelectedCompany=this.trainerData.companyid;
      this.getCompanyDetailsFromServer(this.SelectedCompany);
    }
    else if (this.companydata) {
      this.SelectedCompany=this.companydata._id;
      this.getCompanyDetailsFromServer(this.SelectedCompany);
    }
    else{
      this.getCompany()
    }
  };
  downloadTemplate(): void {
    // This opens the Excel template file from the assets folder
    window.open('assets/image/bulkuploadtemplate.xlsx', '_blank');
  }
  // selectedFile(event){
    
  //   this.excelfile=event.target.files[0]
  //   const input = event.target as HTMLInputElement;
  //   if (!input.files?.length) {
  //     return;
  //   }

  //   const file = input.files[0];
  //   const fileType = file.name.split('.').pop()?.toLowerCase();

  //   if (fileType !== 'xls' && fileType !== 'xlsx') {
  //     this.fileError = 'Please select a valid Excel file (.xls or .xlsx).';
  //   } else {
  //     this.fileError = null;
  //     // Handle the valid file upload
  //     console.log('File selected:', file);
  //   }
  // }
  
  selectedFile(event){
    const input = event.target as HTMLInputElement;
    this.excelfile=event.target.files[0]

    if (!input.files?.length) {
      this.fileError = 'No file selected.';
      return;
    }

    const file = input.files[0];
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (fileType !== 'xls' && fileType !== 'xlsx') {
      this.disablesubmit=true
      this.fileError = 'Please select a valid Excel file (.xls or .xlsx).';
    } else {
      this.fileError = null;
      // Handle the valid file upload
      this.disablesubmit=false
      console.log('File selected:', file);
    }
  }
  getCompany(){
    this.apiService.CommonApi(Apiconfig.getCompanynames.method,Apiconfig.getCompanynames.url,{}).subscribe((result)=>{
      this.companynames=result.data
      this.form.controls.company.setValue(null)
      
     })
  }

  getCompanyDetails(ev){
    debugger;
    this.getCompanyDetailsFromServer(ev.form.value.company);
   
  }

  getCompanyDetailsFromServer(cid) {
    debugger;
    this.iscompany = false;
    this.apiService.CommonApi(Apiconfig.getCompnay.method, Apiconfig.getCompnay.url, { data: cid }).subscribe((result) => {
      console.log("--------------------------------------------------e ehdfudhfj---------------")
      debugger
      this.SelectedCompany = result.data;
      this.iscompany = true;
      // this.CompanyDetails = result.data
      // console.log(this.CompanyDetails);
      // this.activedata = true

    })
  }

  public onFormSubmit(companyForm: NgForm) {
    // console.log(companyForm)
    // console.log(companyForm.valid)
    debugger;
    this.skipped=false
    this.skippeddocumets=[]
    if (companyForm.valid) {
      let data=companyForm.value
      //if(!this.companyadmin){
        console.log("-------------------------------------------------------formdata")
        let bulkupload=new FormData()
        // let companyfind=this.companynames.filter(x=>x._id===data.company)
        bulkupload.append('companyid',data.company)
        bulkupload.append('file',this.excelfile)
        bulkupload.append('joindate',data.joiningdate)
        
        // bulkupload.append('companyid',companyfind[0]._id)
        this.apiService.CommonApi(Apiconfig.bulk_upload_user.method,Apiconfig.bulk_upload_user.url,bulkupload).subscribe((result)=>{
          if(result.status){
            debugger;
            console.log(result)
            // this.router.navigateByUrl('app/users/list')
            if(result.count>0){
              this.skipped=true
              this.skippeddocumets=result.skippeddocs
              console.log(this.skippeddocumets,"skiped docks");
              if(result.count >1){

                this.notifyService.showError(`${result.count} entries skipped `)
              }else{
                this.notifyService.showError(`${result.count} entry skipped`)

              }
              if (result.inserteddata.length != 0) {
                result.inserteddata.forEach(el => {
                  debugger;
                  let email = el.email;
                  let password = el.password;
                  this.firebaseService.createAccount(email, password).subscribe((res) => {

                  }, (error) => {
                    this.notifyService.showError("Error while creating the google account! " + error)
                  })
                });
              }
              companyForm.resetForm()
            }else{
              this.skipped=false
              this.skippeddocumets=[]
              this.notifyService.showSuccess("Successfully uploaded");

              if (result.inserteddata.length != 0) {
                result.inserteddata.forEach(el => {
                  debugger;
                  let email = el.email;
                  let password = this.generatePassword();
                  this.firebaseService.createAccount(email, password).subscribe((res) => {

                  }, (error) => {
                    this.notifyService.showError("Error while creating the google account! " + error)
                  })
                });
              }
              
            }
          }else{
            companyForm.resetForm()
            this.notifyService.showError(result.message)
          }
        })
      //}
      // else {

      //   let companydata: any = JSON.parse(localStorage.getItem("company"))
      //   console.log(companydata._id);

      //   let bulkupload = new FormData()
      //   bulkupload.append('companyid', companydata._id)
      //   bulkupload.append('file', this.excelfile)
      //   bulkupload.append('joindate', data.joiningdate)
      //   this.apiService.CommonApi(Apiconfig.com_bulk_user_upload.method, Apiconfig.com_bulk_user_upload.url, bulkupload).subscribe((result) => {
      //     if (result.status) {
      //       console.log(result)
      //       if (result.count > 0) {
      //         this.skipped = true
      //         this.skippeddocumets = result.skippeddocs
      //         this.notifyService.showError(`${result.count} document has skiped `)
      //         companyForm.resetForm()
      //       } else {
      //         this.notifyService.showSuccess("Successfully uploaded")
      //       }
      //     } else {
      //       companyForm.resetForm()
      //       this.notifyService.showError(result.message)
      //     }
      //   })
      // }
      
    } else {
      this.notifyService.showError('Please Enter all mandatory fields');
    }
  }
    generatePassword(): string {
    const length = 12;
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';

    let characters = lower + upper + numbers + symbols;
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
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
}
