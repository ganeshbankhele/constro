import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'ion-input[decimal-only]' // Attribute selector
})
export class DigitOnlyDirective {
  // Allow decimal numbers and negative values 
  private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home','Delete', '-','ArrowDown','ArrowLeft','ArrowRight','ArrowUp'];

  constructor(private el: ElementRef) {
  }
  @HostListener('input', ['$event'])
  onInput(input:HTMLInputElement):void {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(this.el.nativeElement.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(this.el.nativeElement.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
  
}