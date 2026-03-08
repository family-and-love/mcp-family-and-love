import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AcuityClient } from "../acuity-client.js";
import { fail, ok } from "../helpers.js";

export function registerLabelTools(server: McpServer, client: AcuityClient) {
	server.tool(
		"list-labels",
		"List all appointment labels configured in Acuity",
		{},
		async () => {
			try {
				const data = await client.get("/labels");
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to list labels: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);
}
