import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  private readonly analytics = inject(AnalyticsService);

  protected readonly signInHref = 'https://app.getmandateos.com/';
  protected readonly navLinks = [
    { label: 'Docs', path: '/docs' },
    { label: 'Integrations', path: '/docs/integrations' },
    { label: 'Pricing', path: '/pricing' },
  ];

  protected trackSignIn(): void {
    this.analytics.trackCtaClick('header', 'sign_in');
  }
}
