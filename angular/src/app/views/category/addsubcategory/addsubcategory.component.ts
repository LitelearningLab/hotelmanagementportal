import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PrivilagesData } from 'src/app/menu/privilages';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { ApiService } from 'src/app/_services/api.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { DefaultStoreService } from 'src/app/_services/default-store.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addsubcategory',
  templateUrl: './addsubcategory.component.html',
  styleUrls: ['./addsubcategory.component.scss']
})
export class AddsubcategoryComponent implements OnInit {
  id: any;
  pageTitle: string = "Add Sub Category";
  restaurantCatList: any;
  selectedCategory: any;
  previewImage: any;
  subCategory: UntypedFormGroup;
  inputFile: any;
  idExist: boolean = false;
  disabled: boolean = false;
  submitted: boolean = false;
  curentUser: any;
  showOptions: boolean = false;
  userPrivilegeDetails: PrivilagesData[] = [];
  indx: any;
  slugName: any = "";
  subCatName: any = '';
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router,
    private store: DefaultStoreService,
    private authService: AuthenticationService,
    private fb: UntypedFormBuilder
  ) {
    this.subCategory = this.fb.group({
      rcategory: ['', Validators.required],
      scatname: ['', Validators.required],
      status: ['', Validators.required],
      fields: this.fb.array([]),
      cimage: ['']
    })
    this.curentUser = this.authService.currentUserValue;

    var split = this.router.url.split('/');
    console.log(this.curentUser, 'this is the current user');

    console.log(split, 'this is the split');

    if (this.curentUser.doc && this.curentUser.doc.role == "subadmin" && this.curentUser.doc.privileges) {
      if (this.router.url == '/app/category/sub-category-add' || (split.length > 0 && split[2] == 'category')) {

        this.userPrivilegeDetails = this.curentUser.doc.privileges.filter(x => x.alias == 'category');
        console.log(this.userPrivilegeDetails, 'this is the user privilegeDetails');

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
    console.log("hi you enetered to the ngOnInit");

    this.id = this.ActivatedRoute.snapshot.paramMap.get('id');
    console.log(this.id, 'hi this is id');

    // console.log(this.subCategory);

    this.pageTitle = this.id ? "Edit Sub Category" : "Add Sub Category";
    this.apiService.CommonApi(Apiconfig.restaurantCategory.method, Apiconfig.restaurantCategory.url, {}).subscribe(
      (catList) => {
        console.log(catList, 'this is catlist');

        if (catList && catList.list.length > 0) {
          this.restaurantCatList = catList.list
        }
        if (this.id) {
          this.idExist = true;
          this.disabled = true;
          this.apiService.CommonApi(Apiconfig.editSubCategory.method, Apiconfig.editSubCategory.url, { id: this.id }).subscribe(
            async (result) => {
              console.log(result.result, 'this is the result that I am waiting for')
              // var categoryFilter=this.restaurantCatList.filter(x=>x._id==result[0].rcategory)
              // console.log(categoryFilter);

              let len = result.result
              const add = [...result.result]
              len.pop()

              console.log(len, 'this are len');
              // len.push('add-new')
              console.log(len, 'this are len');
              this.showOptions = true;
              this.selectedCategory = result.result[result.result.length - 1]
              // this.subCategory.controls.rcategory.setValue(categoryFilter[0]._id)
              this.subCategory.controls.scatname.setValue(result.data.scatname);
              this.subCatName = result.data.scatname;
              this.subCategory.controls.status.setValue(result.data.status)
              this.previewImage = environment.apiUrl + result.data.img
              this.inputFile = result.data.img
              console.log(len, 'len len len +++++++++++++ len len len')
              len.reverse()
              len.pop()
              console.log(len, 'len len len ----------------------- len len len')
              for (let i = 0; i <= len.length - 1; i++) {
                console.log(len[i], 'len[i].rcategory len[i].rcategory');
                await this.getSubCategoryAsync(len[i], i);
              }
              console.log(add, 'this is final');
              add.pop();
              add.reverse();
              add.shift();
              this.changeSlug();
              console.log(add, 'this is final twooo');
              this.initializeFields(add)
            })
        }
      })
    this.addDropdown();
  }
  initializeFields(ids: string[]) {
    // Clear existing form controls
    while (this.fields.length !== 0) {
      this.fields.removeAt(0);
    }

    // Add new form controls based on the array of IDs
    for (const id of ids) {
      console.log(id, 'this are id ');

      const newField = this.fb.group({
        dropdown: new FormControl(id)
      });

      this.fields.push(newField);
    }
  }

  async getSubCategoryAsync(value: any, index: number): Promise<void> {
    try {
      console.log(value, 'thjis calue');

      const result = await this.apiService.CommonApi("post", "scategory/get_all_sub", { id: value }).toPromise();

      if (result && result.length > 0) {
        console.log(result, 'this is the result');

        // Populate the dropdown options for the corresponding category
        this.dropdownOptions[index] = result;
      }
    } catch (error) {
      // Handle error if the request fails
      this.notifyService.showError(error.message);
    }
  }

  onSubmit() {
    console.log(this.subCategory.status);
    console.log(this.subCategory.controls.fields.value, 'what about the controls');
    // console.log(this.d);
    const length = this.subCategory.controls.fields.value.length
    console.log(length, 'the length');
    var value;
    if (length < 2) {
      value = this.subCategory.get('rcategory').value
    } else {
      value = this.subCategory.controls.fields.value[length - 2].dropdown
    }
    console.log(value, 'this is the value of the control');
    this.submitted = true;
    if (this.subCategory.status != 'INVALID') {
      var formData = new FormData;
      formData.append('_id', this.id)
      formData.append('rcategory', value)
      formData.append('rootCategory', this.selectedCategory)
      formData.append('scatname', this.subCategory.get('scatname').value.substr(0, 1).toUpperCase() + this.subCategory.get('scatname').value.substr(1))
      formData.append('status', this.subCategory.get('status').value)
      formData.append('img', this.inputFile)
      formData.append('slug1', this.slugName);
      // formData.append('slug',this.subCategory.get('scatname').value.replace(/ /g,'-'));
      this.apiService.CommonApi(Apiconfig.addSubCategory.method, Apiconfig.addSubCategory.url, formData).subscribe(
        (result) => {
          if (result) {
            this.router.navigate(['/app/category/sub-category-list']);
            if (this.id) {
              this.notifyService.showSuccess("Successfully updated.");
            } else {
              this.notifyService.showSuccess("Successfully Added.");
            }
          } else {
            this.notifyService.showError("Sorry, Please try again later.");
          }
        })
    }

  }

  get rcatEditForm() {
    return this.subCategory.controls
  }
  get fields() {
    return this.subCategory.get('fields') as FormArray;
  }
  fileUpload(event) {
    var file = event.target.files[0]
    var image_valid = ['image/jpg', 'image/jpeg', 'image/png', 'image/JPG', 'image/JPEG', 'image/PNG'];
    if (image_valid.indexOf(file.type) == -1) {
      this.subCategory.controls['cimage'].setValue('')
      this.notifyService.showError('Images  only allow!Please select file types of jpg,jpeg,png,JPG,JPEG,PNG');
      return;
    }
    this.inputFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    }
    reader.readAsDataURL(this.inputFile)
  }

  addDropdown() {
    const newField = this.fb.group({
      dropdown: new FormControl('')
    });

    this.fields.push(newField);

  }
  dropdownOptions: { label: string; value: string }[][] = [[]];
  dropdownOptions1: { label: string; value: string }[][] = [
    [
      { label: 'Option 1-A', value: 'option-1a' },
      { label: 'Option 2-A', value: 'option-2a' },
      { label: 'Add New', value: 'add-new' } // "Add New" option
    ],

    // Add more sets of options as needed
  ];
  removeDropdown(index: number) {
    while (this.fields.length > index + 1) {
      this.fields.removeAt(index + 1);
    }
  }

  getSubCategory(value, index) {
    console.log(value, 'this is the value');
    this.dropdownOptions=[]
    this.apiService.CommonApi("post", "scategory/get_all_sub", { id: value }).subscribe(
      (result) => {
        console.log(result, 'this is the result love and drama');

        if (result && result.length > 0) {
          this.dropdownOptions[index] = result
          console.log(this.dropdownOptions, 'this is drop options');
        }
      },
      (error) => {
        this.notifyService.showError(error.message);
      }
    )
  }

  getDropdownOptions(index: number): { label: string; value: string }[] {
    console.log(index);
    // console.log(this.dropdownOptions,'this are drop option in actual drop option');
    return this.dropdownOptions[index] || [];
  }

  onDropdownChange(index: number) {

    this.dropdownOptions[index + 1]=[]
    console.log(index, 'this is the index');

    const currentDropdown = this.fields.at(index).get('dropdown');
    const currentDropdownValue = currentDropdown.value;

    this.removeDropdown(index);
    console.log(currentDropdownValue, 'this is the current dropdown value');

    if (currentDropdownValue !== 'add-new') {
      this.showOptions = false;
      this.addDropdown();
      this.apiService.CommonApi("post", "scategory/get_all_sub", { id: currentDropdownValue }).subscribe(
        (result) => {
          console.log(result, 'this is the result');
          if (result && result.length > 0) {
            this.dropdownOptions[index + 1] = result
            console.log(this.dropdownOptions, 'this is drop options');
          }
        },
        (error) => {
          this.notifyService.showError(error.message);
        }
      )
      // const newDropdownIndex = index + 1;
      // const newDropdown = this.fields.at(newDropdownIndex).get('dropdown');
      // const newOptions = this.getUpdatedOptions(index, currentDropdownValue);
      // newDropdown.setValue('');
      // newDropdown.reset(newOptions);
    } else {
      this.showOptions = true;
    }

    if (index == 4) {
      this.notifyService.showWarning('You can add only five sub-levels');
    }

    this.indx = index
  }

  changeSlug() {
    if (this.subCatName) {
      this.slugName = this.subCatName.trim().toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
    } else {
      this.slugName = "";
    }
  }

  // getUpdatedOptions(previousIndex: number, selectedValue: string): { label: string; value: string }[] {
  //   // Implement your logic here to determine options based on the selected value
  //   // For example, return a set of options based on the selected value
  //   // You may use 'previousIndex' to get the selected value from the previous dropdown
  //   if (selectedValue === 'option-1a') {
  //     return [
  //       { label: 'New Option A-1', value: 'new-option-a-1' },
  //       { label: 'New Option A-2', value: 'new-option-a-2' },
  //       // Add more options as needed
  //     ];
  //   } else if (selectedValue === 'option-1b') {
  //     return [
  //       { label: 'New Option B-1', value: 'new-option-b-1' },
  //       { label: 'New Option B-2', value: 'new-option-b-2' },
  //       // Add more options as needed
  //     ];
  //   } else {
  //     return [];
  //   }
  // }
  // I told you that I don't need drop down in add-new select and I need only one drop down from each drop down except the add-new 

}
