import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AcuityClient } from "../acuity-client.js";
import { fail, ok } from "../helpers.js";

export function registerCalendarTools(server: McpServer, client: AcuityClient) {
	server.tool(
		"list-calendars",
		"List all calendars in the Acuity account",
		{},
		async () => {
			try {
				const data = await client.get("/calendars");
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to list calendars: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);
}
