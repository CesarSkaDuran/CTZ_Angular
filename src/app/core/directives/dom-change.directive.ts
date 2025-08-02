import { Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[domChange]'
})
export class DomChangeDirective implements OnDestroy {
  private changes: MutationObserver;

  @Output()
  public domChange = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    const element = this.elementRef.nativeElement;

    this.changes = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) => {
        if (element.classList.contains('preselected')) {
          console.log(element);
        }
        //  this.domChange.emit(mutation));
      });
    });

    this.changes.observe(element, {
      attributes: true
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
