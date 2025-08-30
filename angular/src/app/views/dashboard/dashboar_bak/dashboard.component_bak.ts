import { Component, OnInit } from '@angular/core';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { ApiService } from 'src/app/_services/api.service';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { Colors } from "src/app/_helpers/colors.service";
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component_bak.html',
  styleUrls: ['./dashboard.component_bak.scss']
})
export class DashboardComponentBak implements OnInit {
  orderstatics: any = 7;
  dates: any;
  from: any;
  to: any;
  month: any;
  day: any;
  date: any;
  todate: any;
  todayOrder: any = {
    total_orders: 0 as Number,
    completedOrderDetails: {
      count: 0 as Number,
      orderDetails: [] as any,
    },
    newOrderDetails: {
      count: 0 as Number,
      orderDetails: [] as any,
    },
    restaurantAcceptOrderDetails: {
      count: 0 as Number,
      orderDetails: [] as any,
    },
    driverAcceptedOrderDetails: {
      count: 0 as Number,
      orderDetails: [] as any,
    },
    driverPickedUpOrderDetails: {
      count: 0 as Number,
      orderDetails: [] as any,
    },
    userRejectedOrderDetails: {
      count: 0 as Number,
      orderDetails: [] as any,
    },
    driverRejectedOrderDetails: {
      count: 0 as Number,
      orderDetails: [] as any,
    },
    adminRejectedOrderDetails: {
      count: 0 as Number,
      orderDetails: [] as any,
    },
  }
  grand_total: any;
  restaurant_total: any;
  tax_total: any;
  delivery_amount: any;
  coupon_total: any;
  dashBoardDetails: any = {
    orders: 0 as Number,
    completedOrders: 0 as Number,
    inprogressOrders: 0 as Number,
    users: 0 as Number,
    activeUsers: 0 as Number,
    inactiveUsers: 0 as Number,
    subscription: 0 as Number,
    approvedDrivers: 0 as Number,
    unapprovedDrivers: 0 as Number,
    onlineDrivers: 0 as Number,
    oflineDrivers: 0 as Number,
    products: 0 as Number,
    allReport: 0 as Number,
    unrecommended: 0 as Number,
    activeproducts: 0 as Number,
    inactiveproducts: 0 as Number,
  };

  constructor(
    private apiService: ApiService,
    public datepipe: DatePipe
  ) { }

