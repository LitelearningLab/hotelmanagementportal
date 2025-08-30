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

@Component({
  selector: 'app-add-company-subadmin',
  templateUrl: './add-company-subadmin.component.html',
  styleUrls: ['./add-company-subadmin.component.scss']
})
export class AddCompanySubadminComponent {
  @ViewChild('subadminCompanyForm') form: NgForm;
  citynames:any=[]
  CompanysubadminDetails: any;
  pageTitle: string = 'Add Companies Sub Admin';
  submitebtn: boolean = false;
  viewpage: boolean = false;
  isChecked: boolean = false;
  privilagesdata: PrivilagesData[] = privilagedata;
  userPrivilegeDetails: PrivilagesData[] = [];
  curentUser: any;
  checkpassword: boolean = false;
  id: string;
  companynames: any;
  disableinput: boolean=false;
  countrylist: { name: string; }[];

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
  }

  ngOnInit(): void {
    // this.id = this.ActivatedRoute.snapshot.paramMap.get('id');
   
    this.getcompany()
    this.ActivatedRoute.paramMap.subscribe((id)=>{

    
     
      if(id.get('id')){
        this.id=id.get('id')
        this.checkpassword = true
        // this.pageTitle = "Sub Admin " + (this.viewpage ? 'View' : 'Edit');
        this.apiService.CommonApi(Apiconfig.getCompnay.method, Apiconfig.getCompnay.url, { data: this.id }).subscribe(
          (result) => {
      
            if (result && Object.keys(result).length>0) {
         
              this.CompanysubadminDetails = result.data;
         
              
              this.disableinput=true     
              
              // this.form.controls['username'].setValue(this.CompanysubadminDetails.username ? this.CompanysubadminDetails.username : '');
              this.form.controls['name'].setValue(this.CompanysubadminDetails.name ? this.CompanysubadminDetails.name : '');
              this.form.controls['email'].setValue(this.CompanysubadminDetails.email ? this.CompanysubadminDetails.email : '');
              this.form.controls['status'].setValue(this.CompanysubadminDetails.status?this.CompanysubadminDetails.status:'')
              // this.form.controls['city'].setValue(this.CompanysubadminDetails.city?this.CompanysubadminDetails.city:'')
              // this.form.controls['country'].setValue(this.CompanysubadminDetails?.country?this.CompanysubadminDetails?.country:'')
              // this.form.controls['state'].setValue(this.CompanysubadminDetails?.state?this.CompanysubadminDetails?.state:'')
              this.form.controls['mobile'].setValue(this.CompanysubadminDetails.mobile?this.CompanysubadminDetails.mobile:'')
              this.form.controls['company'].setValue(this.CompanysubadminDetails.company?this.CompanysubadminDetails.company:'')
              setTimeout(()=>{
                let data=this.companynames?.filter((x)=>x._id===this.CompanysubadminDetails.companyid)
                this.citynames=data[0].city
              },100)

              // this.checkprivilages();
              // if (this.viewpage) {
              //   this.form.form.disable();
              // }
            }
          }
        )
      }else{
        setTimeout(()=>{
          this.form.controls['status'].setValue("1")
          this.form.controls['company'].setValue(null)

        },100)
      }
      
    })
    
   
  
  };
  getcompany(){
    this.apiService.CommonApi(Apiconfig.getCompanynames.method,Apiconfig.getCompanynames.url,{}).subscribe((result)=>{
     this.companynames=result.data
    })
  }
  changecompany(data:any){
    this.disableinput=true
    // this.citynames=data.
    console.log(data)
    this.countrylist=data.countryCity
    this.form.controls['city'].setValue('')
    this.form.controls['country'].setValue('')
  }



  public onFormSubmit(subadminCompanyForm: UntypedFormGroup) {
    console.log(this.companynames)
    console.log(subadminCompanyForm.value);
    if (subadminCompanyForm.valid) {
      let data=subadminCompanyForm.value
      console.log(data);
      
      if(this.id===undefined){
        this.firebaseService.createAccount(data.email, data.password).subscribe((res) => {
          let companyselected=this.companynames.filter(x=>x.companyname==subadminCompanyForm.value.company)
          let subadmindata = {
            name: data.name,
            email: data.email,
            actiontype:"create",
            uid: res.uid,
            status: data.status,
            access:"companysubadmin",
            // city:data.city,
            // state:data.state,
            mobile:data.mobile.toString(),
            company:data.company,
            college:data.company,
            companyid:companyselected[0]._id,
            companydata:companyselected
            // country:data.country
          }
         
          
          this.apiService.CommonApi(Apiconfig.compnay_sub_admim.method, Apiconfig.compnay_sub_admim.url, subadmindata).subscribe((result) => {
            if(result.status==true){
              this.notifyService.showSuccess("Added successfully")
              this.router.navigate(["app/companies/listsubadmins"])
            }else{
              this.notifyService.showError(result.message)
            }
          })
        }, (error) => {
          this.notifyService.showError(error)
        })
    
      }else{

        data.actiontype="update"
        data._id=this.id
        data.college=data.company;
        data.access="companysubadmin"
        this.apiService.CommonApi(Apiconfig.compnay_sub_admim.method,Apiconfig.compnay_sub_admim.url,data).subscribe((result)=>{
          if(result.status){
            console.log("here we have reached");
            
            this.notifyService.showSuccess("Updated successfully")
            this.router.navigate(["app/companies/listsubadmins"])
          }else{
            this.notifyService.showError(result.message)
          }
        })        
      }

   

      
    } else {
      this.notifyService.showError('Please Enter all mandatory fields');
    }
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
