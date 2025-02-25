import { Component, Input, Output, EventEmitter, AfterViewInit, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import interact from 'interactjs';

@Component({
  selector: 'tr[appTableTrackItem]',
  standalone: true,
  templateUrl: './table-track-item.component.html',
  styleUrls: ['./table-track-item.component.scss'],
  imports: [CommonModule, MatIconModule]
})
export class TableTrackItemComponent implements AfterViewInit, OnDestroy {
  @Input() id!: string;
  @Input() title!: string;
  @Input() artist!: string;
  @Input() album!: string;
  @Input() albumArt!: string;
  @Input() addedAt!: string;
  @Input() duration!: string;
  @Output() remove = new EventEmitter<string>();

  swipeDelta = 0;
  containerWidth = 0;
  threshold = 0;
  private interactable: any;

  constructor(private host: ElementRef) {}

  ngAfterViewInit(): void {
    this.updateContainerWidth();
    this.interactable = interact(this.host.nativeElement).draggable({
      listeners: { move: this.dragMoveListener.bind(this), end: this.dragEndListener.bind(this) },
      lockAxis: 'x'
    });
  }

  ngOnDestroy(): void {
    this.interactable?.unset();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateContainerWidth();
  }

  updateContainerWidth(): void {
    this.containerWidth = this.host.nativeElement.offsetWidth;
    this.threshold = this.containerWidth * 0.5;
  }

  dragMoveListener(event: any): void {
    if (event.dx > 0) {
      this.swipeDelta += event.dx;
    }
  }

  dragEndListener(event: any): void {
    if (this.swipeDelta >= this.threshold) {
      this.remove.emit(this.id);
    }
    this.swipeDelta = 0;
  }
}
