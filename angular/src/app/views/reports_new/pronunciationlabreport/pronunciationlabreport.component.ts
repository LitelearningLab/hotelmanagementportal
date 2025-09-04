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
  selector: 'app-pronunciationlabreport',
  templateUrl: './pronunciationlabreport.component.html',
  styleUrls: ['./pronunciationlabreport.component.scss'],
 
})
export class PronunciationlabreportComponent {
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
    this.companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))
    this.trainerData = JSON.parse(localStorage.getItem("Trainer Login"));
    this.companydata=JSON.parse(localStorage.getItem("company"))

  }
  ngOnInit(): void {
    debugger;
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
      this.companynames = result.data.sort((a, b) => a.companyname - b.companyname);;
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
  filter(){
    debugger;
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
      this.getpronounciatonlist(data);
    } else {
      this.filterForm.markAllAsTouched();
    }

  }
  getpronounciatonlist(data:any){
    debugger;
    this.apiService.CommonApi(Apiconfig.pronunciatonlaboverall.method, Apiconfig.pronunciatonlaboverall.url,data ).subscribe(
      (result) => {
        if (result) {  
    debugger;
          result.data.forEach(s=>{
            var noofwords=0;
            var correctno=0;
            var listenatmpno=0;
            var pracattno=0;
            
            //For 1st grid
            s.prdata.forEach(a=>{
              if(a['pracAtt']==undefined){
                a['pracAtt']=0
              }
              noofwords=noofwords+1;
              correctno=correctno+a['correct'];
              listenatmpno=listenatmpno+a['listAtt'];
              pracattno=pracattno+a['pracAtt'];
              // s['noofwords']=noofwords;
              // s['correct']=correctno;
              // s['listatt']=listenatmpno;
              // s['pracatt']=pracattno;
              // s['successrate']=((correctno/noofwords)*100).toFixed(2)+"%";

            });
            s['noofwords']=noofwords;
            s['correct']=correctno;
            s['listAtt']=listenatmpno;
            s['pracAtt']=pracattno;
            s['successrate']=  ((correctno/pracattno)*100).toFixed(0)+"%";
           //( corection/pract)
            var gr=[]
            from(s.prdata).pipe(
              groupBy((item:any) => item.title),
              mergeMap(group => zip(of(group.key), group.pipe(toArray())) )
            )
              .subscribe(g=>{
                g['userId']=s._id;
                gr.push(g);
                this.GroupUserAndTitle.push(g);
              });
          });
          
debugger;
          var x=this.GroupUserAndTitle;
          this.RootData=result.data

          //pracatt
          this.showbathlist=true 
          console.log(result) 
          // // this.loadCard_Details(result.all,result.active,result.inactive,result.delete)    
          //this.source.load(result.data[0].data);
          //this.count = result.data[0].total[0].count;

          // setTimeout(() => {
          //   this.loader.loadingSpinner.next(false);
          // }, 1000);
          // this.cd.detectChanges();
        }
      }
    )

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
  contentReady = (e) => {
  
    e.component.getVisibleRows().forEach((row) => {
    });
    // e.refresh();
    //this.dataGrid.instance.refresh();
  };
  contentReady1 = (e) => {
  
    e.component.getVisibleRows().forEach((row) => {
    });
    // e.refresh();
    //this.dataGrid.instance.refresh();
  };
  UsernameClicked(e){
    debugger;
    this.isShowlbl1=true;
    this.Gridshowno=2;
    this.LabelLernername=e.data.username;
    //var re=e;
    this.FormatedGroupUserAndTitle=[];
    var res= this.GroupUserAndTitle.filter(s=>s.userId== e.data._id);
    res.forEach(ss=>{
      var dategroup=[]; 
      from(ss[1]).pipe(
        groupBy((item:any) => item.date),
        mergeMap(group =>  group.pipe(toArray()) )
      )
        .subscribe(g=>{
          dategroup.push(g)
        });
        debugger;
        dategroup.forEach(dg=>{
        var dgrow={};

          var title,date,correct=0,userId,listatt=0,pracatt=0,totalatt=0,success=0;
          dgrow['title']=dg[0].title;

          // if(dg[0].title=='words'){
          //   dgrow['title']=dg[0].load;
          // }
          // else{
          //   dgrow['title']=dg[0].title;
          // }
          dgrow['date']=dg[0].date;
          dgrow['userId']=dg[0].userId;

          dg.forEach(e1 => {
            totalatt=totalatt+1;
            correct=correct+e1['correct'];
            listatt=listatt+e1['listAtt'];
            pracatt=pracatt+e1['pracAtt'];
          });

          dgrow['noofwords']=totalatt;
          dgrow['correct']=correct;
          dgrow['listAtt']=listatt;
          dgrow['pracAtt']=pracatt;
          var per=correct ==0 && pracatt==0?"0":((correct/pracatt)*100).toFixed(2);

          dgrow['successrate']=per;
          this.FormatedGroupUserAndTitle.push(dgrow);
        })

      // ss[1].forEach(sss=>{
      //   this.FormatedGroupUserAndTitle.push(sss);
      // })
    })
    debugger;
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
  WordsData:any[]=[];
  DatesData:any[]=[];
  onCellClickG2(ev) {
    debugger;
    if (ev.columnIndex == 1) {
      this.WordsData=[];
      this.Gridshowno=3;
      this.isShowlbl1=false;
      this.isShowlbl2=true;
      this.isShowlbl3=false;
    //var res= this.GroupUserAndTitle.filter(s=>s.userId== ev.data.userId);
      var filldata=[];
      if (!isNaN(Date.parse(ev.value))) {
        //date clicked
        this.LabelGroupOrDate=ev.data.date;
        filldata=this.GroupUserAndTitle.filter(s=>s.userId== ev.data.userId && s[0] == ev.data.title)[0][1].filter(st=>st.date == ev.data.date);
      }
      else {
        //Category clicked
        if(ev.data.items ==null){
          filldata=this.GroupUserAndTitle.filter(s=>s.userId== ev.data.collapsedItems[0].userId && s[0] == ev.data.key)[0][1];

        }
        else{
          filldata=this.GroupUserAndTitle.filter(s=>s.userId== ev.data.items[0].userId && s[0] == ev.data.key)[0][1];

        }
        this.LabelGroupOrDate=ev.data.key;

      }

      if(filldata.length !=0){

        //filldata[0][1]

      var WD=[];
      from(filldata).pipe(
        groupBy((item:any) => item.word),
        mergeMap(group =>  group.pipe(toArray()) )
      )
        .subscribe(g=>{
          WD.push(g);
        });
        WD.forEach(dg=>{
          var dgrow={};
          var title,date,correct=0,userId,listatt=0,pracatt=0,totalatt=0,success=0;
          dgrow['title']=dg[0].title;
          dgrow['date']=dg[0].date;
          dgrow['userId']=dg[0].userId;
          dgrow['word']=dg[0].word;

          dg.forEach(e1 => {
            totalatt=totalatt+1;
            correct=correct+e1['correct'];
            listatt=listatt+e1['listAtt'];
            pracatt=pracatt+e1['pracAtt'];
          });

          dgrow['noofwords']=totalatt;
          dgrow['correct']=correct;
          dgrow['listAtt']=listatt;
          dgrow['pracAtt']=pracatt;
          var per=correct ==0 && pracatt==0?"0%":((correct/pracatt)*100).toFixed(2)+"%";
          dgrow['successrate']=  per;
          this.WordsData.push(dgrow);
        })
        debugger
      }
    }

  }
  onCellClickG3(ev){
    debugger;
    if (ev.columnIndex == 0) {
      this.isShowlbl1 = false;
      this.isShowlbl2 = false;
      this.isShowlbl3 = true;
      this.DatesData=[];
      this.Gridshowno=4;
      this.LabelWord=ev.data.word;
      var filldata=[];
      filldata=this.GroupUserAndTitle.filter(s=>s.userId== ev.data.userId && s[0] == ev.data.title)[0][1].filter(st=>st.date == ev.data.date);
      filldata.forEach((m1:any)=>{
        var per=m1.correct ==0 && m1.pracAtt==0?"0%":((m1.correct/m1.pracAtt)*100).toFixed(2)+"%";
        m1['successrate']=per;
      })
      this.DatesData=filldata;
    }
  }
}
