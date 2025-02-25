import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

const API_BASE = 'https://api.spotify.com/v1';

@Injectable({ providedIn: 'root' })
export class SpotifyApiService {
  constructor(private http: HttpClient) {}

  private getAccessToken(): string {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No access token available');
    return token;
  }

  getUserSavedTracks(force = false): Observable<any> {
    if (!force) {
      const cached = localStorage.getItem('savedTracks');
      if (cached) return of(JSON.parse(cached));
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getAccessToken()}` });
    return this.http.get(`${API_BASE}/me/tracks`, { headers }).pipe(
      tap(data => localStorage.setItem('savedTracks', JSON.stringify(data))),
      catchError(err => { throw err; })
    );
  }

  removeUserSavedTrack(trackId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getAccessToken()}` });
    return this.http.delete(`${API_BASE}/me/tracks`, {
      headers,
      body: { ids: [trackId] }
    }).pipe(tap(() => localStorage.removeItem('savedTracks')));
  }

  saveUserTrack(trackId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getAccessToken()}` });
    const params = new HttpParams().set('ids', trackId);
    return this.http.put(`${API_BASE}/me/tracks`, null, { headers, params }).pipe(
      tap(() => localStorage.removeItem('savedTracks'))
    );
  }

  searchTracks(query: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getAccessToken()}` });
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'track')
      .set('limit', '20');
    return this.http.get(`${API_BASE}/search`, { headers, params });
  }
}
