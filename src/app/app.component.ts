import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AppComponent { }
