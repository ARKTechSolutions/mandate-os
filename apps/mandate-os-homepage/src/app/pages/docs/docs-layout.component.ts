import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HOST_ORDER, HOSTS } from '../../content/integrations.content';

@Component({
  selector: 'app-docs-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './docs-layout.component.html',
  styleUrl: './docs-layout.component.scss',
})
export class DocsLayoutComponent {
  protected readonly mainNav = [
    { label: 'Install', path: '/docs/install' },
    { label: 'Security', path: '/docs/security' },
    { label: 'Evidence', path: '/docs/evidence' },
    { label: 'FAQ', path: '/docs/faq' },
    { label: 'Integrations', path: '/docs/integrations' },
  ];

  protected readonly hosts = HOST_ORDER.map((slug) => HOSTS[slug]);
}
