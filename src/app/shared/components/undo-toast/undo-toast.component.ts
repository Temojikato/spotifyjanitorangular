import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef, MatSnackBarModule } from '@angular/material/snack-bar';

export interface UndoToastData {
  trackTitle: string;
}

@Component({
  selector: 'app-undo-toast',
  standalone: true,
  templateUrl: './undo-toast.component.html',
  styleUrls: ['./undo-toast.component.scss'],
  imports: [CommonModule, MatButtonModule, MatSnackBarModule]
})
export class UndoToastComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<UndoToastComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: UndoToastData
  ) {}

  onUndo(): void {
    this.snackBarRef.dismissWithAction();
  }
}
