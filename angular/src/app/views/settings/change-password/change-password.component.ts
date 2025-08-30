import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseServiceService } from 'src/app/_services/firebase-service.service';
import { NotificationComponent } from '../../notification/notification.component';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  submitebtn: boolean=false;
  checkpassword:boolean=false
  passwordVisible = {
    currpassword: false,
    password: false,
    confirm_password: false
  };
  @ViewChild ("changePassword") form:NgForm
  constructor(private  firebaseSerive:FirebaseServiceService,private router:Router,private notification:NotificationService){}
  ngOnInit(): void {
   
  }

  async onFormSubmit(changepasswordForm:NgForm){
    // this.notification.showWarning("doyouwant to donform")
    this.firebaseSerive.authstatechangecheck()

    
    let data=changepasswordForm.value
    if(changepasswordForm.valid){
      this.submitebtn = true;
      let result
      try {
         result = await this.firebaseSerive.changePassword(data)
      
        if (result.status) {
          changepasswordForm.resetForm();
          this.submitebtn =false;
          this.notification.showSuccess(result.message)   
          localStorage.clear()
          window.location.reload()       
        } else {
          console.error(result.message);
          // Handle the error message appropriately, e.g., show a notification to the user
        this.notification.showError("The current password you entered is incorrect. Please try again.")

        }
      } catch (error) {
        this.submitebtn = false;
        this.notification.showError("The current password you entered is incorrect. Please try again.")
      

       
        // Handle the error appropriately, e.g., show a notification to the user
      }
    }
  } 

  togglePasswordVisibility(field: string): void {
    // Toggle the visibility state
    this.passwordVisible[field] = !this.passwordVisible[field];

    // Get the password field element by its ID
    const passwordField: any = document.getElementById(field);

    // Set the type of the password field based on visibility state
    if (this.passwordVisible[field]) {
        passwordField.type = 'text';  // Show password
    } else {
        passwordField.type = 'password';  // Hide password
    }

    // Optional: To ensure focus remains intact after toggling password visibility
    setTimeout(() => passwordField.focus(), 0);
}
}
