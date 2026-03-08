import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AcuityClient } from "../acuity-client.js";
import { fail, ok } from "../helpers.js";

export function registerBlockTools(server: McpServer, client: AcuityClient) {
	server.tool(
		"list-blocks",
		"List all blocked-off time ranges on calendars",
		{
			minDate: z
				.string()
				.optional()
				.describe("Minimum date in YYYY-MM-DD format"),
			maxDate: z
				.string()
				.optional()
				.describe("Maximum date in YYYY-MM-DD format"),
			calendarID: z.number().optional().describe("Filter by calendar ID"),
		},
		async (params) => {
			try {
				const query: Record<string, string | undefined> = {
					minDate: params.minDate,
					maxDate: params.maxDate,
					calendarID: params.calendarID ? String(params.calendarID) : undefined,
				};
				const data = await client.get("/blocks", query);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to list blocks: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"create-block",
		"Create a new blocked-off time range on a calendar",
		{
			start: z.string().describe("Block start datetime in ISO 8601 format"),
			end: z.string().describe("Block end datetime in ISO 8601 format"),
			calendarID: z.number().describe("Calendar ID"),
			notes: z.string().optional().describe("Notes for the block"),
		},
		async (params) => {
			try {
				const data = await client.post("/blocks", params);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to create block: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"get-block",
		"Get a single blocked-off time by ID",
		{
			id: z.number().describe("Block ID"),
		},
		async ({ id }) => {
			try {
				const data = await client.get(`/blocks/${id}`);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to get block: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"delete-block",
		"Delete a blocked-off time range by ID",
		{
			id: z.number().describe("Block ID"),
		},
		async ({ id }) => {
			try {
				await client.delete(`/blocks/${id}`);
				return ok({ deleted: true, id });
			} catch (error) {
				return fail(
					`Failed to delete block: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);
}
