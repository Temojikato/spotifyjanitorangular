import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appPullToRefresh]',
  standalone: true
})
export class PullToRefreshDirective {
  @Output() refresh = new EventEmitter<void>();
  @Output() pullProgress = new EventEmitter<number>();

  private startX = 0;
  private startY = 0;
  private pulling = false;
  private readonly threshold = 200;

  constructor(private el: ElementRef) {}

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (this.el.nativeElement.scrollTop === 0) {
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
      this.pulling = true;
      this.pullProgress.emit(0);
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (!this.pulling) return;

    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    const dx = currentX - this.startX;
    const dy = currentY - this.startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.reset();
      return;
    }

    if (dy > 0) {
      const progress = Math.min(dy / this.threshold, 1);
      this.pullProgress.emit(progress);
      this.el.nativeElement.style.transform = `translateY(${dy}px)`;
      if (dy >= this.threshold) {
        this.refresh.emit();
        this.reset();
      }
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.reset();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (this.el.nativeElement.scrollTop === 0) {
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.pulling = true;
      this.pullProgress.emit(0);
      event.preventDefault();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.pulling) return;

    const currentX = event.clientX;
    const currentY = event.clientY;
    const dx = currentX - this.startX;
    const dy = currentY - this.startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.reset();
      return;
    }

    if (dy > 0) {
      const progress = Math.min(dy / this.threshold, 1);
      this.pullProgress.emit(progress);
      this.el.nativeElement.style.transform = `translateY(${dy}px)`;
      if (dy >= this.threshold) {
        this.refresh.emit();
        this.reset();
      }
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.reset();
  }

  private reset(): void {
    this.pulling = false;
    this.el.nativeElement.style.transition = 'transform 0.3s ease';
    this.el.nativeElement.style.transform = 'translateY(0)';
    setTimeout(() => {
      this.el.nativeElement.style.transition = '';
    }, 300);
    this.pullProgress.emit(0);
  }
}
