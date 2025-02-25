import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should successfully get token and update localStorage', async () => {
    const code = 'test-code';
    localStorage.setItem('code_verifier', 'test-verifier');

    const mockResponse = {
      access_token: 'access123',
      expires_in: 3600,
      refresh_token: 'refresh123'
    };

    const tokenPromise = service.getToken(code);
    const req = httpMock.expectOne('https://accounts.spotify.com/api/token');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
    const data = await tokenPromise;

    expect(data.access_token).toEqual('access123');
    expect(localStorage.getItem('access_token')).toEqual('access123');
    expect(localStorage.getItem('refresh_token')).toEqual('refresh123');
    expect(localStorage.getItem('token_expiry')).toBeTruthy();
  });

  it('should refresh token successfully', async () => {
    localStorage.setItem('refresh_token', 'refresh123');
    const mockResponse = {
      access_token: 'newAccess123',
      expires_in: 3600
    };

    const refreshPromise = service.refreshAccessToken();
    const req = httpMock.expectOne('https://accounts.spotify.com/api/token');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
    const response = await refreshPromise;
    expect(response.access_token).toEqual('newAccess123');
    expect(localStorage.getItem('access_token')).toEqual('newAccess123');
  });

  it('should logout and navigate to /login on invalid_grant error during refresh', async () => {
    localStorage.setItem('refresh_token', 'refresh123');
    spyOn(service, 'logout').and.callThrough();

    let errorCaught: any;
    const refreshPromise = service.refreshAccessToken().catch(err => errorCaught = err);
    const req = httpMock.expectOne('https://accounts.spotify.com/api/token');
    req.flush(
      { error: 'invalid_grant', error_description: 'Refresh token revoked' },
      { status: 400, statusText: 'Bad Request' }
    );
    await refreshPromise;
    expect(service.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(errorCaught).toBeDefined();
  });
});
