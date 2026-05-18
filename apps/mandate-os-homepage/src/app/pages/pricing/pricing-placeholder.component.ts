import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'pricing-placeholder',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pricing-placeholder.component.html',
  styleUrl: './pricing-placeholder.component.scss',
})
export class PricingPlaceholderComponent implements OnInit {
  constructor(private readonly seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Pricing — MandateOS',
      description: 'MandateOS pricing tiers — coming soon.',
      path: '/pricing',
    });
  }
}
