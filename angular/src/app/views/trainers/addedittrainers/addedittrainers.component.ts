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
  selector: 'app-addedittrainers',
  templateUrl: './addedittrainers.component.html',
  styleUrls: ['./addedittrainers.component.scss']
})
export class AddedittrainersComponent {
  @ViewChild('trainerForm') form: NgForm;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  citynames:any=[]
  rolenames:any=[]
  teamnames:any=[]
  cityPlaceholder ='Select Your City'
  trainerDetails: any;
  pageTitle: string = 'Add Trainer';
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
    let companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))


    if(data){
      this.companyadmin=true
      this.disableinput=true 
      this.countrylist=data.countryCity
      // this.citynames=data.city
    }
    if(companysubadmin){
      this.companyadmin=true
      this.disableinput=true
      this.countrylist=companysubadmin.companydata[0].countryCity
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
    // this.id = this.ActivatedRoute.snapshot.paramMap.get('id');
  
    this.ActivatedRoute.paramMap.subscribe((id)=>{
      if(this.viewpage){
        this.id=id.get('id')
        this.apiService.CommonApi(Apiconfig.getCompnay.method, Apiconfig.getCompnay.url, { data: this.id }).subscribe((result)=>{
          this.trainerDetails=result.data
          this.activedata=true
        })
      }else{
        this.getcompany()
      if(id.get('id')){
        this.id=id.get('id')
        this.checkpassword = true
        this.disableinput=true
        this.inputdesable=true
        this.pageTitle = this.viewpage ? 'View Trainer Details' : 'Edit Trainer Details';
        this.apiService.CommonApi(Apiconfig.getCompnay.method, Apiconfig.getCompnay.url, { data: this.id }).subscribe(
          (result) => {
      
            if (result && Object.keys(result).length>0) {
         
              this.trainerDetails = result.data;
              
              this.form.controls['name'].setValue(this.trainerDetails.name ? this.trainerDetails.name : '');
              this.form.controls['email'].setValue(this.trainerDetails.email ? this.trainerDetails.email : '');
              this.form.controls['status'].setValue(this.trainerDetails.status?this.trainerDetails.status:'')
              this.form.controls['city'].setValue(this.trainerDetails.city?this.trainerDetails.city:null)
            
              this.form.controls['country'].setValue(this.trainerDetails?.country?this.trainerDetails?.country:'')
              if(!this.companyadmin){
                this.form.controls['company'].setValue(this.trainerDetails.companyid?this.trainerDetails.companyid:'')
                }
                let companydata
                setTimeout(()=>{

                   companydata=this.companynames.filter((x)=>x._id===this.trainerDetails.companyid)
                   this.countrylist=companydata[0].countryCity
                   let data=this.countrylist.filter((x)=>x.country===this.trainerDetails.country)
                   this.citynames=data[0].city
                   
                },100)
           
              this.form.controls['mobile'].setValue(this.trainerDetails.mobile?this.trainerDetails.mobile:'')

             
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
          this.form.controls['city'].setValue(null)
          this.form.controls['country'].setValue(null)
          this.form.controls['company'].setValue(null)


        },100)
      }

      }
      
      
    })
    
 
  
  };

  getcompany(){
    // if(!this.companyadmin){
      this.apiService.CommonApi(Apiconfig.getCompanynames.method,Apiconfig.getCompanynames.url,{}).subscribe((result)=>{
        debugger;
       this.companynames=result.data;

      })
    // }
  }
  changeCountry(data){
    // console.log(data)
    this.citynames=data.city
    this.form.controls['city'].setValue('')
  }
  changecompany(data:any){
    console.log(data)
    this.disableinput=true
    this.countrylist=data.countryCity
    // this.citynames=data.city
    this.form.controls['city'].setValue('')
    this.form.controls['country'].setValue('')
  }
  public onFormSubmit(trainerForm: UntypedFormGroup) {
    let companydata=this.companynames.filter((x)=>x._id===trainerForm.value.company)
    // console.log(trainerForm.value)
    if (trainerForm.valid) {
      let data=trainerForm.value
      if(this.id===undefined){
        if(this.companyadmin){
         
          let companytdata=JSON.parse(localStorage.getItem('company'))
         
          let trainerdata:any
          if(companytdata){
          trainerdata = {
              name: data.name,
              uesrname:data.name,
              slugname:data.name.toLowerCase(),
              email: data.email,
              actiontype:"create",
              status: data.status,
              access:"Trainer Login",
              city:data.city.toLowerCase(),
              mobile:data.mobile.toString(),
              country:data.country,
              company:companytdata.companyname,
              companyid:companytdata._id,
              webaccess:"1"
            }
            
          }else{
            let companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))
            trainerdata = {
              name: data.name,
              uesrname:data.name,
              slugname:data.name.toLowerCase(),
              email: data.email,
              actiontype:"create",
              status: data.status,
              access:"Trainer Login",
              city:data.city.toLowerCase(),
              mobile:data.mobile.toString(),
              country:data.country,
              company:companysubadmin.companydata[0].companyname,
              companyid:companysubadmin.companydata[0]._id,
              webaccess:"1"
            }

          }
          this.firebaseService.checkmobileexsist(data.mobile).then((result)=>{
            if(result===0){
                    this.firebaseService.createAccount(data.email, data.password).subscribe((res) => {
               
                      trainerdata.uid=res.uid
                
                this.apiService.CommonApi(Apiconfig.com_trainer_addedit.method, Apiconfig.com_trainer_addedit.url, trainerdata).subscribe((result) => {
                  if(result.status==true){
                    this.notifyService.showSuccess("Added successfully")
                    this.router.navigate(["app/trainers/list"])
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
          let trainerdata :any= {
            name: data.name,
            uesrname:data.name,
            slugname:data.name.toLowerCase(),
            email: data.email,
            actiontype:"create",
            status: data.status,
            access:"Trainer Login",
            city:data.city.toLowerCase(),
            mobile:data.mobile.toString(),
            country:data.country,
            company:companydata[0].name,
            companyid:companydata[0]._id,
            webaccess:"1"
          }
          
          this.firebaseService.checkmobileexsist(data.mobile).then((result)=>{
            
            if(result===0){
                    this.firebaseService.createAccount(data.email, data.password).subscribe((res) => {
               
                      trainerdata.uid=res.uid
                
                this.apiService.CommonApi(Apiconfig.add_edit_trainer.method, Apiconfig.add_edit_trainer.url, trainerdata).subscribe((result) => {
                  if(result.status==true){
                    this.notifyService.showSuccess("Added successfully")
                    this.router.navigate(["app/trainers/list"])
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
        }
        
     
    
      }else{
        if(this.companyadmin){
          data.actiontype="update",
          data.slugname=data.name.toLowerCase()
          data._id=this.id
          data.access="Trainer Login"



          if(this.trainerDetails.mobile===data.mobile){
            this.apiService.CommonApi(Apiconfig.com_trainer_addedit.method,Apiconfig.com_trainer_addedit.url,data).subscribe((result)=>{
              if(result.status){
                setTimeout(()=>{
                  this.notifyService.showSuccess("Updated successfully")
    
                  this.router.navigate(["app/trainers/list"])
                },1000)
              }else{
                this.notifyService.showError(result.message)
              }
            })  

          }else{
            this.firebaseService.checkmobileexsist(data.mobile).then((result)=>{
              if(result===0){
                this.apiService.CommonApi(Apiconfig.com_trainer_addedit.method,Apiconfig.com_trainer_addedit.url,data).subscribe((result)=>{
                  if(result.status){
                    setTimeout(()=>{
                      this.notifyService.showSuccess("Updated successfully")
        
                      this.router.navigate(["app/trainers/list"])
                    },1000)
                  }else{
                    this.notifyService.showError(result.message)
                  }
                })  
               
              }else{
                this.notifyService.showError("Phone number already exsisted")
              }
            })

          }

         
        }else{

          data.actiontype="update",
          data.slugname=data.name.toLowerCase()
          data._id=this.id
          data.access="Trainer Login"
          console.log(companydata)
          data.companyid=data.company
          data.company=companydata[0].name
          console.log(data)
          this.apiService.CommonApi(Apiconfig.add_edit_trainer.method,Apiconfig.add_edit_trainer.url,data).subscribe((result)=>{
            if(result.status){
              setTimeout(()=>{
                this.notifyService.showSuccess("Updated successfully")
  
                this.router.navigate(["app/trainers/list"])
              },1000)
            }else{
              this.notifyService.showError(result.message)
            }
          })        
        }
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
