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
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-addnotification',
  templateUrl: './addnotification.component.html',
  styleUrls: ['./addnotification.component.scss']
})
export class AddnotificationComponent {
  @ViewChild('notificationForm') form: NgForm;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  citynames:any=[]
  rolenames:any=[]
  teamnames:any=[]
  trainerDetails: any;
  pageTitle: string = 'Create Notification';
  submitebtn: boolean = false;
  viewpage: boolean = false;
  isChecked: boolean = false;
  privilagesdata: PrivilagesData[] = privilagedata;
  userPrivilegeDetails: PrivilagesData[] = [];
  curentUser: any;
  checkpassword: boolean = false;
  id: string;
  inputdesable: boolean=false;
companynames: any=[];
  disableinput: boolean=false;
  countrylist: any=[];
  companyadmin: boolean=false;
  activedata: boolean=false;
  fileimage: File;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router,
    private store: DefaultStoreService,
    private authService: AuthenticationService,
    private firebaseService: FirebaseServiceService
  ) {
    let data=JSON.parse(localStorage.getItem('company'))
    if(data){
      this.companyadmin=true
      this.disableinput=true 
      this.countrylist=data.countryCity
      // this.citynames=data.city
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
    this.id = this.ActivatedRoute.snapshot.paramMap.get('id');
    if(this.id){
      this.apiService.CommonApi(Apiconfig.get_nofication.method,Apiconfig.get_nofication.url,{id:this.id}).subscribe((res)=>{
        if(res.status){
          
          this.form.controls['title'].setValue(res.data.title?res.data.title:"")
          this.form.controls['message'].setValue(res.data.message?res.data.message:"")
        }else{
          this.notifyService.showError(res.message)
        }
      })
    }
  
  };


  changefile(event){

    this.fileimage=event.target.files[0]
    
  }
  
  public onFormSubmit(notificationForm: UntypedFormGroup) {

    let data:any=notificationForm.value
 
    if(notificationForm.valid){
      if(this.id){
    
        data.action="update"
        data._id=this.id
        this.apiService.CommonApi(Apiconfig.create_notification.method,Apiconfig.create_notification.url,data).subscribe((result)=>{
          if(result.status){
            this.notifyService.showSuccess(result.message)
            // this.form.resetForm()
            this.router.navigate(["app/notificationss/list"])
          }else{
            this.notifyService.showError("Somthing went wrong")
          }
        })
       
      }else{
        // data.action='create'
        console.log("insdie of this console mer")
        let formdata=new FormData()
        formdata.append('file',this.fileimage)
        formdata.append('title',data.title)
        formdata.append("message",data.message)
        formdata.append("action","create")
        this.apiService.CommonApi(Apiconfig.create_notification.method,Apiconfig.create_notification.url,formdata).subscribe((result)=>{
          if(result.status){
            this.notifyService.showSuccess("Notifcation Created Successfully")
            this.form.resetForm()
          }else{
            this.notifyService.showError("Somthing went wrong")
          }
        })
      }
     
     

    }else{
      this.notifyService.showError('Fill all mandatory fields')
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
