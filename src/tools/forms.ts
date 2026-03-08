import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AcuityClient } from "../acuity-client.js";
import { fail, ok } from "../helpers.js";

export function registerFormTools(server: McpServer, client: AcuityClient) {
	server.tool(
		"list-forms",
		"List all intake forms configured in Acuity",
		{},
		async () => {
			try {
				const data = await client.get("/forms");
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to list forms: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);
}
