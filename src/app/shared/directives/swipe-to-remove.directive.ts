import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostBinding,
  OnInit,
  OnDestroy,
  HostListener
} from '@angular/core';
import interact from 'interactjs';

@Directive({
  selector: '[appSwipeToRemove]',
  exportAs: 'appSwipeToRemove',
  standalone: true
})
export class SwipeToRemoveDirective implements OnInit, OnDestroy {
  @Output() swipeRemove = new EventEmitter<void>();
  @HostBinding('style.transform') transform = 'translateX(0px)';
  swipeDelta = 0;
  containerWidth = 0;
  threshold = 0;
  private interactable: any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.updateDimensions();
    this.interactable = interact(this.el.nativeElement).draggable({
      listeners: {
        move: this.onDragMove.bind(this),
        end: this.onDragEnd.bind(this)
      },
      lockAxis: 'x'
    });
  }

  ngOnDestroy(): void {
    this.interactable?.unset();
  }

  private updateDimensions(): void {
    this.containerWidth = this.el.nativeElement.offsetWidth;
    this.threshold = this.containerWidth * 0.5;
  }

  private onDragMove(event: any): void {
    if (event?.originalEvent) {
      event.originalEvent.stopPropagation();
    }

    if (event.dx > 0) {
      this.swipeDelta += event.dx;
      this.transform = `translateX(${this.swipeDelta * 0.5}px)`;
    }
  }

  private onDragEnd(): void {
    if (this.swipeDelta >= this.threshold) {
      this.swipeRemove.emit();
    }
    this.swipeDelta = 0;
    this.transform = 'translateX(0px)';
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateDimensions();
  }
}
