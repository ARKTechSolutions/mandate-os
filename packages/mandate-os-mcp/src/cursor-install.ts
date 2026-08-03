#!/usr/bin/env node

import { existsSync } from 'node:fs';
import path from 'node:path';

import { readMandateOsMcpConfig } from './config.js';
import { isInvokedAsEntrypoint } from './entrypoint.js';
import {
  installMandateOsIntoCursor,
  readMandateOsCursorStatus,
} from './cursor-setup.js';
import type { HostGatewayPermission } from './host-gateway.js';

const ANSI = {
  reset: '\u001b[0m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  red: '\u001b[31m',
  dim: '\u001b[2m',
} as const;

type InstallRowTone = 'green' | 'yellow' | 'red';

type InstallOutputRow = {
  status: string;
  tone: InstallRowTone;
  label: string;
  path: string;
};

type CursorInstallCommand = 'install' | 'status';

type CursorInstallCliOptions = {
  command: CursorInstallCommand;
  workspacePath: string;
  cursorHomeDir?: string;
  identifier?: string;
  installUserMcp: boolean;
  installProjectMcp: boolean;
  installProjectHooks: boolean;
  baseUrl?: string;
  bearerToken?: string;
  defaultMandateId?: string;
  sourcePrefix?: string;
  unmatchedPermission?: HostGatewayPermission;
  rulesFiles?: string[];
};

export async function runCursorInstallCommand(argv: string[]) {
  const options = parseCursorInstallArgs(argv);

  if (options.command === 'status') {
    const status = readMandateOsCursorStatus({
      workspacePath: options.workspacePath,
      cursorHomeDir: options.cursorHomeDir,
      identifier: options.identifier,
    });
    process.stdout.write(formatCursorStatus(status));
    return;
  }

  const env = {
    ...process.env,
  };

  if (options.baseUrl) {
    env.MANDATE_OS_BASE_URL = options.baseUrl;
  }

  if (options.bearerToken) {
    env.MANDATE_OS_AGENT_TOKEN = options.bearerToken;
  }

  if (options.defaultMandateId) {
    env.MANDATE_OS_MCP_DEFAULT_MANDATE_ID = options.defaultMandateId;
  }

  const config = readMandateOsMcpConfig(env);
  const sourcePrefix =
    normalizeOptionalText(options.sourcePrefix) || 'cursor.mandateos';

  const result = installMandateOsIntoCursor({
    workspacePath: options.workspacePath,
    cursorHomeDir: options.cursorHomeDir,
    identifier: options.identifier,
    baseUrl: config.baseUrl,
    bearerToken: config.bearerToken,
    defaultMandateId: options.defaultMandateId || config.defaultMandateId,
    userSource: `${sourcePrefix}.user`,
    projectSource: `${sourcePrefix}.project`,
    hooksSource: `${sourcePrefix}.hooks`,
    unmatchedPermission: options.unmatchedPermission || 'ask',
    rulesFiles: options.rulesFiles,
    installUserMcp: options.installUserMcp,
    installProjectMcp: options.installProjectMcp,
    installProjectHooks: options.installProjectHooks,
  });

  process.stdout.write(formatInstallResult(result));
}

function parseCursorInstallArgs(argv: string[]): CursorInstallCliOptions {
  const args = [...argv];
  let command: CursorInstallCommand = 'install';

  if (args[0] === 'install' || args[0] === 'status') {
    command = args.shift() as CursorInstallCommand;
  }

  const options: CursorInstallCliOptions = {
    command,
    workspacePath: process.cwd(),
    installUserMcp: true,
    installProjectMcp: true,
    installProjectHooks: true,
  };

  while (args.length > 0) {
    const token = args.shift();

    if (!token) {
      break;
    }

    if (token === '--') {
      continue;
    }

    switch (token) {
      case '--workspace':
        options.workspacePath = readRequiredValue(args, token);
        break;
      case '--cursor-home':
        options.cursorHomeDir = readRequiredValue(args, token);
        break;
      case '--identifier':
        options.identifier = readRequiredValue(args, token);
        break;
      case '--base-url':
        options.baseUrl = readRequiredValue(args, token);
        break;
      case '--token':
        options.bearerToken = readRequiredValue(args, token);
        break;
      case '--mandate-id':
        options.defaultMandateId = readRequiredValue(args, token);
        break;
      case '--source-prefix':
        options.sourcePrefix = readRequiredValue(args, token);
        break;
      case '--rules-files':
        options.rulesFiles = readRequiredValue(args, token)
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
          .map((value) => path.resolve(value));
        break;
      case '--unmatched-permission':
        options.unmatchedPermission = readHostGatewayPermission(
          readRequiredValue(args, token),
        );
        break;
      case '--no-user-mcp':
        options.installUserMcp = false;
        break;
      case '--no-project-mcp':
        options.installProjectMcp = false;
        break;
      case '--no-project-hooks':
        options.installProjectHooks = false;
        break;
      case '--help':
      case '-h':
        process.stdout.write(getCursorInstallHelp());
        process.exit(0);
        return options;
      default:
        throw new Error(`Unknown argument: ${token}`);
    }
  }

  return options;
}

function formatInstallResult(
  result: ReturnType<typeof installMandateOsIntoCursor>,
) {
  const rows: InstallOutputRow[] = [];

  if (result.userMcpPath) {
    rows.push(createPathStatusRow('User MCP', result.userMcpPath, 'installed'));
  }

  if (result.projectMcpPath) {
    rows.push(
      createPathStatusRow('Project MCP', result.projectMcpPath, 'installed'),
    );
  }

  if (result.projectHooksPath) {
    rows.push(
      createPathStatusRow(
        'Project hooks',
        result.projectHooksPath,
        'installed',
      ),
    );
  }

  for (const rulesFile of result.rulesFiles) {
    rows.push(createPathStatusRow('Rule bundle', rulesFile, 'ok'));
  }

  const lines = [
    '',
    'MandateOS Cursor install complete.',
    '',
    `Workspace: ${result.workspacePath}`,
    `Cursor home: ${result.cursorHomeDir}`,
    `Identifier: ${result.identifier}`,
    '',
    formatInstallTable(rows),
    '',
    ...formatApprovalSection(result.approvalPaths),
    '',
    'Next:',
    `- Open Cursor on ${result.workspacePath}`,
    '- Approve the `mandateos` MCP if Cursor asks',
    '- Try: Use the mandateos_get_context tool and tell me which MandateOS tools are available here.',
  ];

  return `${lines.join('\n')}\n`;
}

function createPathStatusRow(
  label: string,
  filePath: string,
  successStatus: 'installed' | 'ok',
): InstallOutputRow {
  if (existsSync(filePath)) {
    return {
      status: successStatus,
      tone: 'green',
      label,
      path: filePath,
    };
  }

  return {
    status: 'missing',
    tone: 'red',
    label,
    path: filePath,
  };
}

function formatApprovalSection(approvalPaths: string[]) {
  if (approvalPaths.length === 0) {
    return [];
  }

  const lines = [
    'MCP approval (Cursor-owned — this installer does not create it):',
    'Cursor writes this file after you approve the `mandateos` MCP server.',
  ];

  const statusWidth = 'awaiting you'.length;

  for (const approvalPath of approvalPaths) {
    if (existsSync(approvalPath)) {
      lines.push(
        `${padEndVisible(colorizeText('recorded', 'green'), statusWidth)}  ${approvalPath}`,
      );
      continue;
    }

    lines.push(
      `${padEndVisible(colorizeText('awaiting you', 'yellow'), statusWidth)}  ${approvalPath}`,
    );
  }

  return lines;
}

function formatInstallTable(rows: InstallOutputRow[]) {
  if (rows.length === 0) {
    return colorizeText('No install targets were written.', 'yellow');
  }

  const statusWidth = Math.max(
    'STATUS'.length,
    ...rows.map((row) => row.status.length),
  );
  const labelWidth = Math.max(
    'COMPONENT'.length,
    ...rows.map((row) => row.label.length),
  );

  const header = [
    padEndVisible('STATUS', statusWidth),
    padEndVisible('COMPONENT', labelWidth),
    'PATH',
  ].join('  ');

  const separator = [
    '-'.repeat(statusWidth),
    '-'.repeat(labelWidth),
    '-'.repeat(4),
  ].join('  ');

  const body = rows.map((row) => {
    const statusCell = padEndVisible(
      colorizeText(row.status, row.tone),
      statusWidth,
    );
    const labelCell = padEndVisible(row.label, labelWidth);
    return `${statusCell}  ${labelCell}  ${row.path}`;
  });

  return [colorizeText(header, 'dim'), colorizeText(separator, 'dim'), ...body].join(
    '\n',
  );
}

function supportsColor() {
  if (process.env.NO_COLOR) {
    return false;
  }

  if (process.env.FORCE_COLOR === '0') {
    return false;
  }

  return Boolean(process.stdout.isTTY) || Boolean(process.env.FORCE_COLOR);
}

function colorizeText(text: string, tone: InstallRowTone | 'dim') {
  if (!supportsColor()) {
    return text;
  }

  return `${ANSI[tone]}${text}${ANSI.reset}`;
}

function padEndVisible(text: string, width: number) {
  const visibleLength = text.replace(/\u001b\[[0-9;]*m/g, '').length;
  return `${text}${' '.repeat(Math.max(0, width - visibleLength))}`;
}

function formatCursorStatus(
  status: ReturnType<typeof readMandateOsCursorStatus>,
) {
  const lines = [
    'MandateOS Cursor status',
    `Workspace: ${status.workspacePath}`,
    `Cursor home: ${status.cursorHomeDir}`,
    `Identifier: ${status.identifier}`,
    `User MCP file: ${status.userMcpPath}`,
    `User MCP configured: ${status.hasUserMcp && status.userServerConfigured ? 'yes' : 'no'}`,
    `Project MCP file: ${status.projectMcpPath}`,
    `Project MCP configured: ${status.hasProjectMcp && status.projectServerConfigured ? 'yes' : 'no'}`,
    `Project hooks file: ${status.projectHooksPath}`,
    `beforeShellExecution hook configured: ${status.hasProjectHooks && status.beforeShellConfigured ? 'yes' : 'no'}`,
    `beforeMCPExecution hook configured: ${status.hasProjectHooks && status.beforeMcpConfigured ? 'yes' : 'no'}`,
    'Approval files:',
    ...status.approvalPaths.map((value) => {
      const marker =
        value.exists && value.approved
          ? 'approved'
          : value.exists
            ? 'present'
            : 'missing';
      return `- ${value.path}: ${marker}`;
    }),
  ];

  return `${lines.join('\n')}\n`;
}

function readRequiredValue(args: string[], flagName: string) {
  const value = args.shift();

  if (!value) {
    throw new Error(`${flagName} requires a value.`);
  }

  return value;
}

function readHostGatewayPermission(value: string): HostGatewayPermission {
  if (value === 'allow' || value === 'ask' || value === 'deny') {
    return value;
  }

  throw new Error(
    `Invalid --unmatched-permission value: ${value}. Expected allow, ask, or deny.`,
  );
}

function getCursorInstallHelp() {
  return `Usage: cursor-install.js [install|status] [options]

Options:
  --workspace <path>              Workspace to configure. Defaults to the current directory.
  --cursor-home <path>            Cursor home directory. Defaults to ~/.cursor.
  --base-url <url>                MandateOS base URL. Falls back to MANDATE_OS_BASE_URL.
  --token <token>                 MandateOS operator or service token. Falls back to MANDATE_OS_AGENT_TOKEN.
  --mandate-id <id>               Default mandate id for the project MCP and hooks.
  --source-prefix <prefix>        Source prefix. Defaults to cursor.mandateos.
  --rules-files <a,b,c>           Comma-separated rule bundle files for the hook gateway.
  --unmatched-permission <value>  Hook fallback for unmatched commands: allow, ask, or deny.
  --no-user-mcp                   Skip updating ~/.cursor/mcp.json.
  --no-project-mcp                Skip updating <workspace>/.cursor/mcp.json.
  --no-project-hooks              Skip updating <workspace>/.cursor/hooks.json.
  -h, --help                      Show this help.
`;
}

function normalizeOptionalText(value: string | undefined) {
  return value?.trim() || '';
}

async function main() {
  await runCursorInstallCommand(process.argv.slice(2));
}

if (isInvokedAsEntrypoint(import.meta.url)) {
  main().catch((error) => {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown Cursor install failure.';
    process.stderr.write(`${message}\n`);
    process.exit(1);
  });
}
