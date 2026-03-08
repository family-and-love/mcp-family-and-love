import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fail } from "../helpers.js";

const N8N_WEBHOOK_URL =
	process.env.N8N_WEBHOOK_URL ??
	"https://n8n.srv780195.hstgr.cloud/webhook/3eb750d1-e47b-4200-84f1-55b74540e477";

export function registerN8nTools(server: McpServer) {
	server.tool(
		"sync-daily-appointments",
		"Sync Acuity Scheduling appointments to Airtable for a given date. Fetches appointments from Acuity, deduplicates against the Airtable Bookings table, and creates missing booking cards via Make.com. Defaults to today if no date is provided.",
		{
			date: z
				.string()
				.date()
				.optional()
				.describe("Date in YYYY-MM-DD format. Defaults to today."),
		},
		async ({ date }) => {
			const targetDate = date ?? new Date().toISOString().slice(0, 10);
			const url = `${N8N_WEBHOOK_URL}?date=${targetDate}`;

			try {
				const response = await fetch(url);

				if (!response.ok) {
					return fail(
						`N8N webhook error: ${response.status} ${response.statusText}`,
					);
				}

				const data = await response.text();
				return { content: [{ type: "text" as const, text: data }] };
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				return fail(`Failed to reach N8N webhook: ${message}`);
			}
		},
	);
}
