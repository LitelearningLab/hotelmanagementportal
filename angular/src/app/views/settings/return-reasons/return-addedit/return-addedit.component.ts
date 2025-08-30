import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { log } from 'console';
@Component({
  selector: 'app-return-addedit',
  templateUrl: './return-addedit.component.html',
  styleUrls: ['./return-addedit.component.scss']
})
export class ReturnAddeditComponent implements OnInit {
  @ViewChild('returnReasonForm') form: NgForm;
  
  submitebtn: boolean=false;
  constructor(   private apiService: ApiService,){

  }
  ngOnInit() {
   
  }
  onFormSubmit(data:any){
    if(data.valid){
      this.apiService.CommonApi(Apiconfig.postreturnreason.method,Apiconfig.postreturnreason.url,data.value).subscribe((result)=>{
        if(result){
          console.log(result.message)
         this.form.reset()
       
         
        }
      })
    }

  } 
}
