import { Component, Output, EventEmitter, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Apiconfig } from 'src/app/_helpers/api-config';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/_services/notification.service';
import { ApiService } from "../_services/api.service";

@Component({
    selector: 'assign-popup-button',
    template: `
    <span  style="cursor: pointer;" class='badge badge-warning w-100 badge-pill py-2 mb-2' (click)="confirmModal.show()" >Send Mail</span>
    <!-- <span *ngIf="rowData.active == true" class='badge badge-success w-100 badge-pill py-2 mb-2' >Subscribed</span> -->
    <div bsModal #confirmModal="bs-modal" class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content cases-model">
            <div class="modal-header">
                <h4 class="modal-title pull-left">Subscribed User :- {{rowData.username}}</h4>
            </div>
            <div class="modal-body">
                <ng-select name="tag_name" id="tag_name" dropdownPosition="bottom" [multiple]="false" [clearable]="false" [(ngModel)]="select_subscript" [searchable]="true" class="form-control">
                    <ng-option value='' selected disabled>--Select--</ng-option>
                    <ng-option *ngFor="let item of productList" [value]="item._id">{{item.name}}
                    </ng-option>
                </ng-select>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn conform-dels" (click)="onModelChange()">
                    Yes
                </button>
                <button type="button" class="btn conform-cancel" (click)="confirmModal.hide()">
                    No
                </button>
            </div>
        </div>
    </div>
</div>
  `
})

export class SendmailComponent {
    rowData: any;
    confirmModal:any;
    select_subscript: any;
    productList: any [] = [];

    @ViewChild('confirmModal')model:BsModalRef;
    @Input() value: any;
    @Output() save: EventEmitter<any> = new EventEmitter();

    constructor(
        private apiService: ApiService,
        private notifyService: NotificationService,
    ){
        this.apiService.CommonApi(Apiconfig.trendingProduct.method, Apiconfig.trendingProduct.url, {}).subscribe(result => {
            if(result && result.status == 1){
                this.productList = result.data;
            }
        })
    }
    onModelChange() {
        if(this.select_subscript && this.select_subscript != ''){
            var data = {
                user_id: this.rowData._id,
                email: this.rowData.email,
                productid: this.select_subscript
            }
            this.apiService.CommonApi(Apiconfig.sendMail.method, Apiconfig.sendMail.url, data).subscribe(result =>{
                if(result && result.status == 1){
                    this.notifyService.showSuccess(result.message)
                    this.model.hide();
                    this.save.emit(this.rowData);
                } else{
                    this.notifyService.showError(result.message)
                }
            })

        } else {
            this.notifyService.showError("Please choose any one subscription")
        }
    }
}