import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedTracksComponent } from './saved-tracks.component';
import { TracksRoutingModule } from './saved-tracks-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, TracksRoutingModule, SharedModule, SavedTracksComponent]
})
export class TracksModule {}
