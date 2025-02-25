import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CallbackComponent } from './callback.component';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [CallbackComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    window.history.pushState({}, 'Test', '?code=test-code');
    authServiceSpy.getToken.and.returnValue(Promise.resolve({ access_token: 'access123', expires_in: 3600 }));
    localStorage.setItem('access_token', 'access123');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should call getToken, fetch profile, and navigate on valid code', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const req = httpMock.expectOne('https://api.spotify.com/v1/me');
    const mockProfile = { images: [{ url: 'profile.jpg' }], display_name: 'Test User' };
    req.flush(mockProfile);
    tick();

    expect(authServiceSpy.getToken).toHaveBeenCalledWith('test-code');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/saved-tracks']);
    expect(localStorage.getItem('profile_pic')).toEqual('profile.jpg');
  }));

  it('should log an error if code is not found', fakeAsync(() => {
    spyOn(console, 'error');
    window.history.pushState({}, 'Test', '');
    fixture.detectChanges();
    tick();
    expect(console.error).toHaveBeenCalledWith('Code not found');
  }));
});
