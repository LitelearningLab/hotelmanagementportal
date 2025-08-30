import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { ApiService } from 'src/app/_services/api.service';
import { DefaultStoreService } from 'src/app/_services/default-store.service';
import { NotificationService } from 'src/app/_services/notification.service';
import privilagedata, { PrivilagesData } from 'src/app/menu/privilages';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addmaincategory',
  templateUrl: './addmaincategory.component.html',
  styleUrls: ['./addmaincategory.component.scss']
})
export class AddmaincategoryComponent implements OnInit {

  @ViewChild('categoryForm') form: NgForm;

  categoryDetails: any;
  pageTitle: string = 'Add Category';
  submitebtn: boolean = false;
  viewpage: boolean = false;
  curentUser: any;
  userPrivilegeDetails: PrivilagesData[] = [];
  previewImage: any;
  iconpreviewImage: any
  inputFile: any;
  icon_inputFile: any;
  id: any;
  cateory_name: string = '';
  category_slug: string = "";
  view: string
  disableview: boolean = false
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router,
    private store: DefaultStoreService,
    private authService: AuthenticationService,
  ) {
    this.curentUser = this.authService.currentUserValue;
    var split = this.router.url.split('/');
    console.log(this.curentUser)
    if (this.curentUser && this.curentUser.role == "subadmin" && this.curentUser.privileges) {
      if (this.router.url == '/app/category/category-add' || (split.length > 0 && split[2] == 'category')) {
        this.userPrivilegeDetails = this.curentUser.privileges.filter(x => x.alias == 'category');
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
  }

  ngOnInit(): void {
    this.id = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.view = this.ActivatedRoute.snapshot.paramMap.get('view');
    if (this.id) {
      this.pageTitle = "Edit Category";
      this.apiService.CommonApi(Apiconfig.categoryEdit.method, Apiconfig.categoryEdit.url, { id: this.id }).subscribe(
        (result) => {
          if (result && result.length > 0) {
            this.categoryDetails = result[0];
            this.cateory_name = this.categoryDetails.rcatname;
            this.form.controls['rcatname'].setValue(this.categoryDetails.rcatname ? this.categoryDetails.rcatname : '');
            this.form.controls['status'].setValue(this.categoryDetails.status ? this.categoryDetails.status : '');
            this.previewImage = environment.apiUrl + this.categoryDetails.img
            this.iconpreviewImage = environment.apiUrl + this.categoryDetails.iconimg
            this.inputFile = this.categoryDetails.img
            this.icon_inputFile = this.categoryDetails.iconimg;
            this.changeSlug();
          }
        }
      )
    }



    if (this.view) {
      this.pageTitle = "View Category";
      this.disableview = true
      this.apiService.CommonApi(Apiconfig.categoryEdit.method, Apiconfig.categoryEdit.url, { id: this.view }).subscribe(
        (result) => {
          if (result && result.length > 0) {
            this.categoryDetails = result[0];
            this.cateory_name = this.categoryDetails.rcatname;
            this.form.controls['rcatname'].setValue(this.categoryDetails.rcatname ? this.categoryDetails.rcatname : '');
            this.form.controls['status'].setValue(this.categoryDetails.status ? this.categoryDetails.status : '');
            this.previewImage = environment.apiUrl + this.categoryDetails.img
            this.iconpreviewImage = environment.apiUrl + this.categoryDetails.iconimg
            this.inputFile = this.categoryDetails.img
            this.icon_inputFile = this.categoryDetails.iconimg;
            this.changeSlug();
          }
        }
      )
    }
  };

  public onFormSubmit(categoryForm: UntypedFormGroup) {
    if (categoryForm.valid && this.inputFile) {
      this.submitebtn = true;
      var formdata = new FormData;
      formdata.append('_id', this.id);
      formdata.append('rcatname', categoryForm.value.rcatname.substr(0, 1).toUpperCase() + categoryForm.value.rcatname.substr(1));
      formdata.append('status', categoryForm.value.status);
      formdata.append('img', this.inputFile);
      formdata.append('slug1', this.category_slug);
      formdata.append('iconimg', this.icon_inputFile)
      this.apiService.CommonApi(Apiconfig.categorySave.method, Apiconfig.categorySave.url, formdata).subscribe(
        (result) => {
          if (result && result.status) {
            this.router.navigate(['/app/category/category-list']);
            if (this.id) {
              this.notifyService.showSuccess("Successfully updated.");
            } else {
              this.notifyService.showSuccess("Successfully Added.");
            }
          } else {
            this.notifyService.showError(result.message);
          }
          this.submitebtn = false;
        }, (error) => {
          this.submitebtn = false;
        }
      )
    } else {
      this.notifyService.showError('Please Enter all mandatory fields');
    }
  }

  fileUpload(event) {
    this.inputFile = event.target.files[0];
    var file = event.target.files[0]
    var image_valid = ['image/jpg', 'image/jpeg', 'image/png', 'image/JPG', 'image/JPEG', 'image/PNG'];
    if (image_valid.indexOf(file.type) == -1) {
      this.form.controls['cimage'].setValue('')
      this.notifyService.showError('Images  only allow!Please select file types of jpg,jpeg,png,JPG,JPEG,PNG');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    }
    reader.readAsDataURL(this.inputFile)
  }


  icon_fileUpload(event) {
    this.icon_inputFile = event.target.files[0];
    var file = event.target.files[0]
    var image_valid = ['image/jpg', 'image/jpeg', 'image/png', 'image/JPG', 'image/JPEG', 'image/PNG'];
    if (image_valid.indexOf(file.type) == -1) {
      this.form.controls['iconimage'].setValue('')
      this.notifyService.showError('Images  only allow!Please select file types of jpg,jpeg,png,JPG,JPEG,PNG');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.iconpreviewImage = reader.result as string;
    }
    reader.readAsDataURL(this.icon_inputFile)
  }

  changeSlug() {
    if (this.cateory_name) {
      this.category_slug = this.cateory_name.trim().toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
    } else {
      this.category_slug = "";
    }
  }

}
