import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HOME_CONTENT } from '../../content/home.content';
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  protected readonly content = HOME_CONTENT;
  protected readonly isProofPreviewOpen = signal(false);

  constructor(private readonly seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'MandateOS — Guardrails, approvals, and receipts for agent action',
      description:
        'MandateOS gives platform and security teams a runtime guardrail layer for Codex, Cursor, Claude Code, OpenClaw, and MCP-based agent workflows.',
      path: '/',
    });
  }

  protected openProofPreview(): void {
    this.isProofPreviewOpen.set(true);
  }

  protected closeProofPreview(): void {
    this.isProofPreviewOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected handleEscape(): void {
    if (this.isProofPreviewOpen()) {
      this.closeProofPreview();
    }
  }

  protected hostSlug(name: string): string {
    if (name === 'GitHub Enforcement') return 'github';
    if (name === 'Claude Code') return 'claude-code';
    return name.toLowerCase();
  }
}
