import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const code = new URLSearchParams(window.location.search).get('code');
    
    if (code) {
      try {
        await this.authService.getToken(code);
        await this.fetchProfile();
        this.router.navigate(['/saved-tracks']);
      } catch (error) {
        console.error('Token error', error);
        this.authService.logout();
      }
    } else {
      console.error('Code not found');
    }
  }

  async fetchProfile(): Promise<void> {
    const token = localStorage.getItem('access_token');

    if (!token) return;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    
    try {
      const profile: any = await this.http.get('https://api.spotify.com/v1/me', { headers }).toPromise();
      localStorage.setItem('user_profile', JSON.stringify(profile));
      if (profile.images?.length) {
        localStorage.setItem('profile_pic', profile.images[0].url);
      }
    } catch (error) {
      console.error('Profile error', error);
    }
  }
}
