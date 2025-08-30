import {Component, HostBinding, HostListener, Input} from '@angular/core';

import { AppSidebarService } from './app-sidebar.service';

@Component({
  selector: 'app-sidebar-minimizer, cui-sidebar-minimizer',
  //template: `<h3  style="margin-top: 15px !important;" ><i *ngIf="togle" (click)="isshow('1')" class="nav-icon fa fa fa-chevron-right pull-left toggle"></i><i *ngIf="!togle" (click)="isshow('2')" class="nav-icon fa fa fa-chevron-left pull-right toggle"></i></h3>`
  template: ``

})
export class AppSidebarMinimizerComponent {

  @HostBinding('attr.role') @Input() role = 'button';
  @HostBinding('class.sidebar-minimizer') sidebarMinimizerClass = true;

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    this.sidebarService.toggle({minimize: 'toggle'});
  }
  togle=false;
  constructor(
    private sidebarService: AppSidebarService
  ) { }
  
  isshow(id){
    debugger;
    this.togle=id=='2'?true:false;
    //this.togle=true;

  }
}
