import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { settings } from 'src/app/interface/interface';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { ApiService } from 'src/app/_services/api.service';
import { DefaultStoreService } from 'src/app/_services/default-store.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, onAuthStateChanged, getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  @ViewChild('forgotForm') form: NgForm;
  settings: settings;
  logo: any;
  environment = environment.apiUrl;
  auth: any;

  constructor(
    private apiService: ApiService,
    private titleService: Title,
    private router: Router,
    private store: DefaultStoreService,
    private notifyService: NotificationService,
  ) {
    const app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);
    // this.apiService.CommonApi(Apiconfig.landingData.method, Apiconfig.landingData.url, {}).subscribe(
    //   (result) => {
    //     console.log(result, 'result');

    //     if (result && result != null) {
    //       this.settings = result;
    //       this.apiService.setAppFavicon(this.settings.favicon);
    //       this.titleService.setTitle(this.settings.site_title);
    //       this.store.generalSettings.next(this.settings);
    //       this.logo = result.logo;
    //       console.log(this.logo);

    //     }
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  ngOnInit(): void {
  }

  public onFormSubmit(forgotForm: UntypedFormGroup) {
    if (forgotForm && forgotForm.valid) {
      console.log(forgotForm.value)
      let email = forgotForm.value.email
      fetchSignInMethodsForEmail(this.auth, email).then((signInMethods) => {
        if (signInMethods.length > 0) {
          let data = sendPasswordResetEmail(this.auth, email)
          this.notifyService.showSuccess("Reset Link has sent to the registered email")
          setTimeout(() => {
            this.router.navigate(["/app"])
          }, 10000)
        } else {
          this.notifyService.showError("Email not found")
        }
      })
        .catch((error) => {
          console.error('Error checking email:', error);
        });

      // this.apiService.CommonApi(Apiconfig.forgotPassword.method, Apiconfig.forgotPassword.url, forgotForm.value).subscribe(
      //   (result) => {
      //     if (result && result.status == "1") {
      //       this.router.navigate(['/app']);
      //       this.notifyService.showSuccess(result.response);
      //     } else {
      //       this.notifyService.showError(result.response);
      //     }
      //   }
      // )
    } else {
      // this.notifyService.showError('Email is required');
    }
  }

}
