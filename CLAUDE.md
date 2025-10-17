# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is an MCP (Model Context Protocol) server configuration repository for building an autonomous AI agent for Family and Love, a professional photography studio in Paris (https://www.familyandlove.fr/).

The agent's mission is to automate and manage various business operations including:
- Online booking system for photo sessions (family, pregnancy, newborn, couple)
- Customer communication (email, phone, contact forms)
- Gift voucher operations
- Photo gallery management
- FAQ and content updates
- Social media integration (Instagram)
- Analytics tracking and reporting
- Business workflow automation

The repository contains MCP server definitions that enable integration with external services and automation platforms to achieve these goals.

## MCP Server Configuration

The repository's primary artifact is `mcp.json`, which defines three MCP servers:

### Configured Servers

1. **Airtable** (`airtable`)
   - Command: `npx -y airtable-mcp-server`
   - Requires: `AIRTABLE_API_KEY` environment variable
   - Purpose: Integration with Airtable databases

2. **n8n** (`n8n`)
   - Command: `npx n8n-mcp`
   - Requires: `N8N_API_URL` and `N8N_API_KEY` environment variables
   - Configuration: stdio mode, error-level logging, console output disabled
   - Purpose: n8n workflow automation platform integration

3. **Make.com** (`make`)
   - Command: `npx -y mcp-remote https://mcp.make.com/sse`
   - Uses: OAuth SSE connection via mcp-remote proxy
   - Purpose: Make.com automation platform integration

### Working with MCP Configuration

When modifying `mcp.json`:
- Use the standard MCP server configuration format with `mcpServers` top-level key
- Each server requires a `command` field and `args` array
- Environment variables are specified in the `env` object
- For SSE-based connections (like Make.com), use the `mcp-remote` proxy
- API keys should remain as placeholders (`YOUR_*`) in the repository

### Adding New MCP Servers

To add a new MCP server:
1. Consult the official MCP server documentation for the service
2. Add a new entry under `mcpServers` with appropriate command and arguments
3. Include required environment variables with placeholder values
4. Test the configuration locally before committing
