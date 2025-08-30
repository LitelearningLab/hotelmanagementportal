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
//import data from 'src/app/menu/privilages';
import { ChartOptions, ChartType, ChartDataset, plugins ,ChartConfiguration} from 'chart.js';
import { Colors } from "src/app/_helpers/colors.service";
import moment from 'moment';
import { sum } from 'firebase/firestore';
import {
  Chart,
  registerables
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { json } from 'stream/consumers';
Chart.register(...registerables, ChartDataLabels);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  companynames: any[] = [];
  SelectedCompany="";
  ComanyDetails:any={};
  LearningHoursCount:number=0;
  LearningHoursCount2:number=0;

  SentSum:number=0;
  sentWords:number=0;
   SentSum2:number=0;
  sentWords2:number=0;
  UserDetails:any[]=[];

  ProLabData:any[]=[];
  SentenceLabData:any[]=[];
  CallflowData:any[]=[];


  btnRepotCondition=0;
  btnUserRepotCondition=0;

  LH1:any[]=[];
  LH2:any[]=[];
  LH3:any[]=[];
  LH4:any[]=[];

  Last4WeekNos:any[]=[ {'WeekNo': (new Date(new Date().setDate(new Date().getDate()-27)).getFullYear()).toString()+'-'+ (moment(new Date()).week()-3),'WeekName':'Week 1','Type':'WeekNo'}, {'WeekNo':(new Date(new Date().setDate(new Date().getDate()-14)).getFullYear()).toString()+'-'+ (moment(new Date()).week()-2),'WeekName':'Week 2','Type':'WeekNo'},{'WeekNo':(new Date(new Date().setDate(new Date().getDate()-7)).getFullYear()).toString()+'-'+(moment(new Date()).week()-1),'WeekName':'Week 3','Type':'WeekNo'},{'WeekNo':new Date().getFullYear()+'-' +moment(new Date()).week(),'WeekName':'Week 4','Type':'WeekNo'}]
  MonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  barChartOptions1 = {
    //scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        ticks: {
          autoSkip: false
        }
      },
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Learning Hours - Consolidated' },
    }
  };
  barChartOptions2: ChartOptions  = {
    //scaleShowVerticalLines: false,
    responsive: true,
     maintainAspectRatio: false,
     scales: {
      x: {
      stacked: false,
      ticks: {
        autoSkip: false
      }
    },
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        title: { display: true, text: 'Attempts' }
      },
      y1: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 100,
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Success Score (%)' },
        ticks: {
          stepSize: 20,
          callback: function(value, index, values) {
              return value + " %";
          }            
        }
      }
    },
    plugins: {
      legend: { position: 'top',labels: {
          usePointStyle: false // Set to false for box, true for line/circle
        } 
      },
      title: { display: true, text: 'Pronunciation Practice - Consolidated' },

      // datalabels: {
      //   anchor: 'end',
      //   align: 'end',
      //   formatter: Math.round,
      //   font: {
      //     //weight: 'bold',
      //     size: 14
      //   }
      // }
    }
  };
  barChartOptions3: ChartOptions  = {
    //scaleShowVerticalLines: false,
     maintainAspectRatio: false,
    responsive: true,
     scales: {
      x: {
      stacked: false,
      ticks: {
        autoSkip: false
      }
    },
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        title: { display: true, text: 'Attempts' }
      },
      y1: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 100,
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Success Score (%)' },
        ticks: {
          stepSize: 20,
          callback: function(value, index, values) {
              return value + " %";
          }            
        }
      }
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sentence Practice - Consolidated' },
    }
  };

  barChartOptions4 : ChartConfiguration['options'] = {
    //scaleShowVerticalLines: false,
    responsive: true,
     maintainAspectRatio: false,
     scales: {
      x: {
      stacked: false,
      ticks: {
        autoSkip: false
      }
    },
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
       // title: { display: true, text: 'Attempts' }
      },
      y1: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 100,
        grid: { drawOnChartArea: false },
       // title: { display: true, text: 'Success Score (%)' },
        ticks: {
          stepSize: 20,
          callback: function(value, index, values) {
              return value + " %";
          }            
        },
        
      }
    },
    plugins: {
      // legend: {
      //   labels: {
      //     generateLabels: (chart) => {
      //       return chart.data.datasets.map((dataset, i) => {
      //         const defaultLabel = Chart.defaults.plugins.legend.labels.generateLabels(chart)[i];
      //         return {
      //           ...defaultLabel,
      //           strokeStyle: dataset.borderColor || dataset.backgroundColor,
      //           fillStyle: dataset.backgroundColor,
      //           lineWidth: i === 2 ? 2 : 0,
      //           pointStyle: i === 2 ? 'line' : 'rect'
      //         };
      //       });
      //     }
      //   }
      // },
      legend: { 
        position: 'top',
       },
      title: { display: true, text: 'Utilization - Consolidated' },
    }
  };

  public barChartPlugins = [ChartDataLabels];
  barChartLabels =[];
  barChartLegend = true;
  barChartType = "bar";
  barChartData:any[]=[];

  ProLabBarChartData:any[]=[];
  ProLabBarChartLabels =[];

  SentenceLabBarChartData:any[]=[];
  SentenceLabBarChartLabels =[];

  UsersBarChartData:any[]=[];
  UsersBarChartLabels =[];

  BatchNames:any[]=[];
  cityList:any[]=[];

  ProList=0;
  ProPract=0;
  ProList2=0;
  ProPract2=0;
  SelectedCity="";
  SelectedBatch="";
  SelectedUserId=1;

  companysubadmin: any;
  trainerData:any;
  companydata: any;

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
    this.companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))
    this.trainerData = JSON.parse(localStorage.getItem("Trainer Login"));
    this.companydata=JSON.parse(localStorage.getItem("company"))
  }
  async ngOnInit() {
    debugger;
    this.cityList = [];
    this.ComanyDetails={};
     this.BatchNames=[];

    
    if (this.companysubadmin) {
      this.SelectedCompany=this.companysubadmin.companyid;
      this.getCountry(this.companysubadmin.companyid);
      this.SearchCompany();
    }
    else if (this.trainerData) {
      this.SelectedCompany=this.trainerData.companyid;
      this.getCountry(this.trainerData.companyid);
      this.SearchCompany();
    }
    else if (this.companydata) {
      this.SelectedCompany=this.companydata._id;
      this.getCountry(this.companydata._id);
      this.SearchCompany();
    }
    else{
      this.getcompany();
      this.getDashboardCompaniesReports();
    }
  }
  async getcompany() {
    this.apiService.CommonApi(Apiconfig.getCompanynames.method, Apiconfig.getCompanynames.url, {}).subscribe((result) => {
      this.companynames = result.data;
      this.getCompaniesReport(this.companynames);
    })
  }
  CompaniesReport:any={}
  SortedBySubscriptionCompanies:any=[];
  getCompaniesReport(AllCompanies){
    this.CompaniesReport.Total = AllCompanies.length;
    this.CompaniesReport.Active = AllCompanies.filter(o=> o.status=="1").length;
    //this.CompaniesReport.TotalLicences = AllCompanies.reduce((sum, item) => sum + parseInt(item.activeusers));
    //this.CompaniesReport.TotalAssignedLicences = AllCompanies.reduce((sum, item) => sum + parseInt(item.totalusers));

    this.CompaniesReport.TotalLicences = AllCompanies.reduce((sum, item) => sum + (parseInt( item.activeusers) || 0), 0);
    this.CompaniesReport.TotalAssignedLicences = AllCompanies.reduce((sum, item) => sum + (item.totalusers || 0), 0);
    let compstr=JSON.stringify(AllCompanies);
    let compobj=JSON.parse(compstr)
    this.SortedBySubscriptionCompanies= compobj.sort((a, b) => new Date(a.subscriptionenddate).getTime() - new Date(b.subscriptionenddate).getTime());

  }
    getCountry(data: any) {
     
    // Reset the lists
    this.cityList = [];
    // Populate lists if data is available
    if(this.companynames.filter(s=>s._id==this.SelectedCompany).length !=0){
      this.cityList=this.companynames.filter(s=>s._id==this.SelectedCompany)[0].countryCity.flatMap(country => country.city);
    }
  }
  async SearchCompany() {
    debugger
    if (this.SelectedCompany != "") {
      this.ResetAll();
      this.BatchNames=[];
      this.ComanyDetails={};
      this.apiService.CommonApi(Apiconfig.getCompnay.method, Apiconfig.getCompnay.url, { data: this.SelectedCompany }).subscribe((result) => {
        if(result.status==true){
          this.ComanyDetails=result.data;
          
        }
      })
      this.getUserDetails();
   
    }
  }
  pageloadfilter(){
  
    let threemonths = new Date();
    threemonths.setMonth(threemonths.getMonth() - 3);

    let learningform = {};
    learningform['startdate'] = threemonths;
    learningform['enddate'] = new Date();

    learningform['ustartdate'] = "";
    learningform['ustartdate'] = "";
    learningform['company'] = this.SelectedCompany;

    this.getReports(learningform);

  }
  getReports(data:any){
    this.LearningHoursCount=0;
    this.sentWords=0;
    this.SentSum=0;
    this.LearningHours(data);
    this.PronunciationReport(data);
    this.SentenceLapReport(data);
  }
  async getUserDetails(){
    this.btnUserRepotCondition=1;
    this.UsersBarChartData =[];
    this.UsersBarChartLabels=[];
    let data={'Company':this.SelectedCompany};
    
    this.apiService.CommonApi(Apiconfig.getDashboardUsersReports.method,Apiconfig.getDashboardUsersReports.url,data).subscribe((result)=>{
      this.pageloadfilter();
      if(result.status){
   
        this.UserDetails=result.data;
        this.UserDetails.forEach(element => {
          var cdt=new Date((element.createAt._seconds*1000) + (element.createAt._nanoseconds/1000000));
          element['CreatedOn'] = cdt;
          element['WeekNo'] = cdt.getFullYear()+'-'+moment(cdt).week()
          element['MonthNo'] = cdt.getFullYear()+'-'+(cdt.getMonth()+1);
          
        });
        this.getUserDetailsFilter();
    
      }
    })
  }
  getUserDetailsFilter() {
    this.UsersBarChartData =[];
    this.UsersBarChartLabels=[];
    let arr1 = []; let arr2 = []; let arr3=[]; let LabelNames = [];
    let LH1D=this.UserDetails;
    debugger;
    if(this.SelectedCity !=""){
      LH1D=LH1D.filter(ss=>ss.city && ss.city.toLowerCase()==this.SelectedCity.toLowerCase() );
    }
    // if(this.SelectedBatch !=""){
    //   LH1D=LH1D.filter(ss=>ss.batch && ss.batch.toLowerCase()==this.SelectedBatch.toLowerCase() );
    // }

   if(this.SelectedUserId !=1){
      let filterdUsers=[];
      if(this.SelectedUserId==2){
        filterdUsers=LH1D.filter(ll=>  ll.joindate && moment(new Date()).diff(new Date(ll.joindate),'days') <= 90 )
      }
      else{
        filterdUsers=LH1D.filter((ll:any)=> ll.joindate && moment(new Date()).diff(new Date(ll.joindate),'days') >= 90 )
      }
      if(filterdUsers.length !=0){
        let userids= filterdUsers.map(item => item._id);
        LH1D=LH1D.filter(ss=> userids.includes(ss._id)  );
      }
      else{
        //this.notifyService.showError("");
        return;
      }
    }

    this.Last4WeekNos.forEach(a => {
      debugger;
      LabelNames.push(a.WeekName);
      let rest1 = LH1D.filter(k => k[a.Type] <= a.WeekNo && k.status == "1" && k.firstTImeLogin).length;
      let rest2 = LH1D.filter(k => k[a.Type] <= a.WeekNo && k.status == "1").length;
      let uti=Math.floor((rest1/rest2)*100);
      uti=Number.isNaN(uti)?0:uti;
      arr1.push(rest1);
      arr2.push(rest2);
      arr3.push(uti);

    });
    let bar1 = { data: arr2, label: 'Total Assigned Users',backgroundColor:'#7AB2B1' }
    let bar2 = { data: arr1, label: 'Active Users',backgroundColor:'#60A876' }
    this.UsersBarChartData.push(bar1);
    this.UsersBarChartData.push(bar2);

    var resss = {
      type: 'line' as const,
      label: 'Utilization%',
      data: arr3,
      borderColor: 'blue',
      backgroundColor: 'transparent',
      pointBackgroundColor: 'blue',
      pointStyle: 'triangle',
      pointRadius: 10,
      align: 'top',
      yAxisID: 'y1',
      useLineStyle: true,
      datalabels: {
        anchor: 'end',
        align: 'bootom',
        font: {
          //weight: 'bold',
          size: 11
        }
      },
      
    }
    this.UsersBarChartData.push(resss);

    this.UsersBarChartLabels = LabelNames;
  }
  LearningHours(data) {
    this.barChartData=[];
    this.barChartLabels=[];
    this.btnRepotCondition=1;
    this.apiService.CommonApi(Apiconfig.learninghoursReportlistDashboard.method, Apiconfig.learninghoursReportlistDashboard.url, data).subscribe(
      (result) => {
        debugger;
        
        let arsum = result.data.AR.reduce((n, { totalPracticeTime }) => n + totalPracticeTime, 0);
        let ProFluesum = result.data.ProFlue.reduce((n, { totalPracticeTime }) => n + totalPracticeTime, 0);
        let ProcessLernsum = result.data.ProcessLern.reduce((n, { totalPracticeTime }) => n + totalPracticeTime, 0);
        let Softskillsum = result.data.Softskill.reduce((n, { totalPracticeTime }) => n + totalPracticeTime, 0);
        this.LearningHoursCount = arsum + ProFluesum + ProcessLernsum + Softskillsum;
       
        this.LH1 = result.data.AR;
        this.LH2 = result.data.ProFlue;
        this.LH3 = result.data.ProcessLern;
        this.LH4 = result.data.Softskill;
        this.LH1.forEach(s => {
          var cdt1=new Date(s.lastUpdated._seconds * 1000 + s.lastUpdated._nanoseconds / 1000000);
          s['LastUpdatedOn'] = cdt1;
          s['WeekNo'] = cdt1.getFullYear()+"-"+moment(cdt1).week()
          s['MonthNo'] = cdt1.getFullYear()+'-'+(cdt1.getMonth()+1);
          if (s.batch != "" && s.batch != undefined && !this.BatchNames.includes(s.batch)) {
              this.BatchNames.push(s.batch);
          }
          s['city']=this.UserDetails.filter(m=>m._id==s.userId).length !=0 ?this.UserDetails.filter(m=>m._id==s.userId)[0].city:'';

        });
        this.LH2.forEach(s => {
          var cdt1=new Date(s.lastUpdated._seconds * 1000 + s.lastUpdated._nanoseconds / 1000000);
          s['LastUpdatedOn'] = new Date(s.lastUpdated._seconds * 1000 + s.lastUpdated._nanoseconds / 1000000)
          s['WeekNo'] = cdt1.getFullYear()+"-"+moment(new Date(s.lastUpdated._seconds * 1000 + s.lastUpdated._nanoseconds / 1000000)).week()
          s['MonthNo'] = cdt1.getFullYear()+'-'+(cdt1.getMonth()+1);
          if (s.batch != "" && s.batch != undefined && !this.BatchNames.includes(s.batch)) {
              this.BatchNames.push(s.batch);
          }
          s['city']=this.UserDetails.filter(m=>m._id==s.userId).length !=0 ?this.UserDetails.filter(m=>m._id==s.userId)[0].city:'';
        });
        this.LH3.forEach(s => {
          var cdt1=new Date(s.lastUpdated._seconds * 1000 + s.lastUpdated._nanoseconds / 1000000);
          s['LastUpdatedOn'] = new Date(s.lastUpdated._seconds * 1000 + s.lastUpdated._nanoseconds / 1000000)
          s['WeekNo'] =cdt1.getFullYear()+"-"+moment(new Date(s.lastUpdated._seconds * 1000 + s.lastUpdated._nanoseconds / 1000000)).week()
          s['MonthNo'] = cdt1.getFullYear()+'-'+(cdt1.getMonth()+1);
          if (s.batch != "" && s.batch != undefined && !this.BatchNames.includes(s.batch)) {
              this.BatchNames.push(s.batch);
          }
          s['city']=this.UserDetails.filter(m=>m._id==s.userId).length !=0 ?this.UserDetails.filter(m=>m._id==s.userId)[0].city:'';
        });
        this.LH4.forEach(s => {
          var cdt1=new Date(s.lastUpdated._seconds * 1000 + s.lastUpdated._nanoseconds / 1000000);
          s['LastUpdatedOn'] = new Date(s.lastUpdated._seconds * 1000 + s.lastUpdated._nanoseconds / 1000000)
          s['WeekNo'] = cdt1.getFullYear()+"-"+moment(new Date(s.lastUpdated._seconds * 1000 + s.lastUpdated._nanoseconds / 1000000)).week()
          s['MonthNo'] = cdt1.getFullYear()+'-'+(cdt1.getMonth()+1);
          if (s.batch != "" && s.batch != undefined && !this.BatchNames.includes(s.batch)) {
              this.BatchNames.push(s.batch);
          }
          s['city']=this.UserDetails.filter(m=>m._id==s.userId).length !=0 ?this.UserDetails.filter(m=>m._id==s.userId)[0].city:'';
        });

       this.LearningHoursFilter();

      });
  }
  LearningHoursFilter() {
    this.barChartData=[];
    this.barChartLabels=[];
    let arr1 = []; let arr2 = []; let arr3 = []; let arr4 = []; let LabelNames = [];
    let sarr1 = []; let sarr2 = []; let sarr3 = []; let sarr4 = [];
    let LH1D=this.LH1;
    let LH2D=this.LH2;
    let LH3D=this.LH3;
    let LH4D=this.LH4;
    debugger;
    if(this.SelectedCity !=""){
      LH1D=LH1D.filter(ss=>ss.city && ss.city.toLowerCase()==this.SelectedCity.toLowerCase() );
      LH2D=LH2D.filter(ss=>ss.city && ss.city.toLowerCase()==this.SelectedCity.toLowerCase() );
      LH3D=LH3D.filter(ss=>ss.city && ss.city.toLowerCase()==this.SelectedCity.toLowerCase() );
      LH4D=LH4D.filter(ss=>ss.city && ss.city.toLowerCase()==this.SelectedCity.toLowerCase() );
    }
    if(this.SelectedBatch !=""){
      LH1D=LH1D.filter(ss=>ss.batchName && ss.batchName.toLowerCase()==this.SelectedBatch.toLowerCase() );
      LH2D=LH2D.filter(ss=>ss.batchName && ss.batchName.toLowerCase()==this.SelectedBatch.toLowerCase() );
      LH3D=LH3D.filter(ss=>ss.batchName && ss.batchName.toLowerCase()==this.SelectedBatch.toLowerCase() );
      LH4D=LH4D.filter(ss=>ss.batchName && ss.batchName.toLowerCase()==this.SelectedBatch.toLowerCase() );
    }

    if(this.SelectedUserId !=1){
      let cdt=new Date();
      let monthstoadd=this.SelectedUserId == 2 ? -3 :3;
      //let newDate = new Date(new Date(cdt).setMonth(cdt.getMonth() + monthstoadd));
      let filterdUsers=[];
      if(this.SelectedUserId==2){
        let newDate = new Date(new Date(cdt).setMonth(cdt.getMonth() - 3));
        filterdUsers=this.UserDetails.filter(ll=>  ll.joindate && moment(new Date()).diff(new Date(ll.joindate),'days') <= 90 )
      }
      else{
        let newDate = new Date(new Date(cdt).setMonth(cdt.getMonth() + 3));
        //let a2= moment(newDate).diff(new Date(),'days');
        //let a1= moment(new Date()).diff(newDate,'days');
        //console.log("a1 : ",a1)

        filterdUsers=this.UserDetails.filter((ll:any)=> ll.joindate && moment(new Date()).diff(new Date(ll.joindate),'days') >= 90 )
        //filterdUsers=this.UserDetails.filter(ll=>ll.joindate &&  ( new Date(ll.joindate) >= new Date() &&  new Date(ll.joindate) <= newDate  ) )
      }
      if(filterdUsers.length !=0){
        let userids= filterdUsers.map(item => item._id);
        LH1D=LH1D.filter(ss=> userids.includes(ss.userId)  );
        LH2D=LH2D.filter(ss=> userids.includes(ss.userId) );
        LH3D=LH3D.filter(ss=> userids.includes(ss.userId));
        LH4D=LH4D.filter(ss=> userids.includes(ss.userId) );
      }
      else{
        //this.notifyService.showError("");
        return;
      }
    }
    this.Last4WeekNos.forEach(a => {
      LabelNames.push(a.WeekName);
      let sum1 = LH1D.filter(x => x[a.Type] == a.WeekNo).reduce((n, { totalPracticeTime }) => n + totalPracticeTime, 0);
      let sum2 = LH2D.filter(x => x[a.Type] == a.WeekNo).reduce((n, { totalPracticeTime }) => n + totalPracticeTime, 0);
      let sum3 = LH3D.filter(x => x[a.Type] == a.WeekNo).reduce((n, { totalPracticeTime }) => n + totalPracticeTime, 0);
      let sum4 = LH4D.filter(x => x[a.Type] == a.WeekNo).reduce((n, { totalPracticeTime }) => n + totalPracticeTime, 0);
      sarr1.push(sum1)
      sarr2.push(sum2)
      sarr3.push(sum3)
      sarr4.push(sum4)

      let hours = Math.floor(sum1 / 3600);
      let minutes = Math.floor((sum1 % 3600) / 60);
      arr1.push(parseFloat(hours + "." + minutes));

      hours = 0; minutes = 0;
      hours = Math.floor(sum2 / 3600);
      minutes = Math.floor((sum2 % 3600) / 60);
      arr2.push(parseFloat(hours + "." + minutes));

      hours = 0; minutes = 0;
      hours = Math.floor(sum3 / 3600);
      minutes = Math.floor((sum3 % 3600) / 60);
      arr3.push(parseFloat(hours + "." + minutes));

      hours = 0; minutes = 0;
      hours = Math.floor(sum4 / 3600);
      minutes = Math.floor((sum4 % 3600) / 60);
      arr4.push(parseFloat(hours + "." + minutes));
    });
    debugger;
    // let scoredata=[];
    // let mx1=Math.max(...sarr1);
    // let mx2=Math.max(...sarr2);
    // let mx3=Math.max(...sarr3);
    // let mx4=Math.max(...sarr4);
    // let summx=mx1+mx2+mx3+mx4;

    // scoredata.push((mx1/summx)*100);
    // scoredata.push((mx2/summx)*100);
    // scoredata.push((mx3/summx)*100);
    // scoredata.push((mx4/summx)*100);
    
    let bar3 = { data: arr3, label: 'Process Learning',backgroundColor:'#4CA8D7' }
    let bar1 = { data: arr1, label: 'AR Call Simulations',backgroundColor:'#69D6DD' }
    let bar2 = { data: arr2, label: 'Profluent English',backgroundColor:'#7AB2B1' }
    let bar4 = { data: arr4, label: 'Soft Skills',backgroundColor:'#60A876' }
    this.barChartData.push(bar3);
    this.barChartData.push(bar1);
    this.barChartData.push(bar2);
    this.barChartData.push(bar4);
 
    this.barChartLabels = LabelNames;
   
  }
  
  PronunciationReport(data) {
    this.ProLabBarChartData=[];
    this.ProLabBarChartLabels=[];
    this.apiService.CommonApi(Apiconfig.pronunciationLabReportlistDashboard.method, Apiconfig.pronunciationLabReportlistDashboard.url, data).subscribe(
      (result) => {
        debugger;
        if (result.status == true) {
          result.data.forEach(s => {
            s['LastUpdatedOn'] = new Date(s.lastAttempt);
            s['WeekNo'] = new Date(s.lastAttempt).getFullYear()+"-"+moment(new Date(s.lastAttempt)).week();
            s['MonthNo'] = new Date(s.lastAttempt).getFullYear()+'-'+(new Date(s.lastAttempt).getMonth()+1);
            if (s.batch != "" && !this.BatchNames.includes(s.batch)) {
              this.BatchNames.push(s.batch);
            }
            s['city']=this.UserDetails.filter(m=>m._id==s.userId).length !=0 ?this.UserDetails.filter(m=>m._id==s.userId)[0].city:'';

          });
          this.ProLabData=result.data;
            this.ProList = this.ProLabData.filter(x =>  x.listatt).reduce((n, { listatt }) => n + listatt, 0);
            this.ProPract = this.ProLabData.filter(x => x.pracatt).reduce((n, { pracatt }) => n + pracatt, 0);
          this.PronunciationReportFilter();
        }
      });
  }
  
  PronunciationReportFilter() {
    this.ProLabBarChartData=[];
    this.ProLabBarChartLabels=[];
    let arr1 = []; let arr2 = []; let arr3=[]; let LabelNames = [];
    let LH1D=this.ProLabData;
    debugger
    if(this.SelectedCity !=""){
      LH1D=LH1D.filter(ss=>ss.city && ss.city.toLowerCase()==this.SelectedCity.toLowerCase() );
    }
    if(this.SelectedBatch !=""){
      LH1D=LH1D.filter(ss=>ss.batch && ss.batch.toLowerCase()==this.SelectedBatch.toLowerCase() );
    }

   if(this.SelectedUserId !=1){
      let filterdUsers=[];
      if(this.SelectedUserId==2){
        filterdUsers=this.UserDetails.filter(ll=>  ll.joindate && moment(new Date()).diff(new Date(ll.joindate),'days') <= 90 )
      }
      else{
        filterdUsers=this.UserDetails.filter((ll:any)=> ll.joindate && moment(new Date()).diff(new Date(ll.joindate),'days') >= 90 )
      }
      if(filterdUsers.length !=0){
        let userids= filterdUsers.map(item => item._id);
        LH1D=LH1D.filter(ss=> userids.includes(ss.userId)  );
      }
      else{
        //this.notifyService.showError("");
        return;
      }
    }
    debugger;
    this.Last4WeekNos.forEach(l => {
      LabelNames.push(l.WeekName);
      let res1 = LH1D.filter(x => x[l.Type] == l.WeekNo && x.listatt).reduce((n, { listatt }) => n + listatt, 0);
      let res2 = LH1D.filter(x => x[l.Type] == l.WeekNo && x.pracatt).reduce((n, { pracatt }) => n + pracatt, 0);
      let res3 = LH1D.filter(x => x[l.Type] == l.WeekNo && x.correct).reduce((n, { correct }) => n + correct, 0);

      arr1.push(res1)
      arr2.push(res2)
      let av=Number.isNaN((res3/res2)*100) ? 0 :Math.floor((res3/res2)*100);
      //let xpr:number=parseInt(av)
      arr3.push(av)
    })
    
    let bar1 = { data: arr1, label: 'Listening Attempts',backgroundColor:'#7AB2B1' }
    let bar2 = { data: arr2, label: 'Practice Attempts',backgroundColor:'#60A876' }

    this.ProLabBarChartData.push(bar1);
    this.ProLabBarChartData.push(bar2);

    var resss={
      type: 'line' as const,
      label: 'Success Score',
      usePointStyle: false ,
      data: arr3,
      borderColor: 'blue',
      backgroundColor: 'transparent',
      pointBackgroundColor: 'blue',
      pointStyle: 'triangle',
      pointRadius: 10,
      align: 'top',
      yAxisID: 'y1',
      useLineStyle: true,
      datalabels: {
        anchor: 'end',
        align: 'bootom',
        font: {
          //weight: 'bold',
          size: 11
        }
      }
    }
    this.ProLabBarChartData.push(resss);
    this.ProLabBarChartLabels = LabelNames;
  }
  SentenceLapReport(data) {
    this.SentenceLabBarChartData =[];
    this.SentenceLabBarChartLabels=[];
    this.apiService.CommonApi(Apiconfig.generateSentenceLabReportDashbpard.method, Apiconfig.generateSentenceLabReportDashbpard.url, data).subscribe(
      (result) => {
        //pracatt
        if (result.status == true) {
          let callsums  = result.data.call.filter(p=>p.pracatt).reduce((n, { pracatt }) => n + pracatt, 0);
          let sentsums = result.data.sent.filter(p=>p.pracatt).reduce((n, { pracatt }) => n + pracatt, 0);

          let calllistsums  = result.data.call.filter(p=>p.listatt).reduce((n, { listatt }) => n + listatt, 0);
          let sentlistsums = result.data.sent.filter(p=>p.listatt).reduce((n, { listatt }) => n + listatt, 0);

          this.SentSum = sentsums + callsums;
          this.sentWords = calllistsums + sentlistsums;
          result.data.sent.forEach(s => {
            s['LastUpdatedOn'] = new Date(s.lastAttempt);
            s['WeekNo'] =new Date(s.lastAttempt).getFullYear()+"-"+ moment(new Date(s.lastAttempt)).week();
            s['MonthNo'] = new Date(s.lastAttempt).getFullYear()+'-'+(new Date(s.lastAttempt).getMonth()+1);
            if (s.batch != "" && !this.BatchNames.includes(s.batch)) {
              this.BatchNames.push(s.batch);
            }
            s['city']=this.UserDetails.filter(m=>m._id==s.userId).length !=0 ?this.UserDetails.filter(m=>m._id==s.userId)[0].city:'';
          });
           result.data.call.forEach(s => {
            s['LastUpdatedOn'] = new Date(s.lastAttempt);
            s['WeekNo'] =new Date(s.lastAttempt).getFullYear()+"-"+ moment(new Date(s.lastAttempt)).week();
            s['MonthNo'] = new Date(s.lastAttempt).getFullYear()+'-'+(new Date(s.lastAttempt).getMonth()+1);
             if (s.batch != "" && !this.BatchNames.includes(s.batch)) {
              this.BatchNames.push(s.batch);
            }
            s['city']=this.UserDetails.filter(m=>m._id==s.userId).length !=0 ?this.UserDetails.filter(m=>m._id==s.userId)[0].city:'';

          });
          this.SentenceLabData=result.data.sent;
          this.CallflowData=result.data.call;

          this.SentenceLapReportFilter();
        }
      });
  }
  SentenceLapReportFilter() {
    this.SentenceLabBarChartData =[];
    this.SentenceLabBarChartLabels=[];

    let arr1 = []; let arr2 = []; let arr3=[]; let LabelNames = [];
    let LH1D=this.SentenceLabData;
    let LH2D=this.CallflowData;

    if(this.SelectedCity !=""){
      LH1D=LH1D.filter(ss=>ss.city && ss.city.toLowerCase()==this.SelectedCity.toLowerCase() );
      LH2D=LH2D.filter(ss=>ss.city && ss.city.toLowerCase()==this.SelectedCity.toLowerCase() );
    }
    if(this.SelectedBatch !=""){
      LH1D=LH1D.filter(ss=>ss.batch && ss.batch.toLowerCase()==this.SelectedBatch.toLowerCase() );
      LH2D=LH2D.filter(ss=>ss.batch && ss.batch.toLowerCase()==this.SelectedBatch.toLowerCase() );
    }
    if(this.SelectedUserId !=1){
      let filterdUsers=[];
      if(this.SelectedUserId==2){
        filterdUsers=this.UserDetails.filter(ll=>  ll.joindate && moment(new Date()).diff(new Date(ll.joindate),'days') <= 90 )
      }
      else{
        filterdUsers=this.UserDetails.filter((ll:any)=> ll.joindate && moment(new Date()).diff(new Date(ll.joindate),'days') >= 90 )
      }
      if(filterdUsers.length !=0){
        let userids= filterdUsers.map(item => item._id);
        LH1D=LH1D.filter(ss=> userids.includes(ss.userId)  );
        LH2D=LH2D.filter(ss=> userids.includes(ss.userId)  );

      }
      else{
        //this.notifyService.showError("");
        return;
      }
    }
    this.Last4WeekNos.forEach(l => {
      LabelNames.push(l.WeekName);
      let res1 = LH1D.filter(x => x[l.Type] == l.WeekNo && x.listatt).reduce((n, { listatt }) => n + listatt, 0);
      let res2 = LH2D.filter(x => x[l.Type] == l.WeekNo && x.listatt).reduce((n, { listatt }) => n + listatt, 0);

      let res3 = LH1D.filter(x => x[l.Type] == l.WeekNo && x.pracatt).reduce((n, { pracatt }) => n + pracatt, 0);
      let res4 = LH2D.filter(x => x[l.Type] == l.WeekNo && x.pracatt).reduce((n, { pracatt }) => n + pracatt, 0);

      let score=0;
      let rowcnt=0;
      debugger;
      LH1D.filter(x => x[l.Type] == l.WeekNo && x.focusWord).forEach(kl=>{
         var cols=Object.keys(kl.focusWord);
         if(cols.length !=0){
            rowcnt=rowcnt+1;
         }
         score=score+kl.score/cols.length
      });
      let score1=0;
      let rowcnt1=0;
     LH2D.filter(x => x[l.Type] == l.WeekNo && x.focusWord).forEach(kl=>{
         var cols=Object.keys(kl.focusWord);
         if(cols.length !=0){
            rowcnt1=rowcnt1+1;
         }
         score1=score1+kl.score/cols.length
      });
      arr1.push(res1 + res2);
      arr2.push(res3 + res4);
      
      let av=Number.isNaN((score/rowcnt)) ? 0 :Math.floor((score/rowcnt));
      let av2=Number.isNaN((score1/rowcnt1)) ? 0 :Math.floor((score1/rowcnt1));

      arr3.push(Math.floor(((av+av2)/2)));
    });
    debugger;
    let bar1 = { data: arr1, label: 'Listening Attempts',backgroundColor:'#7AB2B1' }
    let bar2 = { data: arr2, label: 'Practice Attempts',backgroundColor:'#60A876' }
    this.SentenceLabBarChartData.push(bar1);
    this.SentenceLabBarChartData.push(bar2);
     var resss={
      type: 'line' as const,
      label: 'Success Score',
      data: arr3,
      borderColor: 'blue',
      backgroundColor: 'transparent',
      pointBackgroundColor: 'blue',
      pointStyle: 'triangle',
      rotation:1,
      pointRadius: 12,
      align: 'left',
      yAxisID: 'y1',
      usePointStyle: true,
      useLineStyle: true,
      datalabels: {
        anchor: 'end',
        align: 'bootom',
        font: {
          size: 11
        }
      }
    }
    this.SentenceLabBarChartData.push(resss);
    this.SentenceLabBarChartLabels = LabelNames;
  }
  SearchType2(setype:string){
    
    debugger
    if(setype == "1"){
      this.Last4WeekNos=[ {'WeekNo': (new Date(new Date().setDate(new Date().getDate()-27)).getFullYear()).toString()+'-'+ (moment(new Date()).week()-3),'WeekName':'Week 1','Type':'WeekNo'}, {'WeekNo':(new Date(new Date().setDate(new Date().getDate()-14)).getFullYear()).toString()+'-'+ (moment(new Date()).week()-2),'WeekName':'Week 2','Type':'WeekNo'},{'WeekNo':(new Date(new Date().setDate(new Date().getDate()-7)).getFullYear()).toString()+'-'+(moment(new Date()).week()-1),'WeekName':'Week 3','Type':'WeekNo'},{'WeekNo':new Date().getFullYear()+'-' +moment(new Date()).week(),'WeekName':'Week 4','Type':'WeekNo'}]

      //this.Last4WeekNos=[ {'WeekNo':moment(new Date()).week()-3,'WeekName':'Week 1','Type':'WeekNo'}, {'WeekNo':moment(new Date()).week()-2,'WeekName':'Week 2','Type':'WeekNo'},{'WeekNo':moment(new Date()).week()-1,'WeekName':'Week 3','Type':'WeekNo'},{'WeekNo':moment(new Date()).week(),'WeekName':'Week 4','Type':'WeekNo'}]
      this.btnRepotCondition=1;
      this.CallFilterMethods();
    }
    else if(setype == "2"){
      this.SetMonths(2);
      this.btnRepotCondition=2;

    }
    else if(setype == "3"){
      this.SetMonths(5);
      this.btnRepotCondition=3;
    } 
    else if(setype == "4"){
      this.SetMonths(12);
      this.btnRepotCondition=4;
    }
  }
  SetMonths(monthNo) {
    const result = [];
    const today = new Date();
    for (let i = monthNo; i >= 0; i--) {
      const pastDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthNumber = pastDate.getMonth() + 1;
      const year= pastDate.getFullYear()
      const monthName = this.MonthNames[pastDate.getMonth()];
      result.push({ WeekNo: year+'-'+monthNumber, WeekName: monthName,'Type':'MonthNo' });
    }
    this.Last4WeekNos=result;
    this.CallFilterMethods();
  }
  CallFilterMethods(){
    this.LearningHoursFilter();
    this.SentenceLapReportFilter();
    this.PronunciationReportFilter();
    this.getUserDetailsFilter();
  }
  CityChange(){
    this.CallFilterMethods();
  }
  BatchChange() {
    this.CallFilterMethods();
  }

  UserSearch(tid){
    this.btnUserRepotCondition=parseInt(tid);
    this.SelectedUserId=parseInt(tid);
    this.CallFilterMethods();
  }
  ResetAll(){
    this.Last4WeekNos=[ {'WeekNo': (new Date(new Date().setDate(new Date().getDate()-27)).getFullYear()).toString()+'-'+ (moment(new Date()).week()-3),'WeekName':'Week 1','Type':'WeekNo'}, {'WeekNo':(new Date(new Date().setDate(new Date().getDate()-14)).getFullYear()).toString()+'-'+ (moment(new Date()).week()-2),'WeekName':'Week 2','Type':'WeekNo'},{'WeekNo':(new Date(new Date().setDate(new Date().getDate()-7)).getFullYear()).toString()+'-'+(moment(new Date()).week()-1),'WeekName':'Week 3','Type':'WeekNo'},{'WeekNo':new Date().getFullYear()+'-' +moment(new Date()).week(),'WeekName':'Week 4','Type':'WeekNo'}]
    this.btnUserRepotCondition=1;
    this.btnRepotCondition=1;
    this.SelectedCity="";
    this.SelectedBatch="";
  }
  async getDashboardCompaniesReports() {
    this.apiService.CommonApi(Apiconfig.getDashboardCompaniesReports.method, Apiconfig.getDashboardCompaniesReports.url, null).subscribe(
      (result) => {
        debugger;
        let arsum = result.data.retdata.AR.reduce((n, { totalPracticeTime }) => n + totalPracticeTime, 0);
        let ProFluesum = result.data.retdata.ProFlue.reduce((n, { totalPracticeTime }) => n + totalPracticeTime, 0);
        let ProcessLernsum = result.data.retdata.ProcessLern.reduce((n, { totalPracticeTime }) => n + totalPracticeTime, 0);
        let Softskillsum = result.data.retdata.Softskill.reduce((n, { totalPracticeTime }) => n + totalPracticeTime, 0);
        this.LearningHoursCount2 = arsum + ProFluesum + ProcessLernsum + Softskillsum;
        this.ProList2 = result.data.prolabres.filter(x => x.listatt).reduce((n, { listatt }) => n + listatt, 0);
        this.ProPract2 = result.data.prolabres.filter(x => x.pracatt).reduce((n, { pracatt }) => n + pracatt, 0);

        let callsums = result.data.call.filter(p => p.pracatt).reduce((n, { pracatt }) => n + pracatt, 0);
        let sentsums = result.data.sent.filter(p => p.pracatt).reduce((n, { pracatt }) => n + pracatt, 0);

        let calllistsums = result.data.call.filter(p => p.listatt).reduce((n, { listatt }) => n + listatt, 0);
        let sentlistsums = result.data.sent.filter(p => p.listatt).reduce((n, { listatt }) => n + listatt, 0);

        this.SentSum2 = sentsums + callsums;
        this.sentWords2 = calllistsums + sentlistsums;

      });
  }
}
