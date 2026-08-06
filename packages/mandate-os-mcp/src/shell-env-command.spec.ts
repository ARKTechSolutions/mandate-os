import { describe, expect, it } from 'vitest';

import { buildEnvPrefixedShellCommand } from './shell-env-command';

describe('buildEnvPrefixedShellCommand', () => {
  const env = {
    MANDATE_OS_BASE_URL: 'https://api.example/demo',
    MANDATE_OS_AGENT_TOKEN: 'demo.token&more',
  } as const;

  const argv = [
    'npx',
    '--yes',
    '--prefer-offline',
    '--package',
    '@mandate-os/mcp@latest',
    'mandate-os-hook-gateway',
    'cursor',
    'before-mcp',
  ] as const;

  it('uses env on POSIX hosts', () => {
    const command = buildEnvPrefixedShellCommand({
      env,
      argv,
      platform: 'linux',
    });

    expect(command).toBe(
      "env MANDATE_OS_BASE_URL='https://api.example/demo' MANDATE_OS_AGENT_TOKEN='demo.token&more' 'npx' '--yes' '--prefer-offline' '--package' '@mandate-os/mcp@latest' 'mandate-os-hook-gateway' 'cursor' 'before-mcp'",
    );
  });

  it('uses cmd /c set on Windows hosts and preserves special characters', () => {
    const command = buildEnvPrefixedShellCommand({
      env,
      argv,
      platform: 'win32',
    });

    expect(command).toBe(
      'cmd /c "set ""MANDATE_OS_BASE_URL=https://api.example/demo""&&set ""MANDATE_OS_AGENT_TOKEN=demo.token&more""&&npx --yes --prefer-offline --package @mandate-os/mcp@latest mandate-os-hook-gateway cursor before-mcp"',
    );
  });

  it('quotes Windows argv values that contain spaces', () => {
    const command = buildEnvPrefixedShellCommand({
      env: { MANDATE_OS_BASE_URL: 'http://localhost:4330' },
      argv: ['node', 'C:\\Program Files\\mandate-os\\hook-gateway.js', 'cursor', 'before-shell'],
      platform: 'win32',
    });

    expect(command).toContain(
      'node ""C:\\Program Files\\mandate-os\\hook-gateway.js"" cursor before-shell',
    );
  });

  it('rejects env values that cannot be safely encoded for Windows cmd', () => {
    expect(() =>
      buildEnvPrefixedShellCommand({
        env: { MANDATE_OS_AGENT_TOKEN: 'say "hello"' },
        argv: ['node', 'hook-gateway.js'],
        platform: 'win32',
      }),
    ).toThrow(/quotes or newlines/);
  });
});
