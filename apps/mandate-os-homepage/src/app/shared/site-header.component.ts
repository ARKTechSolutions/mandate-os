import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  protected readonly signInHref = 'https://app.getmandateos.com/';
  protected readonly navLinks = [
    { label: 'Docs', path: '/docs' },
    { label: 'Integrations', path: '/docs/integrations' },
    { label: 'Pricing', path: '/pricing' },
  ];
}
