import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileTrackItemComponent } from './mobile-track-item.component';
import { By } from '@angular/platform-browser';
import { SwipeToRemoveDirective } from '../../../../shared/directives/swipe-to-remove.directive';

describe('MobileTrackItemComponent', () => {
  let component: MobileTrackItemComponent;
  let fixture: ComponentFixture<MobileTrackItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileTrackItemComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTrackItemComponent);
    component = fixture.componentInstance;
    component.id = '123';
    component.title = 'Test Title';
    component.artist = 'Test Artist';
    component.albumArt = 'test.jpg';
    fixture.detectChanges();
  });

  it('should render track info correctly', () => {
    const compiled = fixture.nativeElement;
    const titleEl = compiled.querySelector('.track-info h6');
    const artistEl = compiled.querySelector('.track-info p');
    const imgEl: HTMLImageElement = compiled.querySelector('.album-art');
    expect(titleEl.textContent).toContain('Test Title');
    expect(artistEl.textContent).toContain('Test Artist');
    expect(imgEl.src).toContain('test.jpg');
  });

  it('should emit remove event when swipeRemove is triggered', () => {
    spyOn(component.remove, 'emit');
    const swipeEl = fixture.debugElement.query(By.directive(SwipeToRemoveDirective));
    swipeEl.triggerEventHandler('swipeRemove', null);
    expect(component.remove.emit).toHaveBeenCalledWith('123');
  });
});
