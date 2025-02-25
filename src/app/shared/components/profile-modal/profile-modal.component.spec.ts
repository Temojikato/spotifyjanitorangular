import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ProfileModalComponent, UserProfile } from './profile-modal.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileModalComponent', () => {
  let component: ProfileModalComponent;
  let fixture: ComponentFixture<ProfileModalComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ProfileModalComponent>>;

  const dummyProfile: UserProfile = {
    display_name: 'John Doe',
    images: [{ url: 'https://example.com/john-doe.jpg' }],
    product: 'premium',
    country: 'US',
    email: 'john.doe@example.com',
    id: 'john123',
    followers: { total: 100 },
    external_urls: { spotify: 'https://open.spotify.com/user/john123' }
  };

  beforeEach(waitForAsync(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [
        ProfileModalComponent,
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: AuthService, useValue: authSpy },
        { provide: MatDialogRef, useValue: dialogRefSpyObj }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ProfileModalComponent>>;
  }));

  beforeEach(() => {
    localStorage.setItem('user_profile', JSON.stringify(dummyProfile));
    fixture = TestBed.createComponent(ProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the profile modal component', () => {
    expect(component).toBeTruthy();
  });

  it('should load profile from localStorage on ngOnInit', () => {
    expect(component.profile).toEqual(dummyProfile);
  });

  it('should return correct profileImageUrl when profile is set', () => {
    expect(component.profileImageUrl).toBe(dummyProfile.images[0].url);
  });

  it('should close the dialog when onClose is called', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should logout and navigate to /login when logout is called', () => {
    component.logout();
    expect(dialogRefSpy.close).toHaveBeenCalled();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
