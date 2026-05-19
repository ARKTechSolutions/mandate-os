# MandateOS — 60-second walkthrough script

Target length: 1:00. Aspect ratio 16:9 at 1920×1080. Native 30fps. Tab audio off — record voiceover separately.

The goal is to show one approval and receipt happen end to end. No abstract claims, no marketing chrome. Show a real terminal and the real app.

## Pre-recording checklist

- Sign into `app.getmandateos.com` as `robin-labs-2 / Robin`.
- Open a clean terminal at `D:/Projects/sandbox-repo/` (an empty git repo that does not have MandateOS configured yet).
- Set `MANDATE_OS_BASE_URL` and `MANDATE_OS_AGENT_TOKEN` in the shell. Do not show the values on screen.
- Have the mandate composer at `/mandates/new` already loaded on the Basics tab.
- Have a second window with the Evidence view ready to swap to.
- Set terminal font to 16pt for readability when the video gets resized.

## Scene 1 — 0:00–0:10 · Installer writes guarded host config

- Cut to terminal at `D:/Projects/sandbox-repo/`.
- Voiceover: "Start with any repo. No clone, no scaffold — just install MandateOS into the host of your choice."
- Run:
  ```bash
  npx --yes --package @mandate-os/mcp@latest mandate-os-claude-install install \
    --workspace "D:/Projects/sandbox-repo"
  ```
- Let the installer finish. Final line should read something like `MandateOS configured for workspace`. Pause one beat on that line.

## Scene 2 — 0:10–0:25 · Compose a mandate

- Cut to browser at `https://app.getmandateos.com/mandates/new`.
- Voiceover: "Open the composer. Name the agent, write a one-line purpose, then pick the tools you want it to use."
- Fill the Basics tab:
  - Owner: `Robin`
  - Agent name: `Codex Smoke Review`
  - Purpose: `Test Codex guarded shell flow, approval escalation, and evidence receipts from a disposable review run.`
- Click the **Surface** tab.
- Tick two tools — for example `issue.label` and `repo.read`.

## Scene 3 — 0:25–0:40 · Review tab → issue signed mandate

- Click the **Review** tab.
- Pause one beat on the live policy DSL preview. The viewer should read the boundary, the spend cap, and the approval rule.
- Voiceover: "Review the policy DSL the runtime will sign. Issue the mandate, and any agent operating in this repo now runs against it."
- Click **Issue signed mandate**. Wait for the success state.

## Scene 4 — 0:40–0:55 · Trigger one guarded action

- Cut back to the terminal.
- Trigger a guarded shell command from inside Claude Code (or whichever host you installed in scene 1). Choose something the mandate forces to approval — for example a `git push` or a production-tagged migration command.
- Cut to the browser approval inbox. Show the approval event appearing.
- Voiceover: "Higher-risk actions stop at the runtime. The operator sees the exact request, decides, and the signed receipt is captured automatically."
- Approve the action. Show the receipt appear under the mandate.

## Scene 5 — 0:55–1:00 · Audit chain verified

- Cut to `https://app.getmandateos.com/workspace/evidence`.
- Show the head sequence number tick up and the integrity status read **Verified**.
- Hold for one full second. End on this frame.

## Post-production

- Encode at `videoBitsPerSecond: 6_000_000` (~6 Mbps) so the terminal stays crisp at 1080p.
- Keep idle time between cuts under 300ms. Use `createDemoVideo` with `speed: 6` if any segment ran long.
- Export both an MP4 (for the `<video>` tag) and a Loom/YouTube upload.
- Replace the placeholder in `home-page.component.html`:
  ```html
  <video controls poster="/screenshots/video-poster.jpg" width="1920" height="1080">
    <source src="/walkthrough.mp4" type="video/mp4" />
  </video>
  ```
  …or the matching Loom / YouTube embed inside the `.video-frame` container.

## Out of scope for this recording

- Don't show pricing, integrations sidebar, or anything that isn't part of the install → mandate → approval → receipt → audit loop.
- Don't include identifiable workspace data (avoid real customer mandates, real tokens, real repo names beyond `sandbox-repo`).
