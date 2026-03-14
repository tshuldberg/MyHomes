# AGENTS.md

Project-specific agent instructions for `/Users/trey/Desktop/Apps/MyLife/MyHomes`.

## Instruction Pair (Critical)

- Keep this file and `CLAUDE.md` synchronized for persistent project rules.
- When a long-lived workflow or constraint changes, update both files in the same session.

## Startup Checklist

- Read `AGENTS.md` and `CLAUDE.md` before making substantial edits.
- Review `.claude/settings.local.json` for local execution constraints.
- Review `.claude/skills-available.md` for the current in-repo skill snapshot.
- Review `.claude/plugins.md` for currently verified MCP/plugin availability.

## TypeScript Requirement (Critical)

- Default to TypeScript for application and shared package code whenever feasible.
- For new product/runtime code, prefer .ts/.tsx over .js/.jsx.
- Use JavaScript only when a toolchain file requires it (for example Babel or Metro config).

## Standalone And Hub Module Parity (Critical)

- `MyHomes` is the canonical product source while it remains an active standalone workspace.
- `modules/homes` is a hub adapter and partial migration surface, not a full representation of the HumanHomes platform.
- Do not describe hub parity as complete unless the API, auth, chat, video, jobs, maps, and marketplace scope have been verified in the hub.
- When parity or archival status changes, update both `AGENTS.md` and `CLAUDE.md` in the same session.

## Skills Availability

- Skills are sourced from the global Codex skills directory: `/Users/trey/.codex/skills`.
- Do not assume `.claude/skills` exists in this repo unless explicitly added later.
- Check the shared skills directory directly if availability needs re-verification.

## Plugins / MCP Availability

- See `.claude/plugins.md` for the current verified inventory and re-verification steps.

## Agent Teams

- Agent team support is enabled via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in MyLife `.claude/settings.json`.
- Custom agent definitions are available from `/Users/trey/Desktop/Apps/.claude/agents/` and `/Users/trey/Desktop/Apps/MyLife/.claude/agents/`.
- When spawning teams, assign file ownership zones from CLAUDE.md to prevent edit conflicts.
- All teammates automatically load CLAUDE.md and AGENTS.md, so critical rules here are enforced team-wide.

## Writing Style
- Do not use em dashes in documents or writing.


### Code Intelligence

Prefer LSP over Grep/Read for code navigation - it's faster, precise, and avoids reading entire files:
- `workspaceSymbol` to find where something is defined
- `findReferences` to see all usages across the codebase
- `goToDefinition` / `goToImplementation` to jump to source
- `hover` for type info without reading the file

Use Grep only when LSP isn't available or for text/pattern searches (comments, strings, config).

After writing or editing code, check LSP diagnostics and fix errors before proceeding.
