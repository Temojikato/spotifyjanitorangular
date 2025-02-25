import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private authService: AuthService) {}
  
  async handleLogin(): Promise<void> {
    try {
      await this.authService.redirectToSpotifyAuth();
    } catch (error) {
      console.error('Login error', error);
    }
  }
}
