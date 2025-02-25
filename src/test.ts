import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

bootstrap();

function bootstrap(): void {
  getTestBed().initTestEnvironment(
    [
      BrowserDynamicTestingModule,
      NoopAnimationsModule
    ],
    platformBrowserDynamicTesting()
  );
}
