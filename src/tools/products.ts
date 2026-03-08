import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AcuityClient } from "../acuity-client.js";
import { fail, ok } from "../helpers.js";

export function registerProductTools(server: McpServer, client: AcuityClient) {
	server.tool(
		"list-products",
		"List all products (add-ons) available in Acuity",
		{},
		async () => {
			try {
				const data = await client.get("/products");
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to list products: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);
}
