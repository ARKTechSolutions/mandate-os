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
    body: 'The installation guide loads a ready-to-use URL, credential, and repository-safety mandate below. It allows routine local work, requires approval for sensitive actions, and blocks destructive deletion — no MandateOS control-panel account required. These are public demo credentials; the demo is rate-limited to 30 evaluations per minute.',
    help: 'These are public demo credentials with access only to the rate-limited installation demo route. Codex uses an env_vars passthrough instead of writing the value into a config file, so keep these variables in the shell that launches Codex. Replace them with your own control-panel values when you are ready for a real workspace.',
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
    body: 'Launch Codex from this repository. Keep MANDATE_OS_BASE_URL and MANDATE_OS_AGENT_TOKEN in the shell environment that starts Codex — the config uses env_vars passthrough, so the guarded runtime reads them at launch time. Ask Codex to run the demo commands below and watch MandateOS require approval for the directory creation and block the destructive delete.',
    help: 'Codex currently exposes Bash PreToolUse hooks only. Non-Bash tool interception is not available yet, so MCP-side tool calls are not guarded by the hook layer. The env_vars mechanism means the token stays in your shell, not in a config file.',
    codeTabs: [
      {
        id: 'approval-prompt',
        label: 'Approval test',
        language: 'text',
        code: 'Run mkdir .mandateos-demo. When MandateOS asks for approval, approve it and confirm the .mandateos-demo folder is created.',
      },
      {
        id: 'block-prompt',
        label: 'Block test',
        language: 'text',
        code: 'Run rm -rf .mandateos-demo (macOS/Linux) or Remove-Item .mandateos-demo -Recurse -Force (Windows). MandateOS should block it and the .mandateos-demo folder should remain.',
      },
    ],
  },
];

const codexCompletion: HostCompletion = {
  title: 'You now have MandateOS running in Codex.',
  body: 'Your repo should now contain a project .codex/config.toml and .codex/hooks.json, Codex should know about the mandateos MCP server, and Bash commands that match the starter presets should route through MandateOS before they continue. Keep MANDATE_OS_BASE_URL and MANDATE_OS_AGENT_TOKEN in the shell that launches Codex — the config uses env_vars passthrough instead of writing the token to disk. A good first success signal is Codex prompting you to approve mkdir .mandateos-demo, then blocking rm -rf .mandateos-demo while the folder remains.',
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
    body: 'The installation guide loads a ready-to-use URL, credential, and repository-safety mandate below. It allows routine local work, requires approval for sensitive actions, and blocks destructive deletion — no MandateOS control-panel account required. These are public demo credentials; the demo is rate-limited to 30 evaluations per minute.',
    help: "These are public demo credentials with access only to the rate-limited installation demo route. The guide fetches them from the API rather than bundling them in the website. The installer writes them into Cursor's MCP and hook config; replace them with your own control-panel values when you are ready for a real workspace.",
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
    body: 'Ask Cursor to run the demo commands below. MandateOS should prompt you to approve the directory creation and block the destructive delete.',
    help: 'The default starter bundles recognize local scripts, dependency changes, file mutations, deploy commands, content publishing, payments, refunds, and similar MCP tool calls.',
    codeTabs: [
      {
        id: 'approval-prompt',
        label: 'Approval test',
        language: 'text',
        code: 'Run mkdir .mandateos-demo. When MandateOS asks for approval, approve it and confirm the .mandateos-demo folder is created.',
      },
      {
        id: 'block-prompt',
        label: 'Block test',
        language: 'text',
        code: 'Run rm -rf .mandateos-demo (macOS/Linux) or Remove-Item .mandateos-demo -Recurse -Force (Windows). MandateOS should block it and the .mandateos-demo folder should remain.',
      },
    ],
  },
];

