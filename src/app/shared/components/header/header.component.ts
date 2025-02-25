import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ]
})
export class HeaderComponent implements OnInit {
  isMobile = false;
  showBackArrow = false;
  currentPath = '';
  profilePicUrl = '/assets/default-avatar.png';
  isLoggedIn = false;
  profileLoaded = false;
  excludedPaths = ['/', '/login', '/saved-tracks'];

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentPath = event.url;
        this.updateBackArrow();
      });
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width:600px)'])
      .subscribe(result => {
        this.isMobile = result.matches;
        this.updateBackArrow();
      });

    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.cdr.detectChanges();
    });

    this.checkProfilePic();
  }

  checkProfilePic(): void {
    const storedPic = localStorage.getItem('profile_pic');
    if (storedPic) {
      this.profilePicUrl = storedPic;
      this.profileLoaded = true;
      this.cdr.detectChanges();
    } else {
      const intervalId = setInterval(() => {
        const pic = localStorage.getItem('profile_pic');
        if (pic) {
          this.profilePicUrl = pic;
          this.profileLoaded = true;
          clearInterval(intervalId);
          this.cdr.detectChanges();
        }
      }, 200);
    }
  }

  updateBackArrow(): void {
    this.showBackArrow = this.isMobile && !this.excludedPaths.includes(this.currentPath);
  }

  handleBack(): void {
    window.history.back();
  }

  handleTitleClick(): void {
    this.router.navigate(['/saved-tracks']);
  }

  openProfileModal(): void {
    this.dialog.open(ProfileModalComponent, { width: '400px' });
  }
}
