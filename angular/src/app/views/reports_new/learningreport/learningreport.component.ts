import { AfterViewInit, ChangeDetectorRef, Component, OnInit,ViewChild } from '@angular/core';

import { ApiService } from 'src/app/_services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { WebSocketService } from 'src/app/_services/webSocketService.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import  { Dayjs } from 'dayjs/esm';
import { from,groupBy,mergeMap,toArray,zip,of} from 'rxjs'

import {
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
  DxButtonModule, DxPopupModule, DxPopoverModule, getElement,DxDataGridComponent
} from 'devextreme-angular';
//import { DxDataGridComponent } from 'devextreme-angular';
interface IRange {
  value: Date[];
  label: string;
}
@Component({
  selector: 'app-learningreport',
  templateUrl: './learningreport.component.html',
  styleUrls: ['./learningreport.component.scss']
})
export class LearningreportComponent {
 filterForm: FormGroup;
  batchid: any;
  teamList: any=[];
  cityList: any=[];  
  roleList: any=[];
  companynames: any=[];
  storeddata: any = null;
  selectedUsers: any=[];
  showbathlist: boolean=false;

  showfilter: boolean=false;
  MainData:any[]=[];
  RootData:any[]=[];
  GroupUserAndTitle:any[]=[];
  FormatedGroupUserAndTitle:any[]=[];
  Gridshowno:number=1;
  LabelLernername:string="";
  LabelGroupOrDate:string="";
  LabelWord:string;

  isShowlbl1:boolean=false;
  isShowlbl2:boolean=false;
  isShowlbl3:boolean=false;
  companysubadmin: any;
  trainerData:any;
  companydata: any;

