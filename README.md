# mcp-family-and-love

## Overview

This repository contains MCP (Model Context Protocol) server configurations for building an autonomous AI agent that can interact with and manage various tools and services of [Family and Love](https://www.familyandlove.fr/), a professional photography studio in Paris.

## Purpose

The goal is to design an autonomous agent capable of:

- **Booking Management**: Handle online booking system for photo sessions
- **Customer Communication**: Manage inquiries via phone, email, and contact forms
- **Gift Voucher Operations**: Process and track gift voucher purchases
- **Photo Gallery Management**: Organize and update photo galleries
- **FAQ & Content Updates**: Maintain website content and frequently asked questions
- **Social Media Integration**: Connect with Instagram and other social platforms
- **Analytics Tracking**: Monitor website performance and customer engagement
- **Workflow Automation**: Streamline business processes using n8n and Make.com

## MCP Servers

This project integrates three MCP servers:

1. **Airtable** - Database management for bookings, customers, and inventory
2. **n8n** - Workflow automation for business processes
3. **Make.com** - Additional automation and integration capabilities

## Installation

### Claude Desktop (stdio)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "family-and-love": {
      "command": "bun",
      "args": ["run", "start"],
      "cwd": "/path/to/mcp-family-and-love"
    }
  }
}
```

### Claude Code (Streamable HTTP)

```bash
claude mcp add family-and-love --transport http https://mcp-family-and-love-family-and-loves-projects.vercel.app/api/mcp
```

## Business Context

Family and Love offers:
- Free 1-hour photo sessions (family, pregnancy, newborn, couple)
- Pay-only-for-liked-photos model
- Located at 10 rue Charles Delescluze, Paris 11
- Contact: hello@familyandlove.fr / +33 7 75 76 90 44

Tagline: *"Vos souvenirs, notre passion"*
