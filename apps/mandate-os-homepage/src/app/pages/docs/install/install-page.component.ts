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
  protected activeCodeTabIds: Record<string, string> = {};
  protected copiedCodeId = '';

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Install — MandateOS',
      description: 'Install MandateOS guardrails into Codex, Cursor, Claude Code, or OpenClaw without cloning the repo.',
      path: '/docs/install',
    });
  }

  protected activeCodeTab(
    step: {
      id: string;
      codeTabs?: readonly { id: string; label: string; language: string; code: string }[];
    },
  ) {
    const tabs = step.codeTabs || [];
    const activeId = this.activeCodeTabIds[step.id] || tabs[0]?.id;
    return tabs.find((tab) => tab.id === activeId) || tabs[0];
  }

  protected stepHelp(step: { help?: string }): string {
    return step.help || '';
  }

  protected setActiveCodeTab(stepId: string, tabId: string): void {
    this.activeCodeTabIds = {
      ...this.activeCodeTabIds,
      [stepId]: tabId,
    };
  }

  protected async copyCode(stepId: string, code: string): Promise<void> {
    await this.writeClipboard(code);
    this.copiedCodeId = stepId;
    window.setTimeout(() => {
      if (this.copiedCodeId === stepId) {
        this.copiedCodeId = '';
      }
    }, 1800);
  }

  private async writeClipboard(value: string): Promise<void> {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
