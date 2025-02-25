import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['redirectToSpotifyAuth']);
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call redirectToSpotifyAuth on handleLogin', async () => {
    authServiceSpy.redirectToSpotifyAuth.and.returnValue(Promise.resolve());
    await component.handleLogin();
    expect(authServiceSpy.redirectToSpotifyAuth).toHaveBeenCalled();
  });

  it('should log error if redirectToSpotifyAuth throws', async () => {
    spyOn(console, 'error');
    authServiceSpy.redirectToSpotifyAuth.and.returnValue(Promise.reject('error'));
    await component.handleLogin();
    expect(console.error).toHaveBeenCalledWith('Login error', 'error');
  });
});
