import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AcuityClient } from "../acuity-client.js";
import { fail, ok } from "../helpers.js";

export function registerAvailabilityTools(
	server: McpServer,
	client: AcuityClient,
) {
	server.tool(
		"list-available-dates",
		"Get available dates for a given appointment type and month",
		{
			appointmentTypeID: z.number().describe("Appointment type ID"),
			month: z.string().describe("Month in YYYY-MM format"),
			calendarID: z.number().optional().describe("Filter by calendar ID"),
			timezone: z.string().optional().describe("Timezone (e.g. Europe/Paris)"),
		},
		async (params) => {
			try {
				const query: Record<string, string | undefined> = {
					appointmentTypeID: String(params.appointmentTypeID),
					month: params.month,
					calendarID: params.calendarID ? String(params.calendarID) : undefined,
					timezone: params.timezone,
				};
				const data = await client.get("/availability/dates", query);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to get available dates: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"list-available-times",
		"Get available time slots for a given appointment type and date",
		{
			appointmentTypeID: z.number().describe("Appointment type ID"),
			date: z.string().describe("Date in YYYY-MM-DD format"),
			calendarID: z.number().optional().describe("Filter by calendar ID"),
			timezone: z.string().optional().describe("Timezone (e.g. Europe/Paris)"),
		},
		async (params) => {
			try {
				const query: Record<string, string | undefined> = {
					appointmentTypeID: String(params.appointmentTypeID),
					date: params.date,
					calendarID: params.calendarID ? String(params.calendarID) : undefined,
					timezone: params.timezone,
				};
				const data = await client.get("/availability/times", query);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to get available times: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"list-available-classes",
		"Get available class sessions for a given appointment type and month",
		{
			appointmentTypeID: z.number().describe("Appointment type ID"),
			month: z.string().describe("Month in YYYY-MM format"),
			calendarID: z.number().optional().describe("Filter by calendar ID"),
			timezone: z.string().optional().describe("Timezone (e.g. Europe/Paris)"),
			includeUnavailable: z
				.boolean()
				.optional()
				.describe("Include full/unavailable classes"),
		},
		async (params) => {
			try {
				const query: Record<string, string | undefined> = {
					appointmentTypeID: String(params.appointmentTypeID),
					month: params.month,
					calendarID: params.calendarID ? String(params.calendarID) : undefined,
					timezone: params.timezone,
					includeUnavailable:
						params.includeUnavailable !== undefined
							? String(params.includeUnavailable)
							: undefined,
				};
				const data = await client.get("/availability/classes", query);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to get available classes: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"check-availability",
		"Check if a specific datetime is available for an appointment type",
		{
			appointmentTypeID: z.number().describe("Appointment type ID"),
			datetime: z.string().describe("Datetime in ISO 8601 format"),
			calendarID: z.number().optional().describe("Calendar ID"),
		},
		async (params) => {
			try {
				const query: Record<string, string | undefined> = {
					appointmentTypeID: String(params.appointmentTypeID),
					datetime: params.datetime,
					calendarID: params.calendarID ? String(params.calendarID) : undefined,
				};
				const data = await client.get("/availability/check", query);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to check availability: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);
}
