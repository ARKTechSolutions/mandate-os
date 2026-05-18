import { MANDATE_OS_CONTENT } from '../mandate-os-content';

export interface HostContent {
  slug: string;
  name: string;
  status: string;
  planned?: boolean;
  summary: string;
  details: readonly string[];
  installer?: {
    packageName: string;
    packageHref: string;
    packageLinkLabel: string;
    command: string;
    scriptHref: string;
    scriptFileName: string;
    scriptLabel: string;
    notes: readonly string[];
  };
}

const integrationItems = MANDATE_OS_CONTENT.integrations.items;
const installers = MANDATE_OS_CONTENT.deploy.installers;

function requireFound<T>(value: T | undefined, label: string): T {
  if (value === undefined) {
    throw new Error(`Missing ${label}`);
  }
  return value;
}

const findItem = (name: string) =>
  requireFound(
    integrationItems.find((item) => item.name === name),
    `integration item: ${name}`,
  );
const findInstaller = (name: string) =>
  requireFound(
    installers.find((item) => item.name === name),
    `installer: ${name}`,
  );

export const INTEGRATIONS_INDEX = {
  eyebrow: MANDATE_OS_CONTENT.integrations.eyebrow,
  title: MANDATE_OS_CONTENT.integrations.title,
  body: MANDATE_OS_CONTENT.integrations.body,
  statusSummary: MANDATE_OS_CONTENT.integrations.statusSummary,
} as const;

export const HOSTS: Record<string, HostContent> = {
  codex: {
    slug: 'codex',
    ...findItem('Codex'),
    installer: extractInstaller(findInstaller('Codex')),
  },
  cursor: {
    slug: 'cursor',
    ...findItem('Cursor'),
    installer: extractInstaller(findInstaller('Cursor')),
  },
  'claude-code': {
    slug: 'claude-code',
    ...findItem('Claude Code'),
    installer: extractInstaller(findInstaller('Claude Code')),
  },
  openclaw: {
    slug: 'openclaw',
    ...findItem('OpenClaw'),
    installer: extractInstaller(findInstaller('OpenClaw')),
  },
  github: {
    slug: 'github',
    name: 'GitHub Enforcement',
    status: 'Planned',
    planned: true,
    summary: findItem('GitHub Enforcement').summary,
    details: findItem('GitHub Enforcement').details,
  },
};

export const HOST_ORDER: readonly string[] = [
  'codex',
  'cursor',
  'claude-code',
  'openclaw',
  'github',
];

function extractInstaller(i: (typeof installers)[number]) {
  return {
    packageName: i.packageName,
    packageHref: i.packageHref,
    packageLinkLabel: i.packageLinkLabel,
    command: i.command,
    scriptHref: i.scriptHref,
    scriptFileName: i.scriptFileName,
    scriptLabel: i.scriptLabel,
    notes: i.notes,
  };
}
