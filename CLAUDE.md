# MCP Family and Love

## Overview

Custom MCP server for Family and Love studio operations and maintenance. Provides tools for managing N8N workflows, Airtable records, booking operations, and business automation.

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **MCP SDK**: `@modelcontextprotocol/sdk` v1.x (stdio transport)
- **Validation**: Zod v4
- **Linter**: Biome

## Project Structure

```
mcp-family-and-love/
├── src/
│   └── index.ts              # MCP server entry point
├── .specify/                 # Spec-kit configuration
│   ├── memory/
│   │   └── constitution.md   # Project principles
│   ├── scripts/              # Spec-kit bash scripts
│   └── templates/            # Spec/plan/task templates
├── .claude/
│   └── commands/             # Spec-kit slash commands
├── specs/                    # Feature specifications (created per feature)
├── biome.json                # Biome linter config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies and scripts
```

## Development Commands

```bash
bun run dev           # Run server locally
bun run start         # Start server
bun run typecheck     # TypeScript validation
bun run lint          # Biome check
bun run lint:fix      # Biome auto-fix
bun run inspector     # MCP Inspector (debug tools)
```

## MCP Server Architecture

The server uses **stdio transport** for local integration with Claude Code.

### Entry Point

`src/index.ts` — Initializes `McpServer` and connects via `StdioServerTransport`.

### Adding Tools

```typescript
import { z } from "zod";

server.tool(
  "tool-name",
  "Tool description",
  { param: z.string() },
  async ({ param }) => {
    return { content: [{ type: "text", text: "result" }] };
  }
);
```

## External Services

| Service | Purpose | Auth |
|---------|---------|------|
| N8N | Workflow automation | API key |
| Airtable | Database (bookings, contacts) | API key |
| Acuity | Calendar scheduling | API key |
| Stripe | Payment processing | API key |

## Spec-Driven Development

This project uses [spec-kit](https://github.com/github/spec-kit) for specification-driven development.

### Workflow

1. `/speckit.constitution` — Define project principles
2. `/speckit.specify` — Create feature specification
3. `/speckit.plan` — Research and plan implementation
4. `/speckit.tasks` — Generate task list
5. `/speckit.implement` — Execute tasks

## Contributing

1. Write specs before code (spec-kit workflow)
2. Run `bun run lint && bun run typecheck` before commits
3. Use conventional commits (`feat:`, `fix:`, `chore:`)
