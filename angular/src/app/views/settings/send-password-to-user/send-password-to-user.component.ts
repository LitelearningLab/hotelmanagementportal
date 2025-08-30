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
import { ExcelServiceService } from 'src/app/_services/excel-service.service';

import {
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
  DxButtonModule, DxPopupModule, DxPopoverModule, getElement,DxDataGridComponent
} from 'devextreme-angular';
@Component({
  selector: 'app-send-password-to-user',
  templateUrl: './send-password-to-user.component.html',
  styleUrls: ['./send-password-to-user.component.scss']
})
export class SendPasswordToUserComponent {
   companysubadmin: any;
  trainerData:any;
  companydata: any;
  selectedcomp:any;
  companynames: any=[];
  GridData:any[]=[];
SelectedCompany:any;
       @ViewChild('dataGridVar', { static: false }) dataGrid: DxDataGridComponent;
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
    private excelService: ExcelServiceService,
    private fb:FormBuilder,
  ) {
    this.companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))
    this.trainerData = JSON.parse(localStorage.getItem("Trainer Login"));
    this.companydata=JSON.parse(localStorage.getItem("company"))

  }
   ngOnInit(): void {
     this.getcompany();
   }
     contentReady = (e) => {
  
    e.component.getVisibleRows().forEach((row) => {
    });
    // e.refresh();
    //this.dataGrid.instance.refresh();
  };
  getcompany() {
    console.log("insideo f thuis ")
    this.apiService.CommonApi(Apiconfig.getCompanynames.method, Apiconfig.getCompanynames.url, {}).subscribe((result) => {
      this.companynames = result.data.sort((a, b) => a.companyname - b.companyname);;
      
    })
  }
  getUsers() {
    debugger;
  
    this.SelectedCompany= this.companynames.filter(s=>s._id==this.selectedcomp)[0]
    if (this.selectedcomp) {
      var req = { companyid: this.selectedcomp }
      this.apiService.CommonApi(Apiconfig.user_list.method, Apiconfig.user_list.url, req).subscribe((result) => {

        let updat=result.data.map(l=>
          l.status === "1" ? { ...l, isActive: true } : { ...l, isActive: false } 
        )
        this.GridData=updat;
      //this.companynames = result.data.sort((a, b) => a.companyname - b.companyname);;
      debugger;
    })
      debugger;
    }
    //user_list
  }
   // To get selected row data
    onGetSelectedRowsData() {
      this.dataGrid.instance.getSelectedRowsData().then((selectedData) => {
        debugger
        if (selectedData.length != 0) {
          let selected={selectedData:selectedData}
          this.apiService.CommonApi(Apiconfig.send_user_list.method, Apiconfig.send_user_list.url, selected).subscribe((result) => {
            
          });
        }
        
      });
      
    }
    downloadExcel(){
      if(this.GridData.length !=0){
        let excel=this.GridData.map(s=>({
          "User Name":s.username,
          Email:s.email,
          Mobile:s.mobile,
          Course:s.course,
          Year:s.year,
          City:s.City,
          Password:s.password

        }))
        this.excelService.exportToExcel(excel, 'UsersList');
      }
    }
}
