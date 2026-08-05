import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter } from 'rxjs';

export const COOKIE_CONSENT_STORAGE_KEY = 'mandateos_cookie_consent';
export type CookieConsentValue = 'granted' | 'denied';

type GtagCommand = 'config' | 'event' | 'js' | 'set' | 'consent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly preferencesRequest$ = new Subject<void>();
  private pageViewsInitialized = false;

  readonly openPreferences$ = this.preferencesRequest$.asObservable();

  requestOpenPreferences(): void {
    this.clearConsent();
    this.preferencesRequest$.next();
  }

  initPageViews(): void {
    if (!isPlatformBrowser(this.platformId) || this.pageViewsInitialized) {
      return;
    }

    this.pageViewsInitialized = true;
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.trackPageView(event.urlAfterRedirects);
      });
  }

  trackPageView(path: string): void {
    const params: Record<string, string> = { page_path: path };
    if (isPlatformBrowser(this.platformId)) {
      params['page_title'] = document.title;
      params['page_location'] = window.location.href;
    }
    this.gtag('event', 'page_view', params);
  }

  trackEvent(name: string, params?: Record<string, string | number | boolean>): void {
    if (params) {
      this.gtag('event', name, params);
      return;
    }
    this.gtag('event', name);
  }

  trackCtaClick(location: string, label: string): void {
    this.trackEvent('cta_click', {
      cta_location: location,
      cta_label: label,
    });
  }

  getStoredConsent(): CookieConsentValue | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const value = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  }

  setConsent(granted: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const value: CookieConsentValue = granted ? 'granted' : 'denied';
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
    this.updateConsent(granted);

    if (granted) {
      this.trackPageView(window.location.pathname + window.location.search + window.location.hash);
    }
  }

  clearConsent(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
    this.updateConsent(false);
  }

  updateConsent(granted: boolean): void {
    const state = granted ? 'granted' : 'denied';
    this.gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
  }

  private gtag(command: GtagCommand, ...args: unknown[]): void {
    if (!isPlatformBrowser(this.platformId) || typeof window.gtag !== 'function') {
      return;
    }

    window.gtag(command, ...args);
  }
}
