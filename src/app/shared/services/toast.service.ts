import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UndoToastComponent } from '../components/undo-toast/undo-toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly defaultDuration = 3000;
  private readonly undoDuration = 5000;

  constructor(private snackBar: MatSnackBar) {}

  showMessage(
    message: string,
    action: string = 'Close',
    duration: number = this.defaultDuration,
    panelClass: string | string[] = 'custom-snackbar'
  ): void {
    this.snackBar.open(message, action, { duration, panelClass });
  }

  showUndoToast(
    trackTitle: string,
    onUndo: () => void,
    duration: number = this.undoDuration,
    panelClass: string | string[] = 'custom-snackbar'
  ): void {
    const ref = this.snackBar.openFromComponent(UndoToastComponent, {
      data: { trackTitle },
      duration,
      panelClass
    });
    ref.onAction().subscribe(() => onUndo());
  }
}
