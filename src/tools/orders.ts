import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AcuityClient } from "../acuity-client.js";
import { fail, ok } from "../helpers.js";

export function registerOrderTools(server: McpServer, client: AcuityClient) {
	server.tool(
		"list-orders",
		"List all orders (product purchases) in Acuity",
		{},
		async () => {
			try {
				const data = await client.get("/orders");
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to list orders: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"get-order",
		"Get a single order by ID",
		{
			id: z.number().describe("Order ID"),
		},
		async ({ id }) => {
			try {
				const data = await client.get(`/orders/${id}`);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to get order: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);
}
