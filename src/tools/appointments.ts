import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AcuityClient } from "../acuity-client.js";
import { fail, ok } from "../helpers.js";

interface AcuityAppointment {
	id: number;
	dateCreated: string;
	datetime: string;
	firstName: string;
	lastName: string;
	email: string;
	type: string;
	calendar: string;
	canceled: boolean;
}

function isSameDay(dateStr: string, targetDate: string): boolean {
	const date = new Date(dateStr);
	const [year, month, day] = targetDate.split("-").map(Number);
	return (
		date.getFullYear() === year &&
		date.getMonth() + 1 === month &&
		date.getDate() === day
	);
}

export function registerAppointmentTools(
	server: McpServer,
	client: AcuityClient,
) {
	server.tool(
		"count-daily-bookings",
		"Count how many new bookings (reservations) were made on a specific day. Filters by creation date, not appointment date.",
		{
			date: z
				.string()
				.describe("Date to count bookings for, in YYYY-MM-DD format."),
		},
		async ({ date }) => {
			try {
				const targetDate = date;

				const appointments = await client.get<AcuityAppointment[]>(
					"/appointments",
					{ minDate: targetDate, max: "500", direction: "ASC" },
				);

				const bookingsOnDate = appointments.filter((appt) =>
					isSameDay(appt.dateCreated, targetDate),
				);

				const summary = {
					date: targetDate,
					totalBookings: bookingsOnDate.length,
					bookings: bookingsOnDate.map((appt) => ({
						id: appt.id,
						dateCreated: appt.dateCreated,
						appointmentDate: appt.datetime,
						client: `${appt.firstName} ${appt.lastName}`,
						email: appt.email,
						type: appt.type,
						calendar: appt.calendar,
					})),
				};

				return ok(summary);
			} catch (error) {
				return fail(
					`Failed to count daily bookings: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"list-appointments",
		"List appointments with optional filters (date range, calendar, status, etc.)",
		{
			minDate: z
				.string()
				.optional()
				.describe("Minimum date in YYYY-MM-DD format"),
			maxDate: z
				.string()
				.optional()
				.describe("Maximum date in YYYY-MM-DD format"),
			calendarID: z.number().optional().describe("Filter by calendar ID"),
			appointmentTypeID: z
				.number()
				.optional()
				.describe("Filter by appointment type ID"),
			canceled: z
				.boolean()
				.optional()
				.describe("Include canceled appointments"),
			email: z.string().optional().describe("Filter by client email"),
			firstName: z.string().optional().describe("Filter by client first name"),
			lastName: z.string().optional().describe("Filter by client last name"),
			max: z
				.number()
				.optional()
				.describe("Max results to return (default 100)"),
			direction: z
				.enum(["ASC", "DESC"])
				.optional()
				.describe("Sort direction by date"),
		},
		async (params) => {
			try {
				const query: Record<string, string | undefined> = {
					minDate: params.minDate,
					maxDate: params.maxDate,
					calendarID: params.calendarID ? String(params.calendarID) : undefined,
					appointmentTypeID: params.appointmentTypeID
						? String(params.appointmentTypeID)
						: undefined,
					canceled:
						params.canceled !== undefined ? String(params.canceled) : undefined,
					email: params.email,
					firstName: params.firstName,
					lastName: params.lastName,
					max: params.max ? String(params.max) : undefined,
					direction: params.direction,
				};
				const data = await client.get("/appointments", query);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to list appointments: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"create-appointment",
		"Create a new appointment in Acuity",
		{
			datetime: z.string().describe("Appointment datetime in ISO 8601 format"),
			appointmentTypeID: z.number().describe("Appointment type ID"),
			firstName: z.string().describe("Client first name"),
			lastName: z.string().describe("Client last name"),
			email: z.string().describe("Client email address"),
			phone: z.string().optional().describe("Client phone number"),
			calendarID: z
				.number()
				.optional()
				.describe("Calendar ID (uses default if omitted)"),
			notes: z.string().optional().describe("Internal notes"),
			fields: z
				.array(
					z.object({
						id: z.number().describe("Intake form field ID"),
						value: z.string().describe("Field value"),
					}),
				)
				.optional()
				.describe("Intake form field values"),
		},
		async (params) => {
			try {
				const data = await client.post("/appointments", params);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to create appointment: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"get-appointment",
		"Get a single appointment by ID",
		{
			id: z.number().describe("Appointment ID"),
		},
		async ({ id }) => {
			try {
				const data = await client.get(`/appointments/${id}`);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to get appointment: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"update-appointment",
		"Update an existing appointment (notes, labels, etc.)",
		{
			id: z.number().describe("Appointment ID"),
			notes: z.string().optional().describe("Internal notes"),
			labels: z
				.array(
					z.object({
						id: z.number().describe("Label ID"),
					}),
				)
				.optional()
				.describe("Labels to assign"),
		},
		async ({ id, ...body }) => {
			try {
				const data = await client.put(`/appointments/${id}`, body);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to update appointment: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"cancel-appointment",
		"Cancel an appointment by ID",
		{
			id: z.number().describe("Appointment ID"),
			cancelNote: z.string().optional().describe("Cancellation reason note"),
			noShow: z
				.boolean()
				.optional()
				.describe("Mark as no-show instead of cancel"),
		},
		async ({ id, ...body }) => {
			try {
				const data = await client.put(`/appointments/${id}/cancel`, body);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to cancel appointment: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"reschedule-appointment",
		"Reschedule an appointment to a new date/time",
		{
			id: z.number().describe("Appointment ID"),
			datetime: z.string().describe("New datetime in ISO 8601 format"),
			calendarID: z.number().optional().describe("New calendar ID (optional)"),
		},
		async ({ id, ...body }) => {
			try {
				const data = await client.put(`/appointments/${id}/reschedule`, body);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to reschedule appointment: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);

	server.tool(
		"list-appointment-payments",
		"List payments for a specific appointment",
		{
			id: z.number().describe("Appointment ID"),
		},
		async ({ id }) => {
			try {
				const data = await client.get(`/appointments/${id}/payments`);
				return ok(data);
			} catch (error) {
				return fail(
					`Failed to list payments: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		},
	);
}
