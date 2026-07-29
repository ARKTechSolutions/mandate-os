type InstallCodeTab = {
  id: string;
  label: string;
  language: string;
  code: string;
};

type InstallStep = {
  id: string;
  number: string;
  title: string;
  body: string;
  help?: string;
  codeTabs: readonly InstallCodeTab[];
};

type HostCompletion = {
  title: string;
  body: string;
  help: string;
  ctaLabel: string;
  ctaHref: string;
};

type HostGuide = {
  steps: readonly InstallStep[];
  completion: HostCompletion;
};

export type InstallHostId = 'codex' | 'cursor' | 'claude-code' | 'openclaw';

const codexSteps: readonly InstallStep[] = [
  {
    id: 'open-terminal',
    number: '01',
    title: 'Open a terminal in the repository you want to guard',
    body: 'Use the repo you already use with Codex. The installer writes Codex config into this workspace, so run the commands from the repository root.',
    help: 'You need Node.js with npm available because the installer runs from the published npm package.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: 'cd "C:\\path\\to\\your\\repo"',
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: 'cd "/absolute/path/to/your/repo"',
      },
    ],
  },
  {
    id: 'connection-values',
    number: '02',
    title: 'Add your MandateOS connection values',
    body: 'This installation guide provides ready-to-use demo URL, credential, and mandates. They will allow you to test against our demo mandates, but will be replaced with your real credentials later.',
    help: 'These are public demo credentials with access only to the rate-limited installation demo route (30 evaluations per minute). Codex uses an env_vars passthrough instead of writing the value into a config file, so keep these variables in the shell that launches Codex. Replace them with your own control-panel values when you are ready for a real workspace.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: `$env:MANDATE_OS_BASE_URL="__MANDATE_OS_BASE_URL__"
$env:MANDATE_OS_AGENT_TOKEN="__MANDATE_OS_AGENT_TOKEN__"
$env:MANDATE_OS_MCP_DEFAULT_MANDATE_ID="__MANDATE_OS_MANDATE_ID__"
$env:MANDATE_OS_MCP_DEFAULT_SOURCE="codex.mandateos.project"`,
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: `export MANDATE_OS_BASE_URL="__MANDATE_OS_BASE_URL__"
export MANDATE_OS_AGENT_TOKEN="__MANDATE_OS_AGENT_TOKEN__"
export MANDATE_OS_MCP_DEFAULT_MANDATE_ID="__MANDATE_OS_MANDATE_ID__"
export MANDATE_OS_MCP_DEFAULT_SOURCE="codex.mandateos.project"`,
      },
    ],
  },
  {
    id: 'run-installer',
    number: '03',
    title: 'Run the Codex installer',
    body: 'This installs the MandateOS MCP server and Codex hooks for the current repository. The default setup includes the bundled starter risk presets.',
    help: 'The installer writes .codex/config.toml with the MandateOS MCP entry and .codex/hooks.json with a Bash PreToolUse guardrail. Codex uses an env_vars array to declare which environment variables it must inherit at runtime, so the bearer token is never written to disk.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: 'npx --yes --package @mandate-os/mcp@latest mandate-os-codex-install install --workspace "$PWD"',
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: 'npx --yes --package @mandate-os/mcp@latest mandate-os-codex-install install --workspace "$PWD"',
      },
    ],
  },
  {
    id: 'check-status',
    number: '04',
    title: 'Confirm the files were written',
    body: 'Run the status command before launching Codex. You should see the Codex config, hooks file, hooks feature, and project MCP marked as configured.',
    help: 'The status check also verifies that .codex/config.toml and .codex/hooks.json were added to .git/info/exclude so the generated files stay out of normal commits.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: 'npx --yes --package @mandate-os/mcp@latest mandate-os-codex-install status --workspace "$PWD"',
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: 'npx --yes --package @mandate-os/mcp@latest mandate-os-codex-install status --workspace "$PWD"',
      },
    ],
  },
  {
    id: 'verify',
    number: '05',
    title: 'Launch Codex and verify a guarded action',
    body: 'Test that MandateOS works by issuing one of the specific commands below. These commands have been pre-programmed into the demo mandates so you can see how it works (in practice you can set up your own mandates or use one of our pre-made ones). Keep MANDATE_OS_BASE_URL and MANDATE_OS_AGENT_TOKEN in the shell that launches Codex.',
    help: 'Codex currently exposes Bash PreToolUse hooks only. Non-Bash tool interception is not available yet, so MCP-side tool calls are not guarded by the hook layer. The env_vars mechanism means the token stays in your shell, not in a config file.',
    codeTabs: [],
  },
];

const sharedCompletion = {
  title: 'You now have MandateOS running in your repository!',
  body: 'With MandateOS your agents can still move fast, but risky actions no longer run unchecked. You already did the hard part — the hooks are installed. Sign up to replace the demo credentials with your own workspace, attach real mandates, and start protecting every guarded action from day one.',
  ctaLabel: 'Sign up',
  ctaHref: 'https://app.getmandateos.com',
} as const;

const codexCompletion: HostCompletion = {
  ...sharedCompletion,
  help: 'Your repo now has project .codex/config.toml and .codex/hooks.json, Codex knows about the mandateos MCP server, and Bash commands that match your mandates route through MandateOS before they continue. You can remove .codex/config.toml and .codex/hooks.json to disable the demo setup.',
};

const cursorSteps: readonly InstallStep[] = [
  {
    id: 'open-repo',
    number: '01',
    title: 'Open a terminal in the repository you want to guard',
    body: 'Use the repo you already use with Cursor. The installer writes Cursor config into this workspace, so run the commands from the repository root.',
    help: 'You need Node.js with npm available because the installer runs from the published npm package. Cursor Desktop is the tested enforcement surface for these hooks.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: 'cd "C:\\path\\to\\your\\repo"',
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: 'cd "/absolute/path/to/your/repo"',
      },
    ],
  },
  {
    id: 'connection-values',
    number: '02',
    title: 'Add your MandateOS connection values',
    body: 'This installation guide provides ready-to-use demo URL, credential, and mandates. They will allow you to test against our demo mandates, but will be replaced with your real credentials later.',
    help: "These are public demo credentials with access only to the rate-limited installation demo route (30 evaluations per minute). The guide fetches them from the API rather than bundling them in the website. The installer writes them into Cursor's MCP and hook config; replace them with your own control-panel values when you are ready for a real workspace.",
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: `$env:MANDATE_OS_BASE_URL="__MANDATE_OS_BASE_URL__"
$env:MANDATE_OS_AGENT_TOKEN="__MANDATE_OS_AGENT_TOKEN__"
$env:MANDATE_OS_MCP_DEFAULT_MANDATE_ID="__MANDATE_OS_MANDATE_ID__"
$env:MANDATE_OS_MCP_DEFAULT_SOURCE="cursor.mandateos.project"`,
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: `export MANDATE_OS_BASE_URL="__MANDATE_OS_BASE_URL__"
export MANDATE_OS_AGENT_TOKEN="__MANDATE_OS_AGENT_TOKEN__"
export MANDATE_OS_MCP_DEFAULT_MANDATE_ID="__MANDATE_OS_MANDATE_ID__"
export MANDATE_OS_MCP_DEFAULT_SOURCE="cursor.mandateos.project"`,
      },
    ],
  },
  {
    id: 'run-installer',
    number: '03',
    title: 'Run the Cursor installer',
    body: 'This installs the MandateOS MCP server and Cursor hooks for the current repository. The default setup includes the bundled starter risk presets.',
    help: 'The installer updates ~/.cursor/mcp.json, .cursor/mcp.json, and .cursor/hooks.json. The hooks use beforeShellExecution and beforeMCPExecution with failClosed enabled.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: 'npx --yes --package @mandate-os/mcp@latest mandate-os-cursor-install install --workspace "$PWD"',
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: 'npx --yes --package @mandate-os/mcp@latest mandate-os-cursor-install install --workspace "$PWD"',
      },
    ],
  },
  {
    id: 'check-status',
    number: '04',
    title: 'Confirm the files were written',
    body: 'Run the status command before opening Cursor. You should see the user MCP, project MCP, and both project hooks marked as configured.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: 'npx --yes --package @mandate-os/mcp@latest mandate-os-cursor-install status --workspace "$PWD"',
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: 'npx --yes --package @mandate-os/mcp@latest mandate-os-cursor-install status --workspace "$PWD"',
      },
    ],
  },
  {
    id: 'open-cursor',
    number: '05',
    title: 'Open the repository in Cursor and approve MandateOS',
    body: 'Start Cursor on this repo. If Cursor asks whether to allow the mandateos MCP server, approve it so the agent can reach MandateOS.',
    help: 'The approval is stored by Cursor for this project. If status shows approval files as missing before first launch, that is normal.',
    codeTabs: [
      {
        id: 'prompt',
        label: 'Cursor Prompt',
        language: 'text',
        code: 'Use the mandateos_get_context tool and tell me which MandateOS tools are available in this workspace.',
      },
    ],
  },
  {
    id: 'verify-guardrail',
    number: '06',
    title: 'Verify a guarded action',
    body: 'Test that MandateOS works by issuing one of the specific commands below. These commands have been pre-programmed into the demo mandates so you can see how it works (in practice you can set up your own mandates or use one of our pre-made ones).',
    help: 'The default starter bundles recognize local scripts, dependency changes, file mutations, deploy commands, content publishing, payments, refunds, and similar MCP tool calls. Ask Cursor to run each command; MandateOS evaluates it against the demo mandate before the action continues.',
    codeTabs: [],
  },
];

const cursorCompletion: HostCompletion = {
  ...sharedCompletion,
  help: 'Your repo now has project .cursor/mcp.json and .cursor/hooks.json, Cursor knows about the mandateos MCP server, and shell or MCP actions that match your mandates route through MandateOS before they continue. You can remove .cursor/mcp.json and .cursor/hooks.json to disable the demo setup.',
};

const claudeCodeSteps: readonly InstallStep[] = [
  {
    id: 'open-terminal',
    number: '01',
    title: 'Open a terminal in the repository you want to guard',
    body: 'Use the repo you already use with Claude Code. The installer writes Claude Code config into this workspace, so run the commands from the repository root.',
    help: 'You need Node.js with npm available because the installer runs from the published npm package.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: 'cd "C:\\path\\to\\your\\repo"',
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: 'cd "/absolute/path/to/your/repo"',
      },
    ],
  },
  {
    id: 'connection-values',
    number: '02',
    title: 'Add your MandateOS connection values',
    body: 'This installation guide provides ready-to-use demo URL, credential, and mandates. They will allow you to test against our demo mandates, but will be replaced with your real credentials later.',
    help: "These are public demo credentials with access only to the rate-limited installation demo route (30 evaluations per minute). The guide fetches them from the API rather than bundling them in the website. The installer writes the value into Claude Code's local configuration; replace it with your own control-panel value when you are ready for a real workspace.",
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: `$env:MANDATE_OS_BASE_URL="__MANDATE_OS_BASE_URL__"
$env:MANDATE_OS_AGENT_TOKEN="__MANDATE_OS_AGENT_TOKEN__"
$env:MANDATE_OS_MCP_DEFAULT_MANDATE_ID="__MANDATE_OS_MANDATE_ID__"
$env:MANDATE_OS_MCP_DEFAULT_SOURCE="claude.mandateos.local"`,
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: `export MANDATE_OS_BASE_URL="__MANDATE_OS_BASE_URL__"
export MANDATE_OS_AGENT_TOKEN="__MANDATE_OS_AGENT_TOKEN__"
export MANDATE_OS_MCP_DEFAULT_MANDATE_ID="__MANDATE_OS_MANDATE_ID__"
export MANDATE_OS_MCP_DEFAULT_SOURCE="claude.mandateos.local"`,
      },
    ],
  },
  {
    id: 'run-installer',
    number: '03',
    title: 'Run the Claude Code installer',
    body: 'This installs the MandateOS MCP server and Claude Code hooks for the current repository. The default setup includes the bundled starter risk presets.',
    help: 'The installer writes the local-scoped mandateos MCP entry into ~/.claude.json (keyed by the workspace realpath) and creates PreToolUse hooks for Bash and mcp__.* matchers in .claude/settings.local.json. The settings file is git-excluded automatically.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: 'npx --yes --package @mandate-os/mcp@latest mandate-os-claude-install install --workspace "$PWD"',
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: 'npx --yes --package @mandate-os/mcp@latest mandate-os-claude-install install --workspace "$PWD"',
      },
    ],
  },
  {
    id: 'check-status',
    number: '04',
    title: 'Confirm the files were written',
    body: 'Run the status command before opening Claude Code. You should see the local MCP, local settings file, and both PreToolUse hooks marked as configured.',
    help: 'The status check also shows project key candidates (the resolved and realpath variants of your workspace) so you can confirm the MCP entry is scoped to the right path.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: 'npx --yes --package @mandate-os/mcp@latest mandate-os-claude-install status --workspace "$PWD"',
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: 'npx --yes --package @mandate-os/mcp@latest mandate-os-claude-install status --workspace "$PWD"',
      },
    ],
  },
  {
    id: 'verify',
    number: '05',
    title: 'Open Claude Code and verify',
    body: 'Test that MandateOS works by issuing one of the specific commands below. These commands have been pre-programmed into the demo mandates so you can see how it works (in practice you can set up your own mandates or use one of our pre-made ones). Open Claude Code in this repository first — the local-scoped mandateos MCP entry and PreToolUse hooks load automatically.',
    help: 'Claude Code does not require an approval dialog for the MCP entry. If the context tool is not visible, confirm the workspace path matches the project key in ~/.claude.json.',
    codeTabs: [],
  },
];

const claudeCodeCompletion: HostCompletion = {
  ...sharedCompletion,
  help: 'Your workspace now has a local-scoped mandateos MCP entry in ~/.claude.json and PreToolUse hooks in .claude/settings.local.json. Shell or MCP actions that match your mandates route through MandateOS before they continue. You can remove the mandateos entry from ~/.claude.json and delete .claude/settings.local.json to disable the demo setup.',
};

const openclawSteps: readonly InstallStep[] = [
  {
    id: 'open-terminal',
    number: '01',
    title: 'Open a terminal in the repository you want to guard',
    body: 'Use the repo you already use with OpenClaw. The installer creates a guarded agent profile for this workspace, so run the commands from the repository root.',
    help: 'You need Node.js with npm available because the installer runs from the published npm package.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: 'cd "C:\\path\\to\\your\\repo"',
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: 'cd "/absolute/path/to/your/repo"',
      },
    ],
  },
  {
    id: 'connection-values',
    number: '02',
    title: 'Add your MandateOS connection values',
    body: 'This installation guide provides ready-to-use demo URL, credential, and mandates. They will allow you to test against our demo mandates, but will be replaced with your real credentials later.',
    help: 'These are public demo credentials with access only to the rate-limited installation demo route (30 evaluations per minute). The guide fetches them from the API rather than bundling them in the website. Unlike the other hosts, OpenClaw can install without a token, but it needs this one at runtime for the demo policy check.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: `$env:MANDATE_OS_BASE_URL="__MANDATE_OS_BASE_URL__"
$env:MANDATE_OS_AGENT_TOKEN="__MANDATE_OS_AGENT_TOKEN__"
$env:MANDATE_OS_MCP_DEFAULT_MANDATE_ID="__MANDATE_OS_MANDATE_ID__"
$env:MANDATE_OS_MCP_DEFAULT_SOURCE="openclaw.mandateos.bundle"`,
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: `export MANDATE_OS_BASE_URL="__MANDATE_OS_BASE_URL__"
export MANDATE_OS_AGENT_TOKEN="__MANDATE_OS_AGENT_TOKEN__"
export MANDATE_OS_MCP_DEFAULT_MANDATE_ID="__MANDATE_OS_MANDATE_ID__"
export MANDATE_OS_MCP_DEFAULT_SOURCE="openclaw.mandateos.bundle"`,
      },
    ],
  },
  {
    id: 'run-installer',
    number: '03',
    title: 'Run the OpenClaw installer',
    body: 'This installs the OpenClaw bridge, plugin bundle, and guarded agent profile for the current repository. The default setup includes the bundled starter risk presets.',
    help: 'The installer writes to ~/.openclaw/openclaw.json, creates the plugin and bundle directories under ~/.openclaw/extensions/, and adds a mandateos_guarded agent profile. Unlike the other hosts, OpenClaw uses the MANDATE_OS_OPENCLAW_WORKSPACE_PATH environment variable instead of a --workspace flag to identify the target repository.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: `$env:MANDATE_OS_OPENCLAW_WORKSPACE_PATH="$PWD"
npx --yes --package @mandate-os/openclaw@latest mandate-os-openclaw-install install`,
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: `MANDATE_OS_OPENCLAW_WORKSPACE_PATH="$PWD" \\
npx --yes --package @mandate-os/openclaw@latest mandate-os-openclaw-install install`,
      },
    ],
  },
  {
    id: 'check-status',
    number: '04',
    title: 'Check installation health',
    body: 'Run the status command to verify the plugin, bundle, MCP server, bridge, and guarded agent are all configured. Status reports four independent health dimensions: install health, runtime authorization, wrapper exposure verification, and live policy capability.',
    help: 'If any dimension reports needs_repair or missing, run the repair command (mandate-os-openclaw-install repair) to clean and reinstall the plugin and bundle directories, then check status again.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: `$env:MANDATE_OS_OPENCLAW_WORKSPACE_PATH="$PWD"
npx --yes --package @mandate-os/openclaw@latest mandate-os-openclaw-install status`,
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: `MANDATE_OS_OPENCLAW_WORKSPACE_PATH="$PWD" \\
npx --yes --package @mandate-os/openclaw@latest mandate-os-openclaw-install status`,
      },
    ],
  },
  {
    id: 'run-doctor',
    number: '05',
    title: 'Run the doctor self-test',
    body: 'The doctor command runs five smoke tests on top of the status check: install status, bridge runtime, runtime token presence, a local bridge smoke test with a git status payload, and a live policy smoke test with a browser action payload.',
    help: 'Doctor exits with code 1 if any check fails or degrades. The live policy smoke test is skipped when the base URL, agent token, or mandate ID is missing — the other four checks still run. This step is unique to OpenClaw and gives you a concrete pass or fail signal before you start the guarded agent.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: `$env:MANDATE_OS_OPENCLAW_WORKSPACE_PATH="$PWD"
npx --yes --package @mandate-os/openclaw@latest mandate-os-openclaw-install doctor`,
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: `MANDATE_OS_OPENCLAW_WORKSPACE_PATH="$PWD" \\
npx --yes --package @mandate-os/openclaw@latest mandate-os-openclaw-install doctor`,
      },
    ],
  },
  {
    id: 'verify',
    number: '06',
    title: 'Start OpenClaw with a guarded agent and verify',
    body: 'Test that MandateOS works by issuing one of the specific commands below. These commands have been pre-programmed into the demo mandates so you can see how it works (in practice you can set up your own mandates or use one of our pre-made ones). Start OpenClaw with the mandateos_guarded agent profile first.',
    help: 'The guarded agent profile routes shell execution and browser actions through the MandateOS bridge. The default starter bundles recognize local scripts, dependency changes, file mutations, deploy commands, and similar tool calls.',
    codeTabs: [],
  },
];

const openclawCompletion: HostCompletion = {
  ...sharedCompletion,
  help: 'Your OpenClaw state directory now contains the MandateOS plugin bundle and bridge runtime, and ~/.openclaw/openclaw.json lists the mandateos MCP server and guarded agent profile. Shell and browser actions from the mandateos_guarded agent that match your mandates route through the MandateOS bridge before they continue. You can remove the mandateos plugin entries from ~/.openclaw/openclaw.json to disable the demo setup.',
};

const installHosts: readonly { id: InstallHostId; label: string }[] = [
  { id: 'codex', label: 'Codex' },
  { id: 'cursor', label: 'Cursor' },
  { id: 'claude-code', label: 'Claude Code' },
  { id: 'openclaw', label: 'OpenClaw' },
];

const installGuides: Record<InstallHostId, HostGuide> = {
  codex: { steps: codexSteps, completion: codexCompletion },
  cursor: { steps: cursorSteps, completion: cursorCompletion },
  'claude-code': { steps: claudeCodeSteps, completion: claudeCodeCompletion },
  openclaw: { steps: openclawSteps, completion: openclawCompletion },
};

export const INSTALL_CONTENT = {
  installGuide: {
    id: 'install-guide',
    eyebrow: 'Setup in under 5 minutes • Free & Open Source',
    title: 'Try our guardrails in your own repository',
    body: 'See how MandateOS can block your agent\u2019s shady requests in your own repository. A quick 5-minute setup is enough to configure your repository hooks and try out a blocking request.',
    hosts: installHosts,
    guides: installGuides,
  },
} as const;
