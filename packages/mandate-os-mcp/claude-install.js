#!/usr/bin/env node
import { runClaudeInstallCommand } from '../../dist/packages/mandate-os-mcp/claude-install.js';

runClaudeInstallCommand(process.argv.slice(2)).catch((error) => {
  console.error(
    error instanceof Error ? error.message : 'Claude installer failed.',
  );
  process.exit(1);
});
