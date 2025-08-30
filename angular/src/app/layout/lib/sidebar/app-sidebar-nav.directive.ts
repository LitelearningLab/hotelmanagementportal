import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appNavDropdown]'
})
export class NavDropdownDirective {
  private static activeDropdown: NavDropdownDirective | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  toggle() {
    if (NavDropdownDirective.activeDropdown && NavDropdownDirective.activeDropdown !== this) {
      NavDropdownDirective.activeDropdown.close();
    }

    const isOpen = this.el.nativeElement.classList.contains('open');
    if (isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.renderer.addClass(this.el.nativeElement, 'open');
    NavDropdownDirective.activeDropdown = this;
    this.listenForOutsideClick();
  }

  close() {
    this.renderer.removeClass(this.el.nativeElement, 'open');
    NavDropdownDirective.activeDropdown = null;
    this.removeOutsideClickListener();
  }

  private listenForOutsideClick() {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.close();
      }
    });
  }

  private removeOutsideClickListener() {
    // Remove event listener if necessary (not needed with current implementation)
  }
}

@Directive({
  selector: '[appNavDropdownToggle]'
})
export class NavDropdownToggleDirective {
  constructor(private dropdown: NavDropdownDirective) {}

  @HostListener('click', ['$event'])
  toggleOpen($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dropdown.toggle();
  }
}
