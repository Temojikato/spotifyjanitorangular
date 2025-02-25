import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SavedTracksComponent } from './saved-tracks.component';

const routes: Routes = [{ path: '', component: SavedTracksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TracksRoutingModule {}
