import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        LayoutComponent,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the layout component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a container with class "layout-container"', () => {
    const containerEl = fixture.nativeElement.querySelector('.layout-container');
    expect(containerEl).toBeTruthy();
  });

  it('should render <app-header> inside the layout', () => {
    const headerEl = fixture.nativeElement.querySelector('app-header');
    expect(headerEl).toBeTruthy();
  });

  it('should render a router-outlet in the content area', () => {
    const routerOutletEl = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutletEl).toBeTruthy();
  });

  it('should render a child element with class "content"', () => {
    const contentEl = fixture.nativeElement.querySelector('.content');
    expect(contentEl).toBeTruthy();
  });
});
