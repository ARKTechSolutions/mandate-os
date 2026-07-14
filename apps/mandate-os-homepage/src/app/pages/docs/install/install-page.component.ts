import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  INSTALL_CONTENT,
  type InstallHostId,
} from '../../../content/install.content';
import {
  DemoInstallService,
  type DemoInstallConnection,
} from '../../../shared/demo-install.service';
import { SeoService } from '../../../shared/seo.service';

const OS_TAB_IDS = new Set(['windows', 'mac-linux']);

@Component({
  selector: 'app-install-page',
  standalone: true,
  templateUrl: './install-page.component.html',
  styleUrl: './install-page.component.scss',
})
export class InstallPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly demoInstall = inject(DemoInstallService);

  protected readonly content = INSTALL_CONTENT;
  protected activeHostId: InstallHostId = 'cursor';
  protected activeOsTabId = '';
  protected activeCodeTabIds: Record<string, string> = {};
  protected copiedCodeId = '';
  protected demoConnection: DemoInstallConnection | null = null;
  protected demoConnectionState: 'loading' | 'ready' | 'error' = 'loading';

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Install — MandateOS',
      description:
        'Install MandateOS guardrails into Codex, Cursor, Claude Code, or OpenClaw without cloning the repo.',
      path: '/docs/install',
    });

    if (isPlatformBrowser(this.platformId)) {
      void this.loadDemoConnection();
    }
  }

  protected get activeGuide() {
    return this.content.installGuide.guides[this.activeHostId];
  }

  protected setActiveHost(hostId: InstallHostId): void {
    if (hostId === this.activeHostId) return;
    this.activeHostId = hostId;
    this.activeCodeTabIds = {};
  }

  protected activeCodeTab(step: {
    id: string;
    codeTabs?: readonly {
      id: string;
      label: string;
      language: string;
      code: string;
    }[];
  }) {
    const tabs = step.codeTabs || [];
    const isOsStep = tabs.some((tab) => OS_TAB_IDS.has(tab.id));
    const activeId = isOsStep
      ? this.activeOsTabId || tabs[0]?.id
      : this.activeCodeTabIds[step.id] || tabs[0]?.id;
    return tabs.find((tab) => tab.id === activeId) || tabs[0];
  }

  protected stepHelp(step: { help?: string }): string {
    return step.help || '';
  }

  protected isDemoConnectionStep(step: { id: string }): boolean {
    return step.id === 'connection-values';
  }

  protected demoConnectionMessage(): string {
    if (this.demoConnectionState === 'error') {
      return 'The demo values could not be loaded. Refresh the page before copying anything; placeholder credentials are never copied.';
    }

    return 'Loading the shared demo URL, credential, and mandate from MandateOS…';
  }

  protected codeFor(code: string): string {
    if (!this.demoConnection) {
      return code;
    }

    return code
      .replace(/__MANDATE_OS_BASE_URL__/g, this.demoConnection.baseUrl)
      .replace(/__MANDATE_OS_AGENT_TOKEN__/g, this.demoConnection.bearerToken)
      .replace(/__MANDATE_OS_MANDATE_ID__/g, this.demoConnection.mandate.id);
  }

  protected setActiveCodeTab(stepId: string, tabId: string): void {
    if (OS_TAB_IDS.has(tabId)) {
      this.activeOsTabId = tabId;
      return;
    }
    this.activeCodeTabIds = {
      ...this.activeCodeTabIds,
      [stepId]: tabId,
    };
  }

  protected async copyCode(stepId: string, code: string): Promise<void> {
    this.copiedCodeId = stepId;
    await this.writeClipboard(code);
    window.setTimeout(() => {
      if (this.copiedCodeId === stepId) {
        this.copiedCodeId = '';
      }
    }, 1800);
  }

  private async loadDemoConnection(): Promise<void> {
    try {
      this.demoConnection = await this.demoInstall.getConnection();
      this.demoConnectionState = 'ready';
    } catch {
      this.demoConnectionState = 'error';
    }
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
