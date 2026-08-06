import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnalyticsService } from './shared/analytics.service';
import { CookieConsentComponent } from './shared/cookie-consent.component';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteHeaderComponent } from './shared/site-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SiteHeaderComponent,
    SiteFooterComponent,
    CookieConsentComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.initPageViews();
  }
}
