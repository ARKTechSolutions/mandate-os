import { Component, inject } from '@angular/core';
import { MANDATE_OS_CONTENT } from '../mandate-os-content';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss',
})
export class SiteFooterComponent {
  private readonly analytics = inject(AnalyticsService);

  protected readonly content = MANDATE_OS_CONTENT;
  protected readonly year = new Date().getFullYear();

  protected openCookiePreferences(): void {
    this.analytics.requestOpenPreferences();
  }
}
