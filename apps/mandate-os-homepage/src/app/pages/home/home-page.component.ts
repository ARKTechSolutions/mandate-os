import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HOME_CONTENT } from '../../content/home.content';
import { SeoService } from '../../shared/seo.service';

interface ScreenshotSlot {
  slug: string;
  title: string;
  caption: string;
  alt: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly content = HOME_CONTENT;

  protected readonly screenshots: ScreenshotSlot[] = [
    {
      slug: 'dashboard',
      title: 'Workspace overview',
      caption: 'Mandates, receipts, audit events, and integrity status on one surface.',
      alt: 'MandateOS workspace overview showing mandate count, receipts, audit events, integrity status, and setup checklist.',
    },
    {
      slug: 'composer',
      title: 'Mandate composer',
      caption: 'Step through preset, risk, surface, and review before issuing a signed mandate.',
      alt: 'MandateOS mandate composer with Basics, Risk, Surface, and Review tabs active on the Review step.',
    },
    {
      slug: 'mandate-detail',
      title: 'Mandate detail',
      caption: 'Inspect the signed DSL, fingerprint, and policy body for any active mandate.',
      alt: 'Mandate detail page showing the signed Mandate DSL policy block including purpose, spend cap, boundary, tools, and approval rules.',
    },
    {
      slug: 'evidence',
      title: 'Audit and evidence',
      caption: 'Selected mandate evidence, receipt counts, and the wider workspace ledger together.',
      alt: 'Workspace evidence view with recent mandates, selected mandate signature, and receipt counts.',
    },
  ];

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'MandateOS — Guardrails, approvals, and receipts for agent action',
      description:
        'MandateOS gives platform and security teams a runtime guardrail layer for Codex, Cursor, Claude Code, OpenClaw, and MCP-based agent workflows.',
      path: '/',
    });
  }

  protected hostSlug(name: string): string {
    if (name === 'GitHub Enforcement') return 'github';
    if (name === 'Claude Code') return 'claude-code';
    return name.toLowerCase();
  }
}