const cursorCompletion: HostCompletion = {
  title: 'You now have MandateOS running in Cursor.',
  body: 'Your repo should now contain a project .cursor/mcp.json and .cursor/hooks.json, Cursor should know about the mandateos MCP server, and shell or MCP actions that match the starter presets should route through MandateOS before they continue. A good first success signal is Cursor prompting you to approve mkdir .mandateos-demo, then blocking rm -rf .mandateos-demo while the folder remains.',
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
    body: 'The installation guide loads a ready-to-use URL, credential, and repository-safety mandate below. It allows routine local work, requires approval for sensitive actions, and blocks destructive deletion — no MandateOS control-panel account required. These are public demo credentials; the demo is rate-limited to 30 evaluations per minute.',
    help: "These are public demo credentials with access only to the rate-limited installation demo route. The guide fetches them from the API rather than bundling them in the website. The installer writes the value into Claude Code's local configuration; replace it with your own control-panel value when you are ready for a real workspace.",
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
    body: 'Open Claude Code in this repository. The local-scoped mandateos MCP entry loads automatically from ~/.claude.json and the PreToolUse hooks load from .claude/settings.local.json — no explicit approval step is needed. Then ask Claude Code to run the demo commands below: approve the directory creation, and confirm the destructive delete is blocked.',
    help: 'Claude Code does not require an approval dialog. The MCP entry and hooks are loaded from the config files written by the installer. If the context tool is not visible, confirm the workspace path matches the project key in ~/.claude.json.',
    codeTabs: [
      {
        id: 'approval-prompt',
        label: 'Approval test',
        language: 'text',
        code: 'Run mkdir .mandateos-demo. When MandateOS asks for approval, approve it and confirm the .mandateos-demo folder is created.',
      },
      {
        id: 'block-prompt',
        label: 'Block test',
        language: 'text',
        code: 'Run rm -rf .mandateos-demo (macOS/Linux) or Remove-Item .mandateos-demo -Recurse -Force (Windows). MandateOS should block it and the .mandateos-demo folder should remain.',
      },
    ],
  },
];

const claudeCodeCompletion: HostCompletion = {
  title: 'You now have MandateOS running in Claude Code.',
  body: 'Your workspace should now have a local-scoped mandateos MCP entry in ~/.claude.json and PreToolUse hooks in .claude/settings.local.json. Claude Code should load both automatically when you open the repo, and shell or MCP actions that match the starter presets should route through MandateOS before they continue. A good first success signal is Claude Code prompting you to approve mkdir .mandateos-demo, then blocking rm -rf .mandateos-demo while the folder remains.',
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
    body: 'The installation guide loads a ready-to-use URL, credential, and repository-safety mandate below. It allows routine local work, requires approval for sensitive actions, and blocks destructive deletion — no MandateOS control-panel account required. These are public demo credentials; the demo is rate-limited to 30 evaluations per minute.',
    help: 'These are public demo credentials with access only to the rate-limited installation demo route. The guide fetches them from the API rather than bundling them in the website. Unlike the other hosts, OpenClaw can install without a token, but it needs this one at runtime for the demo policy check.',
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
    body: 'Start OpenClaw using the mandateos_guarded agent profile that the installer created. Ask the guarded agent to run the demo commands below: approve the directory creation, and confirm the destructive delete is blocked.',
    help: 'The guarded agent profile routes shell execution and browser actions through the MandateOS bridge. The default starter bundles recognize local scripts, dependency changes, file mutations, deploy commands, and similar tool calls.',
    codeTabs: [
      {
        id: 'approval-prompt',
        label: 'Approval test',
        language: 'text',
        code: 'Run mkdir .mandateos-demo. When MandateOS asks for approval, approve it and confirm the .mandateos-demo folder is created.',
      },
      {
        id: 'block-prompt',
        label: 'Block test',
        language: 'text',
        code: 'Run rm -rf .mandateos-demo (macOS/Linux) or Remove-Item .mandateos-demo -Recurse -Force (Windows). MandateOS should block it and the .mandateos-demo folder should remain.',
      },
    ],
  },
];

const openclawCompletion: HostCompletion = {
  title: 'You now have MandateOS running in OpenClaw.',
  body: 'Your OpenClaw state directory should now contain the MandateOS plugin bundle and bridge runtime, ~/.openclaw/openclaw.json should list the mandateos MCP server and guarded agent profile, and the doctor self-test should pass all five checks. Shell and browser actions from the mandateos_guarded agent that match the starter presets should route through the MandateOS bridge before they continue. A good first success signal is the guarded agent prompting you to approve mkdir .mandateos-demo, then blocking rm -rf .mandateos-demo while the folder remains.',
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
