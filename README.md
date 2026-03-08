# mcp-family-and-love

## Overview

MCP (Model Context Protocol) server for [Family and Love](https://www.familyandlove.fr/), a professional photography studio in Paris. Provides tools for booking management, customer communication, workflow automation, and business operations.

Deployed on Vercel as a [Streamable HTTP](https://modelcontextprotocol.io/docs/concepts/transports#streamable-http) endpoint.

## Installation

### Claude Desktop

Requires [mcp-remote](https://github.com/geelen/mcp-remote) to bridge Streamable HTTP to stdio. Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "family-and-love": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp-family-and-love-family-and-loves-projects.vercel.app/api/mcp",
        "--transport",
        "http-only"
      ]
    }
  }
}
```

> **Note**: If `npx` is not found by Claude Desktop, use the absolute path (e.g. `/Users/<you>/.nvm/versions/node/v22.x.x/bin/npx`) and add `"env": { "PATH": "/Users/<you>/.nvm/versions/node/v22.x.x/bin:/usr/local/bin:/usr/bin:/bin" }` to ensure Node >= 18 is used.

### Claude Code

```bash
claude mcp add family-and-love --transport http https://mcp-family-and-love-family-and-loves-projects.vercel.app/api/mcp
```

## Tools

| Tool | Description |
|------|-------------|
| `sync-daily-appointments` | Sync Acuity Scheduling appointments to Airtable for a given date (defaults to today) |

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **MCP SDK**: `@modelcontextprotocol/sdk` v1.x
- **Validation**: Zod v4
- **Linter**: Biome
- **Deployment**: Vercel (Streamable HTTP via `api/mcp.ts`)

## Development

```bash
bun install
bun run dev           # Run server locally (stdio)
bun run typecheck     # TypeScript validation
bun run lint          # Biome check
bun run lint:fix      # Biome auto-fix
bun run inspector     # MCP Inspector (debug tools)
```
