import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { appRoutes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(appRoutes)],
    }).compileComponents();
  });

  it('renders the MandateOS shell with header, outlet, and footer', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('site-header')).not.toBeNull();
    expect(compiled.querySelector('main router-outlet')).not.toBeNull();
    expect(compiled.querySelector('site-footer')).not.toBeNull();
    expect(compiled.querySelector('.brand-name')?.textContent).toContain('MandateOS');
  });
});
