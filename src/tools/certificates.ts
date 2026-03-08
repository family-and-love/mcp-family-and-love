import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AcuityClient } from "../acuity-client.js";
import { fail, ok } from "../helpers.js";

export function registerCertificateTools(
	server: McpServer,
	client: AcuityClient,
) {
	server.tool(
		"list-certificates",
		"List all gift certificates / packages / subscriptions",
		{
			appointmentTypeID: z
				.number()
				.optional()
				.describe("Filter by appointment type ID"),
			email: z.string().optional().describe("Filter by client email"),
		},
		async (params) => {
			try {
				const query: Record<string, string | undefined> = {
					appointmentTypeID: params.appointmentTypeID
						? String(params.appointmentTypeID)
						: undefined,
					email: params.email,
				};
				const data = await client.get("/certificates", query);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to list certificates: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"create-certificate",
		"Create a new gift certificate for a client",
		{
			productID: z.number().describe("Certificate product ID"),
			email: z.string().describe("Client email address"),
			firstName: z.string().describe("Client first name"),
			lastName: z.string().describe("Client last name"),
		},
		async (params) => {
			try {
				const data = await client.post("/certificates", params);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to create certificate: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"delete-certificate",
		"Delete (void) a gift certificate by ID",
		{
			id: z.number().describe("Certificate ID"),
		},
		async ({ id }) => {
			try {
				await client.delete(`/certificates/${id}`);
				return ok({ deleted: true, id });
			} catch (error) {
				return fail(
					`Failed to delete certificate: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"check-certificate",
		"Check / validate a certificate code",
		{
			certificate: z.string().describe("Certificate code to validate"),
			appointmentTypeID: z
				.number()
				.optional()
				.describe("Appointment type ID to check against"),
		},
		async (params) => {
			try {
				const query: Record<string, string | undefined> = {
					certificate: params.certificate,
					appointmentTypeID: params.appointmentTypeID
						? String(params.appointmentTypeID)
						: undefined,
				};
				const data = await client.get("/certificates/check", query);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to check certificate: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);
}