  ranges: IRange[] = [{
    value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
    label: 'Last 7 Days'
  }, {
    value: [new Date(new Date().setDate(new Date().getDate() - 14)), new Date()],
    label: 'Last 2 Weeks'
  },
  {
    value: [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()],
    label: 'Last 1 Month'
  },
  {
    value: [new Date(new Date().setDate(new Date().getDate() - 180)), new Date()],
    label: 'Last 6 Months'
  },
  {
    value: [new Date(new Date().setDate(new Date().getDate() - 360)), new Date()],
    label: 'Last 1 Year'
  },
];
  @ViewChild('dataGridVar', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridVar2', { static: false }) dataGrid2: DxDataGridComponent;
  closeButtonOptions: Record<string, unknown>={};
  popupVisible = false;
 constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthenticationService,
    private cd: ChangeDetectorRef,
  
    private loader: SpinnerService,
    private socketService: WebSocketService,
    private notifyService: NotificationService,
    private ActivatedRoute: ActivatedRoute,
    //private store: DefaultStoreService,
  
    private fb:FormBuilder,
  ) {
    this.closeButtonOptions = {
      text: 'Close',
      stylingMode: 'outlined',
      type: 'normal',
      onClick: () => {
        this.popupVisible = false;
      },
    };
    this.companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))
    this.trainerData = JSON.parse(localStorage.getItem("Trainer Login"));
    this.companydata=JSON.parse(localStorage.getItem("company"))

  }
  ngOnInit(): void {
    //debugger;
    this.filterForm = this.fb.group(
      {
        company: [null, [Validators.required]],
        city: [[], [Validators.required]],
        startdate: [''],
        enddate: [''],
        ustartdate: [''],
        uenddate: [''],
        team: [[]],
        userjoiningdate: [''],
        perioddate: ['', [Validators.required]],

      },
      {
        validator: this.endDateValidator('startdate', 'enddate'),
      }
    );
  
    // Get batch ID from route parameters
    this.ActivatedRoute.paramMap.subscribe((result) => {
      this.batchid = result.get('id');
    });
  
    // Fetch company details
    this.getcompany();
  
    // Check for stored filter data in localStorage
    const storedData = localStorage.getItem('batchRequestData');
    if (storedData) {
      this.storeddata = JSON.parse(storedData);
      //this.onFilter(); // Call the filter function with stored data
    }
  }
  endDateValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
  
      if (matchingControl.errors && !matchingControl.errors.endDateValidator) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
  
      if (control.value && matchingControl.value && new Date(matchingControl.value) < new Date(control.value)) {
        matchingControl.setErrors({ endDateValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  getcompany() {
    console.log("insideo f thuis ")
    this.apiService.CommonApi(Apiconfig.getCompanynames.method, Apiconfig.getCompanynames.url, {}).subscribe((result) => {
      this.companynames = result.data;
      if(this.companysubadmin){
        let loggedincompany= this.companynames.filter(s=>s._id == this.companysubadmin.companyid)[0];
        this.filterForm.controls['company'].setValue(this.companysubadmin.companyid);
        this.getCountry(loggedincompany);
      }
      else if(this.trainerData){
       let loggedincompany= this.companynames.filter(s=>s._id == this.trainerData.companyid)[0]; 
        this.filterForm.controls['company'].setValue(this.trainerData.companyid);
        this.getCountry(loggedincompany);
      }
      else if(this.companydata){
       let loggedincompany= this.companynames.filter(s=>s._id == this.companydata._id)[0]; 
        this.filterForm.controls['company'].setValue(this.companydata._id);
        this.getCountry(loggedincompany);
      }
    })
  }

  getCountry(data: any) {
    // Reset the lists
    this.cityList = [];
    this.roleList = [];
    this.teamList = [];

    // Optionally reset form controls
    this.filterForm.patchValue({
      city: null,
      team: null,
    });

    // Populate lists if data is available
    if (data != undefined) {
      this.cityList = data.countryCity.flatMap(country => country.city);
      this.roleList = data.year;
      this.teamList = data.course;
    }
  }
  filter(){
    this.Gridshowno=1;
    var res=this.filterForm;
    this.RootData=[];
    if (this.filterForm.valid) {
      this.filterForm.controls['startdate'].setValue(this.filterForm.value.perioddate[0]);
      this.filterForm.controls['enddate'].setValue(this.filterForm.value.perioddate[1]);
      if(this.filterForm.value.userjoiningdate){
        this.filterForm.controls['ustartdate'].setValue(this.filterForm.value.userjoiningdate[0]);
        this.filterForm.controls['uenddate'].setValue(this.filterForm.value.userjoiningdate[1]);
      }
      else{
        this.filterForm.controls['ustartdate'].setValue('');
        this.filterForm.controls['uenddate'].setValue('');
      }
      this.filterForm.value
      const data = {
        ...this.filterForm.value,

        limit: 10,
        skip: 0,
      };
  
      localStorage.setItem('batchRequestData', JSON.stringify(data));
      console.log(data);
      this.getLearningHours(data);
    } else {
      this.filterForm.markAllAsTouched();
    }
  }
  contentReady = (e) => {
  
    e.component.getVisibleRows().forEach((row) => {
    });
    // e.refresh();
    //this.dataGrid.instance.refresh();
  };
  Grid1Data:any[]=[];
  getLearningHours(data:any){
    this.Gridshowno=1;
    this.MainData=[];
    this.RootData=[];
    this.Grid1Data=[];
    this.apiService.CommonApi(Apiconfig.learninghoursoverall.method, Apiconfig.learninghoursoverall.url,data ).subscribe(
      (result) => {
        debugger;
        if(result.status == true){
          this.MainData=result.data;
          this.RootData=result.data;
          let groupdata={}
          this.RootData.forEach(s=>{
            groupdata={};
            groupdata['company']= s.company;
            groupdata['companyid'] = s.companyid;
            groupdata['userid'] = s._id;
            groupdata['username'] = s.username[0].toUpperCase()+ s.username.slice(1)// s.username;
            groupdata['course'] = s.course;
            groupdata['city'] = s.city;
           // groupdata['batchName'] = s.batchName;
            
            let sum=0;
            let totalsum=0;
            groupdata['arcallsim_totalPracticeTime'] =sum;
            if(s.arcallsim.length !=0){
              s.arcallsim.forEach(e => {
                sum=sum+e.totalPracticeTime;
                
              });
              totalsum=totalsum+sum;
              let hh=Math.floor(sum/3600);
              let mm=Math.floor((sum%3600)/60);
              let displayformat=(hh ==0?'':hh.toString()+" hrs ")+(mm == 0?'':mm.toString()+" mins");
              groupdata['arcallsim_totalPracticeTime'] =displayformat;
            }

            let sum2=0;
            let sum2_total=0;
            groupdata['processlearning_totalPracticeTime'] =sum2;
            groupdata['fp_totalPracticeTime'] =0;
            groupdata['fb_totalPracticeTime'] =0;
            groupdata['fo_totalPracticeTime'] =0;
            groupdata['hk_totalPracticeTime'] =0;

            if (s.processlearning != null) {
              if (s.processlearning.prs1.length != 0) {
                s.processlearning.prs1.forEach(e => {
                  sum2 = sum2 + e.totalPracticeTime;
                });
                totalsum = totalsum + sum2;
                sum2_total=sum2_total+sum2;
                //let hmformat=((sum2/60)/60).toFixed(2).split(".");
                let hh = Math.floor(sum2 / 3600);
                let mm=Math.floor((sum2%3600)/60);
                let displayformat = (hh == 0 ? '' : hh.toString() + " hrs ") + (mm == 0 ? '' : mm.toString() + " mins");
                groupdata['fp_totalPracticeTime'] = displayformat;
              }
              sum2=0;
              if (s.processlearning.prs2.length != 0) {
                s.processlearning.prs2.forEach(e => {
                  sum2 = sum2 + e.totalPracticeTime;

                });
                totalsum = totalsum + sum2;
                sum2_total=sum2_total+sum2;

                //let hmformat=((sum2/60)/60).toFixed(2).split(".");
                let hh = Math.floor(sum2 / 3600);
                let mm=Math.floor((sum2%3600)/60);
                let displayformat = (hh == 0 ? '' : hh.toString() + " hrs ") + (mm == 0 ? '' : mm.toString() + " mins");
                groupdata['fb_totalPracticeTime'] = displayformat;
              }
              sum2=0;
              if (s.processlearning.prs3.length != 0) {
                s.processlearning.prs3.forEach(e => {
                  sum2 = sum2 + e.totalPracticeTime;

                });
                totalsum = totalsum + sum2;
                sum2_total=sum2_total+sum2;

                //let hmformat=((sum2/60)/60).toFixed(2).split(".");
                let hh = Math.floor(sum2 / 3600);
                let mm=Math.floor((sum2%3600)/60);
                let displayformat = (hh == 0 ? '' : hh.toString() + " hrs ") + (mm == 0 ? '' : mm.toString() + " mins");
                groupdata['fo_totalPracticeTime'] = displayformat;
              }
               sum2=0;
              if (s.processlearning.prs4.length != 0) {
                s.processlearning.prs4.forEach(e => {
                  sum2 = sum2 + e.totalPracticeTime;

                });
                totalsum = totalsum + sum2;
                sum2_total=sum2_total+sum2;

                //let hmformat=((sum2/60)/60).toFixed(2).split(".");
                let hh = Math.floor(sum2 / 3600);
                let mm=Math.floor((sum2%3600)/60);
                let displayformat = (hh == 0 ? '' : hh.toString() + " hrs ") + (mm == 0 ? '' : mm.toString() + " mins");
                groupdata['hk_totalPracticeTime'] = displayformat;
              }
              let hh1 = Math.floor(sum2_total / 3600);
              let mm1 = Math.floor((sum2_total%3600) / 60);
              let displayformat2 = (hh1 == 0 ? '' : hh1.toString() + " hrs ") + (mm1 == 0 ? '' : mm1.toString() + " mins");
              groupdata['processlearning_totalPracticeTime'] = displayformat2;

            }

            let sum3=0;
            groupdata['profluenteng_totalPracticeTime'] =sum3;
            if(s.profluenteng.length !=0){
              s.profluenteng.forEach(e => {
                sum3=sum3+e.totalPracticeTime;
                

              });
              totalsum=totalsum+sum3;

              //let hmformat=((sum3/60)/60).toFixed(2).split(".");
              let hh=Math.floor(sum3/3600);
              let mm=Math.floor((sum3%3600)/60);
              let displayformat=(hh ==0?'':hh.toString()+" hrs ")+(mm == 0?'':mm.toString()+" mins");
              groupdata['profluenteng_totalPracticeTime'] =displayformat;
              
            }

            let sum4=0;
            groupdata['softskills_totalPracticeTime'] =sum4;
            if(s.softskills.length !=0){
              s.softskills.forEach(e => {
                sum4=sum4+e.totalPracticeTime;
               
              });
              totalsum=totalsum+sum4;
              //let hmformat=((sum4/60)/60).toFixed(2).split(".");
              let hh=Math.floor(sum4/3600);
              let mm=Math.floor((sum4%3600)/60);
              let displayformat=(hh ==0?'':hh.toString()+" hrs ")+(mm == 0?'':mm.toString()+" mins");
              groupdata['softskills_totalPracticeTime'] =displayformat;
            }
            let hh5=Math.floor(totalsum/3600);
            let mm5=Math.floor((totalsum%3600)/60);
            let displayformat5=(hh5 ==0?'':hh5.toString()+" hrs ")+(mm5 == 0?'':mm5.toString()+" mins");
            groupdata['totalsum'] = displayformat5;

            this.Grid1Data.push(groupdata);
          })
        }
      });
  }
  Grid2Data:any[]=[];
  SumClick(row, grtype, vi) {
    debugger;
    if (vi != "0") {
    this.Gridshowno=2;
    this.Grid2Data=[];
    this.isShowlbl1=true;
     if(grtype =='processlearning'){
      this.LabelLernername="Process Learning - "+vi;
    }
    else if(grtype =='arcallsim'){
      this.LabelLernername="AR Call Simulations - "+vi;
    }
    else if(grtype =='profluenteng'){
      this.LabelLernername="Profluent English - "+vi;
    }
    else if(grtype =='softskills'){
      this.LabelLernername="Soft Skills - "+vi;
    }
    this.LabelLernername=row.data.username+" - "+this.LabelLernername;
      let subCategorygroup = [];
      let userres = this.RootData.filter(s => s._id == row.data.userid)
      userres.forEach(s => {
        debugger;
        if (grtype == 'processlearning') {
          let farr = [];
          if(s[grtype].prs1.length !=0){
            s[grtype].prs1.forEach(element => {
              farr.push(element)
            });
          }
          if(s[grtype].prs2.length !=0){
            s[grtype].prs2.forEach(element => {
              farr.push(element)
            });
          }
           if(s[grtype].prs3.length !=0){
            s[grtype].prs3.forEach(element => {
              farr.push(element)
            });
          }
           if(s[grtype].prs4.length !=0){
            s[grtype].prs4.forEach(element => {
              farr.push(element)
            });
          }
      

          from(farr).pipe(
            groupBy((item: any) => item.subCategory),
            mergeMap(group => group.pipe(toArray()))
          )
            .subscribe(g => {
              subCategorygroup.push(g)
            });

        }
        else {
          from(s[grtype]).pipe(
            groupBy((item: any) => item.subCategory),
            mergeMap(group => group.pipe(toArray()))
          )
            .subscribe(g => {
              subCategorygroup.push(g)
            });
        }
      })
      debugger;
     
      subCategorygroup.forEach(k => {
        let row = {};
        row['subCategory'] = k[0].subCategory;
        row['category'] = k[0].category;
        row['type'] = k[0].type;
        row['companyid'] = k[0].companyid;
        row['userid'] = k[0].userId;
        row['grtype'] = grtype;
        let sum = 0;
        k.forEach(e => {
          sum = sum + e.totalPracticeTime;
        });
        //let hmformat = ((sum/60)/60).toFixed(2).split(".");
        let hh=Math.floor(sum/3600);
        let mm=Math.floor((sum%3600)/60);
        let displayformat=(hh ==0?'':hh.toString()+" hrs ")+(mm == 0?'':mm.toString()+" mins");
        //let displayformat = (hmformat[0] == "0" ? '' : hmformat[0] + " hrs ") + (hmformat[1] == "0" ? '' : hmformat[1] + " mins");

        row['totalPracticeTime'] = displayformat;
        this.Grid2Data.push(row);
      })
    }
  }

  Grid3Data:any[]=[];
  SumClick2(row,  vi) {
    debugger;
    if (vi != "0") {
    this.Gridshowno=3;
    this.Grid3Data=[];
    this.isShowlbl2=true;
    this.isShowlbl1=false;
    // if(row.data.grtype =='processlearning'){
    //   this.LabelGroupOrDate="Process Learning - "+vi;
    // }
    // else if(row.data.grtype =='arcallsim'){
    //   this.LabelGroupOrDate="AR Call Simulations - "+vi;
    // }
    // else if(row.data.grtype =='profluenteng'){
    //   this.LabelGroupOrDate="Profluent English - "+vi;
    // }
    // else if(row.data.grtype =='softskills'){
    //   this.LabelGroupOrDate="Soft Skills - "+vi;
    // }
    this.LabelGroupOrDate=row.data.subCategory+" - " +vi;
      debugger;
      let userres = this.RootData.filter(s => s._id == row.data.userid)
      userres.forEach(s => {
        let farr=[];
        if(row.data.grtype =="processlearning"){
          if(s[row.data.grtype].prs1.length !=0){
            s[row.data.grtype].prs1.forEach(element => {
              farr.push(element)
            });
          }
          if(s[row.data.grtype].prs2.length !=0){
            s[row.data.grtype].prs2.forEach(element => {
              farr.push(element)
            });
          }
           if(s[row.data.grtype].prs3.length !=0){
            s[row.data.grtype].prs3.forEach(element => {
              farr.push(element)
            });
          }
           if(s[row.data.grtype].prs4.length !=0){
            s[row.data.grtype].prs4.forEach(element => {
              farr.push(element)
            });
          }
        }
        else{
          farr=s[row.data.grtype];
        }

        farr.filter(a=>a.subCategory==row.data.subCategory).forEach(k => {
          k.sessions.forEach(e => {
            debugger;
            let row = {};
            row['subCategory'] = k.subCategory;
            row['category'] = k.category;
            row['type'] = k.type;
            row['companyid'] = k.companyid;
            row['userid'] = k._id;
            row['activityName'] =k.type+ (k.activityName=="" ? "":" - "+ k.activityName);
            row['totalPracticeTime'] = k.totalPracticeTime;
            row['duration'] = e.duration;
            row['recordTimings']=e.recordTimings;

            const milliseconds = e.startTime._seconds * 1000 + e.startTime._nanoseconds / 1000000;
            let sdate = new Date(milliseconds);
            row['startTime'] = sdate.toLocaleString();

            const milliseconds2 = e.endTime._seconds * 1000 + e.endTime._nanoseconds / 1000000;
            let sdate2 = new Date(milliseconds2);
            row['endTime'] = sdate2.toLocaleString();
            debugger
            let diffmins = Math.floor( (sdate2.valueOf() - sdate.valueOf()) /60000); 
            const hours = Math.floor(diffmins / 60);
            const minutes = diffmins % 60;

            let hh=Math.floor(k.totalPracticeTime/3600);
            let mm=Math.floor(k.totalPracticeTime/60);
            
            let displayformat = (hours ==0?'':hours.toString()+" hrs ")+(minutes == 0?'':minutes.toString()+" mins");

            row['learnhours'] = displayformat;

            this.Grid3Data.push(row);
          });
        })
      });
    }
  }
  clearForm(): void {
    debugger;
    this.selectedUsers = [];
    this.showfilter = false;
    this.showbathlist = false;
  
    this.storeddata = null;
    this.filterForm.markAsPristine()
    this.filterForm.reset();
    // Clear the data from localStorage
    localStorage.removeItem('batchRequestData');
  }
  BacktoMain(){
    this.isShowlbl1 = false;
    this.isShowlbl2 = false;
    this.isShowlbl3 = false;
    this.Gridshowno=1;
  }
  BacktoBack(){
    this.isShowlbl1 = true;
    this.isShowlbl2 = false;
    this.isShowlbl3 = false;
    this.Gridshowno=2;
  }
  BacktoBackGroup(){
    this.Gridshowno=3;
    this.isShowlbl1 = false;
    this.isShowlbl2 = true;
    this.isShowlbl3 = false;
  }
  rowdt:any[]=[];
  totsec="";
  onGr3CellClicked(ev) {
    debugger;
    this.rowdt=[];
    this.totsec="";
    if (ev.columnIndex == 5) {
      //this.rowdt = ev.data.recordTimings;
      let a=1;
      let sum=0;
      ev.data.recordTimings.forEach(e => {
        debugger;
        let row={};
        row['index']=a;
        let st=e['startTime'+a]
        let ed=e['endTime'+a]

        const milliseconds = st._seconds * 1000 + st._nanoseconds / 1000000;
        let sdate = new Date(milliseconds);
        row['startdt'] = sdate.toLocaleString();

        const milliseconds2 = ed._seconds * 1000 + ed._nanoseconds / 1000000;
        let sdate2 = new Date(milliseconds2);
        row['enddt'] = sdate2.toLocaleString();
     
        sum=sum+(ed._seconds-st._seconds);

        let ssec=ed._seconds-st._seconds;

        //let hh=Math.floor(ssec/60);
        let mm=Math.floor(ssec/60);
        let seconds = ssec % 60;
        let displayformat = (mm ==0?'':mm.toString()+" mins ")+(seconds == 0?'':seconds.toString()+" secs");

        row['sec']=displayformat;// ed._seconds-st._seconds;

        this.rowdt.push(row);
        a=a+1;
      });
      let mm=Math.floor(sum/60);
      let seconds = sum % 60;

      this.totsec=(mm ==0?'':mm.toString()+" mins ")+(seconds == 0?'':seconds.toString()+" secs");
      this.popupVisible = true;
    }
  }
}
