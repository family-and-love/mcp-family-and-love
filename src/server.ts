import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AcuityClient } from "./acuity-client.js";
import { registerPrompts } from "./prompts.js";
import { registerAccountTools } from "./tools/account.js";
import { registerAppointmentTools } from "./tools/appointments.js";
import { registerAvailabilityTools } from "./tools/availability.js";
import { registerBlockTools } from "./tools/blocks.js";
import { registerCalendarTools } from "./tools/calendars.js";
import { registerCertificateTools } from "./tools/certificates.js";
import { registerClientTools } from "./tools/clients.js";
import { registerFormTools } from "./tools/forms.js";
import { registerLabelTools } from "./tools/labels.js";
import { registerN8nTools } from "./tools/n8n.js";
import { registerOrderTools } from "./tools/orders.js";
import { registerProductTools } from "./tools/products.js";
import { registerWebhookTools } from "./tools/webhooks.js";

export function createServer(): McpServer {
	const server = new McpServer({
		name: "mcp-family-and-love",
		version: "0.2.0",
	});

	registerN8nTools(server);

	const userId = process.env.ACUITY_USER_ID;
	const apiKey = process.env.ACUITY_API_KEY;

	if (userId && apiKey) {
		const client = new AcuityClient(userId, apiKey);

		registerAccountTools(server, client);
		registerAppointmentTools(server, client);
		registerAvailabilityTools(server, client);
		registerBlockTools(server, client);
		registerCalendarTools(server, client);
		registerCertificateTools(server, client);
		registerClientTools(server, client);
		registerFormTools(server, client);
		registerLabelTools(server, client);
		registerOrderTools(server, client);
		registerProductTools(server, client);
		registerWebhookTools(server, client);
		registerPrompts(server);
	}

	return server;
}
