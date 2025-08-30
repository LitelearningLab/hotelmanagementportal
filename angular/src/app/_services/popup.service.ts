import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  selectedDoc: any;
  constructor() { }

  openModal(rowData) {
    if (rowData) {
      this.selectedDoc = rowData;
      document.getElementById("triggerPopupModal").click();
    }
  }
  confirmModal() {
    console.log(this.selectedDoc)
    document.getElementById("confirmPopModal" + this.selectedDoc._id).click()
  }
}
