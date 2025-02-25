import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SwipeToRemoveDirective } from './swipe-to-remove.directive';
import * as interactModule from 'interactjs';

@Component({
  standalone: true,
  selector: 'app-swipe-host',
  template: `
    <div appSwipeToRemove (swipeRemove)="onSwipeRemove()" style="width:300px;">
      Swipe Test Content
    </div>
  `,
  imports: [SwipeToRemoveDirective]
})
export class SwipeTestHostComponent {
  swipeRemoved = false;
  onSwipeRemove() {
    this.swipeRemoved = true;
  }
}

describe('SwipeToRemoveDirective', () => {
  let fixture: ComponentFixture<SwipeTestHostComponent>;
  let hostComponent: SwipeTestHostComponent;
  let directiveDebugEl = null as HTMLElement | null;
  let directiveInstance: SwipeToRemoveDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwipeTestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SwipeTestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.directive(SwipeToRemoveDirective));
    expect(debugEl).toBeTruthy('Expected to find SwipeToRemoveDirective on element');
    directiveDebugEl = debugEl.nativeElement;
    directiveInstance = debugEl.injector.get(SwipeToRemoveDirective);
  });

  it('should update transform on drag move (simulate move event)', () => {
    const fakeEvent = { dx: 100 };
    (directiveInstance as any).onDragMove(fakeEvent);
    expect(directiveInstance.transform).toBe('translateX(50px)');
  });

  it('should emit swipeRemove when threshold is exceeded and reset transform', () => {
    directiveInstance.containerWidth = 300;
    directiveInstance.threshold = 150;
    const fakeEvent = { dx: 200 };
    (directiveInstance as any).onDragMove(fakeEvent);
    spyOn(directiveInstance.swipeRemove, 'emit');
    (directiveInstance as any).onDragEnd();
    expect(directiveInstance.swipeRemove.emit).toHaveBeenCalled();
    expect(directiveInstance.transform).toBe('translateX(0px)');
  });
});