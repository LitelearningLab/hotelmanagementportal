import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { smtpSettings } from 'src/app/interface/smtp-setting.interface';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { ApiService } from 'src/app/_services/api.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-smtpsettings',
  templateUrl: './smtpsettings.component.html',
  styleUrls: ['./smtpsettings.component.scss']
})
export class SmtpsettingsComponent implements OnInit {

  @ViewChild('smtpSettingForm') form: NgForm;
  submitebtn: boolean = false;
  settings: smtpSettings;

  constructor(
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  
    this.apiService.CommonApi(Apiconfig.get_smtpSetting.method, Apiconfig.get_smtpSetting.url, {}).subscribe(
      (result) => { 
        if (result) {
          this.settings = result;
          this.form.form.controls['mode'].setValue(this.settings.mode);
          this.form.form.controls['smtp_host'].setValue(this.settings.smtp_host);
          this.form.form.controls['smtp_password'].setValue(this.settings.smtp_password);
          this.form.form.controls['smtp_port'].setValue(this.settings.smtp_port);
          this.form.form.controls['smtp_username'].setValue(this.settings.smtp_username);
        };
      },
      (error) => {
        console.log(error);
      }
    )
  };

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([currentUrl]));
  }

  public onFormSubmit(smtpSettingForm: UntypedFormGroup) {
    if (smtpSettingForm.valid) {
      this.submitebtn = true;
      var data = smtpSettingForm.value;
      this.apiService.CommonApi(Apiconfig.smtp_SettingSave.method, Apiconfig.smtp_SettingSave.url, data).subscribe(
        (result) => {
          if (result && result.status) {
            this.reloadComponent();
            this.notifyService.showSuccess("Successfully Updated");
          } else {
            this.notifyService.showError("Not Updated");
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
