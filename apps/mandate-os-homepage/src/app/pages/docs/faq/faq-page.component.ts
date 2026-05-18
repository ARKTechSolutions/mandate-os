import { Component, OnInit } from '@angular/core';
import { FAQ_CONTENT } from '../../../content/faq.content';
import { SeoService } from '../../../shared/seo.service';

@Component({
  selector: 'faq-page',
  standalone: true,
  templateUrl: './faq-page.component.html',
  styleUrl: './faq-page.component.scss',
})
export class FaqPageComponent implements OnInit {
  protected readonly content = FAQ_CONTENT;

  constructor(private readonly seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'FAQ — MandateOS',
      description: 'Direct answers for teams evaluating MandateOS guardrails, approvals, and audit evidence.',
      path: '/docs/faq',
    });
  }
}
