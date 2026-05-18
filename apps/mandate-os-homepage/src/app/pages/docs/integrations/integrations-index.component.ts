import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  HOST_ORDER,
  HOSTS,
  INTEGRATIONS_INDEX,
} from '../../../content/integrations.content';
import { SeoService } from '../../../shared/seo.service';

@Component({
  selector: 'integrations-index',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './integrations-index.component.html',
  styleUrl: './integrations-index.component.scss',
})
export class IntegrationsIndexComponent implements OnInit {
  protected readonly meta = INTEGRATIONS_INDEX;
  protected readonly hosts = HOST_ORDER.map((slug) => HOSTS[slug]);

  constructor(private readonly seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Integrations — MandateOS',
      description: 'MandateOS guardrails for Codex, Cursor, Claude Code, OpenClaw, and (planned) GitHub.',
      path: '/docs/integrations',
    });
  }
}
