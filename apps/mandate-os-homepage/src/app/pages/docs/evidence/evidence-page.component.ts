import { Component, inject, OnInit } from '@angular/core';
import { EVIDENCE_CONTENT } from '../../../content/evidence.content';
import { SeoService } from '../../../shared/seo.service';

@Component({
  selector: 'app-evidence-page',
  standalone: true,
  templateUrl: './evidence-page.component.html',
  styleUrl: './evidence-page.component.scss',
})
export class EvidencePageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly content = EVIDENCE_CONTENT;

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Evidence — MandateOS',
      description: 'Receipts, approval events, execution grants, and audit-chain verification operators can inspect.',
      path: '/docs/evidence',
    });
  }
}
