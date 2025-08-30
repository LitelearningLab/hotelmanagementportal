import { Component, Input } from '@angular/core';

import { SidebarNavHelper } from '../app-sidebar-nav.service';
import { INavData } from '../app-sidebar-nav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-nav-dropdown, cui-sidebar-nav-dropdown',
  template: `
    <a class="nav-link nav-dropdown-toggle {{helper.isActive(router, item) ? 'seleted-menu' : ''}}"
       appNavDropdownToggle
       [appHtmlAttr]="item.attributes" >
      <i *ngIf="helper.hasIcon(item)" [ngClass]="item | appSidebarNavIcon"></i>
      <ng-container>{{item.name}}</ng-container>
      <span *ngIf="helper.hasBadge(item)" [ngClass]="item | appSidebarNavBadge">{{ item.badge.text }}</span>
    </a>
    <app-sidebar-nav-items
      class="nav-dropdown-items"
      style="background: #646E7A !important;"
      [items]="item.children">
    </app-sidebar-nav-items>
  `,
  styles: [
    '.nav-dropdown-toggle { cursor: pointer; }',
    '.nav-dropdown-items { display: block; }'
  ],
  providers: [SidebarNavHelper]
})
export class AppSidebarNavDropdownComponent {
  @Input() item: INavData;

  constructor(
    public helper: SidebarNavHelper,
    public router: Router,
  ) { }
}
