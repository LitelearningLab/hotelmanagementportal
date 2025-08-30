import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { ApiService } from 'src/app/_services/api.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent implements OnInit {

  @ViewChild('smsSettingForm') form: NgForm;
  submitebtn: boolean = false;
  twilio :any={
    apikey: String,
    sender: String,
    mode: String
}
  constructor(
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.apiService.CommonApi(Apiconfig.get_smsSetting.method, Apiconfig.get_smsSetting.url , {}).subscribe(
      (result) => {        
        if (result) {
          console.log(result)
          this.form.form.controls['mode'].setValue(result.twilio.mode);
          this.form.form.controls['apikey'].setValue(result.twilio.apikey);
          this.form.form.controls['clientid'].setValue(result.twilio.clientid);
        };
      },
      (error) => {
        console.log(error);
      }
    )
  }
  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([currentUrl]));
  }

  public onFormSubmit(smsSettingForm: UntypedFormGroup) {
    if (smsSettingForm.valid) {
      this.submitebtn = true;
      this.twilio.apikey = smsSettingForm.value.apikey;
      this.twilio.clientid = smsSettingForm.value.clientid;
      this.twilio.mode = smsSettingForm.value.mode;      
      this.apiService.CommonApi(Apiconfig.sms_SettingSave.method, Apiconfig.sms_SettingSave.url, { twilio: this.twilio }).subscribe(
        (result) => {
          if (result && result.status) {
            this.reloadComponent();
            this.notifyService.showSuccess("Successfully Updated");
          } else {
            this.notifyService.showError(result.message);
          }
          this.submitebtn = false;
        }, (error) => {
          this.submitebtn = false;
         this.notifyService.showError(error);

        }
      )
    } else {
      this.notifyService.showError('Please Enter all mandatory fields');
    }
  }
}