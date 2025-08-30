import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataSource } from '../../lib/data-source/data-source';
@Component({
  selector: 'ng2-smart-table-pager',
  styleUrls: ['./pager.component.scss'],
  template: `
    <div class="list-count">Showing {{currentpage_start}} - {{currentpage_end}} of {{count}} items</div>
    <nav *ngIf="shouldShow()" class="ng2-smart-pagination-nav">
      <ul class="ng2-smart-pagination pagination">
        <li class="ng2-smart-page-item page-item" [ngClass]="{disabled: getPage() == 1}">
          <a class="ng2-smart-page-link page-link" href="#"
          (click)="getPage() == 1 ? false : paginate(1)" aria-label="First">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">First</span>
          </a>
        </li>
        <li class="ng2-smart-page-item page-item" [ngClass]="{disabled: getPage() == 1}">
          <a class="ng2-smart-page-link page-link page-link-prev" href="#"
             (click)="getPage() == 1 ? false : prev()" aria-label="Prev">
            <span aria-hidden="true">&lt;</span>
            <span class="sr-only">Prev</span>
          </a>
        </li>
        <li class="ng2-smart-page-item page-item"
        [ngClass]="{active: getPage() == page}" *ngFor="let page of getPages()">
          <span class="ng2-smart-page-link page-link"
          *ngIf="getPage() == page">{{ page }} <span class="sr-only">(current)</span></span>
          <a class="ng2-smart-page-link page-link" href="#"
          (click)="paginate(page)" *ngIf="getPage() != page">{{ page }}</a>
        </li>
        <li class="ng2-smart-page-item page-item"
            [ngClass]="{disabled: getPage() == getLast()}">
          <a class="ng2-smart-page-link page-link page-link-next" href="#"
             (click)="getPage() == getLast() ? false : next()" aria-label="Next">
            <span aria-hidden="true">&gt;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
        <li class="ng2-smart-page-item page-item"
        [ngClass]="{disabled: getPage() == getLast()}">
          <a class="ng2-smart-page-link page-link" href="#"
          (click)="getPage() == getLast() ? false : paginate(getLast())" aria-label="Last">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Last</span>
          </a>
        </li>
      </ul>
    </nav>
    <nav *ngIf="perPageSelect && perPageSelect.length > 0" class="ng2-smart-pagination-per-page">
      <label for="per-page" class="text-muted text-small">
        Per Page:
      </label>
      <select style="border-radius: 20px; border-color: #8F8F8F;color: #8F8F8F;"(change)="onChangePerPage($event)" [(ngModel)]="Defaultselect" id="per-page">
        <option style="border-radius: 20px;" *ngFor="let item of perPageSelect" [value]="item">{{ item }}</option>
      </select>
    </nav>
  `,
})
export class PagerComponent implements OnChanges {
  constructor(private cdref: ChangeDetectorRef){

  }
  @Input() source: DataSource;
  @Input() count: number = 0;
  @Input() currentPerPage: number = 1;
  @Input() currentPage: number = 1;
  @Input() Defaultselect: number = 50;
  perPageSelect = [5, 10, 50, 100];
  @Output() changePage = new EventEmitter<any>();
  @Output() PerPagechange = new EventEmitter<any>();
  currentpage_start = 1;
  currentpage_end = 10;
  // currentPerPage: any;
  protected pages: Array<any>;
  protected page: number;
  // protected count: number = 0;
  protected perPage: number;
  protected dataChangedSub: Subscription;
  ngOnChanges(changes: SimpleChanges) {
    if (changes.source) {
      if (!changes.source.firstChange) {
        this.dataChangedSub.unsubscribe();
      }
      if (typeof this.currentPage != 'undefined' && this.currentPage == 1) {
        this.currentPerPage = this.currentPage;
      }
      this.source.getPaging().perPage = this.Defaultselect * 1;
      this.dataChangedSub = this.source.onChanged().subscribe((dataChanges) => {
        this.page = this.currentPerPage;
        this.perPage = this.source.getPaging().perPage;
        // this.currentPerPage = this.perPage;
        // this.count = this.count;
        if (this.isPageOutOfBounce()) {
          this.source.setPage(--this.page);
        }
        let showpage = this.Defaultselect * this.currentPerPage;
        this.currentpage_start = this.currentPerPage != 1 ? 1 + (this.Defaultselect * this.currentPerPage) - this.Defaultselect : 1;
        // console.log("this.count", this.count)
        if (showpage > this.count) {
          console.log("this.countshowpage", showpage, this.count)
          this.currentpage_end = this.count;
          // console.log("this.currentpage_end", this.currentpage_end)
        } else {
          console.log("commeing here")
          this.currentpage_end = showpage
        }
        this.processPageChange(dataChanges);
        this.initPages();
      });
    }
    this.cdref.detectChanges();
  }
  /**
   * We change the page here depending on the action performed against data source
   * if a new element was added to the end of the table - then change the page to the last
   * if a new element was added to the beginning of the table - then to the first page
   * @param changes
   */
  processPageChange(changes: any) {
    if (changes['action'] === 'prepend') {
      this.source.setPage(1);
    }
    if (changes['action'] === 'append') {
      this.source.setPage(this.getLast());
    }
  }
  shouldShow(): boolean {
    let showpage = this.Defaultselect * this.currentPerPage;
    if (this.perPage > this.count) {
      // console.log("this.countshowpage45456", this.perPage, this.count)
      this.currentpage_end = this.count;
      // console.log("this.currentpage_end", this.currentpage_end)
    } else {
      // console.log("commeing here")
      this.currentpage_end = showpage
    }
    return this.count > this.perPage;
  }
  paginate(page: number): boolean {
    this.source.setPage(page);
    this.currentPerPage = page;
    this.page = page;
    this.changePage.emit({ page });
    return false;
  }
  next(): boolean {
    return this.paginate(this.getPage() + 1);
  }
  prev(): boolean {
    return this.paginate(this.getPage() - 1);
  }
  getPage(): number {
    return this.page;
  }
  getPages(): Array<any> {
    return this.pages;
  }
  getLast(): number {
    // console.log("this.count2", this.count)
    return Math.ceil(this.count / this.perPage);
  }
  isPageOutOfBounce(): boolean {
    console.log("this.count3", this.count)
    return (this.page * this.perPage) >= (this.count + this.perPage) && this.page > 1;
  }
  initPages() {
    const pagesCount = this.getLast();
    let showPagesCount = 4;
    showPagesCount = pagesCount < showPagesCount ? pagesCount : showPagesCount;
    this.pages = [];
    if (this.shouldShow()) {
      let middleOne = Math.ceil(showPagesCount / 2);
      middleOne = this.page >= middleOne ? this.page : middleOne;
      let lastOne = middleOne + Math.floor(showPagesCount / 2);
      lastOne = lastOne >= pagesCount ? pagesCount : lastOne;
      const firstOne = lastOne - showPagesCount + 1;
      for (let i = firstOne; i <= lastOne; i++) {
        this.pages.push(i);
      }
    }
    // else {
    //   console.log("this.countdddd", this.count)
    // }
  }
  onChangePerPage(event: any) {
    if (this.currentPerPage) {
      this.source.getPaging().perPage = this.Defaultselect * 1;
      this.currentPerPage = 1;
      this.PerPagechange.emit(this.source);
      // if (typeof this.currentPerPage === 'string' && this.currentPerPage.toLowerCase() === 'all') {
      //   this.source.getPaging().perPage = null;
      // } else {
      // this.source.refresh();
      // }
      // this.initPages();
    }
  }
}