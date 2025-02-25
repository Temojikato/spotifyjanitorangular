import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { of, BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../auth/services/auth.service';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

class FakeAuthService {
  isLoggedIn$ = of(true);
  logout() {}
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(waitForAsync(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate'], {
      events: of(new NavigationEnd(0, '/saved-tracks', '/saved-tracks'))
    });
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
    const breakpointSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    breakpointSpy.observe.and.returnValue(of({ matches: false, breakpoints: {} } as BreakpointState));

    TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule
      ],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: MatDialog, useValue: dialogSpyObj },
        { provide: BreakpointObserver, useValue: breakpointSpy },
        { provide: AuthService, useClass: FakeAuthService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    breakpointObserverSpy = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should update isMobile from BreakpointObserver', fakeAsync(() => {
    breakpointObserverSpy.observe.and.returnValue(of({ matches: true, breakpoints: {} } as BreakpointState));
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.isMobile).toBeTrue();
  }));

  it('should update isLoggedIn from AuthService subscription', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.isLoggedIn).toBeTrue();
  }));

  it('should call router.navigate on handleTitleClick', () => {
    component.handleTitleClick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/saved-tracks']);
  });

  it('should call window.history.back on handleBack', () => {
    spyOn(window.history, 'back');
    component.handleBack();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should update profilePicUrl and profileLoaded from localStorage', fakeAsync(() => {
    localStorage.setItem('profile_pic', 'new-pic-url');
    component.checkProfilePic();
    tick(500);
    fixture.detectChanges();
    expect(component.profilePicUrl).toBe('new-pic-url');
    expect(component.profileLoaded).toBeTrue();
  }));
});
