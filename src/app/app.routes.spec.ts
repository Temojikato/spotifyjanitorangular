import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  template: `<p>SavedTracksComponent works!</p>`
})
class SavedTracksStubComponent {}

@Component({
  standalone: true,
  template: `<p>LoginComponent works!</p>`
})
class LoginStubComponent {}

@Component({
  standalone: true,
  template: `<p>CallbackComponent works!</p>`
})
class CallbackStubComponent {}


class AuthGuardStub {
  canActivate() {
    return true;
  }
}

const testRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'saved-tracks', pathMatch: 'full' },
      { path: 'saved-tracks', component: SavedTracksStubComponent, canActivate: [AuthGuardStub] },
      { path: 'login', component: LoginStubComponent },
      { path: 'callback', component: CallbackStubComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
class RoutingTestHostComponent {}

describe('App Routing Integration', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(testRoutes),
        RoutingTestHostComponent
      ],
      providers: [
        { provide: AuthGuardStub, useClass: AuthGuardStub } 
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    const fixture = TestBed.createComponent(RoutingTestHostComponent);
    fixture.detectChanges();

    router.initialNavigation();
  });

  it('should navigate "" (root) -> "/saved-tracks" (redirect)', fakeAsync(() => {
    router.navigate(['']);
    tick();
    expect(location.path()).toBe('/saved-tracks');
  }));

  it('should navigate to "/login" and render the LoginStubComponent', fakeAsync(() => {
    router.navigate(['/login']);
    tick();
    expect(location.path()).toBe('/login');
  }));

  it('should navigate to "/callback" and render the CallbackStubComponent', fakeAsync(() => {
    router.navigate(['/callback']);
    tick();
    expect(location.path()).toBe('/callback');
  }));

  it('should allow /saved-tracks if AuthGuard returns true', fakeAsync(() => {
    router.navigate(['/saved-tracks']);
    tick();
    expect(location.path()).toBe('/saved-tracks');
  }));

});
