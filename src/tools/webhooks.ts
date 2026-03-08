import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AcuityClient } from "../acuity-client.js";
import { fail, ok } from "../helpers.js";

export function registerWebhookTools(server: McpServer, client: AcuityClient) {
	server.tool(
		"list-webhooks",
		"List all registered webhooks in Acuity",
		{},
		async () => {
			try {
				const data = await client.get("/webhooks");
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to list webhooks: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"create-webhook",
		"Register a new webhook to receive event notifications",
		{
			event: z
				.enum([
					"appointment.scheduled",
					"appointment.rescheduled",
					"appointment.canceled",
					"appointment.changed",
					"order.completed",
				])
				.describe("Event type to subscribe to"),
			target: z.string().describe("Target URL to receive webhook POST"),
		},
		async (params) => {
			try {
				const data = await client.post("/webhooks", params);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to create webhook: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"delete-webhook",
		"Delete a registered webhook by ID",
		{
			id: z.number().describe("Webhook ID"),
		},
		async ({ id }) => {
			try {
				await client.delete(`/webhooks/${id}`);
				return ok({ deleted: true, id });
			} catch (error) {
				return fail(
					`Failed to delete webhook: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);
}
