import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { AddSongModalComponent, AddSongModalData, Track } from './add-song-modal.component';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SpotifyApiService } from '../../../shared/services/spotify-api.service';
import { ToastService } from '../../services/toast.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AddSongModalComponent', () => {
  let component: AddSongModalComponent;
  let fixture: ComponentFixture<AddSongModalComponent>;
  let spotifyApiSpy: jasmine.SpyObj<SpotifyApiService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddSongModalComponent>>;
  const dialogData: AddSongModalData = {
    existingTrackIds: ['existing1'],
    isMobile: false,
    onSongAdded: jasmine.createSpy('onSongAdded'),
    onSongRemoved: jasmine.createSpy('onSongRemoved')
  };

  const dummySearchResponse = {
    tracks: {
      items: [
        {
          id: '1',
          name: 'New Track',
          artists: [{ name: 'New Artist' }],
          album: { name: 'New Album', images: [{ url: 'new-art.jpg' }] },
          duration_ms: 200000
        },
        {
          id: '2',
          name: 'Another Track',
          artists: [{ name: 'Another Artist' }],
          album: { name: 'Another Album', images: [{ url: 'another-art.jpg' }] },
          duration_ms: 230000
        }
      ]
    }
  };

  beforeEach(waitForAsync(() => {
    const spotifySpy = jasmine.createSpyObj('SpotifyApiService', ['searchTracks', 'saveUserTrack']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['showMessage']);
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      imports: [
        AddSongModalComponent,
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        { provide: SpotifyApiService, useValue: spotifySpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: dialogData }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    spotifyApiSpy = TestBed.inject(SpotifyApiService) as jasmine.SpyObj<SpotifyApiService>;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AddSongModalComponent>>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSongModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the add song modal component', () => {
    expect(component).toBeTruthy();
  });

  it('should perform a search and update results when handleSearch is called', fakeAsync(() => {
    component.query = 'test';
    spotifyApiSpy.searchTracks.and.returnValue(of(dummySearchResponse));
    component.handleSearch();
    tick();
    expect(component.results.length).toBe(2);
    expect(component.results[0].title).toBe('New Track');
  }));

  it('should show error message when search fails', fakeAsync(() => {
    component.query = 'error';
    spotifyApiSpy.searchTracks.and.returnValue(throwError(() => new Error('Search failed')));
    spyOn(console, 'error');
    component.handleSearch();
    tick();
    expect(console.error).toHaveBeenCalled();
    expect(toastServiceSpy.showMessage).toHaveBeenCalledWith('Error searching tracks', 'Close');
  }));

  it('should call saveUserTrack and update existingTrackIds when handleAdd is called', fakeAsync(() => {
    const track: Track = {
      id: 'new1',
      title: 'New Track',
      artist: 'New Artist',
      album: 'New Album',
      albumArt: 'new-art.jpg',
      addedAt: '',
      duration: '3:20'
    };
    spotifyApiSpy.saveUserTrack.and.returnValue(of({}));
    component.handleAdd(track);
    tick();
    expect(dialogData.existingTrackIds).toContain(track.id);
    expect(dialogData.onSongAdded).toHaveBeenCalledWith(track);
    expect(toastServiceSpy.showMessage).toHaveBeenCalledWith(`Added "${track.title}"`, 'Close');
  }));

  it('should remove track id from existingTrackIds when handleRemove is called', fakeAsync(() => {
    dialogData.existingTrackIds = ['new1', 'new2'];
    const track: Track = {
      id: 'new1',
      title: 'New Track',
      artist: 'New Artist',
      album: 'New Album',
      albumArt: 'new-art.jpg',
      addedAt: '',
      duration: '3:20'
    };
    component.handleRemove(track);
    tick();
    expect(dialogData.existingTrackIds).not.toContain('new1');
    expect(dialogData.onSongRemoved).toHaveBeenCalledWith(track);
    expect(toastServiceSpy.showMessage).toHaveBeenCalledWith(`Removed "${track.title}"`, 'Close');
  }));

  it('should close the dialog when onClose is called', () => {
    component.onClose();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
