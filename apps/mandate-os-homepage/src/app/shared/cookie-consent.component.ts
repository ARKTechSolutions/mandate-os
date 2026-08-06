import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss',
})
export class CookieConsentComponent implements OnInit, OnDestroy {
  private readonly analytics = inject(AnalyticsService);
  private readonly platformId = inject(PLATFORM_ID);
  private preferencesSub?: Subscription;

  protected readonly visible = signal(false);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const stored = this.analytics.getStoredConsent();
    if (stored) {
      this.analytics.updateConsent(stored === 'granted');
      this.visible.set(false);
    } else {
      this.visible.set(true);
    }

    this.preferencesSub = this.analytics.openPreferences$.subscribe(() => {
      this.visible.set(true);
    });
  }

  ngOnDestroy(): void {
    this.preferencesSub?.unsubscribe();
  }

  protected accept(): void {
    this.analytics.setConsent(true);
    this.visible.set(false);
  }

  protected reject(): void {
    this.analytics.setConsent(false);
    this.visible.set(false);
  }
}
