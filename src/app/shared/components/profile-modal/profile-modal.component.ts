import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

export interface UserProfile {
  display_name: string;
  images: { url: string }[];
  product: string;
  country: string;
  email: string;
  id: string;
  followers: { total: number };
  external_urls: { spotify: string };
}

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class ProfileModalComponent implements OnInit {
  profile: UserProfile | null = null;

  constructor(
    private dialogRef: MatDialogRef<ProfileModalComponent>,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('user_profile');
    if (stored) this.profile = JSON.parse(stored);
  }

  close(): void {
    this.dialogRef.close();
  }

  logout(): void {
    this.dialogRef.close();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get profileImageUrl(): string | null {
    return this.profile && this.profile.images?.length
      ? this.profile.images[0].url
      : null;
  }
}
