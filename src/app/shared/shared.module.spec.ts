import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SharedModule } from './shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  imports: [
    SharedModule,
    RouterTestingModule,
    HttpClientTestingModule
  ],
  template: `
    <app-layout></app-layout>
    <app-header></app-header>
    <app-add-song-modal></app-add-song-modal>
    <app-profile-modal></app-profile-modal>
    <app-undo-toast></app-undo-toast>
    <div appSwipeToRemove>Test Swipe Directive</div>
  `
})
class TestHostComponent {}

describe('SharedModule Integration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { existingTrackIds: [], isMobile: false } },

        { provide: MatSnackBarRef, useValue: { dismissWithAction: () => {} } },
        { provide: MAT_SNACK_BAR_DATA, useValue: { trackTitle: 'Integration Test' } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  it('should create TestHostComponent and render all exported elements', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('app-layout')).toBeTruthy();
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('app-add-song-modal')).toBeTruthy();
    expect(compiled.querySelector('app-profile-modal')).toBeTruthy();
    expect(compiled.querySelector('app-undo-toast')).toBeTruthy();
    expect(compiled.querySelector('[appSwipeToRemove]')).toBeTruthy();
  });
});
