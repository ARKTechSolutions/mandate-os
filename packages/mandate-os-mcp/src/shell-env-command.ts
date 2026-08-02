export type ShellEnvPair = readonly [string, string];

export type BuildEnvPrefixedShellCommandOptions = {
  env: ReadonlyArray<ShellEnvPair> | Record<string, string>;
  argv: readonly string[];
  /**
   * Install-time platform. Defaults to `process.platform`.
   * Override in tests so POSIX and Windows command shapes can both be asserted.
   */
  platform?: NodeJS.Platform;
};

/**
 * Build a one-line shell command that sets environment variables and then
 * runs `argv`.
 *
 * Cursor/Claude/Codex hooks only accept a `command` string (no `env` map), so
 * the installer must bake credentials into the command. POSIX hosts use the
 * `env` utility. Windows hosts use `cmd /c` + `set`, which Cursor documents as
 * the supported Windows hook form and which preserves stdin for hook payloads.
 */
export function buildEnvPrefixedShellCommand(
  options: BuildEnvPrefixedShellCommandOptions,
): string {
  const platform = options.platform ?? process.platform;
  const envPairs = normalizeEnvPairs(options.env);

  if (options.argv.length === 0) {
    throw new Error('Hook command argv must include at least one program.');
  }

  if (platform === 'win32') {
    return buildWindowsCmdEnvPrefixedCommand(envPairs, options.argv);
  }

  return [
    'env',
    ...envPairs.map(([key, value]) => `${key}=${posixShellQuote(value)}`),
    ...options.argv.map(posixShellQuote),
  ].join(' ');
}

function buildWindowsCmdEnvPrefixedCommand(
  envPairs: readonly ShellEnvPair[],
  argv: readonly string[],
): string {
  const parts = [
    ...envPairs.map(([key, value]) => `set ${windowsSetAssignment(key, value)}`),
    argv.map(windowsCmdEscapeArg).join(' '),
  ];

  // `""` inside the outer cmd quotes becomes a literal `"` when cmd parses it,
  // which restores the `set "KEY=value"` form that safely handles `&` etc.
  return `cmd /c ${windowsCmdQuote(parts.join('&&'))}`;
}

function normalizeEnvPairs(
  env: ReadonlyArray<ShellEnvPair> | Record<string, string>,
): ShellEnvPair[] {
  const pairs = Array.isArray(env) ? [...env] : Object.entries(env);

  for (const [key] of pairs) {
    assertSafeEnvKey(key);
  }

  return pairs;
}

function assertSafeEnvKey(key: string) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
    throw new Error(`Invalid hook environment variable name: ${key}`);
  }
}

function windowsSetAssignment(key: string, value: string): string {
  if (/[\r\n"]/.test(value)) {
    throw new Error(
      `Cannot encode environment value for ${key} in a Windows cmd hook command because it contains quotes or newlines.`,
    );
  }

  return `"${key}=${value}"`;
}

function windowsCmdQuote(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function windowsCmdEscapeArg(value: string): string {
  if (value.length === 0) {
    return '""';
  }

  if (!/[\s"&|<>^%!()]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
}

function posixShellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}
