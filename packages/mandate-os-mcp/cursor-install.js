#!/usr/bin/env node
import { runCursorInstallCommand } from '../../dist/packages/mandate-os-mcp/cursor-install.js';

runCursorInstallCommand(process.argv.slice(2)).catch((error) => {
  const message =
    error instanceof Error ? error.message : 'Unknown Cursor install failure.';
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
