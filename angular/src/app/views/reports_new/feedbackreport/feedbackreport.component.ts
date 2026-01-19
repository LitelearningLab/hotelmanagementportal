import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { ApiService } from 'src/app/_services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/_services/spinner.service';
import { WebSocketService } from 'src/app/_services/webSocketService.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dayjs } from 'dayjs/esm';
import { from, groupBy, mergeMap, toArray, zip, of } from 'rxjs'

import {
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
  DxButtonModule, DxPopupModule, DxPopoverModule, getElement, DxDataGridComponent
} from 'devextreme-angular';
//import { DxDataGridComponent } from 'devextreme-angular';
interface IRange {
  value: Date[];
  label: string;
}

@Component({
  selector: 'app-feedbackreport',
  templateUrl: './feedbackreport.component.html',
  styleUrls: ['./feedbackreport.component.scss']
})
export class FeedbackreportComponent {
  filterForm: FormGroup;
  Feedbacks: any[] = [];
  companysubadmin: any;
  trainerData: any;
  companydata: any;
  companynames: any = [];
  teamList: any = [];
  cityList: any = [];
  roleList: any = [];
  SelectedRow:any;
  isshow=true;
  feedbackForm:any[]=[];
  feedbackFormMain:any[]=[];
  overview:any=null;

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
    private fb: FormBuilder,
  ) {
    this.companysubadmin = JSON.parse(localStorage.getItem("companysubadmin"))
    this.trainerData = JSON.parse(localStorage.getItem("Trainer Login"));
    this.companydata = JSON.parse(localStorage.getItem("company"))
  }
  ngOnInit(): void {
    this.isshow = true;

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

    this.getcompany();
    this.getFeedbackForm();
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
  getFeedbackForm(){
    this.apiService.CommonApi(Apiconfig.feedbackForm.method,Apiconfig.feedbackForm.url,{}).subscribe(f=>{
      this.feedbackForm=f.data[0].sections;
      this.feedbackForm.forEach(e => {
        e.questions.forEach(e1 => {
          if(e1.options){
          let a=5;
          let opvalues=[];

          e1.options.forEach(e2 => {
            var res={};

            //res[e2]=a;
            res['name']=e2;
            res['value']=a;
            res['rating']=0

            opvalues.push(res);
            a=a-1;
          });
          e1.opvalues=opvalues;
        }
        });
      });
      this.feedbackFormMain= JSON.parse( JSON.stringify(this.feedbackForm))
      debugger;
    })
  }
  getcompany() {
    console.log("insideo f thuis ")
    this.apiService.CommonApi(Apiconfig.getCompanynames.method, Apiconfig.getCompanynames.url, {}).subscribe((result) => {
      this.companynames = result.data.sort((a, b) => a.companyname - b.companyname);
      let allcomp={_id:'0',companyname:'All' }
      this.companynames.unshift(allcomp)
      debugger;
      if (this.companysubadmin) {
        let loggedincompany = this.companynames.filter(s => s._id == this.companysubadmin.companyid)[0];
        this.filterForm.controls['company'].setValue(this.companysubadmin.companyid);
        this.getCountry(loggedincompany);
      }
      else if (this.trainerData) {
        let loggedincompany = this.companynames.filter(s => s._id == this.trainerData.companyid)[0];
        this.filterForm.controls['company'].setValue(this.trainerData.companyid);
        this.getCountry(loggedincompany);
      }
      else if (this.companydata) {
        let loggedincompany = this.companynames.filter(s => s._id == this.companydata._id)[0];
        this.filterForm.controls['company'].setValue(this.companydata._id);
        this.getCountry(loggedincompany);
      }
    })
  }
  getCountry(data: any) {
    debugger;
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
  //feedbackTypesData=[{name: 'Industry Fundamentals'},{name:'Language Lab'},{name:'Interactive Simulations'},{name:'Content Library'},{name:'PMS Simulation'},{name:'Overall Experience'}]
  feedbackTypesData=[ 'Industry Fundamentals','Language Lab','Interactive Simulations','Content Library','PMS Simulation','Overall Experience'];

  comments1:any[]=[];
  comments2:any[]=[];
  comments3:any[]=[];
  comments4:any[]=[];
  comments5:any[]=[];
  comments6:any[]=[];
  TotalaveragePercentage:any=null;
  Greaterthan4:any[]=[];
  t3to39:any[]=[];
  Lessthan3:any[]=[];

  filter() {
  this.feedbackForm=JSON.parse(JSON.stringify(this.feedbackFormMain))
    debugger;
    var res = this.filterForm.value;
    const data = {
      ...this.filterForm.value,

      limit: 10,
      skip: 0,
    };
    this.Feedbacks=[];
    this.apiService.CommonApi(Apiconfig.feedbackreport.method, Apiconfig.feedbackreport.url, data).subscribe(
      (result) => {
        debugger;
        if (result.message == "success") {
          this.Feedbacks = result.data.map(s => {
            return {
              ...s,
              CreatedOn: new Date((s.submittedAt._seconds * 1000) + (s.submittedAt._nanoseconds / 1000000))
            }; // Create a new object with existing properties and the new 'status' field
          });
          // this.Feedbacks.forEach(an => {
          //   this.feedbackTypes.forEach(el1 => {
          //     an.answers[el1].forEach(an1 => {
          //       if (an1.answer && this.feedbackForm.filter(s1 => s1.title == el1)[0].questions.filter(s2 => s2.text == an1.question)[0].opvalues) {
          //         an1.rating = this.feedbackForm.filter(s1 => s1.title == el1)[0].questions.filter(s2 => s2.text == an1.question)[0].opvalues.filter(s3 => s3[an1.answer])[0][an1.answer];
          //       }
          //     })
          //   });
          // })
          debugger;
          this.TotalaveragePercentage = null;
          this.Greaterthan4 = [];
          this.t3to39 = [];
          this.Lessthan3 = [];

          this.feedbackForm.forEach(e => {
            e.questions.forEach(e1 => {
              if (e1.options) {
                this.Feedbacks.forEach(a => {
                  //e.title category
                  //e1.text question
                  //e1.options answers
                  let ans = a.answers[e.title].filter(s => s.question == e1.text)[0].answer;
                  e1.opvalues.filter(ss => ss.name == ans)[0].rating = Number(e1.opvalues.filter(ss => ss.name == ans)[0].rating + 1);
                })
              }
            });
            debugger;
            e.questions.forEach(e2 => {
              if (e2.options) {
                e2.opvalues.forEach(fp => {
                  fp.percentage= Number( ((fp.rating/this.Feedbacks.length)*100).toFixed(2) ) // fp.rating ==0?0: (fp.value/(e2.opvalues.filter(se2f=>se2f.value).length))*100;
                });
                const totalSum: number = e2.opvalues.reduce((accumulator, item) => {
                  // Convert the string value to a number before addition
                  return accumulator + item.rating * item.value;
                }, 0); // initial value is 0

                let avg = (totalSum / this.Feedbacks.length);
                e2.avgrating =Number(  avg.toFixed(2));
                 //e2.percentage=(totalSum / this.Feedbacks.length)*100;
              }
            });
           
            let ques=e.questions.filter(qv=>qv.avgrating);
            let quessum = ques.reduce((accumulator, item) => {
              // Convert the string value to a number before addition
              return accumulator + item.avgrating ;
            }, 0); // initial value is 0

            let avg1 = (quessum / ques.length);
           
            e.avgrating = Number(  avg1.toFixed(2));

            let avg1obj={"name":e.title,'rate':Number( avg1.toFixed(2)) };
            if(avg1>=4){
              this.Greaterthan4.push(avg1obj);
            }
            else if(avg1 >=3 && avg1 <=3.9 ){
              this.t3to39.push(avg1obj);
            }
            else{
              this.Lessthan3.push(avg1obj);
            }

          });

          const totalper=this.feedbackForm.reduce((sum,c)=>{
            return sum + c.avgrating;
          },0);

          this.TotalaveragePercentage=Number(  (totalper/this.feedbackForm.length).toFixed(2));

          let cobj = null;
          let ind = null;
          this.comments1 = [];
          this.comments2 = [];
          this.comments3 = [];
          this.comments4 = [];
          this.comments5 = [];
          this.comments6 = [];

        this.Feedbacks.forEach(element => {
         // element.answers[this.feedbackTypesData[0]].forEach(el1=>{
            debugger
            ind= element.answers[this.feedbackTypesData[0]].filter(a=>a.question.includes("Industry Fundamentals Section"));
            if(ind.length !=0){
              cobj={question:ind[0].question,answer:ind[0].answer,username:element.userName,group:this.feedbackTypesData[0]}
              this.comments1.push(cobj);
            }

            ind= element.answers[this.feedbackTypesData[1]].filter(a=>a.question.includes("Please share your feedback and suggestions"));
            if(ind.length !=0){
              cobj={question:ind[0].question,answer:ind[0].answer,username:element.userName,group:this.feedbackTypesData[1]}
              this.comments2.push(cobj);
            }

            ind= element.answers[this.feedbackTypesData[2]].filter(a=>a.question.includes("Suggestions on scenarios you’d like to see added:"));
            if(ind.length !=0){
              cobj={question:ind[0].question,answer:ind[0].answer,username:element.userName,group:this.feedbackTypesData[2]}
              this.comments3.push(cobj);
            }

            ind= element.answers[this.feedbackTypesData[3]].filter(a=>a.question.includes("What topics/content would you like to see added in this section"));
            if(ind.length !=0){
              cobj={question:ind[0].question,answer:ind[0].answer,username:element.userName,group:this.feedbackTypesData[3]}
              this.comments4.push(cobj);
            }
            ind= element.answers[this.feedbackTypesData[4]].filter(a=>a.question.includes("Any difficulties or suggestions for improvement"));
            if(ind.length !=0){
              cobj={question:ind[0].question,answer:ind[0].answer,username:element.userName,group:this.feedbackTypesData[4]}
              this.comments5.push(cobj);
            }
             ind= element.answers[this.feedbackTypesData[5]].filter(a=>a.question.includes("Any other comments or suggestions:"));
            if(ind.length !=0){
              cobj={question:ind[0].question,answer:ind[0].answer,username:element.userName,group:this.feedbackTypesData[5]}
              this.comments6.push(cobj);
            }
         
          //})
        });
          debugger;
        }
        else {
          this.notifyService.showError("Something went wrong. Please try again later!")
        }
      })
  }
  
  clearForm(): void {

    this.filterForm.markAsPristine()
    this.filterForm.reset();
    // Clear the data from localStorage
    localStorage.removeItem('batchRequestData');
  }
  rowclick(row){
    debugger;
    this.SelectedRow=row;
    this.isshow=false;
  }
  back(){
    this.isshow=true;
    this.SelectedRow=null;

  }
  getQuestinRating(qusarr) {
    const totalSum: number = qusarr.reduce((accumulator, item) => {
      // Convert the string value to a number before addition
      return accumulator + item.rating*item.value;
    }, 0); // initial value is 0
    return (totalSum/this.Feedbacks.length);
  }
  tabid='1';
  tabclick(tid){
    this.tabid=tid;
  }
  
}
