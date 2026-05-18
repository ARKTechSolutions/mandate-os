import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'docs-index',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './docs-index.component.html',
  styleUrl: './docs-index.component.scss',
})
export class DocsIndexComponent implements OnInit {
  protected readonly cards = [
    { title: 'Install', description: 'Bring guardrails into an existing repo without cloning.', path: '/docs/install' },
    { title: 'Security', description: 'How the trust boundary separates open-source layer from managed plane.', path: '/docs/security' },
    { title: 'Evidence', description: 'Signed receipts, audit chains, and what operators can verify.', path: '/docs/evidence' },
    { title: 'FAQ', description: 'Direct answers for teams evaluating MandateOS.', path: '/docs/faq' },
    { title: 'Integrations', description: 'Codex, Cursor, Claude Code, OpenClaw — and GitHub (planned).', path: '/docs/integrations' },
  ];

  constructor(private readonly seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Docs — MandateOS',
      description: 'Install, security, evidence, and integration documentation for MandateOS.',
      path: '/docs',
    });
  }
}
