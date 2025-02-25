import { Component, HostListener, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SpotifyApiService } from '../../../shared/services/spotify-api.service';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { formatDuration } from '../../../shared/utils/format-duration';
import { ToastService } from '../../services/toast.service';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  addedAt: string;
  duration: string;
}

export interface AddSongModalData {
  existingTrackIds: string[];
  isMobile: boolean;
  onSongAdded?: (track: Track) => void;
  onSongRemoved?: (track: Track) => void;
}

@Component({
  selector: 'app-add-song-modal',
  standalone: true,
  templateUrl: './add-song-modal.component.html',
  styleUrls: ['./add-song-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class AddSongModalComponent {
  query = '';
  results: Track[] = [];
  isMobile: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddSongModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddSongModalData,
    private spotifyApi: SpotifyApiService,
    private toastService: ToastService
  ) {
    this.isMobile = data.isMobile;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkWindowSize();
  }

  checkWindowSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  async handleSearch(): Promise<void> {
    if (!this.query.trim()) return;
    try {
      const data: any = await this.spotifyApi.searchTracks(this.query).toPromise();
      this.results = data.tracks.items.map((item: any) => ({
        id: item.id,
        title: item.name,
        artist: item.artists[0].name,
        albumArt: item.album.images[0]?.url,
        album: item.album.name || '',
        addedAt: '',
        duration: formatDuration(item.duration_ms)
      }));
    } catch (error) {
      console.error(error);
      this.toastService.showMessage('Error searching tracks', 'Close');
    }
  }

  async handleAdd(track: Track): Promise<void> {
    try {
      await this.spotifyApi.saveUserTrack(track.id).toPromise();
      this.toastService.showMessage(`Added "${track.title}"`, 'Close');
      this.data.existingTrackIds.push(track.id);
      if (this.data.onSongAdded) {
        this.data.onSongAdded(track);
      }
    } catch (error) {
      console.error(error);
      this.toastService.showMessage('Error adding track', 'Close');
    }
  }

  async handleRemove(track: Track): Promise<void> {
    try {
      this.data.existingTrackIds = this.data.existingTrackIds.filter(id => id !== track.id);
      if (this.data.onSongRemoved) {
        this.data.onSongRemoved(track);
      }
      this.toastService.showMessage(`Removed "${track.title}"`, 'Close');
    } catch (error) {
      console.error(error);
      this.toastService.showMessage('Error removing track', 'Close');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
