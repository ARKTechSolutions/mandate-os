import { Component, OnInit } from '@angular/core';
import { SECURITY_CONTENT } from '../../../content/security.content';
import { SeoService } from '../../../shared/seo.service';

@Component({
  selector: 'security-page',
  standalone: true,
  templateUrl: './security-page.component.html',
  styleUrl: './security-page.component.scss',
})
export class SecurityPageComponent implements OnInit {
  protected readonly content = SECURITY_CONTENT;

  constructor(private readonly seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Security — MandateOS',
      description: 'The trust boundary between the open-source trust layer and the managed control plane.',
      path: '/docs/security',
    });
  }
}
