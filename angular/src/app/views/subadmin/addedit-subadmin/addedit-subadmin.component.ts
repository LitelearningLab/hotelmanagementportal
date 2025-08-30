import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-addedit-subadmin',
  templateUrl: './addedit-subadmin.component.html',
  styleUrls: ['./addedit-subadmin.component.scss']
})
export class AddeditSubadminComponent implements OnInit,OnDestroy  {
  @ViewChild('adminForm') form: NgForm;

  adminDetails: any;
  pageTitle: string = 'Add Sub Admin';
  submitebtn: boolean = false;
  viewpage: boolean = false;
  isChecked: boolean = false;
  privilagesdata: PrivilagesData[] = privilagedata;
  userPrivilegeDetails: PrivilagesData[] = [];
  curentUser: any;
  checkpassword: boolean = false;
  id: string;
  activedata: boolean=false;
  disableinput: boolean=false;
  passwordVisible = {
    password: false,
    confirm_password: false
  };
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
  ngOnDestroy(): void {
    // this.userPrivilegeDetails=[]
    this.privilagesdata=[] 
    console.log(this.privilagesdata)
    console.log("component is distroyed")
  }

  ngOnInit(): void {
    console.log(this.privilagesdata)
    this.privilagesdata[0].status.add=false
    this.privilagesdata[0].status.delete=false
    this.privilagesdata[0].status.edit=false
    this.privilagesdata[0].status.view=false
    this.privilagesdata[1].status.add=false
    this.privilagesdata[1].status.delete=false
    this.privilagesdata[1].status.edit=false
    this.privilagesdata[1].status.view=false
    this.privilagesdata[2].status.add=false
    this.privilagesdata[2].status.delete=false
    this.privilagesdata[2].status.edit=false
    this.privilagesdata[2].status.view=false
    this.privilagesdata[3].status.add=false
    this.privilagesdata[3].status.delete=false
    this.privilagesdata[3].status.edit=false
    this.privilagesdata[3].status.view=false
    
    // this.id = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.ActivatedRoute.paramMap.subscribe((id)=>{
    

      if(this.viewpage){
        this.id=id.get('id')
        this.apiService.CommonApi(Apiconfig.subAdminEdit.method,Apiconfig.subAdminEdit.url,{data:this.id}).subscribe((result)=>{
          this.adminDetails=result.data
          this.activedata=true
        })

      }else{
        if(id.get('id')){
          this.id=id.get('id')
          this.checkpassword = true
          this.disableinput=true
          this.pageTitle =(this.viewpage ? 'View' : 'Edit')+ " Sub Admin"  ;
          this.apiService.CommonApi(Apiconfig.subAdminEdit.method, Apiconfig.subAdminEdit.url, { data: this.id }).subscribe(
            (result) => {
              console.log("+++++++++++++++++++++++++++++++++")
              console.log(result)
              if (result && Object.keys(result).length>0) {
                let privilagearray=result.data.privileges
             
                this.adminDetails = result.data;
                console.log(this.adminDetails)
                        
                
                // this.form.controls['username'].setValue(this.adminDetails.username ? this.adminDetails.username : '');
                this.form.controls['name'].setValue(this.adminDetails.name ? this.adminDetails.name : '');
                this.form.controls['email'].setValue(this.adminDetails.email ? this.adminDetails.email : '');
                this.form.controls['status'].setValue(this.adminDetails.status?this.adminDetails.status:'')
                this.form.controls['mobile'].setValue(this.adminDetails.mobile?this.adminDetails.mobile:'')
                this.privilagesdata.forEach((value) => {
                  console.log(value)
                  let index = this.adminDetails.privileges.findIndex(x => x.alias === value.alias);
                  console.log(index)
                  if (index != -1) {
                    value.status = this.adminDetails.privileges[index].status;
                  }
                })
                this.checkprivilages();
                // if (this.viewpage) {
                //   this.form.form.disable();
                // }
              }
            }
          )
        }
      }
    
   
    })
    
  };


  
  selectall(event) {
    this.privilagesdata.forEach((value) => {
      value.status.add = event;
      value.status.edit = event;
      value.status.view = event;
      value.status.delete = event;
    });
  }

  checkprivilages() {
    var i = 0;
    // console.log(this.privilagesdata);

    this.privilagesdata.forEach((value) => {
      if (value.status.add == true && value.status.edit == true && value.status.view == true && value.status.delete == true) {
        i++;
      }
    });
    if (this.privilagesdata.length === i) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }

  public onFormSubmit(adminForm: UntypedFormGroup) {
    console.log(this.id);
    console.log(adminForm.valid)
    if (adminForm.valid) {
      this.submitebtn = true;
      var data = adminForm.value;
      console.log(data)
    if( data.confirmPassword!=data.password ){
      return 
    }
      data.role = 'subadmin';
      data._id = this.ActivatedRoute.snapshot.paramMap.get('id');
      data['privileges'] = this.privilagesdata;

     
      if(this.id===undefined){
         this.firebaseService.checkmobileexsist(data.mobile).then((result)=>{
          if(result===0){

            this.firebaseService.createAccount(data.email, data.password).subscribe((res) => {
             
              let subadmindata = {
                name: data.name,
                email: data.email,
                privileges: this.privilagesdata,
                actiontype:"create",
                uid: res.uid,
                status: data.status,
                access:"subAdmin",
                mobile:data.mobile
               
              }
              this.apiService.CommonApi(Apiconfig.add_sub_admin.method, Apiconfig.add_sub_admin.url, subadmindata).subscribe((result) => {
                if(result.status==true){
                  this.notifyService.showSuccess(result.message||"Sub Admin added")
                  this.privilagesdata=[] 
                  this.router.navigate(["app/subadmin/list"])
                }else{
                  this.notifyService.showError(result.message)
                }
              })
            }, (error) => {
              this.notifyService.showError(error)
            })
          }else{
            this.notifyService.showError("Phone number already exsisted")
          }
         })

      }else{

        
        let subadmindata = {
          name: data.name,
          email: data.email,
          privileges: this.privilagesdata,
          actiontype:"update",
          _id: this.id,
          status: data.status,
          access:"subAdmin",
          mobile:data.mobile
         
        }
        if(this.adminDetails.mobile===subadmindata.mobile){
          this.apiService.CommonApi(Apiconfig.add_sub_admin.method, Apiconfig.add_sub_admin.url, subadmindata).subscribe((result) => {
            if(result.status==true){
              this.notifyService.showSuccess("Updated successfully")
              this.router.navigate(["app/subadmin/list"])
            }else{
              this.notifyService.showError(result.message)
            }
          })

        }else{

          this.firebaseService.checkmobileexsist(subadmindata.mobile).then((result)=>{
            if(result===0){
              this.apiService.CommonApi(Apiconfig.add_sub_admin.method, Apiconfig.add_sub_admin.url, subadmindata).subscribe((result) => {
                if(result.status==true){
                  this.notifyService.showSuccess("Updated successfully")
                  this.router.navigate(["app/subadmin/list"])
                }else{
                  this.notifyService.showError(result.message)
                }
              })
            }else{
              this.notifyService.showError("Phone number already exsisted")
            }
          })
        }
      }

      
    } else {
      this.notifyService.showError('Please Enter all mandatory fields');
    }
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
