import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenEndpoint = 'https://accounts.spotify.com/api/token';
  private authEndpoint = 'https://accounts.spotify.com/authorize';
  private scope = 'user-read-private user-read-email user-library-read user-library-modify';
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isLoggedIn$ = this.loggedInSubject.asObservable();
  private refreshTimeout: any;

  constructor(private http: HttpClient, private router: Router) {}

  private hasValidToken(): boolean {
    const token = localStorage.getItem('access_token');
    const expiry = localStorage.getItem('token_expiry');
    return token && expiry ? Date.now() < +expiry : false;
  }

  generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = new Uint8Array(length);
    
    window.crypto.getRandomValues(randomValues);
    return Array.from(randomValues).map(val => possible[val % possible.length]).join('');
  }

  async sha256(plain: string): Promise<ArrayBuffer> {
    const data = new TextEncoder().encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  }

  base64encode(buffer: ArrayBuffer): string {
    const binary = Array.from(new Uint8Array(buffer)).map(byte => String.fromCharCode(byte)).join('');
    return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const hashed = await this.sha256(codeVerifier);
    return this.base64encode(hashed);
  }

  async redirectToSpotifyAuth(): Promise<void> {
    const clientId = environment.spotifyClientId;
    const redirectUri = environment.spotifyRedirectUri;
    const codeVerifier = this.generateRandomString(64);
    localStorage.setItem('code_verifier', codeVerifier);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: this.scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri
    });

    window.location.href = `${this.authEndpoint}?${params.toString()}`;
  }

  async getToken(code: string): Promise<any> {
    const codeVerifier = localStorage.getItem('code_verifier') || '';
    const clientId = environment.spotifyClientId;
    const redirectUri = environment.spotifyRedirectUri;
    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier
    });
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const data: any = await this.http.post(this.tokenEndpoint, body.toString(), { headers }).toPromise();

    localStorage.setItem('access_token', data.access_token);
    if (data.expires_in) {
      const expiry = Date.now() + data.expires_in * 1000;
      localStorage.setItem('token_expiry', expiry.toString());
      this.scheduleRefresh(data.expires_in);
    }
    if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
    this.loggedInSubject.next(true);
    return data;
  }

  async refreshAccessToken(): Promise<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token available');
    const clientId = environment.spotifyClientId;
    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    try {
      const response: any = await this.http.post(this.tokenEndpoint, body.toString(), { headers }).toPromise();
      if (!response.access_token) throw new Error('No access token in response');
      localStorage.setItem('access_token', response.access_token);
      if (response.expires_in) {
        const expiry = Date.now() + response.expires_in * 1000;
        localStorage.setItem('token_expiry', expiry.toString());
        this.scheduleRefresh(response.expires_in);
      }
      return response;
    } catch (error: any) {
      if (error.error?.error === 'invalid_grant') {
        this.logout();
        this.router.navigate(['/login']);
      }
      throw error;
    }
  }

  private scheduleRefresh(expiresIn: number): void {
    if (this.refreshTimeout) clearTimeout(this.refreshTimeout);
    const refreshTime = expiresIn * 1000 - 60000;
    const timeout = refreshTime > 0 ? refreshTime : 0;

    this.refreshTimeout = setTimeout(() => {
      this.refreshAccessToken().catch(err => console.error('Token refresh failed', err));
    }, timeout);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('user_profile');
    localStorage.removeItem('profile_pic');
    if (this.refreshTimeout) clearTimeout(this.refreshTimeout);
    this.loggedInSubject.next(false);
  }
}
