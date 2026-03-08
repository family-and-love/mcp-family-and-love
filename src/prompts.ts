import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerPrompts(server: McpServer) {
	server.prompt(
		"daily-report",
		"Generate a daily activity report for the studio: new bookings created, upcoming appointments, and cancellations.",
		{
			date: z
				.string()
				.describe("Date to report on in YYYY-MM-DD format. Defaults to today."),
		},
		({ date }) => ({
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `Generate a daily activity report for ${date}. Use the available Acuity tools to:

1. Call count-daily-bookings with date "${date}" to get new reservations created on that day.
2. Call list-appointments with minDate "${date}" and maxDate "${date}" to get all appointments scheduled for that day.
3. Call list-appointments with minDate "${date}" and maxDate "${date}" and canceled true to check for cancellations.

Present a clear summary in French with:
- Number of new bookings created
- Number of appointments scheduled
- Breakdown by appointment type
- Any cancellations
- Notable observations (busy periods, popular services, etc.)`,
					},
				},
			],
		}),
	);

	server.prompt(
		"client-lookup",
		"Look up a client's history: past appointments, upcoming bookings, and payment status.",
		{
			email: z.string().describe("Client email address to look up."),
		},
		({ email }) => ({
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `Look up the client with email "${email}". Use the available Acuity tools to:

1. Call list-clients with email "${email}" to find the client.
2. Call list-appointments with email "${email}" to get their appointment history.
3. For recent appointments, call list-appointment-payments to check payment status.

Present a client profile summary in French with:
- Client name and contact info
- Total number of appointments (past and upcoming)
- Appointment types breakdown
- Payment status for recent appointments
- Last visit date and next upcoming appointment`,
					},
				},
			],
		}),
	);

	server.prompt(
		"weekly-availability",
		"Check available slots for the upcoming week to help with scheduling.",
		{
			appointmentTypeID: z
				.string()
				.describe("Appointment type ID to check availability for."),
		},
		({ appointmentTypeID }) => {
			const today = new Date().toISOString().slice(0, 10);
			const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
				.toISOString()
				.slice(0, 10);

			return {
				messages: [
					{
						role: "user" as const,
						content: {
							type: "text" as const,
							text: `Check available slots for appointment type ${appointmentTypeID} from ${today} to ${nextWeek}. Use the available Acuity tools to:

1. Call list-available-dates with appointmentTypeID ${appointmentTypeID}, month "${today.slice(0, 7)}" to get available dates.
2. For each available date, call list-available-times to get specific time slots.

Present the availability in French as a clear weekly calendar view with:
- Available dates highlighted
- Time slots for each available date
- Any fully booked days noted`,
						},
					},
				],
			};
		},
	);
}
