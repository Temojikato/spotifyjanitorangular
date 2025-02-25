import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SwipeToRemoveDirective } from '../../../../shared/directives/swipe-to-remove.directive';

@Component({
  selector: 'app-mobile-track-item',
  standalone: true,
  templateUrl: './mobile-track-item.component.html',
  styleUrls: ['./mobile-track-item.component.scss'],
  imports: [CommonModule, MatIconModule, SwipeToRemoveDirective]
})
export class MobileTrackItemComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() artist!: string;
  @Input() albumArt!: string;
  @Output() remove = new EventEmitter<string>();
}
