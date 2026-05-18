import { Component, OnInit } from '@angular/core';
import { INSTALL_CONTENT } from '../../../content/install.content';
import { SeoService } from '../../../shared/seo.service';

@Component({
  selector: 'install-page',
  standalone: true,
  templateUrl: './install-page.component.html',
  styleUrl: './install-page.component.scss',
})
export class InstallPageComponent implements OnInit {
  protected readonly content = INSTALL_CONTENT;

  constructor(private readonly seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Install — MandateOS',
      description: 'Install MandateOS guardrails into Codex, Cursor, Claude Code, or OpenClaw without cloning the repo.',
      path: '/docs/install',
    });
  }
}
