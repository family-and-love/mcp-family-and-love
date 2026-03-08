import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AcuityClient } from "../acuity-client.js";
import { fail, ok } from "../helpers.js";

export function registerAccountTools(server: McpServer, client: AcuityClient) {
	server.tool(
		"get-me",
		"Get the authenticated Acuity account details (name, email, timezone, etc.)",
		{},
		async () => {
			try {
				const data = await client.get("/me");
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to get account: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"get-meta",
		"Get Acuity account metadata (business name, logo, description, timezone, etc.)",
		{},
		async () => {
			try {
				const data = await client.get("/me/meta");
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to get account metadata: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);
}
