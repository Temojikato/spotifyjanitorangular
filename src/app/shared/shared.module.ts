import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { AddSongModalComponent } from './components/add-song-modal/add-song-modal.component';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { UndoToastComponent } from './components/undo-toast/undo-toast.component';
import { SwipeToRemoveDirective } from './directives/swipe-to-remove.directive';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,

    LayoutComponent,
    HeaderComponent,
    AddSongModalComponent,
    ProfileModalComponent,
    UndoToastComponent,
    SwipeToRemoveDirective,
  ],
  exports: [
    LayoutComponent,
    HeaderComponent,
    AddSongModalComponent,
    ProfileModalComponent,
    UndoToastComponent,
    SwipeToRemoveDirective
  ]
})
export class SharedModule {}
