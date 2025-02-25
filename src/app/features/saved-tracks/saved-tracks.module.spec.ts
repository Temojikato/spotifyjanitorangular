import { TestBed } from '@angular/core/testing';
import { TracksModule } from './saved-tracks.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SavedTracksComponent } from './saved-tracks.component';

describe('TracksModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TracksModule, HttpClientTestingModule]
    });
  });

  it('should compile the module and create SavedTracksComponent', () => {
    const fixture = TestBed.createComponent(SavedTracksComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
