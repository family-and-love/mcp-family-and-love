import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AcuityClient } from "../acuity-client.js";
import { fail, ok } from "../helpers.js";

export function registerClientTools(server: McpServer, client: AcuityClient) {
	server.tool(
		"list-clients",
		"List / search clients in Acuity",
		{
			search: z
				.string()
				.optional()
				.describe("Search query (name, email, phone)"),
		},
		async (params) => {
			try {
				const query: Record<string, string | undefined> = {
					search: params.search,
				};
				const data = await client.get("/clients", query);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to list clients: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"create-client",
		"Create a new client in Acuity",
		{
			firstName: z.string().describe("Client first name"),
			lastName: z.string().describe("Client last name"),
			email: z.string().optional().describe("Client email address"),
			phone: z.string().optional().describe("Client phone number"),
			notes: z.string().optional().describe("Notes about the client"),
		},
		async (params) => {
			try {
				const data = await client.post("/clients", params);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to create client: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"update-client",
		"Update an existing client. Note: Acuity uses the client ID in the request body, not in the URL path.",
		{
			id: z.number().describe("Client ID"),
			firstName: z.string().optional().describe("Client first name"),
			lastName: z.string().optional().describe("Client last name"),
			email: z.string().optional().describe("Client email address"),
			phone: z.string().optional().describe("Client phone number"),
			notes: z.string().optional().describe("Notes about the client"),
		},
		async (params) => {
			try {
				// Acuity PUT /clients expects ID in the body, not the path
				const data = await client.put("/clients", params);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to update client: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"delete-client",
		"Delete a client from Acuity. Note: Acuity uses the client ID in the request body, not in the URL path.",
		{
			id: z.number().describe("Client ID"),
		},
		async (params) => {
			try {
				// Acuity DELETE /clients expects ID in the body, not the path
				await client.delete("/clients", params);
				return ok({ deleted: true, id: params.id });
			} catch (error) {
				return fail(
					`Failed to delete client: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);
}
