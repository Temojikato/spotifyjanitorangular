import { TestBed } from '@angular/core/testing';
import { SpotifyApiService } from './spotify-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders, HttpParams } from '@angular/common/http';

const API_BASE = 'https://api.spotify.com/v1';

describe('SpotifyApiService', () => {
  let service: SpotifyApiService;
  let httpMock: HttpTestingController;
  const dummyToken = 'dummy-token';

  beforeEach(() => {
    localStorage.setItem('access_token', dummyToken);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SpotifyApiService]
    });
    service = TestBed.inject(SpotifyApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  it('should get user saved tracks from API and cache them', () => {
    const dummyResponse = { items: [{ track: { id: '1', name: 'Test Track', artists: [{ name: 'Test Artist' }], album: { name: 'Test Album', images: [{ url: 'art.jpg' }] }, duration_ms: 180000 } }] };
    
    service.getUserSavedTracks().subscribe(data => {
      expect(data).toEqual(dummyResponse);
      expect(localStorage.getItem('savedTracks')).toEqual(JSON.stringify(dummyResponse));
    });

    const req = httpMock.expectOne(`${API_BASE}/me/tracks`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    req.flush(dummyResponse);
  });

  it('should remove user saved track and clear cache', () => {
    const trackId = '1';
    localStorage.setItem('savedTracks', JSON.stringify({ items: [] }));

    service.removeUserSavedTrack(trackId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(localStorage.getItem('savedTracks')).toBeNull();
    });

    const req = httpMock.expectOne(`${API_BASE}/me/tracks`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual({ ids: [trackId] });
    req.flush({ success: true });
  });

  it('should save user track and clear cache', () => {
    const trackId = '1';
    localStorage.setItem('savedTracks', JSON.stringify({ items: [] }));

    service.saveUserTrack(trackId).subscribe(data => {
      expect(data).toBeTruthy();
      expect(localStorage.getItem('savedTracks')).toBeNull();
    });

    const params = new HttpParams().set('ids', trackId);
    const req = httpMock.expectOne(req => req.url === `${API_BASE}/me/tracks` && req.method === 'PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    req.flush({ success: true });
  });

  it('should search tracks with proper query, headers, and params', () => {
    const query = 'test';
    const dummySearchResponse = { tracks: { items: [] } };

    service.searchTracks(query).subscribe(data => {
      expect(data).toEqual(dummySearchResponse);
    });

    const req = httpMock.expectOne(request =>
      request.url === `${API_BASE}/search` &&
      request.params.get('q') === query &&
      request.params.get('type') === 'track' &&
      request.params.get('limit') === '20'
    );
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    req.flush(dummySearchResponse);
  });
});
