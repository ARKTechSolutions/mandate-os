import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  buildMandateOsMcpEntry,
  getCursorProjectApprovalPaths,
  upsertCursorMcpServer,
  upsertMandateOsHooks,
} from './cursor-setup';

describe('cursor setup helpers', () => {
  it('upserts the MandateOS MCP server without removing unrelated servers', () => {
    const nextConfig = upsertCursorMcpServer(
      {
        mcpServers: {
          brainstack: {
            type: 'http',
            url: 'https://example.com',
          },
        },
      },
      'mandateos',
      buildMandateOsMcpEntry({
        baseUrl: 'http://localhost:4330',
        bearerToken: 'agt_example.secret',
        defaultMandateId: 'mdt_123',
        defaultSource: 'cursor.mandateos.project',
        entryScriptPath: '/tmp/mandate-os-mcp/index.js',
      }),
    );

    expect(nextConfig).toEqual({
      mcpServers: {
        brainstack: {
          type: 'http',
          url: 'https://example.com',
        },
        mandateos: {
          command: 'node',
          args: ['/tmp/mandate-os-mcp/index.js'],
          env: {
            MANDATE_OS_BASE_URL: 'http://localhost:4330',
            MANDATE_OS_AGENT_TOKEN: 'agt_example.secret',
            MANDATE_OS_MCP_DEFAULT_MANDATE_ID: 'mdt_123',
            MANDATE_OS_MCP_DEFAULT_SOURCE: 'cursor.mandateos.project',
          },
        },
      },
    });
  });

  it('uses a package-based Cursor MCP command when installed from npm exec cache', () => {
    const nextConfig = upsertCursorMcpServer(
      {
        mcpServers: {},
      },
      'mandateos',
      buildMandateOsMcpEntry({
        baseUrl: 'http://localhost:4330',
        bearerToken: 'agt_example.secret',
        defaultSource: 'cursor.mandateos.project',
        entryScriptPath:
          '/Users/example/.npm/_npx/1234/node_modules/@mandate-os/mcp/index.js',
      }),
    );

    expect(nextConfig.mcpServers.mandateos).toEqual({
      command: 'npx',
      args: [
        '--yes',
        '--prefer-offline',
        '--package',
        '@mandate-os/mcp@latest',
        'mandate-os-mcp',
      ],
      env: {
        MANDATE_OS_BASE_URL: 'http://localhost:4330',
        MANDATE_OS_AGENT_TOKEN: 'agt_example.secret',
        MANDATE_OS_MCP_DEFAULT_SOURCE: 'cursor.mandateos.project',
      },
    });
  });

  it('upserts MandateOS hooks while preserving unrelated hook entries', () => {
    const nextHooks = upsertMandateOsHooks(
      {
        version: 1,
        hooks: {
          beforeShellExecution: [
            {
              command:
                "node '/tmp/mandate-os-mcp/hook-gateway.js' cursor before-shell",
              timeout: 5,
              failClosed: true,
            },
            {
              command: 'echo keep-me',
            },
          ],
        },
      },
      {
        baseUrl: 'http://localhost:4330',
        bearerToken: 'agt_example.secret',
        defaultMandateId: 'mdt_123',
        defaultSource: 'cursor.mandateos.hooks',
        unmatchedPermission: 'ask',
        rulesFiles: ['/tmp/release.json', '/tmp/docs.json'],
        hookGatewayPath: '/tmp/mandate-os-mcp/hook-gateway.js',
        platform: 'linux',
      },
    );

    expect(nextHooks.version).toBe(1);
    expect(nextHooks.hooks.beforeShellExecution).toHaveLength(2);
    expect(nextHooks.hooks.beforeMCPExecution).toHaveLength(1);
    expect(
      (nextHooks.hooks.beforeShellExecution?.[0] as { command: string })
        .command,
    ).toContain("'cursor' 'before-shell'");
    expect(
      (nextHooks.hooks.beforeShellExecution?.[0] as { command: string })
        .command,
    ).toMatch(/^env /);
    expect(
      nextHooks.hooks.beforeShellExecution?.[0] as {
        failClosed?: boolean;
        timeout?: number;
      },
    ).toMatchObject({
      failClosed: false,
      timeout: 25,
    });
    expect(
      nextHooks.hooks.beforeMCPExecution?.[0] as {
        failClosed?: boolean;
      },
    ).toMatchObject({
      failClosed: false,
    });
    expect(
      (nextHooks.hooks.beforeShellExecution?.[1] as { command: string })
        .command,
    ).toBe('echo keep-me');
    expect(
      (nextHooks.hooks.beforeMCPExecution?.[0] as { command: string }).command,
    ).toContain("'cursor' 'before-mcp'");
  });

  it('generates Windows-safe Cursor hook commands with cmd /c', () => {
    const nextHooks = upsertMandateOsHooks(
      {
        version: 1,
        hooks: {},
      },
      {
        baseUrl: 'https://api.getmandateos.com/demo',
        bearerToken: 'demo_install.public_v1',
        defaultMandateId: 'mdt_demo_repo_guard_v1',
        defaultSource: 'cursor.mandateos.hooks',
        unmatchedPermission: 'ask',
        rulesFiles: [],
        hookGatewayPath: '/tmp/mandate-os-mcp/hook-gateway.js',
        platform: 'win32',
      },
    );

    const beforeMcp = (
      nextHooks.hooks.beforeMCPExecution?.[0] as { command: string }
    ).command;
    const beforeShell = (
      nextHooks.hooks.beforeShellExecution?.[0] as { command: string }
    ).command;

    expect(beforeMcp.startsWith('cmd /c ')).toBe(true);
    expect(beforeMcp).toContain('set ""MANDATE_OS_BASE_URL=');
    expect(beforeMcp).toContain('hook-gateway.js');
    expect(beforeMcp).toContain('cursor before-mcp');
    expect(beforeMcp).not.toMatch(/(^|[^\w-])env /);

    expect(beforeShell.startsWith('cmd /c ')).toBe(true);
    expect(beforeShell).toContain('cursor before-shell');
  });

  it('derives both public and realpath approval candidates for Cursor projects', () => {
    const workspacePath = path.resolve('/tmp/mandate-os-sandbox-test');
    const cursorHomeDir = path.join(os.homedir(), '.cursor');
    const approvalPaths = getCursorProjectApprovalPaths(
      workspacePath,
      cursorHomeDir,
    );
    const cursorProjectId = workspacePath
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/\/+/g, '-');

    expect(approvalPaths).toContain(
      path.join(
        cursorHomeDir,
        'projects',
        cursorProjectId,
        'mcp-approvals.json',
      ),
    );
  });
});