  public barChartOptions: ChartOptions = {
    responsive: true,
  devicePixelRatio: 2.2,
  scales: {
    x: {
      ticks: {
        display: true,
        maxTicksLimit: 20,
      },
      grid: {
        tickLength: 15,
        color: '#9da0a2',
        drawOnChartArea: false,
      },
      title: {
        display: true,
        text: '',
      },
    },
    y: {
      ticks: {
        display: true,
      },
      title: {
        display: true,
        text: '',
      },
      grid: {
        tickLength: 0,
        color: '#9da0a2',
        drawOnChartArea: false,
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'right',
      reverse: true,
      labels: {
        color: 'black',
        font: {
          size: 15,
        },
        padding: 20,
        usePointStyle: true,
        boxWidth: 9,
      },
    },
  }
  };
  public barChartLabels: any = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartData: ChartDataset[] = [
    { barPercentage: 0.3, data: [], label: 'Orders', },
  ];
  public barChartColors: any[] = [
    { backgroundColor: Colors.getColors().themeColor7 },
  ];

  ngOnInit(): void {
    console.log('asdasdasdddd  dashboard');
    
    var date = new Date();
    let dataFrom = new Date(new Date().setDate(date.getDate() - 6));
    var from_date = date.setUTCHours(0,0,0,0);
    var to_date = date.setUTCHours(23,59,59,0);
    this.from =dataFrom.toISOString();
    this.to = date.toISOString();
    this.month = true;
    this.day = false;
    this.getDays(new Date(dataFrom), new Date(date))
    this.barChartLabels = this.dates;
    this.apiService.CommonApi(Apiconfig.dashboard_get.method, Apiconfig.dashboard_get.url, {}).subscribe(
      (result) => {
        this.dashBoardDetails = result.statistics;        
      }, (error) => {
        console.log(error);
      }
    );
      var today_orders = {
        from_date: from_date,
        to_date: to_date,
        month : false,
        day: true
      }
    this.apiService.CommonApi(Apiconfig.dashboard_today_Order.method, Apiconfig.dashboard_today_Order.url+ '?from_date=' + from_date+'&to_date=' +to_date, {}).subscribe(
      (result) => {
        this.todayOrder = result;
        this.grand_total = result.grand_total.toFixed(2);
        this.restaurant_total = result.restaurant_total.toFixed(2);
        this.tax_total = result.tax_total.toFixed(2);
        this.delivery_amount = result.delivery_amount.toFixed(2);
        this.coupon_total = result.coupon_total.toFixed(2);
      }, (error) => {
        console.log(error);
      }
    );
    this. getOrderStatics()
    // var url = 'dashboard/orderstats?from=' + this.from + '&to=' + this.to + '&month=' + this.month + '&day=' + this.day;
    // this.apiService.CommonApi(Apiconfig.dashboard_orderstats.method, url, {}).subscribe(
    //   (result) => {
    //     let dataset = result.map(x => x.count);
    //     this.barChartData[0].data = dataset.reverse();
    //   }, (error) => {
    //     console.log(error);
    //   }
    // );
  }

  onChangeOrderStatics(value) {
    if (value == '7') {
      var date = new Date();
      let dataFrom = new Date(new Date().setDate(date.getDate() - 6));
      this.from = dataFrom.toISOString()
      this.to = date.toISOString()
      this.month = false;
      this.day = true;
      this.getOrderStatics()
      this.getDays(new Date(dataFrom), new Date(date))
      this.barChartLabels = this.dates;
    }
    if (value == '30') {
      var date = new Date();
      let dataFrom = new Date(new Date().setMonth(date.getMonth() - 1));
      this.from = dataFrom.toISOString()
      this.to = date.toISOString()
      this.month = true;
      this.day = true;
      this.getMonth(new Date(this.from), new Date(this.to))
      this.getOrderStatics();      
      this.barChartLabels = this.dates;
    }
    if (value == '180') {
      var date = new Date();
      let dataFrom = new Date(new Date().setMonth(date.getMonth() - 5));
      this.from = dataFrom.toISOString()
      this.to = date.toISOString()
      this.month = true;
      this.day = false;
      this.getMonths(this.from, this.to)
      this.getOrderStatics()
      this.barChartLabels = this.dates;
    }
    if (value == '365') {
      var date = new Date();
      let dataFrom = new Date(new Date().setMonth(date.getMonth() - 11));
      this.from = dataFrom.toISOString()
      this.to = date.toISOString()
      this.month = true;
      this.day = false;
      this.getMonths(this.from, this.to)
      this.getOrderStatics()
      this.barChartLabels = this.dates;    
    }
  }
 
  getDays(startdate, enddate) {
    const date = new Date(startdate.getTime());
    this.dates = [];
    while (date <= enddate) {
      var data = this.datepipe.transform(date, 'dd-MM-yyyy')
      this.dates.push(data);
      date.setDate(date.getDate() + 1);
    }
    return this.dates;
  }
  getMonth(startdate, enddate) {
    const date = new Date(startdate.getTime());
    this.dates = [];
    while (date <= enddate) {
      var data = this.datepipe.transform(date, 'dd-MM-yyyy')
      this.dates.push(data);
      date.setDate(date.getDate() + 1);
    }
    return this.dates;
  }
  getMonths(startdate, enddate) {    
    var start = startdate.split('-');
    var end = enddate.split('-');
    var startYear = parseInt(start[0]);
    var endYear = parseInt(end[0]);
    this.dates = [];
    for (var i = startYear; i <= endYear; i++) {
      var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
      var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
      for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
        var month = j + 1;
        var displayMonth = month < 10 ? '0' + month : month;
       var data= moment(displayMonth,'MM').format('MMM')
        this.dates.push([data,i ].join('-'));
      }
    }
    return this.dates;
  }
  getOrderStatics() {
    this.barChartData[0].data=[]
    var url = 'dashboard/orderstats?from=' + this.from + '&to=' + this.to + '&month=' + this.month + '&day=' + this.day;
    this.apiService.CommonApi("get", url, {}).subscribe(
      (result) => {
        let dataset = result.map(x => x.count);
        for (let index = 0; index < result.length; index++) {
          for (let i = 0; i < this.barChartLabels.length; i++) {
            if((this.barChartLabels[i] == this.datepipe.transform(result[index].Date,'dd-MM-yyyy'))||(this.barChartLabels[i] == this.datepipe.transform(result[index].Date,'MMM-yyyy'))){
              this.barChartData[0].data[i] = result[index].count
            }else if(!this.barChartData[0].data[i]){
              this.barChartData[0].data[i] = 0
            }
          }
        }
        // this.barChartData[0].data = dataset.reverse();
      }, (error) => {
        console.log(error);
      }
    );
  }
}
