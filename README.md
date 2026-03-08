# mcp-family-and-love

## Overview

MCP (Model Context Protocol) server for [Family and Love](https://www.familyandlove.fr/), a professional photography studio in Paris. Provides 36 tools covering Acuity Scheduling (appointments, availability, clients, calendars, blocks, certificates, orders, products, forms, labels, webhooks) and N8N workflow automation.

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

### Environment Variables

```bash
# Required for Acuity tools (optional — server starts without them)
ACUITY_USER_ID=your_acuity_user_id
ACUITY_API_KEY=your_acuity_api_key

# Optional
N8N_WEBHOOK_URL=your_n8n_webhook_url

# API key to secure the HTTP endpoint (optional — if set, requires Authorization: Bearer <key>)
MCP_API_KEY=your_mcp_api_key
```

Acuity credentials use HTTP Basic Auth (`userId:apiKey` base64-encoded). Get them from your [Acuity Scheduling API settings](https://acuityscheduling.com/oauth2/client).

When `MCP_API_KEY` is set, all HTTP requests must include `Authorization: Bearer <key>`. For Claude Desktop, use `--header "Authorization:${MCP_API_KEY}"` with mcp-remote (see installation section).

## Tools (36)

| Domain | Tools | Count |
|--------|-------|-------|
| N8N | `sync-daily-appointments` | 1 |
| Account | `get-me`, `get-meta` | 2 |
| Appointments | `count-daily-bookings`, `list-appointments`, `create-appointment`, `get-appointment`, `update-appointment`, `cancel-appointment`, `reschedule-appointment`, `list-appointment-payments` | 8 |
| Availability | `list-available-dates`, `list-available-times`, `list-available-classes`, `check-availability` | 4 |
| Blocks | `list-blocks`, `create-block`, `get-block`, `delete-block` | 4 |
| Calendars | `list-calendars` | 1 |
| Certificates | `list-certificates`, `create-certificate`, `delete-certificate`, `check-certificate` | 4 |
| Clients | `list-clients`, `create-client`, `update-client`, `delete-client` | 4 |
| Forms | `list-forms` | 1 |
| Labels | `list-labels` | 1 |
| Orders | `list-orders`, `get-order` | 2 |
| Products | `list-products` | 1 |
| Webhooks | `list-webhooks`, `create-webhook`, `delete-webhook` | 3 |

## Prompts (3)

| Prompt | Description |
|--------|-------------|
| `daily-report` | Generate a daily activity report (bookings, appointments, cancellations) |
| `client-lookup` | Look up a client's history by email |
| `weekly-availability` | Check available slots for the upcoming week |

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **MCP SDK**: `@modelcontextprotocol/sdk` v1.x
- **Validation**: Zod v4
- **Linter**: Biome
- **Deployment**: Vercel (Streamable HTTP via `api/mcp.ts`)

## Development

```bash
cp .env.example .env
# Fill in ACUITY_USER_ID and ACUITY_API_KEY
bun install
bun run dev           # Run server locally (stdio)
bun run typecheck     # TypeScript validation
bun run lint          # Biome check
bun run lint:fix      # Biome auto-fix
bun run inspector     # MCP Inspector (debug tools)
```
