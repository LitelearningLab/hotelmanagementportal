import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-accordion',
  template: `
   <div>
  <a href="javascript:void(0)" (click)="toggleAccordion()">+</a>
  <div class="accordion-content" *ngIf="isOpen">
    <table class="table table-sm mb-0">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Column 1</th>
          <th scope="col">Column 2</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let detail of rowData?.details; let i = index">
          <th scope="row">{{ i + 1 }}</th>
          <td>{{ detail.col1 }}</td>
          <td>{{ detail.col2 }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
  `,
  styles: [`
    .accordion-content {
      margin-top: 10px;
    }
  `]
})
export class AccordionComponent {
    @Input() rowData: any;
    isOpen: boolean = false;
  
    toggleAccordion() {
      this.isOpen = !this.isOpen;
    }
}
