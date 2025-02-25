import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { SavedTracksComponent, Track } from './saved-tracks.component';
import { of } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SpotifyApiService } from '../../shared/services/spotify-api.service';
import { ToastService } from '../../shared/services/toast.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

class FakeMatDialog {
  open(...args: any[]) {
    return {
      afterClosed: () => of(true),
      close: () => {}
    };
  }
}

class FakeOverlayContainer {
  private containerElement: HTMLElement;
  constructor() {
    this.containerElement = document.createElement('div');
    this.containerElement.classList.add('cdk-overlay-container');
    document.body.appendChild(this.containerElement);
  }
  getContainerElement() {
    return this.containerElement;
  }
  ngOnDestroy() {
    this.containerElement.remove();
  }
}

describe('SavedTracksComponent', () => {
  let component: SavedTracksComponent;
  let fixture: ComponentFixture<SavedTracksComponent>;
  let spotifyApiSpy: jasmine.SpyObj<SpotifyApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;

  const dummyResponse = {
    items: [
      {
        track: {
          id: '1',
          name: 'Track One',
          artists: [{ name: 'Artist A' }],
          album: { name: 'Album X', images: [{ url: 'art1.jpg' }] },
          duration_ms: 210000
        },
        added_at: '2025-01-01T00:00:00Z'
      },
      {
        track: {
          id: '2',
          name: 'Track Two',
          artists: [{ name: 'Artist B' }],
          album: { name: 'Album Y', images: [{ url: 'art2.jpg' }] },
          duration_ms: 240000
        },
        added_at: '2025-02-01T00:00:00Z'
      }
    ]
  };

  beforeEach(waitForAsync(() => {
    const spotifySpy = jasmine.createSpyObj('SpotifyApiService', [
      'getUserSavedTracks',
      'removeUserSavedTrack',
      'saveUserTrack'
    ]);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['showMessage', 'showUndoToast']);
    const breakpointSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    breakpointSpy.observe.and.returnValue(of({ matches: false, breakpoints: {} } as BreakpointState));

    TestBed.configureTestingModule({
      imports: [
        SavedTracksComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        MatIconModule,
        MatDialogModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        FormsModule
      ],
      providers: [
        { provide: SpotifyApiService, useValue: spotifySpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: MatDialog, useClass: FakeMatDialog },
        { provide: ToastService, useValue: toastSpy },
        { provide: BreakpointObserver, useValue: breakpointSpy },
        { provide: OverlayContainer, useClass: FakeOverlayContainer }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    spotifyApiSpy = TestBed.inject(SpotifyApiService) as jasmine.SpyObj<SpotifyApiService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    breakpointObserverSpy = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
  }));

  beforeEach(() => {
    localStorage.setItem('access_token', 'dummy-token');
    fixture = TestBed.createComponent(SavedTracksComponent);
    component = fixture.componentInstance;
    spotifyApiSpy.getUserSavedTracks.and.returnValue(of({ items: [] }));
    spotifyApiSpy.removeUserSavedTrack.and.returnValue(of({}));
    spotifyApiSpy.saveUserTrack.and.returnValue(of({}));
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should navigate to /login if no access token exists', fakeAsync(() => {
    localStorage.clear();
    component.ngOnInit();
    tick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should fetch tracks and update tracks/filteredTracks', fakeAsync(() => {
    spotifyApiSpy.getUserSavedTracks.and.returnValue(of(dummyResponse));
    component.fetchTracks();
    tick();
    expect(component.tracks.length).toBe(2);
    expect(component.filteredTracks.length).toBe(2);
    expect(component.refreshing).toBeFalse();
    expect(component.tracks[0].title).toBe('Track One');
  }));

  it('should filter tracks based on search query', () => {
    const mappedTracks = dummyResponse.items.map(item => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists[0].name,
      album: item.track.album.name,
      albumArt: item.track.album.images[0]?.url,
      addedAt: new Date(item.added_at).toLocaleDateString(),
      duration: '3:30'
    }));
    component.tracks = mappedTracks;
    component.filteredTracks = [...mappedTracks];
    component.onSearchQueryChange('One');
    expect(component.filteredTracks.length).toBe(1);
    expect(component.filteredTracks[0].id).toBe('1');
    component.onSearchQueryChange('');
    expect(component.filteredTracks.length).toBe(2);
  });

  it('should handle remove event and call removeUserSavedTrack', fakeAsync(() => {
    const mappedTracks = dummyResponse.items.map(item => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists[0].name,
      album: item.track.album.name,
      albumArt: item.track.album.images[0]?.url,
      addedAt: new Date(item.added_at).toLocaleDateString(),
      duration: '3:30'
    }));
    component.tracks = mappedTracks;
    component.filteredTracks = [...mappedTracks];
    spotifyApiSpy.removeUserSavedTrack.and.returnValue(of({}));
    component.handleRemove('1');
    tick();
    expect(spotifyApiSpy.removeUserSavedTrack).toHaveBeenCalledWith('1');
    expect(component.tracks.length).toBe(1);
    expect(component.filteredTracks.length).toBe(1);
  }));

  it('should call toastService.showUndoToast on successful remove', fakeAsync(() => {
    const mappedTracks = dummyResponse.items.map(item => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists[0].name,
      album: item.track.album.name,
      albumArt: item.track.album.images[0]?.url,
      addedAt: new Date(item.added_at).toLocaleDateString(),
      duration: '3:30'
    }));
    component.tracks = mappedTracks;
    component.filteredTracks = [...mappedTracks];
    spotifyApiSpy.removeUserSavedTrack.and.returnValue(of({}));
    component.handleRemove('1');
    tick();
    expect(toastServiceSpy.showUndoToast).toHaveBeenCalled();
  }));

  it('should handle undoRemoval and call saveUserTrack', fakeAsync(() => {
    component.tracks = [];
    component.filteredTracks = [];
    const track = {
      id: '1',
      title: 'Track One',
      artist: 'Artist A',
      album: 'Album X',
      albumArt: 'art1.jpg',
      addedAt: new Date('2025-01-01T00:00:00Z').toLocaleDateString(),
      duration: '3:30'
    };
    spotifyApiSpy.saveUserTrack.and.returnValue(of({}));
    component.undoRemoval(track);
    tick();
    expect(spotifyApiSpy.saveUserTrack).toHaveBeenCalledWith('1');
    expect(component.tracks[0]).toEqual(track);
    expect(component.filteredTracks[0]).toEqual(track);
  }));
});
