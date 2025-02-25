import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MobileTrackItemComponent } from './components/mobile-track-item/mobile-track-item.component';
import { TableTrackItemComponent } from './components/table-track-item/table-track-item.component';
import { SpotifyApiService } from '../../shared/services/spotify-api.service';
import { UndoToastComponent } from '../../shared/components/undo-toast/undo-toast.component';
import { PullToRefreshDirective } from '../../shared/directives/pull-to-refresh.directive';
import { AddSongModalComponent } from '../../shared/components/add-song-modal/add-song-modal.component';
import { formatDuration } from '../../shared/utils/format-duration';
import { ToastService } from '../../shared/services/toast.service';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  addedAt: string;
  duration: string;
}

@Component({
  selector: 'app-saved-tracks',
  standalone: true,
  templateUrl: './saved-tracks.component.html',
  styleUrls: ['./saved-tracks.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MobileTrackItemComponent,
    TableTrackItemComponent,
    PullToRefreshDirective
  ]
})
export class SavedTracksComponent implements OnInit {
  tracks: Track[] = [];
  filteredTracks: Track[] = [];
  searchQuery = '';
  refreshing = false;
  isMobile = false;
  pullProgress = 0;

  constructor(
    private spotifyApi: SpotifyApiService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('access_token')) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchTracks();
    this.breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  async fetchTracks(force = false): Promise<void> {
    this.refreshing = true;
    this.spotifyApi.getUserSavedTracks(force).subscribe({
      next: (data: any) => {
        const formatted: Track[] = data.items.map((item: any) => ({
          id: item.track.id,
          title: item.track.name,
          artist: item.track.artists[0].name,
          album: item.track.album.name,
          albumArt: item.track.album.images[0]?.url,
          addedAt: new Date(item.added_at).toLocaleDateString(),
          duration: formatDuration(item.track.duration_ms)
        }));
        this.tracks = formatted;
        this.filteredTracks = formatted;
        this.refreshing = false;
      },
      error: (error: any) => {
        console.error('Failed to load saved tracks', error);
        this.toastService.showMessage('Failed to load saved tracks', 'Close');
        this.refreshing = false;
      }
    });
  }

  onSearchQueryChange(query: string): void {
    this.searchQuery = query;
    this.filteredTracks = query.trim() === ''
      ? this.tracks
      : this.tracks.filter(track =>
          track.title.toLowerCase().includes(query.toLowerCase()) ||
          track.artist.toLowerCase().includes(query.toLowerCase())
        );
  }

  onRefresh(): void {
    this.fetchTracks(true);
  }

  handleRemove(trackId: string): void {
    const track = this.tracks.find(t => t.id === trackId);
    if (!track) return;
    this.tracks = this.tracks.filter(t => t.id !== trackId);
    this.filteredTracks = this.filteredTracks.filter(t => t.id !== trackId);
    this.spotifyApi.removeUserSavedTrack(trackId).subscribe({
      next: () => {
        this.toastService.showUndoToast(track.title, () => this.undoRemoval(track));
      },
      error: (error: any) => {
        console.error('Error removing track', error);
        this.toastService.showMessage('Error removing track', 'Close');
      }
    });
  }

  undoRemoval(track: Track): void {
    this.spotifyApi.saveUserTrack(track.id).subscribe({
      next: () => {
        this.tracks.unshift(track);
        this.filteredTracks.unshift(track);
        this.toastService.showMessage(`Re-added "${track.title}"`, 'Close');
      },
      error: (error: any) => {
        console.error('Error re-adding track', error);
        this.toastService.showMessage('Error re-adding track', 'Close');
      }
    });
  }

  openAddSongModal(): void {
    this.dialog.open(AddSongModalComponent, {
      width: '90vw',
      maxWidth: '90vw',
      data: {
        existingTrackIds: this.tracks.map(t => t.id),
        isMobile: this.isMobile,
        onSongAdded: (track: Track) => this.handleSongAdded(track),
        onSongRemoved: (track: Track) => this.handleRemove(track.id)
      },
      panelClass: 'custom-add-song-modal'
    });
  }

  handleSongAdded(newTrack: Track): void {
    if (!this.tracks.some(track => track.id === newTrack.id)) {
      this.tracks.unshift(newTrack);
    }
  }
}
