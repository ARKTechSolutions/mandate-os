import { Component, inject, OnInit } from '@angular/core';
import { INSTALL_CONTENT } from '../../../content/install.content';
import { SeoService } from '../../../shared/seo.service';

@Component({
  selector: 'app-install-page',
  standalone: true,
  templateUrl: './install-page.component.html',
  styleUrl: './install-page.component.scss',
})
export class InstallPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly content = INSTALL_CONTENT;

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Install — MandateOS',
      description: 'Install MandateOS guardrails into Codex, Cursor, Claude Code, or OpenClaw without cloning the repo.',
      path: '/docs/install',
    });
  }
}
