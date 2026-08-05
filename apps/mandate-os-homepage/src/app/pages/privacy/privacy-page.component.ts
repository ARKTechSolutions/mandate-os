import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../shared/analytics.service';
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy-page.component.html',
  styleUrl: './privacy-page.component.scss',
})
export class PrivacyPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Privacy Policy — MandateOS',
      description:
        'How MandateOS uses cookies and Google Analytics, and how you can manage consent.',
      path: '/privacy',
    });
  }

  protected openPreferences(): void {
    this.analytics.requestOpenPreferences();
  }
}
