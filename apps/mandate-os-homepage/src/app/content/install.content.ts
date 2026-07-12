import { MANDATE_OS_CONTENT } from '../mandate-os-content';

type CursorQuickInstallCodeTab = {
  id: string;
  label: string;
  language: string;
  code: string;
};

type CursorQuickInstallStep = {
  id: string;
  number: string;
  title: string;
  body: string;
  help?: string;
  codeTabs: readonly CursorQuickInstallCodeTab[];
};

const cursorQuickInstallSteps: readonly CursorQuickInstallStep[] = [
  {
    id: 'open-repo',
    number: '01',
    title: 'Open a terminal in the repository you want to guard',
    body: 'Use the repo you already use with Cursor. The installer writes Cursor config into this workspace, so run the commands from the repository root.',
    help:
      'You need Node.js with npm available because the installer runs from the published npm package. Cursor Desktop is the tested enforcement surface for these hooks.',
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
    body: 'Sign in at app.getmandateos.com, open your workspace, and copy the runtime URL and agent token shown there. The agent token has the form key_id.secret. If you have already issued a mandate in the mandate composer, copy its id (it starts with mdt_) into MANDATE_OS_MCP_DEFAULT_MANDATE_ID to preselect it for this repo. Skip the mandate id line if you have not created one yet.',
    help:
      'Do not invent these values — both come from your MandateOS control plane. The agent token authenticates the agent\'s calls to MandateOS. The mandate id, when set, is the default policy the agent starts under; without it the agent can still run but must pass a mandate id on each guarded action. The installer writes these into Cursor\'s MCP and hook config so Cursor checks MandateOS before risky shell commands or MCP tool calls continue.',
    codeTabs: [
      {
        id: 'windows',
        label: 'Windows PowerShell',
        language: 'powershell',
        code: `$env:MANDATE_OS_BASE_URL="https://your-mandateos-runtime-url"
$env:MANDATE_OS_AGENT_TOKEN="key_id.secret"
$env:MANDATE_OS_MCP_DEFAULT_MANDATE_ID="mdt_123"`,
      },
      {
        id: 'mac-linux',
        label: 'macOS / Linux',
        language: 'bash',
        code: `export MANDATE_OS_BASE_URL="https://your-mandateos-runtime-url"
export MANDATE_OS_AGENT_TOKEN="key_id.secret"
export MANDATE_OS_MCP_DEFAULT_MANDATE_ID="mdt_123"`,
      },
    ],
  },
  {
    id: 'run-installer',
    number: '03',
    title: 'Run the Cursor installer',
    body: 'This installs the MandateOS MCP server and Cursor hooks for the current repository. The default setup includes the bundled starter risk presets.',
    help:
      'The installer updates ~/.cursor/mcp.json, .cursor/mcp.json, and .cursor/hooks.json. The hooks use beforeShellExecution and beforeMCPExecution with failClosed enabled.',
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
    help:
      'The approval is stored by Cursor for this project. If status shows approval files as missing before first launch, that is normal.',
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
    body: 'Ask Cursor to try a normal repo command that the starter presets recognize. MandateOS should intercept it before the command runs and return an allow, ask, or deny decision.',
    help:
      'The default starter bundles recognize local scripts, dependency changes, file mutations, deploy commands, content publishing, payments, refunds, and similar MCP tool calls.',
    codeTabs: [
      {
        id: 'prompt',
        label: 'Cursor Prompt',
        language: 'text',
        code: 'Try to run npm run build in this repository. Before executing it, show me the MandateOS decision that Cursor receives.',
      },
      {
        id: 'safe-shell',
        label: 'Safe Shell Example',
        language: 'bash',
        code: 'npm run build',
      },
    ],
  },
];

export const INSTALL_CONTENT = {
  ...MANDATE_OS_CONTENT.deploy,
  cursorQuickInstall: {
    id: 'cursor-install',
    eyebrow: 'Setup in under 5 minutes • Free & Open Source',
    title: 'Try runtime agent guardrails in your own repository.',
    body: 'Set up the open-source framework to evaluate MandateOS against your own Cursor AI agents. In less than 10 minutes, you can configure your repository hook, activate standard risk presets, and verify exactly how the runtime blocks unsafe behavior in your own local environment.',
    steps: cursorQuickInstallSteps,
    completion: {
      title: 'You now have MandateOS running in Cursor.',
      body: 'Your repo should now contain a project .cursor/mcp.json and .cursor/hooks.json, Cursor should know about the mandateos MCP server, and shell or MCP actions that match the starter presets should route through MandateOS before they continue. A good first success signal is Cursor showing the MandateOS context, then pausing on a command such as npm run build with a concrete runtime decision.',
    },
  },
} as const;
