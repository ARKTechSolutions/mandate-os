import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  INSTALL_CONTENT,
  type InstallHostId,
} from '../../../content/install.content';
import {
  DemoInstallService,
  type DemoInstallConnection,
  type DemoInstallTest,
} from '../../../shared/demo-install.service';
import { SeoService } from '../../../shared/seo.service';

const OS_TAB_IDS = new Set(['windows', 'mac-linux']);
const VERIFY_STEP_IDS = new Set(['verify', 'verify-guardrail']);

type DemoTestCodeTab = {
  id: string;
  label: string;
  language: string;
  code: string;
};

@Component({
  selector: 'app-install-page',
  standalone: true,
  templateUrl: './install-page.component.html',
  styleUrl: './install-page.component.scss',
})
export class InstallPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
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

    const resolved = this.route.snapshot.data['demoConnection'] as
      | DemoInstallConnection
      | null
      | undefined;

    if (resolved) {
      this.demoConnection = resolved;
      this.demoConnectionState = 'ready';
      return;
    }

    if (resolved === null) {
      this.demoConnectionState = 'error';
      return;
    }

    void this.loadDemoConnection();
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
    if (tabs.length === 0) {
      return undefined;
    }
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

  protected isDemoVerifyStep(step: { id: string }): boolean {
    return VERIFY_STEP_IDS.has(step.id);
  }

  protected demoVerifyTests(): DemoInstallTest[] {
    const tests = this.demoConnection?.tests || [];
    return tests.filter(
      (test) => test.decision === 'approval' || test.decision === 'blocked',
    );
  }

  protected demoTestCodeTabs(test: DemoInstallTest): DemoTestCodeTab[] {
    return [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: test.commands.windowsPowerShell,
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: test.commands.macOsLinux,
      },
    ];
  }

  protected activeDemoTestTab(test: DemoInstallTest): DemoTestCodeTab {
    const tabs = this.demoTestCodeTabs(test);
    const activeId = this.activeOsTabId || tabs[0].id;
    return tabs.find((tab) => tab.id === activeId) || tabs[0];
  }

  protected demoTestCopyId(test: DemoInstallTest): string {
    return `demo-test-${test.id}`;
  }

  protected demoConnectionMessage(): string {
    if (this.demoConnectionState === 'error') {
      return 'The demo values could not be loaded. Refresh the page before copying anything; placeholder credentials are never copied.';
    }

    return 'Loading the shared demo URL, credential, and mandate from MandateOS…';
  }

  protected demoTestOutcome(test: DemoInstallTest): string {
    switch (test.decision) {
      case 'allowed':
        return 'Allowed';
      case 'approval':
        return 'Approval required';
      case 'blocked':
        return 'Blocked';
    }
  }

  protected demoTestExpectation(test: DemoInstallTest): string {
    switch (test.decision) {
      case 'allowed':
        return 'Expect the command to run without an approval prompt.';
      case 'approval':
        return 'Expect MandateOS to pause and ask for approval. Approve it, then confirm the action completed.';
      case 'blocked':
        return 'Expect MandateOS to refuse the action even if you consent. Nothing destructive should change in the repo.';
    }
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
