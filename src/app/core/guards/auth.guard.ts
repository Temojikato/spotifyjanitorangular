import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const token = localStorage.getItem('access_token');
    const tokenExpiry = localStorage.getItem('token_expiry');
    const refreshToken = localStorage.getItem('refresh_token');

    if (token && tokenExpiry && Date.now() < +tokenExpiry) {
      return of(true);
    }

    if (refreshToken) {
      return from(this.authService.refreshAccessToken()).pipe(
        map(() => true),
        catchError(() => of(this.router.createUrlTree(['/login'])))
      );
    }
    
    return of(this.router.createUrlTree(['/login']));
  }
}
