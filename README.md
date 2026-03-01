# cc-tools

Which tools does your Claude Code AI call most?

Shows the distribution of tool usage — Read, Bash, Edit, Grep, and more — across your entire session history.

## Usage

```bash
npx cc-tools
```

```
cc-tools — Top 15 tool calls

  Read          ████████████████████████████   68,437  ( 34.7%)
  Bash          ███████████████████████████░   65,464  ( 33.2%)
  Edit          ███████░░░░░░░░░░░░░░░░░░░░░   17,901  (  9.1%)
  Grep          ███████░░░░░░░░░░░░░░░░░░░░░   16,909  (  8.6%)
  Glob          ████░░░░░░░░░░░░░░░░░░░░░░░░   10,033  (  5.1%)
  Write         ██░░░░░░░░░░░░░░░░░░░░░░░░░░    4,863  (  2.5%)
  TaskUpdate    █░░░░░░░░░░░░░░░░░░░░░░░░░░░    2,095  (  1.1%)
  TodoWrite     █░░░░░░░░░░░░░░░░░░░░░░░░░░░    2,090  (  1.1%)
  WebSearch     █░░░░░░░░░░░░░░░░░░░░░░░░░░░    1,640  (  0.8%)
  Task          █░░░░░░░░░░░░░░░░░░░░░░░░░░░    1,616  (  0.8%)
  WebFetch      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░    1,095  (  0.6%)
  TaskCreate    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░    1,032  (  0.5%)
  TaskOutput    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░      813  (  0.4%)
  ExitPlanMode  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░      609  (  0.3%)
  SendMessage   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░      506  (  0.3%)

─────────────────────────────────────────────────────────────────
  Total calls: 197,125  |  Unique tools: 45
```

## Category view

```bash
npx cc-tools --categories
```

```
cc-tools — Tool calls by category

  Explorer      ████████████████████████████   95,379  ( 48.4%)
  Executor      ███████████████████░░░░░░░░░   65,464  ( 33.2%)
  Builder       ███████░░░░░░░░░░░░░░░░░░░░░   22,764  ( 11.5%)
  Orchestrator  ███░░░░░░░░░░░░░░░░░░░░░░░░░    8,847  (  4.5%)
  Researcher    █░░░░░░░░░░░░░░░░░░░░░░░░░░░    2,735  (  1.4%)
  MCP           ░░░░░░░░░░░░░░░░░░░░░░░░░░░░    1,212  (  0.6%)
  Communicator  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░      523  (  0.3%)
```

## Category definitions

| Category | Tools |
|----------|-------|
| Explorer | Read, Grep, Glob — reading and searching |
| Executor | Bash — running shell commands |
| Builder | Edit, Write, NotebookEdit — modifying files |
| Orchestrator | Task, TodoWrite, ExitPlanMode, etc. — planning and delegation |
| Researcher | WebSearch, WebFetch — external information |
| MCP | mcp__* — model context protocol tools |
| Communicator | SendMessage, TeamCreate — agent communication |

## Options

```bash
npx cc-tools                  # Top 15 tools
npx cc-tools --top=20         # Top 20 tools
npx cc-tools --categories     # Category breakdown
npx cc-tools --json           # JSON output
```

## Browser Version

→ **[yurukusa.github.io/cc-tools](https://yurukusa.github.io/cc-tools/)**

Drag in your `~/.claude` folder. Shows top tools and category breakdown. Runs locally.

## Part of cc-toolkit

cc-tools is tool #51 in [cc-toolkit](https://yurukusa.github.io/cc-toolkit/) — 52 free tools for Claude Code users.

Related:
- [cc-file-churn](https://github.com/yurukusa/cc-file-churn) — Most-modified files
- [cc-depth](https://github.com/yurukusa/cc-depth) — Conversation turns per session
- [cc-model](https://github.com/yurukusa/cc-model) — Which Claude models you use

---

**GitHub**: [yurukusa/cc-tools](https://github.com/yurukusa/cc-tools)
**Try it**: `npx cc-tools`
