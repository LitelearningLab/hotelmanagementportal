import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, FormControl, Validators, UntypedFormBuilder } from '@angular/forms';

import { ApiService } from "src/app/_services/api.service";
import { Apiconfig } from "src/app/_helpers/api-config";
import { settings } from "src/app/interface/interface";
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NotificationService } from 'src/app/_services/notification.service';
import { DefaultStoreService } from 'src/app/_services/default-store.service';
import { environment } from 'src/environments/environment';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword,onAuthStateChanged , getAuth, signInWithEmailAndPassword } from "firebase/auth";
import data from 'src/app/menu/privilages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  settings: settings;
  loginform: UntypedFormGroup;
  formsubmite: boolean = false;
  logo: any;
  submitted:boolean=false
  environment = environment.apiUrl
  auth: any
  constructor(
    private apiService: ApiService,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private titleService: Title,
    private notifyService: NotificationService,
    private store: DefaultStoreService
  ) {
    const app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);
    this.apiService.CommonApi(Apiconfig.landingData.method, Apiconfig.landingData.url, {}).subscribe(
      (result) => {
        if (result) {
          this.settings = result;
          this.apiService.setAppFavicon(this.settings.favicon);
          this.titleService.setTitle(this.settings.site_title);
          this.store.generalSettings.next(this.settings);
          this.logo = result.logo;
        }
      },
      (error) => {
        console.log(error);
      }
    );
    this.initiateForm();
  }

  get from() {
    return this.loginform.controls;
  }

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/app']);
    }
  }

  public initiateForm() {
    this.loginform = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }


  passwordFieldType: string = 'password';
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  public onFormSubmit() {
    this.formsubmite = true;
    // this.submitted=true
    
    if (this.loginform.valid) {
      this.submitted=true
      var username = this.loginform.controls['username'].value;
      var password = this.loginform.controls['password'].value;
     console.log(username );

      
      this.apiService.CommonApi(Apiconfig.admin_role_check.method,Apiconfig.admin_role_check.url,{email:username}).subscribe((result)=>{
        // this.submitted=false
        debugger;
        console.log(result)
        if(result.status===true){
          if(result.data.status==="1"){
            if(result.data.webaccess==="1"){
              this.authService.login(username, password,result.data)
           
          .then((result: any) => {
            if (result) {
              this.router.navigate(['/app']);
              this.notifyService.showSuccess("Logged in successfully");
            } else {
              this.submitted=false
              this.notifyService.showError(result.message.message || 'Username or Password Does Not Match');
            }
          })
          .catch((error: any) => {
            this.submitted=false
            this.notifyService.showError(error.code)
          });
            }else{
              this.notifyService.showError("Unauthorized access")
              this.submitted=false
            }
          }else{
            this.submitted=false
            this.notifyService.showError("Access denied! Contact the admin")
          }
          
        }else{
          this.submitted=false
          // this.notifyService.showError("Somthing went wrong! Try again")
          // this.notifyService.showError("Unauthorized Access")
          this.notifyService.showError(result.message)
        }
      })
      
    } else {
      // this.notifyService.showError('Please Enter all mandatory fields');
    }
  }

}