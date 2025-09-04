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
  DxBulletModule,
  DxTemplateModule,
  DxButtonModule, DxPopupModule, DxPopoverModule, getElement,DxDataGridComponent
} from 'devextreme-angular';

import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';

interface IRange {
  value: Date[];
  label: string;
}


@Component({
  selector: 'app-sentenceslabreport',
  templateUrl: './sentenceslabreport.component.html',
  styleUrls: ['./sentenceslabreport.component.scss']
})
export class SentenceslabreportComponent {
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

  @ViewChild('dataGridVar', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridVar2', { static: false }) dataGrid2: DxDataGridComponent;
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

  private fb:FormBuilder,
) {
    this.companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))
    this.trainerData = JSON.parse(localStorage.getItem("Trainer Login"));
    this.companydata=JSON.parse(localStorage.getItem("company"))

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
      this.getsentencelist(data);
    } else {
      this.filterForm.markAllAsTouched();
    }

  }
  getsentencelist(data:any){
    console.log("+_+++++++___()E(EFMEFNE)################")
    this.apiService.CommonApi(Apiconfig.sentencescalllabforsentences.method, Apiconfig.sentencescalllabforsentences.url,data ).subscribe(
      (result) => {
        if (result) {   
          debugger;
          this.showbathlist=true 
          console.log(result) 

          result.data.forEach(s=>{
            var noofwords=0;
            var correctno=0;
            var listenatmpno=0;
            var pracattno=0;
            var score=0;
            var time=0;
            var lastScore=0;
            //For 1st grid
            s.sendata.forEach(a=>{
              if(a['pracatt']==undefined){
                a['pracatt']=0
              }
              noofwords=noofwords+1;
              correctno=correctno+a['correct'];
              listenatmpno=listenatmpno+a['listatt'];
              pracattno=pracattno+a['pracatt'];
              score=score+a['score'];
              time=time+a['time'];
              lastScore=lastScore+a['lastScore'];
              a['loadmain']=a['main']+" - "+a['load'];
              //s['successrate']=((correctno/noofwords)*100).toFixed(2)+"%";
            });
            
            s['noofwords'] = noofwords;
            s['noofwords'] = noofwords;
            s['correct'] = correctno;
            s['listatt'] = listenatmpno;
            s['pracatt'] = pracattno;
            s['time']=time;
            s['score']=score.toFixed(2);
            s['successrate'] = (Math.round((correctno/noofwords)*100)).toString() + "%";
            s['lastScore']=Math.floor(lastScore/noofwords)+"%";
          });
          this.RootData=result.data
          // // this.loadCard_Details(result.all,result.active,result.inactive,result.delete)    
         // this.source.load(result.data);
          //this.count = result.count;

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
 
    this.showbathlist = false;
  
    this.storeddata = null;
    this.filterForm.markAsPristine()
    this.filterForm.reset();
    // Clear the data from localStorage
    localStorage.removeItem('batchRequestData');
  }
  GroupTitleDate:any[]=[];
  UsernameClicked(e) {
    this.LabelLernername=e.data.username[0].toUpperCase()+ e.data.username.slice(1)
    this.isShowlbl1=true;
    this.Gridshowno=2;
    debugger;
    this.GroupTitleDate = [];
    var res = this.RootData;
    var user = this.RootData.filter(o => o._id == e.data._id)[0];
    //var calldata = user.caldata;
    var sentdata = user.sendata;
    //calldata=calldata.map(obj => ({ ...obj, type: 'Call Flow' }))
    sentdata=sentdata.map(obj => ({ ...obj, type: 'Sentense Lab' }))

    var mergeddata = [...sentdata];

    from(mergeddata).pipe(
      groupBy((item: any) => item.loadmain),
      mergeMap(group => zip(of(group.key), group.pipe(toArray())))
    ).subscribe(g => {
      debugger;
      from(g[1]).pipe(
        groupBy((item: any) => item.dateTime),
        mergeMap(group => zip(of(group.key), group.pipe(toArray())))
      ).subscribe(g1 => {
        debugger;
        var dgrow = {};
        dgrow['loadmain'] =g[0];
        dgrow['loadmain2'] =g[0];

        dgrow['date'] = g1[0]
        var noofsentences = 0, listatt = 0, pracatt = 0, lastScore = 0, score;
        g1[1].forEach(g2 => {
          debugger;
          noofsentences = noofsentences + 1;
          listatt = listatt + g2['listatt'];
          pracatt = pracatt + g2['pracatt'];
          lastScore = lastScore + g2['lastScore'];
          score = score + g2['score'];
        })
        dgrow['userId']=e.data._id;
        dgrow['noofsentences'] = noofsentences;
        dgrow['listatt'] = listatt;
        dgrow['pracatt'] = pracatt;
        dgrow['lastScore'] = Math.round(lastScore/noofsentences);
        dgrow['score'] = Math.round(score);
        dgrow['type'] = g1[1][0].type;

        this.GroupTitleDate.push(dgrow);
      });

    });
  }
  SentenseData:any[]=[];
  onCellClickG2(ev){
    debugger;
    if (ev.columnIndex == 1) {
      this.SentenseData=[];
      this.Gridshowno=3;
      var filldata=[];
      var crow=null;
      this.isShowlbl1=false;
      this.isShowlbl2=true;
      this.isShowlbl3=false;

      if (!isNaN(Date.parse(ev.value))) {
        this.LabelGroupOrDate=`${ev.data.date} (${ev.data.loadmain2})`;
        crow=ev.data;
        //filldata=this.RootData.filter(s=>s.userId== ev.data.userId && s[0] == ev.data.title)[0][1].filter(st=>st.date == ev.data.date);
      }
      else {
        //Category clicked
        if(ev.data.items ==null){
          crow=ev.data.collapsedItems[0]
          //filldata=this.RootData.filter(s=>s.userId== ev.data.collapsedItems[0].userId && s[0] == ev.data.key)[0][1];
        }
        else{
          crow=ev.data.items[0]

          //filldata=this.RootData.filter(s=>s.userId== ev.data.items[0].userId && s[0] == ev.data.key)[0][1];
        }
        this.LabelGroupOrDate=ev.data.key;
      }
      
      var user = this.RootData.filter(o => o._id == crow.userId)[0];
      //var calldata = user.caldata;
      var sentdata = user.sendata;
      var mergeddata = [...sentdata];
      if (!isNaN(Date.parse(ev.value))) {
        mergeddata= mergeddata.filter(s=>s.dateTime==ev.value)
      }

      from(mergeddata.filter(s=>s.loadmain==crow.loadmain)).pipe(
        groupBy((item: any) => item.sentence),
        mergeMap(group => zip(of(group.key), group.pipe(toArray())))
      ).subscribe(g1 => {
        debugger;
        var dgrow = {};
        dgrow['sentence'] = g1[0];
        dgrow['loadmain'] =crow.loadmain;
        var noofsentences = 0, listatt = 0, pracatt = 0, lastScore = 0, score;
        g1[1].forEach(g2 => {
          debugger;
          noofsentences = noofsentences + 1;
          listatt = listatt + g2['listatt'];
          pracatt = pracatt + g2['pracatt'];
          lastScore = lastScore + g2['lastScore'];
          score = score + g2['score'];
        })
        dgrow['userId']=crow.userId;
        dgrow['noofsentences'] = noofsentences;
        dgrow['listatt'] = listatt;
        dgrow['pracatt'] = pracatt;
        dgrow['lastScore'] = Math.round(lastScore/noofsentences)+"%";
        dgrow['score'] = Math.round(score);
        this.SentenseData.push(dgrow);
      });
    }
  }
  WordsData:any[]=[];
  onCellClickG3(ev){
    debugger;
    this.WordsData=[];
    this.Gridshowno=4;
    this.LabelWord=ev.data.sentence;
    this.isShowlbl1 = false;
    this.isShowlbl2 = false;
    this.isShowlbl3 = true;
    debugger;
    var user = this.RootData.filter(o => o._id == ev.data.userId)[0];
    //var calldata = user.caldata;
    var sentdata = user.sendata;
    var mergeddata = [...sentdata];
    var res1=mergeddata.filter(s=>s.sentence==ev.data.sentence && s.loadmain==ev.data.loadmain);
    var res2=JSON.stringify(res1);
    var res=JSON.parse(res2);
    res.forEach(s=>{
      var cols=Object.keys(s.focusWord);
      cols.forEach(c => {
        var row={};
        row['dateTime']=s.dateTime;
        var fword1 =  s.focusWord[c];
        var fword=fword1[Object.keys(fword1)[0]]
        var timekey=Object.keys(fword1)[0].split('T')[1]
        row['words'] = "";
        row['timepart'] = c;
        row['timepart2'] =timekey// c.split(':')[0]+":"+c.split(':')[1];

        if (fword) {
          var index = fword.indexOf("NA");
          if (index !== -1) {
            fword.splice(index, 1);
          }

          //fword.pop()
          row['lastScore']="0%";
          if(Number.isInteger(fword.at(-1))){
            row['lastScore'] =Math.floor(fword.at(-1))+"%";
          }
          //row['lastScore'] =Math.floor(fword.at(-1))+"%";
          index = fword.indexOf(fword.at(-1));
          if (index !== -1) {
            fword.splice(index, 1);
          }
          row['words'] = fword.join(', ');
          this.WordsData.push(row);
        }
      });

      // if(s.lastAttempt){
      //   var timepart=new Date(s.lastAttempt);
      //   var tim= timepart.getHours()+":"+timepart.getMinutes()+":"+timepart.getSeconds();
      //   s['words']= s.focusWord[tim].join(', ');
      //   s['timepart']=timepart.getHours()+":"+timepart.getMinutes();
      // }
      // else{
      //   s['words']='';
      //   s['timepart']='';
      // }
      
    })
  }
  customizeTooltip = ({ originalValue }: Record<string, string>) => ({ text: `${parseInt(originalValue)}%` });
  BacktoMain() {
    this.isShowlbl1 = false;
    this.isShowlbl2 = false;
    this.isShowlbl3 = false;

    this.Gridshowno = 1;
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
}
