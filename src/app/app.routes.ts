import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { SavedTracksComponent } from './features/saved-tracks/saved-tracks.component';
import { LoginComponent } from './auth/components/login/login.component';
import { CallbackComponent } from './auth/components/callback/callback.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'saved-tracks', pathMatch: 'full' },
      { path: 'saved-tracks', component: SavedTracksComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'callback', component: CallbackComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
