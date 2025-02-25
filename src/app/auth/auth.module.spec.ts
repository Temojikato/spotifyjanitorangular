import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthModule } from './auth.module';
import { Location } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { CallbackComponent } from './components/callback/callback.component';

describe('AuthModule Integration', () => {
  let router: Router;
  let location: Location;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AuthModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
          { path: 'callback', component: CallbackComponent }
        ])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  }));

  it('should navigate to /login', waitForAsync(() => {
    router.navigate(['/login']).then(() => {
      expect(location.path()).toBe('/login');
    });
  }));

  it('should navigate to /callback', waitForAsync(() => {
    router.navigate(['/callback']).then(() => {
      expect(location.path()).toBe('/callback');
    });
  }));
});
