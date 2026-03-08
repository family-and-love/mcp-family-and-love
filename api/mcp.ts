import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createServer } from "../src/server.js";

const MCP_API_KEY = process.env.MCP_API_KEY;

function authenticate(request: Request): Response | null {
	if (!MCP_API_KEY) return null;

	const auth = request.headers.get("authorization");
	if (auth === `Bearer ${MCP_API_KEY}`) return null;

	return new Response("Unauthorized", { status: 401 });
}

async function handleMcpRequest(request: Request): Promise<Response> {
	const denied = authenticate(request);
	if (denied) return denied;

	const server = createServer();
	const transport = new WebStandardStreamableHTTPServerTransport({
		sessionIdGenerator: undefined,
	});

	await server.connect(transport);
	return transport.handleRequest(request);
}

export async function GET(request: Request): Promise<Response> {
	return handleMcpRequest(request);
}

export async function POST(request: Request): Promise<Response> {
	return handleMcpRequest(request);
}

export async function DELETE(request: Request): Promise<Response> {
	return handleMcpRequest(request);
}
