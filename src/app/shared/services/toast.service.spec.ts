import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UndoToastComponent } from '../components/undo-toast/undo-toast.component';
import { of } from 'rxjs';

describe('ToastService', () => {
  let service: ToastService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open', 'openFromComponent']);
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        ToastService,
        { provide: MatSnackBar, useValue: snackBarSpyObj }
      ]
    });
    service = TestBed.inject(ToastService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should show a message using MatSnackBar.open', () => {
    const message = 'Test message';
    service.showMessage(message, 'Close', 3000, 'custom-class');
    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Close', { duration: 3000, panelClass: 'custom-class' });
  });

  it('should show an undo toast and call onUndo when action is triggered', () => {
    const trackTitle = 'Test Track';
    const onUndoSpy = jasmine.createSpy('onUndo');
    const fakeDialogRef = {
      onAction: () => of(true)
    };
    snackBarSpy.openFromComponent.and.returnValue(fakeDialogRef as any);

    service.showUndoToast(trackTitle, onUndoSpy, 15000, 'custom-class');
    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(UndoToastComponent, {
      data: { trackTitle },
      duration: 15000,
      panelClass: 'custom-class'
    });
    expect(onUndoSpy).toHaveBeenCalled();
  });
});
