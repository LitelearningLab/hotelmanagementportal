import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TableSettingsService {

  constructor(
    private router: Router,
  ) { }

  loadSettings(event: string, curentUser: any, url: string, userPrivilegeDetails: any, deletebtn: boolean, editbtn: boolean, viewbtn: boolean,adduser?:boolean,userlist?:boolean,changebutton?:boolean,  managebtn?: boolean) {
    var custom = [];
    if (event == 'delete') {
      if (deletebtn) {
        custom.push(
          {
            name: 'restoreaction',
            value: 'Restore',
            title: '<div class="action-btn btn btn-danger mb-1"><i class="fa fa-reply"></i></div>',
            type: 'html',
          },
          {
            name: 'forcedeleteaction',
            value: 'Permanent Delete',
            title: '<div class="action-btn btn btn-danger mb-1"><i class="fa fa-trash"></i></div>',
            type: 'html',
          });
      }
      return custom;
    } else {
      if (editbtn) {
        custom.push(
          {
            name: 'editaction',
            value: 'Edit',
            type: 'html',
            title: '<div class="action-btn btn btn-primary mb-1"><i class="fa fa-pencil"></i></div>',
          });
      }
      if (viewbtn) {
        custom.push({
          name: 'viewaction',
          value: 'View',
          title: '<div class="action-btn btn btn-info mb-1"><i class="fa fa-eye"></i></div>',
          type: 'html',
        })
      }
      if (adduser) {
        custom.push({
          name: 'addusertobatch',
          value: 'Add User',
          title: '<div class="action-btn btn btn-primary mb-1"><i class="fa fa-user-plus"></i></div>',
          type: 'html',
        })
      }
      
      if (userlist) {
        custom.push({
          name: 'user list',
          value: 'User List',
          title: '<div class="action-btn btn btn-primary mb-1"><i class="fa fa-list-alt"></i></div>',
          type: 'html',
        })
      }
      if (changebutton) {
        custom.push({
          name: 'batchchange',
          value: 'Move to this batch',
          title: '<div class="action-btn btn btn-primary mb-1"><i class="fa fa-arrow-circle-right"></i></div>',
          type: 'html',
        })
      }
      if (deletebtn) {
        custom.push(
          {
            name: 'deleteaction',
            value: 'Delete',
            title: '<div class="action-btn btn btn-danger mb-1"><i class="fa fa-trash"></i></div>',
            type: 'html',
          },
          {
            name: 'restoreaction',
            value: 'Restore',
            title: '<div class="action-btn btn btn-danger mb-1"><i class="fa fa-reply"></i></div>',
            type: 'html',
          },
          {
            name: 'forcedeleteaction',
            value: 'Permanent Delete',
            title: '<div class="action-btn btn btn-danger mb-1"><i class="fa fa-trash"></i></div>',
            type: 'html',
          })
      };
      if (managebtn) {
        custom.push(
          {
            name: 'manageaction',
            value: 'Manage',
            title: '<div class="action-btn btn btn-primary mb-1"><i class="fa fa-envelope"></i></div>',
            type: 'html',
          })
      }
      return custom;
    };
  }
}
