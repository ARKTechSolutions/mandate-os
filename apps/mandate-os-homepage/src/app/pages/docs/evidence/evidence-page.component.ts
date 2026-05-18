import { Component, OnInit } from '@angular/core';
import { EVIDENCE_CONTENT } from '../../../content/evidence.content';
import { SeoService } from '../../../shared/seo.service';

@Component({
  selector: 'evidence-page',
  standalone: true,
  templateUrl: './evidence-page.component.html',
  styleUrl: './evidence-page.component.scss',
})
export class EvidencePageComponent implements OnInit {
  protected readonly content = EVIDENCE_CONTENT;

  constructor(private readonly seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Evidence — MandateOS',
      description: 'Receipts, approval events, execution grants, and audit-chain verification operators can inspect.',
      path: '/docs/evidence',
    });
  }
}
