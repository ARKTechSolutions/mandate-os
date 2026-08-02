#!/usr/bin/env node
import { runCodexInstallCommand } from '../../dist/packages/mandate-os-mcp/codex-install.js';

runCodexInstallCommand(process.argv.slice(2)).catch((error) => {
  console.error(
    error instanceof Error ? error.message : 'Codex installer failed.',
  );
  process.exit(1);
});
