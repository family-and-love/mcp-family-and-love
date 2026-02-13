import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const N8N_WEBHOOK_URL =
	"https://n8n.srv780195.hstgr.cloud/webhook/3eb750d1-e47b-4200-84f1-55b74540e477";

export function createServer(): McpServer {
	const server = new McpServer({
		name: "mcp-family-and-love",
		version: "0.1.0",
	});

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
			const targetDate = date ?? new Date().toISOString().split("T")[0];
			const url = `${N8N_WEBHOOK_URL}?date=${targetDate}`;

			try {
				const response = await fetch(url);

				if (!response.ok) {
					return {
						content: [
							{
								type: "text" as const,
								text: `N8N webhook error: ${response.status} ${response.statusText}`,
							},
						],
						isError: true,
					};
				}

				const data = await response.text();

				return {
					content: [{ type: "text" as const, text: data }],
				};
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				return {
					content: [
						{
							type: "text" as const,
							text: `Failed to reach N8N webhook: ${message}`,
						},
					],
					isError: true,
				};
			}
		},
	);

	return server;
}
