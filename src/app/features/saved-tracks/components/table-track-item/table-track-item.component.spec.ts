import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TableTrackItemComponent } from './table-track-item.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('TableTrackItemComponent', () => {
  let component: TableTrackItemComponent;
  let fixture: ComponentFixture<TableTrackItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableTrackItemComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTrackItemComponent);
    component = fixture.componentInstance;
    component.id = 'track-123';
    component.title = 'Test Track';
    component.artist = 'Test Artist';
    component.album = 'Test Album';
    component.albumArt = 'test-art.jpg';
    component.addedAt = '2025-01-01';
    component.duration = '3:45';
    component.containerWidth = 100;
    component.threshold = 50;
    fixture.detectChanges();
  });

  it('should render track info correctly', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.track-info .title').textContent).toContain('Test Track');
    expect(compiled.querySelector('.track-info .artist').textContent).toContain('Test Artist');
    const imgEl: HTMLImageElement = compiled.querySelector('.album-cell img');
    expect(imgEl.src).toContain('test-art.jpg');
  });

  it('should emit remove event when swipeDelta exceeds threshold', fakeAsync(() => {
    spyOn(component.remove, 'emit');
    component.dragMoveListener({ dx: 500 });
    tick();
    component.dragEndListener({ dx: 0 });
    tick();
    expect(component.remove.emit).toHaveBeenCalledWith('track-123');
  }));

  it('should not emit remove event if swipeDelta is below threshold', fakeAsync(() => {
    spyOn(component.remove, 'emit');
    component.dragMoveListener({ dx: 20 });
    tick();
    component.dragEndListener({ dx: 0 });
    tick();
    expect(component.remove.emit).not.toHaveBeenCalled();
  }));
});
