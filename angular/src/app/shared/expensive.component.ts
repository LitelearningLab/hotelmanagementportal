import { Component, Output, EventEmitter, Input, OnInit } from "@angular/core";

@Component({
    selector: "expensive-button-component",
    template: `
    <span class="start-rate">
    <div class="btn app-close" *ngIf="rowData && rowData.expensive == 1" (click)="onModelChange()">Expensive</div>
    <div class="btn app-closedd" *ngIf="rowData && rowData.expensive != 1" (click)="onModelChange()">Un Expensive</div>
    </span>
  `
})
export class ExpensiveComponent {
    rowData: any;
    
    @Input() value: any;

    @Output() save: EventEmitter<any> = new EventEmitter();
    onModelChange() {
        this.save.emit(this.rowData);
    }
}