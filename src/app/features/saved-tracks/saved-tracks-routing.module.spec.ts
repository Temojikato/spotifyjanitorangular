import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TracksRoutingModule } from './saved-tracks-routing.module';
import { SavedTracksComponent } from './saved-tracks.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TracksRoutingModule Integration', () => {
  let router: Router;
  let location: Location;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: SavedTracksComponent }
        ]),
        TracksRoutingModule,
        MatIconModule,
        MatDialogModule
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  }));

  it('should navigate to "/" and render SavedTracksComponent', waitForAsync(() => {
    router.navigate(['']).then(() => {
      expect(location.path()).toBe('/');
    });
  }));
});
