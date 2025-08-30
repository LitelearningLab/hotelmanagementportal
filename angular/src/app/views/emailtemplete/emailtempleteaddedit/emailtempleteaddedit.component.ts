import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PrivilagesData } from 'src/app/menu/privilages';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { ApiService } from 'src/app/_services/api.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-emailtempleteaddedit',
  templateUrl: './emailtempleteaddedit.component.html',
  styleUrls: ['./emailtempleteaddedit.component.scss']
})
export class EmailtempleteaddeditComponent implements OnInit {
  @ViewChild('emailtempleteForm') form: NgForm;

  emailtempleteDetails: any;
  pageTitle: string = 'Add E-mail Template';
  submitebtn: boolean = false;
  viewpage: boolean = false;
  curentUser: any;
  userPrivilegeDetails: PrivilagesData[] = [];

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router,
    private authService: AuthenticationService,
  ) {
    this.curentUser = this.authService.currentUserValue;
    var split = this.router.url.split('/');

    if (this.curentUser && this.curentUser.role == "subadmin" && this.curentUser.privileges) {
      if (this.router.url == '/email-template/add' || (split.length > 0 && split[2] == 'email-template')) {
        this.userPrivilegeDetails = this.curentUser.privileges.filter(x => x.alias == 'email-template');
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
    const id = this.ActivatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.pageTitle = "E-Mail Templete " + (this.viewpage ? 'View' : 'Edit');
      this.apiService.CommonApi(Apiconfig.emailTempletEdit.method, Apiconfig.emailTempletEdit.url, {id:id}).subscribe(
        (result) => {
            this.emailtempleteDetails = result;
            this.form.controls['name'].setValue(this.emailtempleteDetails.name ? this.emailtempleteDetails.name : '');
            this.form.controls['email_subject'].setValue(this.emailtempleteDetails.email_subject ? this.emailtempleteDetails.email_subject : '');
            this.form.controls['email_content'].setValue(this.emailtempleteDetails.email_content ? this.emailtempleteDetails.email_content : '');
            this.form.controls['sender_email'].setValue(this.emailtempleteDetails.sender_email ? this.emailtempleteDetails.sender_email : '');
            this.form.controls['sender_name'].setValue(this.emailtempleteDetails.sender_name ? this.emailtempleteDetails.sender_name : '');
            this.form.controls['email_header'].setValue(this.emailtempleteDetails.email_header ? this.emailtempleteDetails.email_header : '');
            this.form.controls['email_footer'].setValue(this.emailtempleteDetails.email_footer ? this.emailtempleteDetails.email_footer : '');
            // this.form.controls['subscription'].setValue(this.emailtempleteDetails.subscription ? (this.emailtempleteDetails.subscription == 1 ? true : false) : false);
            if (this.viewpage) {
              this.form.form.disable();
            }
        }
      )
    }
  } 
  public onFormSubmit(emailtempleteForm: UntypedFormGroup) {
    if (emailtempleteForm.valid) {
      this.submitebtn = true;
      var data = emailtempleteForm.value;
      data.subscription=data.subscription?1:0;
      data._id = this.ActivatedRoute.snapshot.paramMap.get('id');
      data.subscription = data.subscription ? 1 : 0;
      this.apiService.CommonApi(Apiconfig.emailTempletSave.method, Apiconfig.emailTempletSave.url, data).subscribe(
        (result) => {
            this.router.navigate(['/app/email-template/list']);
            this.notifyService.showSuccess("E-mail template updated sucessfully");
          this.submitebtn = false;
        }, (error) => {
          this.submitebtn = false;
          this.notifyService.showError("Something went wrong.");
        }
      )
    } else {
      this.notifyService.showError('Please Enter all mandatory fields');
    }
  }

}
