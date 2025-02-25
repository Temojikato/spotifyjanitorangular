import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PullToRefreshDirective } from './pull-to-refresh.directive';

@Component({
  standalone: true,
  selector: 'app-test-host',
  template: `
    <div
      appPullToRefresh
      (refresh)="onRefresh()"
      (pullProgress)="onPull($event)"
      style="height:300px; overflow:auto;">
      Test Content
    </div>
  `,
  imports: [PullToRefreshDirective] // Import the directive here!
})
export class TestHostComponent {
  refreshCalled = false;
  progress: number | null = null;
  onRefresh() {
    this.refreshCalled = true;
  }
  onPull(value: number) {
    this.progress = value;
  }
}


describe('PullToRefreshDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let directiveDebugEl = null as HTMLElement | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.directive(PullToRefreshDirective));
    expect(debugEl).toBeTruthy('Expected to find the directive on the element');
    directiveDebugEl = debugEl.nativeElement;
  });

  it('should emit pullProgress on touchmove', fakeAsync(() => {
    const touchStart = new TouchEvent('touchstart', {
      touches: [new Touch({ identifier: 0, target: directiveDebugEl!, clientY: 0 })]
    });
    directiveDebugEl!.dispatchEvent(touchStart);
    tick();
    fixture.detectChanges();

    const touchMove = new TouchEvent('touchmove', {
      touches: [new Touch({ identifier: 0, target: directiveDebugEl!, clientY: 100 })]
    });
    directiveDebugEl!.dispatchEvent(touchMove);
    tick();
    fixture.detectChanges();

    expect(hostComponent.progress).toBeCloseTo(0.5, 1);
  }));

  it('should emit refresh when threshold is exceeded and then reset transform', fakeAsync(() => {
    const touchStart = new TouchEvent('touchstart', {
      touches: [new Touch({ identifier: 0, target: directiveDebugEl!, clientY: 0 })]
    });
    directiveDebugEl!.dispatchEvent(touchStart);
    tick();
    fixture.detectChanges();

    const touchMove = new TouchEvent('touchmove', {
      touches: [new Touch({ identifier: 0, target: directiveDebugEl!, clientY: 250 })]
    });
    directiveDebugEl!.dispatchEvent(touchMove);
    tick();
    fixture.detectChanges();

    expect(hostComponent.refreshCalled).toBeTrue();

    tick(300);
    fixture.detectChanges();
    expect(directiveDebugEl!.style.transform).toBe('translateY(0px)');
  }));
});
