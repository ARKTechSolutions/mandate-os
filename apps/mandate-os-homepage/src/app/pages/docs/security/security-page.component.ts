import { Component, inject, OnInit } from '@angular/core';
import { SECURITY_CONTENT } from '../../../content/security.content';
import { SeoService } from '../../../shared/seo.service';

@Component({
  selector: 'app-security-page',
  standalone: true,
  templateUrl: './security-page.component.html',
  styleUrl: './security-page.component.scss',
})
export class SecurityPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly content = SECURITY_CONTENT;

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Security — MandateOS',
      description: 'The trust boundary between the open-source trust layer and the managed control plane.',
      path: '/docs/security',
    });
  }
}
