import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import Hammer from 'hammerjs';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
  override overrides = {
    pan: { direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }
  };

  override buildHammer(element: HTMLElement) {
    console.log('Building Hammer instance for element:', element);
    const mc = new Hammer(element, {
      cssProps: { touchAction: 'pan-y' } as any,
      inputClass: Hammer.MouseInput
    });
    return mc;
  }
  
}
