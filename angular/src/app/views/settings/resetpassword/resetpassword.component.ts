
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FirebaseServiceService } from 'src/app/_services/firebase-service.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { ApiService } from 'src/app/_services/api.service';
import { Apiconfig } from 'src/app/_helpers/api-config';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  @ViewChild('resetForm') form: NgForm;
  submitebtn: boolean = false;
  passwordVisible = {
    email: false,
    currpassword: false,
    password: false,
    confirm_password: false
  };

  constructor(  private apiService: ApiService,private firebaseService: FirebaseServiceService, private notification: NotificationService) { }

  ngOnInit(): void { }

  async onFormSubmit(resetForm: NgForm) {
    if (!resetForm.valid) return;
    const values = resetForm.value;
    if (values.password !== values.confirmPassword) {
      this.notification.showError('Password and Confirm Password do not match');
      return;
    }
    this.submitebtn = true;
    try {
      const result: any = await this.firebaseService.resetPasswordByEmail({
        email: values.email,
        currentPassword: values.currpassword,
        newPassword: values.password
      });
      if (result && result.status) {
        resetForm.resetForm();
        this.notification.showSuccess(result.message || 'Password updated successfully');
        let data={email: values.email,
        currentPassword: values.currpassword,
        newPassword: values.password}
         this.apiService.CommonApi(Apiconfig.resetPassword.method, Apiconfig.resetPassword.url, data).subscribe((result) => {
         });
      } else {
        this.notification.showError(result.message || 'Failed to update password');
      }
    } catch (err) {
      console.error('reset error', err);
      this.notification.showError(err?.message || 'The current password you entered is incorrect. Please try again.');
    } finally {
      this.submitebtn = false;
    }
  }

  togglePasswordVisibility(field: string): void {
    this.passwordVisible[field] = !this.passwordVisible[field];
    const passwordField: any = document.getElementById(field);
    if (passwordField) {
      passwordField.type = this.passwordVisible[field] ? 'text' : 'password';
      setTimeout(() => passwordField.focus(), 0);
    }
  }

}

