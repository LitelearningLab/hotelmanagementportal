import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { ApiService } from 'src/app/_services/api.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seosettings',
  templateUrl: './seosettings.component.html',
  styleUrls: ['./seosettings.component.scss']
})
export class SeosettingsComponent implements OnInit {
  @ViewChild('seoSettingForm') form: NgForm;
  submitebtn: boolean = false;
  filesize: boolean = false;
  fileDimension: boolean = false;
  og_image: File;
  width: number;
  height: number;
  OgimageChangedEvent: any = '';
  croppedOgImage: any = '';
  finalImage: File;
  seosettings: any;
  image: boolean = false;
  previewOgImage: string;
  constructor(
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.apiService.CommonApi(Apiconfig.seo_Setting.method, Apiconfig.seo_Setting.url, {}).subscribe(
      (result) => {
        if (result) {
          this.seosettings = result
          this.form.form.controls['focus_keyword'].setValue(this.seosettings.focus_keyword);
          this.form.form.controls['seo_title'].setValue(this.seosettings.seo_title);
          this.form.form.controls['meta_description'].setValue(this.seosettings.meta_description);
          // this.form.form.controls['google_analytics'].setValue(this.seosettings.webmaster.google_analytics);
          if (this.seosettings.og_image) {
            this.image = true;
            this.finalImage=this.seosettings.og_image;
          this.apiService.imageExists(environment.apiUrl + this.seosettings.og_image, (exists) => {
            this.previewOgImage=environment.apiUrl + this.seosettings.og_image;
            
          })
        }
        };
      },
      (error) => {
        console.log(error);
      }
    )
  }
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  filechange(event: any) {
    this.filesize = false;
    this.fileDimension = false;
    this.OgimageChangedEvent = '';
    var _URL = window.URL || window.webkitURL;
    var file = event.target.files[0]
    if (file.size < 2000000) {
      if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/jpg') {
        var img = new Image();
        var objectUrl = _URL.createObjectURL(file);
        img.onload = () => {
          if (img.height < 600 && img.width < 1200) {
            this.fileDimension = true;
          } else {
            this.OgimageChangedEvent = event;
          }
        };
        img.src = objectUrl;
      } else {
        this.notifyService.showError('Photo only allows file types of PNG, JPG and JPEG and Max file size less than 2Mb');
      }
    } else {
      this.filesize = true;
    }

  }
  imageCropped(event: ImageCroppedEvent) {
    const reader = new FileReader();
    reader.onloadend = () =>{ 
      this.croppedOgImage = reader.result;
      this.finalImage = this.dataURLtoFile(reader.result, 'og_image.png')
    };
    reader.readAsDataURL(event.blob);
  }
  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([currentUrl]));
  }

  public onFormSubmit(seoSettingForm: UntypedFormGroup) {
    if (seoSettingForm.valid) {
      this.submitebtn = true;
      let formData = new FormData();
      var data = seoSettingForm.value;
      data.google_html_tag = 'yeyer';
      formData.append('focus_keyword', data.focus_keyword);
      formData.append('seo_title', data.seo_title);
      formData.append('meta_description', data.meta_description);
      // formData.append('webmaster[google_analytics]', data.google_analytics);
      // formData.append('webmaster[google_html_tag]', data.google_html_tag);
      if (typeof this.finalImage != 'undefined' && this.finalImage) {
        formData.append('og_image', this.finalImage);
      };
      this.apiService.CommonApi(Apiconfig.seo_SettingSave.method, Apiconfig.seo_SettingSave.url, formData).subscribe(
        (result) => {
          if (result && result.status == 1) {
            this.reloadComponent();
            this.notifyService.showSuccess("Successfully Updated");
          } else {
            this.notifyService.showError(result.message);
          }
          this.submitebtn = false;
        }, (error) => {
          this.submitebtn = false;
          this.notifyService.showError(error);
        })
    } else {
      this.notifyService.showError('Please Enter all mandatory fields');
    }
  }
}
