const BASE_URL = "https://acuityscheduling.com/api/v1";

export class AcuityClient {
	private headers: Record<string, string>;

	constructor(userId: string, apiKey: string) {
		const encoded = btoa(`${userId}:${apiKey}`);
		this.headers = {
			Authorization: `Basic ${encoded}`,
			"Content-Type": "application/json",
			Accept: "application/json",
		};
	}

	async get<T = unknown>(
		path: string,
		params?: Record<string, string | undefined>,
	): Promise<T> {
		const url = new URL(`${BASE_URL}${path}`);
		if (params) {
			for (const [key, value] of Object.entries(params)) {
				if (value !== undefined) {
					url.searchParams.set(key, value);
				}
			}
		}
		return this.request<T>("GET", url);
	}

	async post<T = unknown>(path: string, body?: unknown): Promise<T> {
		return this.request<T>("POST", new URL(`${BASE_URL}${path}`), body);
	}

	async put<T = unknown>(path: string, body?: unknown): Promise<T> {
		return this.request<T>("PUT", new URL(`${BASE_URL}${path}`), body);
	}

	async delete<T = unknown>(path: string, body?: unknown): Promise<T> {
		return this.request<T>("DELETE", new URL(`${BASE_URL}${path}`), body);
	}

	private async request<T>(
		method: string,
		url: URL,
		body?: unknown,
	): Promise<T> {
		const init: RequestInit = {
			method,
			headers: this.headers,
		};
		if (body !== undefined) {
			init.body = JSON.stringify(body);
		}

		const response = await fetch(url.toString(), init);

		if (!response.ok) {
			const text = await response.text().catch(() => "");
			throw new Error(
				`Acuity API ${method} ${url.pathname} failed: ${response.status} ${response.statusText}${text ? ` — ${text}` : ""}`,
			);
		}

		if (response.status === 204) {
			return undefined as T;
		}

		return response.json() as Promise<T>;
	}
}
