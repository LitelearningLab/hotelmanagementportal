import { Component, Output, EventEmitter, Input, OnInit, ViewChild } from "@angular/core";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
    selector: "order-manage-component",
    template: `
    <span style="cursor: pointer;" title="Update as Order Packed" class='badge badge-primary badge-pill py-2 px-2' *ngIf="rowData && rowData.status == 1" (click)="confirmModal.show()" >Order Packed</span>
    <span style="cursor: pointer;" title="Update as Ongoing Order" class='badge badge-warning badge-pill py-2 px-2' *ngIf="rowData && rowData.status == 3" (click)="confirmModal.show()" >On Going Order</span>
    <span style="cursor: pointer;" title="Update as Order Delivered" class='badge badge-success badge-pill py-2 px-2' *ngIf="rowData && rowData.status == 6" (click)="confirmModal.show()" >Delivered</span>
    <span style="cursor: pointer;" title="Update as Order Collected" class='badge badge-success badge-pill py-2 px-2' *ngIf="rowData && rowData.status == 16" (click)="confirmModal.show()" >Order Collected</span>
    <span style="cursor: pointer;" title="Update as Order Collected" class='badge badge-success badge-pill py-2 px-2' *ngIf="rowData && rowData.foods.status == 16" (click)="confirmModal.show()" >Order Collected</span>
    <span style="cursor: pointer;" title="Update as Order refunded" class='badge badge-success badge-pill py-2 px-2' *ngIf="rowData && rowData.foods.status == 17" (click)="confirmModal.show()" >Order refunded</span>
    <span style="cursor: pointer;" title="Update as Order refunded" class='badge badge-success badge-pill py-2 px-2' *ngIf="rowData && rowData.status == 9" (click)="confirmModal.show()" >Order refunded</span>
    <span style="cursor: pointer;"  class='badge badge-success badge-pill py-2 px-2' *ngIf="rowData && rowData.foods.status == 18" >{{rowData.foods.refundStatus}}</span>
    <!-- <span style="cursor: pointer;" title="Update as Order Delivered" class='badge badge-success badge-pill py-2 px-2' *ngIf="rowData && rowData.status == 16" (click)="confirmModal.show()" >Order Collected</span> -->

    <!--title="Update as Order refunded" -->
    <div bsModal #confirmModal="bs-modal" class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content cases-model">
                <div class="modal-header">
                    Order Id: {{rowData? rowData.order_id: ""}}

                </div>
                <div class="modal-body">
                    <h6 *ngIf="rowData && rowData.status == 1">  Are you sure! Do you want to accept the order?  </h6>
                    <h6 *ngIf="rowData && rowData.status == 3">  Are you sure! Do you want to ship this order? </h6>
                    <h6 *ngIf="rowData && rowData.status == 6"> Are you sure? Confirm that this order has been delivered?</h6>
                    <h6 *ngIf="rowData && rowData.foods.status == 16"> Are you sure? Do you collected this order?</h6>
                    <h6 *ngIf="rowData && rowData.foods.status == 17"> Are you sure? Do you refund this order</h6>
                    <h6 *ngIf="rowData && rowData.foods.status == 17">Confirm that you have refunded the: {{rowData.foods.price && rowData.foods.quantity ?  rowData.foods.price*rowData.foods.quantity :0}}</h6>
                    <h6 *ngIf="rowData && rowData.status == 9">  Are you sure! Do you want to refund this order?</h6>
                   


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

export class OrderManageComponent implements OnInit{
    ngOnInit(): void {
        console.log(this.rowData,'rowData');
    }
    rowData: any;
    confirmModal: any;
    @Input() value: any;
    @ViewChild('confirmModal') model: BsModalRef;

    @Output() save: EventEmitter<any> = new EventEmitter();
    onModelChange() {
        console.log("rowData", this.rowData)
        this.save.emit(this.rowData);
        this.model.hide();
    }
}