# MCP Family and Love

## Overview

Unified MCP server for Family and Love studio operations. Wraps the full Acuity Scheduling REST API (35 tools) and N8N workflow automation (1 tool). Deployed on Vercel as Streamable HTTP, also runs locally via stdio.

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **MCP SDK**: `@modelcontextprotocol/sdk` v1.x (stdio + Streamable HTTP)
- **Validation**: Zod v4
- **Linter**: Biome

## Project Structure

```
mcp-family-and-love/
├── src/
│   ├── index.ts              # Stdio transport entry point
│   ├── server.ts             # createServer() — registers all tools + prompts
│   ├── acuity-client.ts      # Acuity HTTP client (Basic Auth)
│   ├── helpers.ts            # ok() / fail() response helpers
│   ├── prompts.ts            # 3 MCP prompts
│   └── tools/
│       ├── n8n.ts            # sync-daily-appointments (N8N webhook)
│       ├── account.ts        # get-me, get-meta
│       ├── appointments.ts   # 8 appointment tools
│       ├── availability.ts   # 4 availability tools
│       ├── blocks.ts         # 4 block tools
│       ├── calendars.ts      # list-calendars
│       ├── certificates.ts   # 4 certificate tools
│       ├── clients.ts        # 4 client tools
│       ├── forms.ts          # list-forms
│       ├── labels.ts         # list-labels
│       ├── orders.ts         # 2 order tools
│       ├── products.ts       # list-products
│       └── webhooks.ts       # 3 webhook tools
├── api/
│   └── mcp.ts                # Vercel Streamable HTTP endpoint
├── .env.example              # Environment variables template
├── biome.json                # Biome linter config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies and scripts
```

## Environment Variables

```bash
# Required for Acuity tools (server starts without them, but Acuity tools won't register)
ACUITY_USER_ID=your_acuity_user_id
ACUITY_API_KEY=your_acuity_api_key

# Optional (defaults to hardcoded value)
N8N_WEBHOOK_URL=your_n8n_webhook_url
```

## Development Commands

```bash
bun run dev           # Run server locally (stdio)
bun run start         # Start server
bun run typecheck     # TypeScript validation
bun run lint          # Biome check
bun run lint:fix      # Biome auto-fix
bun run inspector     # MCP Inspector (debug tools)
```

## Architecture

- `src/server.ts` creates the McpServer and conditionally registers tools
- N8N tools always register (no credentials needed)
- Acuity tools only register if `ACUITY_USER_ID` and `ACUITY_API_KEY` are set
- Each tool domain has its own file in `src/tools/` exporting a `registerXxxTools()` function
- `src/helpers.ts` provides `ok(data)` and `fail(message)` for consistent MCP responses

## External Services

| Service | Purpose | Auth |
|---------|---------|------|
| Acuity Scheduling | Calendar, appointments, clients | HTTP Basic Auth |
| N8N | Workflow automation | Webhook URL |
| Airtable | Database (bookings, contacts) | Via N8N |

## Contributing

1. Run `bun run lint && bun run typecheck` before commits
2. Use conventional commits (`feat:`, `fix:`, `chore:`)
3. Add new tools in `src/tools/` following the `registerXxxTools()` pattern

# currentDate
Today's date is 2026-03-08.
