import { TestBed } from '@angular/core/testing';
import { CoreModule } from './core.module';

describe('CoreModule', () => {
  it('should throw an error if imported twice', () => {
    TestBed.configureTestingModule({
      imports: [CoreModule]
    });
    expect(() => TestBed.inject(CoreModule)).not.toThrow();

    expect(() => new CoreModule(TestBed.inject(CoreModule))).toThrowError(
      'CoreModule is already loaded. Import it in the AppModule only.'
    );
  });
});
