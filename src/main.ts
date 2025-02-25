import 'hammerjs';

import { bootstrapApplication, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { HammerConfig } from './app/hammer-config';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig }
  ]
}).catch(err => console.error(err));
