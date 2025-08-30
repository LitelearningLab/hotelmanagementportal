import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { ApiService } from 'src/app/_services/api.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-couponaddedit',
  templateUrl: './couponaddedit.component.html',
  styleUrls: ['./couponaddedit.component.scss']
})
export class CouponaddeditComponent implements OnInit {

  @ViewChild('userAddEditForm') form: NgForm;
  selectedFile: File | null = null;
  base64File: string | null = null;
  myDateValue = new Date();
  onFromDate: any;
  submitted: boolean = false;
  minDate = new Date();
  onToDate: any;
  myDateValue1 = new Date();
  selectfromdate: boolean = false;
  startdate: any;
  todate: boolean = false;
  enddate: any;
  maxDate = new Date()
  id: any;

  percent:any;
  discounttype: any;
  editdata: any;
  startDate = new UntypedFormControl(new Date());
  endDate = new UntypedFormControl(new Date());
  curentUser: any;
  userPrivilegeDetails: any;
  coupon_name: any
  previewImage: any;
  inputFile: any;
  constructor(private route: ActivatedRoute,
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
    private authService: AuthenticationService,) {
    this.curentUser = this.authService.currentUserValue;
    var split = this.router.url.split('/');
    console.log(this.curentUser)
    if (this.curentUser && this.curentUser.role == "subadmin" && this.curentUser.privileges) {
      if (this.router.url == '/app/coupon/couponadd' || (split.length > 0 && split[2] == 'coupon')) {
        this.userPrivilegeDetails = this.curentUser.privileges.filter(x => x.alias == 'category');
        if (!this.userPrivilegeDetails[0].status.view) {
          this.notifyService.showWarning('You are not authorized this module');
          this.router.navigate(['/app']);
          return;
        };
        if (!this.userPrivilegeDetails[0].status.add && !this.route.snapshot.paramMap.get('id')) {
          this.notifyService.showWarning('You are not authorized this module');
          this.router.navigate(['/app']);
          return;
        };
        if (!this.userPrivilegeDetails[0].status.edit && this.route.snapshot.paramMap.get('id')) {
          this.notifyService.showWarning('You are not authorized this module');
          this.router.navigate(['/app']);
          return;
        };
      };
    };
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.apiService.CommonApi(Apiconfig.editcoupons.method, Apiconfig.editcoupons.url, { id: this.id }).subscribe(result => {
        if (result) {
          console.log(result);
          
          this.editdata = result[0]
          var total_coupons = result[0].usage.total_coupons
          var per_user = result[0].usage.per_user
          this.editdata.valid_from = new Date(this.editdata.valid_from)
          this.editdata.expiry_date = new Date(this.editdata.expiry_date)
          if (this.editdata.discount_type == "Flat") {
            this.percent = 0
          }
          else {
            this.percent = 1
          }
          setTimeout(() => {
            this.todate = true;
            this.form.controls['selectadmin'].setValue(this.editdata.coupon_type ? this.editdata.coupon_type : '');
            this.form.controls['coupon_name'].setValue(this.editdata.name ? this.editdata.name : '');
            this.form.controls['coupon_code'].setValue(this.editdata.code ? this.editdata.code : '');
            this.form.controls['discounttype'].setValue(this.editdata.discount_type ? this.editdata.discount_type : '');
            this.form.controls['amount'].setValue(this.editdata.amount_percentage ? this.editdata.amount_percentage : '');
            this.form.controls['status'].setValue(this.editdata.status ? this.editdata.status : '');
            this.form.controls['onFromdate'].setValue(this.editdata.valid_from ? this.editdata.valid_from : '');
            this.form.controls['peruser'].setValue(per_user ? per_user : '');
            this.form.controls['percoupon'].setValue(total_coupons ? total_coupons : '');
            this.form.controls['onTodate'].setValue(this.editdata.expiry_date ? this.editdata.expiry_date : '');
            if(this.editdata.minamount!==undefined){
              this.form.controls['minamount'].setValue(this.editdata.minamount?this.editdata.minamount:'')
            }else if(this.editdata.maxamount!==undefined){
              this.form.controls['maxamount'].setValue(this.editdata.maxamount?this.editdata.maxamount:"")
            }
            this.previewImage = environment.apiUrl + this.editdata.image
            console.log(this.previewImage)

          }, 5);
        }
      })
    }
  }
  set_start_date(event, userAddEditForm: UntypedFormGroup) {
    this.startdate = event;
    userAddEditForm.controls['onTodate']?.setValue(null);
    if (event) {
      this.todate = true
    }
  }

  set_end_date(event) {
    this.enddate = event;
  }

  onFilterData(event) {
    console.log("event", event.target.value)
    if (event.target.value == "Flat") {
      this.percent = 0
    }
    else {
      this.percent = 1
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

    if (file && file.size && file.size > 2 * 1024 * 1024) {
      this.form.controls['cimage'].setValue('')
      this.notifyService.showError('Max file size 2Mb');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    }
    reader.readAsDataURL(this.inputFile)
  }

  public onFormSubmit(userAddEditForm: UntypedFormGroup) {
    if (this.id) {
      if (userAddEditForm.valid) {
        var data = userAddEditForm.value;
        var coupondata = new FormData
        if (data.percoupon < data.peruser) {
          this.notifyService.showError("Usage Limit Per User should not exceed Usage Limit Per Coupon")
        } else {

          coupondata.append('_id', this.id)
          coupondata.append('amount_percentage', data.amount)
          coupondata.append('status', data.status)

          coupondata.append('usage[total_coupons]', data.percoupon)

          coupondata.append('usage[per_user]', data.peruser)
          coupondata.append('discount_type', data.discounttype)
          coupondata.append('valid_from', data.onFromdate)
          coupondata.append('expiry_date', data.onTodate)
          coupondata.append('code', data.coupon_code)
          coupondata.append('total', data.percoupon)
          coupondata.append('coupon_type', data.selectadmin)
          coupondata.append('name', data.coupon_name)
          coupondata.append('image', this.inputFile)
          if(data.minamount){
            coupondata.append('minamount',data.minamount)
          }else if(data.maxamount){
            coupondata.append('maxamount',data.maxamount)
          }
          // var coupondata = {
          //   _id: this.id,
          //   amount_percentage: data.amount,
          //   status: parseInt(data.status),
          //   restaurant: [],
          //   shop: [],
          //   usage: {
          //     total_coupons: data.percoupon,
          //     per_user: data.peruser
          //   },
          //   discount_type: data.discounttype,
          //   valid_from: data.onFromdate,
          //   expiry_date: data.onTodate,
          //   coupon_type: data.selectadmin,
          //   code: data.coupon_code,
          //   total: data.percoupon,
          //   name: data.coupon_name
          // }

          // coupondata['avatar'] = this.base64File;



          

          this.apiService.CommonApi(Apiconfig.savecoupons.method, Apiconfig.savecoupons.url, coupondata).subscribe(result => {
            this.router.navigate(['/app/coupon/couponlist']);
          },
            (error) => {
              this.notifyService.showError("Code Name Already Exists");
            })
        }
      }
    }
    else {
      if (userAddEditForm.valid) {
        this.submitted = true;
        var data = userAddEditForm.value;
        var coupondata1 = new FormData
        if (data.percoupon < data.peruser) {
          this.notifyService.showError("User limit is Exceded")
        }
        // var coupondata1 = {
        //   amount_percentage: data.amount,
        //   status: parseInt(data.status),
        //   restaurant: [],
        //   shop: [],
        //   usage: {
        //     total_coupons: data.percoupon,
        //     per_user: data.peruser
        //   },
        //   discount_type: data.discounttype,
        //   valid_from: data.onFromdate,
        //   expiry_date: data.onTodate,
        //   coupon_type: data.selectadmin,
        //   code: data.coupon_code,
        //   total: data.percoupon,
        //   name: data.coupon_name,
        //   image: this.base64File
        // }

        // coupondata['avatar'] = ;

        coupondata1.append('amount_percentage', data.amount)
        coupondata1.append('status', data.status)

        coupondata1.append('usage[total_coupons]', data.percoupon)

        coupondata1.append('usage[per_user]', data.peruser)
        coupondata1.append('discount_type', data.discounttype)
        coupondata1.append('valid_from', data.onFromdate)
        coupondata1.append('expiry_date', data.onTodate)
        coupondata1.append('code', data.coupon_code)
        coupondata1.append('total', data.percoupon)
        coupondata1.append('coupon_type', data.selectadmin)
        coupondata1.append('name', data.coupon_name)
        coupondata1.append('image', this.inputFile)

        if(data.minamount){
          coupondata1.append('minamount',data.minamount)
        }else if(data.maxamount){
          coupondata1.append('maxamount',data.maxamount)
        }


        this.apiService.CommonApi(Apiconfig.savecoupons.method, Apiconfig.savecoupons.url, coupondata1).subscribe(result => {
          console.log("result", result)
          if (result.code == 11000) {
            this.notifyService.showError("Coupon Code already exist.");
            return;
          }
          this.router.navigate(['/app/coupon/couponlist']);
        }, (error) => {

          console.log(error)
          this.notifyService.showError("Name Already Exists");
        })
      }
    }
  }
}
