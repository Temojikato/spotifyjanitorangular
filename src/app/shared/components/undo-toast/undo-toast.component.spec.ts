import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UndoToastComponent, UndoToastData } from './undo-toast.component';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UndoToastComponent', () => {
  let component: UndoToastComponent;
  let fixture: ComponentFixture<UndoToastComponent>;
  let snackBarRefSpy: jasmine.SpyObj<MatSnackBarRef<UndoToastComponent>>;

  const testData: UndoToastData = { trackTitle: 'Test Song' };

  beforeEach(waitForAsync(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBarRef', ['dismissWithAction']);
    TestBed.configureTestingModule({
      imports: [CommonModule, MatButtonModule, MatSnackBarModule],
      declarations: [],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: testData },
        { provide: MatSnackBarRef, useValue: snackBarSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    snackBarRefSpy = TestBed.inject(MatSnackBarRef) as jasmine.SpyObj<MatSnackBarRef<UndoToastComponent>>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndoToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the undo toast component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct track title in the toast message', () => {
    const messageEl = fixture.debugElement.query(By.css('.toast-message')).nativeElement;
    expect(messageEl.textContent).toContain('Test Song');
  });

  it('should call dismissWithAction on snackBarRef when onUndo is triggered', () => {
    const buttonEl = fixture.debugElement.query(By.css('button'));
    buttonEl.triggerEventHandler('click', null);
    expect(snackBarRefSpy.dismissWithAction).toHaveBeenCalled();
  });
});
