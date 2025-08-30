import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NgForm, UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { ApiService } from 'src/app/_services/api.service';
import { DefaultStoreService } from 'src/app/_services/default-store.service';
import { NotificationService } from 'src/app/_services/notification.service';
import privilagedata, { PrivilagesData } from 'src/app/menu/privilages';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { environment } from 'src/environments/environment';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { __asyncValues } from 'tslib';
import { add } from 'ngx-bootstrap/chronos';
import { log } from 'console';
import { isBoolean } from 'ngx-bootstrap/chronos/utils/type-checks';
interface subCategoryInterface {
  createdAt: string;
  img: string;
  rcategory: string;
  scatname: string;
  slug: string;
  status: number;
  updatedAt: string;
  _id: string;
}
@Component({
  selector: 'app-addeditproduct',
  templateUrl: './addeditproduct.component.html',
  styleUrls: ['./addeditproduct.component.scss']
})
export class AddeditproductComponent implements OnInit, AfterViewInit {
  att_arr: any[] = []
  @ViewChild('productForm') form: NgForm;
  categorylist: any = [];
  sublvl: any = 0
  cat: any = 0
  subcategorylist: any = [];
  brandsList: any = [];
  view: boolean;
  viewimage: boolean = true
  cityList: any = [];
  attributesdata: any = [];
  productDetails: any;
  pageTitle: string = 'Product Add';
  selectedValues: any;
  selectedSubcategory: any;
  submitebtn: boolean = false;
  viewpage: boolean = false;
  curentUser: any;
  userPrivilegeDetails: PrivilagesData[] = [];
  previewImage: any;
  inputFile: any;
  id: any;
  all_subcategory: subCategoryInterface[][] = [];
  attri: any = [];
  scategory: string;
  attributes: any = [];
  avtar: any;
  sizeStatus: boolean
  foodImage: any;
  price_details = [];
  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  formdata: any = {};
  rcat_list: any = [];
  scat_list: any = [];
  viewPage: boolean = false;
  split: any;
  error: any;
  product_details: any[] = [
    { title: '', content: '' }
  ];
  offer_check = 0;
  Preview_files: any = [];
  multipleFiles: any[] = [];
  documentFiles: any[] = [];
  hoverImage: any;
  attributimage: any;
  childcats: any[] = []
  avatarImg: any;
  hoverimg: any;
  sizeCategory = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  @ViewChild('additionlimage') addimg;
  productName: any;
  productSlug: any = "";
  quantity_size: any[] = [
    { size: 'S', quantity: 1, status: '' },
    { size: 'M', quantity: 1, status: '' },
    { size: 'L', quantity: 1, status: '' },
    { size: 'XL', quantity: 1, status: '' },
    { size: 'XXL', quantity: 1, status: '' },
    { size: 'XXXL', quantity: 1, status: '' },
  ]
  varienttableshow: boolean = true;
  varinetshow: boolean = true
  varientsnames: any;
  varience_staus_value: any = 2;
  selected_attribute: any = [];
  selected_size_status: any = '';
  attributes_ar:any=[];
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router,
    private store: DefaultStoreService,
    private authService: AuthenticationService,
    private cd: ChangeDetectorRef,
  ) {
    this.curentUser = this.authService.currentUserValue;
    this.split = this.router.url.split('/');
    if (this.curentUser && this.curentUser.role == "subadmin" && this.curentUser.privileges) {
      if (this.router.url == '/app/products/add' || (this.split.length > 0 && this.split[2] == 'products')) {
        this.userPrivilegeDetails = this.curentUser.privileges.filter(x => x.alias == 'products');
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
    this.viewPage = this.split[3] == 'view' ? true : false;
    this.view = this.split[3] == 'view' ? true : false;
  }

  ngOnInit(): void {
    this.id = this.ActivatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.pageTitle = "Product Edit";
    }
    this.apiService.CommonApi(Apiconfig.productcatgory.method, Apiconfig.productcatgory.url, {}).subscribe(
      (result) => {
        if (result && result.status == 1) {
          this.store.categoryList.next(result.list ? result.list : []);
          this.categorylist = result.list ? result.list : [];
          this.cd.detectChanges();
        }
      },
      (error) => {
        console.log(error);
      }
    );
    this.apiService.CommonApi(Apiconfig.productbrandns.method, Apiconfig.productbrandns.url, {}).subscribe(
      (result) => {
        if (result && result.length == 1) {
          this.store.brandsList.next(result[0].length > 0 ? result[0] : []);
          this.brandsList = result[0].length ? result[0] : [];
          this.cd.detectChanges();
        };
      },
      (error) => {
        console.log(error);
      }
    );
    this.apiService.CommonApi(Apiconfig.productcity.method, Apiconfig.productcity.url, {}).subscribe(
      (result) => {
        if (result && result.length > 0) {
          this.store.cityList.next(result[0].length > 0 ? result[0] : []);
          this.cityList = result[0].length > 0 ? result[0] : [];
          this.cd.detectChanges();
        }
      },
      (error) => {
        console.log(error);
      }
    );

  }

  public onFormSubmit(categoryForm: UntypedFormGroup) {
    
    var details = categoryForm.value


    // console.log("details", )


    this.error = 'VALID';
    // this.price_details.forEach(element => {
    //   if (element.mprice < element.sprice) {
    //     this.error = "INVALID"
    //   }
    //   if (typeof element.image == 'undefined') {
    //     this.error = "INVALID"
    //   }
    // });
    // console.log("----------this.childcats---------------", this.childcats)
    // console.log("-----------------this.sublvl == 1--------------------------", this.sublvl, this.cat)
    console.log(categoryForm,'categoryForm');
    if (categoryForm.valid && (this.sublvl == 1 || this.cat == 1)) {
      // if (details['size_status'] == 1) {
      //   for (var item of this.quantity_size) {
      //     if (item.quantity == '' && item.status == '') {
      //       return this.notifyService.showError("Please enter size quantity and status")
      //     }
      //     if (item.quantity < 0) {
      //       return this.notifyService.showError("Please enter size quantity")
      //     }
      //     if (item.status == '') {
      //       return this.notifyService.showError("Please enter size status")
      //     }
      //   }
      // }

      if (details['product_sale_price'] && details['product_sale_price'] > details['product_base_price']) {
        return this.notifyService.showError("Base price it should be above the sale price")
      }
      if (details['offer_status'] == 1) {
        if (details['offer_amount'] < 0) {
          return this.notifyService.showError("Please enter offer amount must be positive value ")
        }
      }

      for (var value of this.product_details) {

        if (value.content == '' && value.title == '') {
          return this.notifyService.showError("Please enter product detail content and title")
        }
        if (value.content == '') {
          return this.notifyService.showError("Please enter product detail content")
        }
        if (value.title == '') {
          return this.notifyService.showError("Please enter available status")
        }
      }

      if(this.attributes_ar && Array.isArray(this.attributes_ar) && this.attributes_ar.length > 0){
        let ar_vl = this.attributes_ar.map(x=>x.join(''));
        let nw_arr_vl = [...new Set(ar_vl)]
        if(nw_arr_vl.length != ar_vl.length){
          return this.notifyService.showError('Duplicates varients found! Please check and try again')
        }
      }

      if (!this.id && !this.avatarImg) {
        return this.notifyService.showError('Please upload product image')
      }
      if (!this.id && !this.hoverImage) {
        return this.notifyService.showError('Please upload product hover image')
      }

      let formData = new FormData();


      this.quantity_size.forEach(valu => {
        valu.status = parseInt(valu.status);
      })






      const scategory = this.scategory
      this.formdata.attributes = this.att_arr
      this.formdata.base_price = details['product_base_price'];
      this.formdata.sale_price = details['product_sale_price'] ? details['product_sale_price'] : details['product_base_price'];
      this.formdata.name = details['food_name'];
      this.formdata.return_days=details['food_return']
      this.formdata.recommended = details['recommended'] ? details['recommended'] : false;
      this.formdata.rcategory = details['rcatname']._id;
      this.formdata.scategory = scategory;
      this.formdata.status = details['status'];
      this.formdata.size_status = details['size_status'] ? details['size_status'] : this.varience_staus_value




      // details['size_status'];
      this.formdata.offer_status = details['offer_status'] ? 1 : 0;
      this.formdata.offer_amount = details['offer_amount'];
      this.formdata.information = details['information'];
      this.formdata.quantity = details['quantity'];
      this.formdata.price_details = this.price_details;
      this.formdata.size = details['size'] ? details['size'] : [];
      this.formdata.product_details = this.product_details;
      this.formdata.quantity_size = this.quantity_size;
      this.formdata.slug = this.productSlug;
      this.formdata.child_cat_array = this.childcats;
      this.formdata.multiBase64 = this.multipleFiles;
      if (this.documentFiles) {
        this.formdata.documentFiles = this.documentFiles;
      }
      if (this.avatarImg) {
        this.formdata.avatarBase64 = this.avatarImg;
      }
      if (this.hoverimg) {
        this.formdata.hoverImageBas64 = this.hoverimg;
      }
      // formData.append('base_price', details['product_base_price']);
      // formData.append('name', details['food_name']);
      // formData.append('recommended',details['recommended'] ? details['recommended'] : false );
      // formData.append('rcategory', details['rcatname']._id);
      // formData.append('scategory', details['scategory'] ? details['scategory']._id : null);
      // formData.append('status', details['status']);
      // formData.append('offer_status', details['offer_status']);
      // formData.append('offer_amount', details['offer_amount']);
      // formData.append('information', details['information']);
      // formData.append('quantity', details['quantity']);
      // formData.append('slug', details['food_name'].replace(/ /g, '-'));
      // formData.append('avatarBase64', this.cropImgPreview);
      // formData.append('file', this.hoverImage);
      // this.formdata.itmcat = details['itmcat'];

      // for (let index = 0; index < this.multipleFiles.length; index++) {
      //   formData.append(`file${index}`, this.multipleFiles[index]);
      // };

      if (this.split[3] != 'food-clone' && this.id) {
        this.formdata._id = this.productDetails._id ? this.productDetails._id : this.id
        // formData.append('_id', this.productDetails._id);
      }
      this.apiService.CommonApi(Apiconfig.foodAdd.method, Apiconfig.foodAdd.url, this.formdata).subscribe(
        (result) => {
          // if (result && result.code && result.code == 11000) {
          //   this.notifyService.showError("Please check! Duplicate name error.");
          //   return;
          // }
          // else 
          if (result && result.status === 1) {
            this.router.navigate(['/app/products/list']);
            if (this.id) {
              this.notifyService.showSuccess("Successfully updated.");
              // this.submitebtn = false;
            } else {
              this.notifyService.showSuccess("Successfully Added.");
            }
          } else {
            this.notifyService.showError(result.message);
          }
        }
      )

    } else {
      this.notifyService.showError('Please Enter all mandatory fields');
    }
  }

  fileUpload(event) {
    this.inputFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    }
    reader.readAsDataURL(this.inputFile)
  }
  changeSizeStatus(data) {
    console.log(data.value, "this is the data");
    this.varience_staus_value = data.value
    if (data.value == 1) {
      this.sizeStatus = true;
      this.varienttableshow = true
      console.log("currently working here is going om");
      console.log(this.varientsnames);
      this.form.controls['attributes'].setValue(this.varientsnames)

    } else {
      this.varienttableshow = false
      this.sizeStatus = false;
    }
  }

  async getSubCategoryAsync(value: any, index: number): Promise<void> {
    try {
      console.log(value, 'thjis calue-------------------------');
      console.log(index, 'what is the 9999999999999999999999999999999999999999999999999999999999');

      const result = await this.apiService.CommonApi("post", "scategory/get_all_sub", { id: value }).toPromise();
      console.log(result, 'this is the result');

      if (result && result.length > 0) {
        console.log(result, 'this is the result test one');
        // Populate the dropdown options for the corresponding category
        this.all_subcategory[index] = result;
      }
    } catch (error) {
      // Handle error if the request fails
      this.notifyService.showError(error.message);
    }
  }

  getsubcategory(value, index, status) {

    console.log(value, 'value', index, 'this is the index');

    console.log(this.selectedSubcategory, 'this is the selected sub category');
    if (status === 2) {

      this.all_subcategory = this.all_subcategory.splice(0, index + 1)
    }
    if (value) {
      if (!this.viewPage) {
        // this.form.controls['brandname'].setValue([])
        // this.form.controls['scategory'].setValue([])
      }
      // this.apiService.CommonApi(Apiconfig.productCatbrandns.method, Apiconfig.productCatbrandns.url, { cat_id: value._id }).subscribe(
      //   (result) => {
      //     if (result && result.length == 1) {
      //       this.brandsList = result[0].length ? result[0] : [];
      //       if (this.id && !this.viewPage) {
      //         this.form.controls['brandname'].setValue(this.productDetails.brandname ? this.brandsList.filter(x => x._id == this.productDetails.brandname)[0] : []);
      //         this.cd.detectChanges();
      //       }
      //     };
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
      if (!value._id) {
        console.log(value.target.value, 'what is this value');

      }
      this.apiService.CommonApi("post", "scategory/get_all_sub", { id: value._id }).subscribe(
        (result) => {
          console.log(result, 'this is the result of the getcategory list***___***');
          if (result && result.length > 0) {
            // this.subcategorylist = result;
            this.all_subcategory[index] = result;
            // this.all_subcategory.splice(index+1);

            console.log(this.all_subcategory, "result vlaue isnid eof thoeifuiyefhn");

            this.cat = 0
            if (this.id && !this.viewPage) {
              // this.form.controls['scategory'].setValue(this.productDetails.scategory ? this.subcategorylist.filter(x => x._id == this.productDetails.scategory)[0] : '');
              this.cd.detectChanges();
            }
          } else {
            this.all_subcategory[index] = []
            this.cat = 1


          }
        },
        (error) => {
          this.notifyService.showError(error.message);
        }
      )


      this.apiService.CommonApi(Apiconfig.productattributes.method, Apiconfig.productattributes.url, { "mcat": value._id }).subscribe(
        (result) => {
          console.log(result[0].length, "result we want to get");


          if (result && result.length > 0) {
            this.attributesdata = result[0].length > 0 ? result[0] : [];
            if (result[0].length <= 0) {

              this.varinetshow = false
            } else {
              this.varinetshow = true
            }

            // console.log(this.sizeStatus);


            this.cd.detectChanges();
          }
        },
        (error) => {
          console.log(error);
        }
      );



    } //end
  }

  validateInput(event: any) {
    const inputValue = event.target.value;
    // Remove any non-digit characters, including the minus sign
    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
    // Update the input value with the sanitized value
    event.target.value = sanitizedValue;
}

  storeattributes(value) {
    console.log(value);

    const ids = this.attributesdata.map(item => item._id);
    console.log(ids);

    const removeid = ids.find(id => !value.some(obj => obj._id === id));
    this.attri = value;
    //this for loop is used to remove the attribure item that we we romoved from the varient select input tag
    for (let index = 0; index < this.price_details.length; index++) {
      for (let j = 0; j < this.price_details[index].attributes.length; j++) {
        // Use filter to remove attributes with matching parent_id
        this.price_details[index].attributes = this.price_details[index].attributes.filter(item => item.parrent_id !== removeid);
      }
    }

    for (let j = 0; j < this.price_details.length; j++) {
      for (let index = 0; index < value.length; index++) {
        if (this.price_details[j].attributes[index] && typeof this.price_details[j].attributes[index].parrent_id != "undefined") {
        } else {
          this.price_details[j].attributes[index] = { chaild_id: [], attri_name: value[index].name, chaild_name: '', parrent_id: value[index]._id }
        }
      }
    }
    this.cd.detectChanges()
  }
  getsubscategory_edit(value, index) {
    const objectId = value.target.value
    this.selectedValues = this.selectedValues.slice(0, index)
    this.selectedValues.push(value.target.value)
    let vale_pos = index - 1
    // console.log(this.all_subcategory, 'all_subcategory all_subcategory');
    // console.log(typeof (value), 'This is the type of the value');
    const id = value.target.value
    this.scategory = id
    // console.log(this.scategory, 'this is changing or not');
    // console.log(value.target.value, 'this is the value');
    // console.log(value, 'this is the index of the');
    this.childcats[vale_pos] = value.target.value;
    this.all_subcategory.splice(index, this.all_subcategory.length - index);
    this.apiService.CommonApi("post", "scategory/get_all_sub", { id: objectId }).subscribe(
      (result) => {
        console.log(result);

        // console.log(result, 'this is the result of the getcategory list***___***');
        if (result && result.length > 0) {
          // this.subcategorylist = result;
          this.all_subcategory[index] = result;
          // console.log(this.all_subcategory, 'this are the all sub category 1');
          this.sublvl = 0
          // console.log(this.all_subcategory, 'this are the all sub category');

          if (this.id && !this.viewPage) {


            // this.form.controls['scategory'].setValue(this.productDetails.scategory ? this.subcategorylist.filter(x => x._id == this.productDetails.scategory)[0] : '');
            this.cd.detectChanges();
          }
        } else {
          this.sublvl = 1
        }
      },
      (error) => {
        this.notifyService.showError(error.message);
      }
    )

  }
  getsubscategory(value, index) {
    console.log(this.all_subcategory, 'this is the all subcategory');
    console.log(value, index);
    console.log(value.target.value)
    // console.log(this.scategory);

    // const objectId = value.target.value.split("'")[1]; 
    // console.log(objectId);



    let vale_pos = index - 1
    // console.log(this.all_subcategory, 'all_subcategory all_subcategory');
    // console.log(typeof (value), 'This is the type of the value');
    const id = value.target.value
    this.scategory = id
    // console.log(this.scategory, 'this is changing or not');
    // console.log(value.target.value, 'this is the value');
    // console.log(value, 'this is the index of the');
    this.childcats[vale_pos] = value.target.value;
    console.log(id, "USERDFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");



    this.all_subcategory.splice(index, this.all_subcategory.length - index);
    this.apiService.CommonApi("post", "scategory/get_all_sub", { id: id }).subscribe(
      (result) => {
        console.log(result);

        // console.log(result, 'this is the result of the getcategory list***___***');
        if (result && result.length > 0) {
          // this.subcategorylist = result;
          this.all_subcategory[index] = result;
          // console.log(this.all_subcategory, 'this are the all sub category 1');
          this.sublvl = 0
          // console.log(this.all_subcategory, 'this are the all sub category');

          if (this.id && !this.viewPage) {
            this.form.controls['scategory'].setValue(this.productDetails.scategory ? this.subcategorylist.filter(x => x._id == this.productDetails.scategory)[0] : '');
            this.cd.detectChanges();
          }
        } else {
          this.sublvl = 1
        }
      },
      (error) => {
        this.notifyService.showError(error.message);
      }
    )

  }
  removeimage(i) {
    // console.log(this.price_details)
    this.price_details[i].image = ''
    this.price_details[i].preview = ''
  }
  ngAfterViewInit(): void {
    if (this.id) {
      this.sublvl = 1
      this.pageTitle = "Product Edit";
      this.apiService.CommonApi(Apiconfig.foodEdit.method, Apiconfig.foodEdit.url, { id: this.id }).subscribe(
        (result) => {
          
          this.childcats = result && result.foodDetails && result.foodDetails.child_cat_array && Array.isArray(result.foodDetails.child_cat_array) && result.foodDetails.child_cat_array.length > 0 ? result.foodDetails.child_cat_array : [];
          if (!result.errors && result.status == 1 && this.attributesdata && result.foodDetails && result.foodDetails._id) {
            var attriDetails = []
            this.productDetails = result.foodDetails;
            this.varience_staus_value = this.productDetails.size_status
            let id = result.scatId
            console.log(id, 'this are the log id');
            if (id && Array.isArray(id) && id.length > 0) {
              id.pop();
              id.reverse()
              this.selectedValues = id

              console.log(this.selectedValues, 'this are the log id test one');
              console.log(id, 'this are the log id test one');
              for (let i = 0; i <= id.length - 1; i++) {

                this.getSubCategoryAsync(id[i], i)
              }            // Extract unique attri_name values
            }
            const uniqueAttriNames = new Set();
            this.productDetails.price_details.forEach((item,index) => {
              this.attributes_ar[index] = item.attribute_ids;
              item.attributes.forEach(attribute => {
                uniqueAttriNames.add(attribute.attri_name);
              });
            });

            // Convert the Set to an array if needed
            const uniqueAttriNamesArray = Array.from(uniqueAttriNames);

            console.log(this.productDetails, 'thi sis the product details i want in my life');

            this.cropImgPreview = environment.apiUrl + this.productDetails.avatar;
            this.hoverImage = environment.apiUrl + this.productDetails.hover_image;
            this.attributimage = environment.apiUrl
            this.avtar = this.productDetails.avatar
            this.price_details = this.productDetails.price_details;
            for (let index = 0; index < uniqueAttriNamesArray.length; index++) {
              attriDetails.push(this.attributesdata.filter(x => uniqueAttriNamesArray[index] == x.name)[0])
            }
            if (this.productDetails.images && this.productDetails.images.length > 0) {
              this.productDetails.images.forEach(file => this.Preview_files.push(environment.apiUrl + file));
              this.documentFiles = this.productDetails.images;
            }
            this.selected_size_status = this.productDetails.size_status;
            if (this.productDetails.size_status == 1) {
              this.sizeStatus = true
            }
            if (this.productDetails.size_status == 2) {
              this.sizeStatus = false
            }

            // this.attri = attriDetails;
            console.log(this.attri, 'this is atri');

            if (this.productDetails.product_details) {
              this.product_details = this.productDetails.product_details;
            }
            console.log(this.productDetails, 'this is the product details');

            var rmct = this.categorylist.filter(x => x._id == this.productDetails.rcategory)[0];
            this.rcat_list = rmct.rcatname
            if (!this.viewPage) {
              this.form.controls['rcatname'].setValue(this.productDetails.rcategory ? this.categorylist.filter(x => x._id == this.productDetails.rcategory)[0] : [])
              // this.form.controls['main_city'].setValue(this.productDetails.main_city[0] ? this.cityList.filter(x => this.productDetails.main_city.indexOf(x._id) >= 0 ? true : false) : [])
              if (this.productDetails.size_status == 1) {
                setTimeout(() => {
                  this.varientsnames = uniqueAttriNamesArray;
                  this.form.controls['attributes'].setValue(uniqueAttriNamesArray);
                }, 100)
              }
              this.form.controls['food_name'].setValue(this.productDetails.name ? this.productDetails.name : '')
              this.form.controls['food_return'].setValue(this.productDetails.return_days?this.productDetails.return_days:'')
              this.productName = this.productDetails.name ? this.productDetails.name : '';
              this.changeSlug();
              // this.form.controls['itmcat'].setValue(this.productDetails.itmcat ? this.productDetails.itmcat : '')
              if (this.productDetails.size_status === 2) {
                setTimeout(() => {
                  this.form.controls['product_base_price'].setValue(this.productDetails.base_price ? this.productDetails.base_price : '')
                  this.form.controls['product_sale_price'].setValue(this.productDetails.sale_price ? this.productDetails.sale_price : '')
                })
              }
              this.form.controls['status'].setValue(this.productDetails.status ? this.productDetails.status : '')
              // this.form.controls['recommended'].setValue(this.productDetails.isRecommeneded == 1 ? true : false);
              this.form.controls['offer_status'].setValue(this.productDetails.offer_status == 1 ? true : false);
              this.form.controls['information'].setValue(this.productDetails.information ? this.productDetails.information : '');
              this.form.controls['size_status'].setValue(this.productDetails.size_status? this.productDetails.size_status : '');

              if (this.productDetails.size_status == 2) {
                console.log("quqntity", this.productDetails.size_status)
                setTimeout(() => {
                  this.form.controls['quantity'].setValue(this.productDetails.quantity ? this.productDetails.quantity : 0);
                })
              }
              // this.form.controls['size'].setValue(this.productDetails.size? this.productDetails.size : '');
              if (this.productDetails.offer_status) {
                this.offer_check = this.productDetails.offer_status;
                if (this.offer_check == 1) {
                  setTimeout(() => {
                    this.form.controls['offer_amount'].setValue(this.productDetails.offer_amount ? this.productDetails.offer_amount : '');
                  }, 100);
                }
              }
              if (this.productDetails.size_status) {
                this.form.controls['size_status'].setValue(this.productDetails.size_status ? this.productDetails.size_status : '');
                if (this.productDetails.size_status == 1 && this.productDetails.quantity_size) {
                  setTimeout(() => {
                    this.quantity_size = this.productDetails.quantity_size;
                  }, 100);
                }
                if (this.productDetails.size_status == 2) {

                  console.log("--------this.productDetails.quantity---------", this.productDetails.quantity)
                  setTimeout(() => {
                    this.form.controls['quantity'].setValue(this.productDetails.quantity ? this.productDetails.quantity : '');
                  }, 100);
                }
              }
            }
            if (this.viewPage) {
              this.form.controls['rcatname'].setValue(this.productDetails.rcategory ? this.categorylist.filter(x => x._id == this.productDetails.rcategory)[0] : [])
              // this.form.controls['main_city'].setValue(this.productDetails.main_city[0] ? this.cityList.filter(x => this.productDetails.main_city.indexOf(x._id) >= 0 ? true : false) : [])
              if (this.productDetails.size_status == 1) {
                setTimeout(() => {
                  this.form.controls['attributes'].setValue(uniqueAttriNamesArray)
                }, 100)
              }
              this.form.controls['food_name'].setValue(this.productDetails.name ? this.productDetails.name : '')
              this.form.controls['food_return'].setValue(this.productDetails.return_days?this.productDetails.return_days:'')
              // this.form.controls['itmcat'].setValue(this.productDetails.itmcat ? this.productDetails.itmcat : '')
              setTimeout(() => {
                this.form.controls['product_base_price'].setValue(this.productDetails.base_price ? this.productDetails.base_price : '')
                this.form.controls['product_sale_price'].setValue(this.productDetails.sale_price ? this.productDetails.sale_price : '')
              })
              this.form.controls['status'].setValue(this.productDetails.status ? this.productDetails.status : '')
              // this.form.controls['recommended'].setValue(this.productDetails.isRecommeneded == 1 ? true : false);
              this.form.controls['offer_status'].setValue(this.productDetails.offer_status == 1 ? true : false);
              this.form.controls['information'].setValue(this.productDetails.information ? this.productDetails.information : '');
              this.form.controls['size_status'].setValue(this.productDetails.size_status);
              if (this.productDetails.size_status == 2) {
                setTimeout(() => {
                  this.form.controls['quantity'].setValue(this.productDetails.quantity);
                })
              }
              // this.form.controls['size'].setValue(this.productDetails.size? this.productDetails.size : '');
              if (this.productDetails.offer_status) {
                this.offer_check = this.productDetails.offer_status;
                if (this.offer_check == 1) {
                  setTimeout(() => {
                    this.form.controls['offer_amount'].setValue(this.productDetails.offer_amount ? this.productDetails.offer_amount : '');
                  }, 100);
                }
              }
              if (this.productDetails.size_status) {
                this.form.controls['size_status'].setValue(this.productDetails.size_status ? this.productDetails.size_status : '');
                if (this.productDetails.size_status == 1 && this.productDetails.quantity_size) {
                  setTimeout(() => {
                    this.quantity_size = this.productDetails.quantity_size;
                  }, 100);
                }
                if (this.productDetails.size_status == 2) {
                  setTimeout(() => {
                    this.form.controls['quantity'].setValue(this.productDetails.quantity ? this.productDetails.quantity : '');
                  }, 100);
                }
              }
            }
            setTimeout(() => {


              this.getsubcategory(this.categorylist.filter(x => x._id == this.productDetails.rcategory)[0], 0, 1)
            }, 100);

            setTimeout(() => {
              result?.foodDetails?.price_details.forEach((data) => {
                data.attributes.forEach((datas) => {
                  let rs = this.attributesdata.find(obj => obj._id === datas.parrent_id);
                  if (rs) {
                    let isPresent = this.attri.some(item => item._id === rs._id)
                    if (rs && !isPresent) {
                      this.attri.push(rs)
                    }
                  };
                })

                this.price_details = this.productDetails.price_details
                console.log(this.price_details)
              })
            }, 1000)


            this.cd.detectChanges();
          }else{
            this.notifyService.showError("Product Details not found");
            this.router.navigate(['/app/products/list'])
          }
        }
      )
    }
  };

  add_variation() {
    var add_variants = [];
    for (let index = 0; index < this.attri.length; index++) {
      add_variants[index] = { chaild_id: [], attri_name: this.attri[index].name, chaild_name: '', parrent_id: this.attri[index]._id }
    }
    this.price_details.push({ attributes: add_variants, quantity: '', mprice: '', sprice: '', image: '' });
  }

  remove(index) {
    this.price_details.splice(index, 1)
  }

  fileUploads(event, index) {
    this.viewimage = false
    var file = event.target.files[0]
    var image_valid = ['image/jpg', 'image/jpeg', 'image/png', 'image/JPG', 'image/JPEG', 'image/PNG'];
    if (image_valid.indexOf(file.type) == -1) {
      this.notifyService.showError('Images  only allow!Please select file types of jpg,jpeg,png,JPG,JPEG,PNG');
      return;
    }
    console.log(event.target.files[0]);

    this.getBase64(event.target.files[0]).then(
      (data: any) => {
        this.price_details[index].image = data
        this.price_details[index].preview = data
      }
    );
  }

  multiAttributes(event, varient, index, j) {
    console.log("event._id",event._id)
    if(this.attributes_ar && this.attributes_ar[index] && Array.isArray(this.attributes_ar[`${index}`]) && this.attributes_ar[`${index}`].length > 0){
      this.attributes_ar[`${index}`][j] = event._id;
    }else{
      this.attributes_ar[index] = [];
      this.attributes_ar[index][j] = event._id
    };
    this.att_arr.push(event ? event._id : '')
    this.price_details[index].attributes[j] = {
      chaild_id: event ? event._id : '',
      chaild_name: event ? event.name : '',
      attri_name: varient ? varient.name : '',
      parrent_id: varient ? varient._id : '',
    };
  }

  getBase64(file) {
    console.log(file);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  onFileChange(event: any): void {
    this.inputFile = event.target.files[0];
    var file = event.target.files[0];
    if (file && file.size < 50000000) {
      var image_valid = ['image/jpg', 'image/jpeg', 'image/png', 'image/JPG', 'image/JPEG', 'image/PNG'];
      if (image_valid.indexOf(file.type) == -1) {
        this.form.controls['cimage'].setValue('')
        this.notifyService.showError('Images  only allow!Please select file types of jpg,jpeg,png,JPG,JPEG,PNG');
        return;
      }
      // const reader = new FileReader();
      // reader.onload = () => {
      //   this.cropImgPreview = reader.result as string;
      // }
      // reader.readAsDataURL(this.inputFile)
      this.getBase64(event.target.files[0]).then(
        (data: any) => {
          this.cropImgPreview = data;
          this.avatarImg = data;
        }
      );
    } else {
      this.notifyService.showError('Max file size less than 50Mb ');
    }
    // var file = event.target.files[0]
    // var image_valid = ['image/jpg', 'image/jpeg', 'image/png', 'image/JPG', 'image/JPEG', 'image/PNG'];
    // if (image_valid.indexOf(file.type) == -1) {
    //   this.notifyService.showError('Images  only allow!Please select file types of jpg,jpeg,png,JPG,JPEG,PNG');
    //   return;
    // }

    // if (file && file.size < 50000000) {
    //   this.imgChangeEvt = event;
    // } else {
    //   this.notifyService.showError('Max file size less than 50Mb ');
    // }
  }
  onHoverFileChange(event: any): void {
    this.inputFile = event.target.files[0];
    var file = event.target.files[0];
    if (file && file.size < 50000000) {
      var image_valid = ['image/jpg', 'image/jpeg', 'image/png', 'image/JPG', 'image/JPEG', 'image/PNG'];
      if (image_valid.indexOf(file.type) == -1) {
        this.form.controls['cimage'].setValue('')
        this.notifyService.showError('Images  only allow!Please select file types of jpg,jpeg,png,JPG,JPEG,PNG');
        return;
      }
      this.getBase64(event.target.files[0]).then(
        (data: any) => {
          this.hoverImage = data;
          this.hoverimg = data;
        }
      );
      // const reader = new FileReader();
      // reader.onload = () => {
      //   this.hoverImage = reader.result as string;
      // }
      // reader.readAsDataURL(this.inputFile)
    } else {
      this.notifyService.showError('Max file size less than 50Mb ');
    }
  }

  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
  }
  imgLoad() {
    // display cropper tool
  }
  initCropper() {
    // init cropper
  }

  imgFailed() {
    // error msg
  }

  remove_attri(id) {
    console.log(id);
    console.log(this.price_details);
    console.log(this.attributesdata)


    for (let j = 0; j < this.price_details.length; j++) {
      for (let index = 0; index < this.price_details[j].attributes.length; index++) {
        if (this.price_details[j].attributes[index].parrent_id == id) {
          this.price_details[j].attributes.splice(index, 1)
          this.attri = this.attri.filter(x => x._id != id)
        }
      }
    }
    this.form.controls['attributes'].setValue(this.attri)
    this.cd.detectChanges()

  }
  addContent() {
    this.product_details.push({ title: '', content: '' })
  }
  removeContent(i) {
    this.product_details.splice(i, 1)
  }

  detectFiles(event) {
    if (event.target.files && event.target.files[0]) {
      let files = event.target.files;
      for (let index = 0; index < files.length; index++) {
        if (this.multipleFiles.length <= 6) {

          let fileSize = files[index].size;
          let fileType = files[index].type;
          let isDocument = files[index].name.split('.')[1];
          if (fileType == "image/png" || fileType == "image/jpeg" || fileType == "image/jpg" || fileType == "application/pdf" || isDocument == "doc" || isDocument == "docx") {
            if (fileSize / 1024 > 15360) {
              return this.notifyService.showError('Error!, Allowed only maximum of 15MB');
            }
            this.getBase64(files[index]).then(
              (data: any) => {
                console.log(data);

                this.multipleFiles.push(data);
                this.Preview_files.push(data);
              }
            );
            // this.multipleFiles.push(file)
            // var reader = new FileReader();
            // reader.onload = (event:any) => {
            //   this.Preview_files.push((event.target.result)); 
            // }            
            // reader.readAsDataURL(file);         
          } else {
            this.notifyService.showError('Only support Pdf, Jpg, Png, Jpeg');
          }
        } else {
          this.notifyService.showError('Sorry, Allowed only 7 images');
        }
      }
      // for (let file of files) {         
      //   let fileSize = file.size;
      //   let fileType = file['type'];
      //   let isDocument = file.name.split('.')[1];
      //   if (fileType == "image/png" || fileType == "image/jpeg" || fileType == "image/jpg" || fileType == "application/pdf" || isDocument == "doc" || isDocument == "docx") {
      //     if (fileSize / 1024 > 15360) {
      //       return this.notifyService.showError('Error!, Allowed only maximum of 15MB');
      //     }
      //     this.getBase64(file).then(
      //       (data: any) =>
      //       {
      //         this.multipleFiles.push(data);
      //         this.Preview_files.push(data); 
      //       }
      //     );
      //     // this.multipleFiles.push(file)
      //     // var reader = new FileReader();
      //     // reader.onload = (event:any) => {
      //     //   this.Preview_files.push((event.target.result)); 
      //     // }            
      //     // reader.readAsDataURL(file);         
      //   } else {
      //     this.notifyService.showError('Only support Pdf, Jpg, Png, Jpeg');
      //   }  

      // }

    }
  }

  closeMultiImage(index: number, url) {
    if (this.multipleFiles.length > 0) {
      if (index > -1) {
        this.Preview_files.splice(index, 1);
        var findIndex = this.multipleFiles.indexOf(url);
        if (findIndex != -1) {
          this.multipleFiles.splice(findIndex, 1);
        }
        if (this.documentFiles) {
          var find_Index = this.documentFiles.indexOf(url);
          if (find_Index != -1) {
            this.documentFiles.splice(find_Index, 1);
          }
        }
        if (this.multipleFiles.length == 0) {
          this.addimg.nativeElement.value = ''
        }
      }
    } else {
      if (index > -1) {
        this.Preview_files.splice(index, 1);
        if (this.documentFiles) {
          this.documentFiles.splice(index, 1);
        }
      }
    }
  }

  changeSlug() {
    if (this.productName) {
      this.productSlug = this.productName.trim().toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
    } else {
      this.productSlug = "";
    }
  }

  attri_filter_get(parent_id) {
    if (parent_id) {
      return this.attributesdata.find(x => x._id === parent_id);
    } else {
      return [];
    }
  }


}
