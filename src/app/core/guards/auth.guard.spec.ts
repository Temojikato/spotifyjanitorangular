import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['refreshAccessToken']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree']);
    routerSpyObj.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow activation if a valid token exists', fakeAsync(() => {
    localStorage.setItem('access_token', 'valid-token');
    localStorage.setItem('token_expiry', (Date.now() + 10000).toString());

    let result: boolean | UrlTree | undefined;
    guard.canActivate({} as any, {} as any).subscribe(r => result = r);
    tick();
    expect(result).toBe(true);
  }));

  it('should refresh token and allow activation if refresh token exists', fakeAsync(() => {
    localStorage.setItem('access_token', 'expired-token');
    localStorage.setItem('token_expiry', (Date.now() - 1000).toString());
    localStorage.setItem('refresh_token', 'refresh-token');

    authServiceSpy.refreshAccessToken.and.returnValue(Promise.resolve({ access_token: 'new-token', expires_in: 3600 }));

    let result: boolean | UrlTree | undefined;
    guard.canActivate({} as any, {} as any).subscribe(r => result = r);
    tick();
    expect(authServiceSpy.refreshAccessToken).toHaveBeenCalled();
    expect(result).toBe(true);
  }));

  it('should return a UrlTree (redirect to /login) if no valid token or refresh token exists', fakeAsync(() => {
    let result: boolean | UrlTree | undefined;
    guard.canActivate({} as any, {} as any).subscribe(r => result = r);
    tick();
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual(routerSpy.createUrlTree.calls.mostRecent().returnValue);
  }));

  it('should return a UrlTree if refreshAccessToken fails', fakeAsync(() => {
    localStorage.setItem('access_token', 'expired-token');
    localStorage.setItem('token_expiry', (Date.now() - 1000).toString());
    localStorage.setItem('refresh_token', 'refresh-token');

    authServiceSpy.refreshAccessToken.and.returnValue(Promise.reject(new Error('Refresh failed')));

    let result: boolean | UrlTree | undefined;
    guard.canActivate({} as any, {} as any).subscribe(r => result = r);
    tick();
    expect(authServiceSpy.refreshAccessToken).toHaveBeenCalled();
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual(routerSpy.createUrlTree.calls.mostRecent().returnValue);
  }));
});
