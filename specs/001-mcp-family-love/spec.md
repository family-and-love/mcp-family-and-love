# Feature Specification: MCP Family and Love

**Feature Branch**: `001-mcp-family-love`
**Created**: 2026-02-13
**Status**: Draft
**Input**: User description: "Create an MCP for managing Family and Love"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Manage N8N Workflows (Priority: P1)

As a studio operator, I want to list, monitor, and trigger N8N workflows from Claude Code, so that I can automate studio operations without switching to the N8N dashboard.

**Why this priority**: N8N workflows are the backbone of studio automation (email sequences, booking confirmations, follow-ups). Being able to monitor and trigger them directly from Claude Code eliminates context-switching and enables faster incident response.

**Independent Test**: Can be fully tested by listing available workflows, checking their status, and executing a test workflow. Delivers immediate value as a workflow management interface.

**Acceptance Scenarios**:

1. **Given** the MCP server is running and connected to N8N, **When** the operator requests the list of workflows, **Then** the system returns all workflows with their name, status (active/inactive), and last execution time.
2. **Given** a workflow exists in N8N, **When** the operator triggers it with valid input parameters, **Then** the workflow executes and returns execution results (success/failure with details).
3. **Given** a workflow execution fails, **When** the operator requests execution details, **Then** the system returns the error message, failed node, and timestamp.
4. **Given** N8N is unreachable, **When** the operator attempts any workflow operation, **Then** the system returns a clear error message indicating the connection issue.

---

### User Story 2 - Manage Bookings via Airtable (Priority: P1)

As a studio operator, I want to query, create, and update booking records in Airtable from Claude Code, so that I can manage client appointments without navigating the Airtable interface.

**Why this priority**: Bookings are the core business operation. Direct access to booking data enables quick lookups (next client, today's schedule), updates (reschedule, cancel), and creation of new bookings — all from the command line.

**Independent Test**: Can be fully tested by querying existing bookings, creating a test booking, and updating a booking status. Delivers immediate value for daily booking management.

**Acceptance Scenarios**:

1. **Given** bookings exist in Airtable, **When** the operator queries bookings for a specific date, **Then** the system returns all bookings for that date with client name, time, service type, and status.
2. **Given** a valid client and time slot, **When** the operator creates a new booking, **Then** the booking is created in Airtable with all required fields populated.
3. **Given** an existing booking, **When** the operator updates its status (e.g., confirmed, cancelled, completed), **Then** the booking record is updated in Airtable and the change is confirmed.
4. **Given** a search query (client name, phone, email), **When** the operator searches for bookings, **Then** the system returns matching bookings sorted by date.
5. **Given** invalid or incomplete booking data, **When** the operator attempts to create a booking, **Then** the system rejects the request with a clear validation error.

---

### User Story 3 - Manage Contact Records (Priority: P2)

As a studio operator, I want to look up, create, and update contact records in Airtable, so that I can manage client information efficiently during calls and interactions.

**Why this priority**: Contact management supports booking operations and client relationship management. It is essential but secondary to direct booking management.

**Independent Test**: Can be fully tested by searching for a contact, creating a new contact, and updating contact details. Delivers value for CRM-like operations.

**Acceptance Scenarios**:

1. **Given** contacts exist in Airtable, **When** the operator searches by name, phone, or email, **Then** the system returns matching contacts with their key details (name, phone, email, booking history count).
2. **Given** valid contact information, **When** the operator creates a new contact, **Then** the contact is created in Airtable with all provided fields.
3. **Given** an existing contact, **When** the operator updates their information, **Then** the contact record is updated and the change is confirmed.

---

### User Story 4 - Check Scheduling Availability (Priority: P2)

As a studio operator, I want to check available time slots from the scheduling system, so that I can quickly propose options to clients during phone or chat conversations.

**Why this priority**: Real-time availability checking speeds up the booking process and reduces double-bookings. It complements the booking management story.

**Independent Test**: Can be fully tested by requesting available slots for a given date range and service type. Delivers value for scheduling operations.

**Acceptance Scenarios**:

1. **Given** a date range and service type, **When** the operator checks availability, **Then** the system returns available time slots for the specified period.
2. **Given** no available slots exist for the requested period, **When** the operator checks availability, **Then** the system returns an empty list with a clear message.
3. **Given** the scheduling service is unreachable, **When** the operator checks availability, **Then** the system returns a clear error message.

---

### User Story 5 - View Payment and Invoice Status (Priority: P3)

As a studio operator, I want to check payment status and recent transactions, so that I can verify client payments and reconcile accounts.

**Why this priority**: Payment verification is important but less frequent than booking and contact operations. It supports financial reconciliation and client follow-up.

**Independent Test**: Can be fully tested by querying recent payments, checking a specific payment status, and listing outstanding invoices. Delivers value for financial operations.

**Acceptance Scenarios**:

1. **Given** payments exist in the payment system, **When** the operator queries recent payments, **Then** the system returns a list of recent transactions with amount, client, date, and status.
2. **Given** a specific booking or client, **When** the operator checks payment status, **Then** the system returns the payment details (paid, pending, failed, refunded).
3. **Given** outstanding invoices exist, **When** the operator lists unpaid invoices, **Then** the system returns all outstanding invoices sorted by due date.

---

### Edge Cases

- What happens when API credentials are missing or expired? The system MUST return a clear, actionable error message indicating which service credential is missing or invalid.
- What happens when Airtable rate limits are hit? The system MUST return a clear error indicating rate limiting and suggest retrying after a delay.
- What happens when a booking is created for a time slot that was just booked by someone else? The system MUST check availability before confirming and return a conflict error if the slot is no longer available.
- What happens when the operator queries a very large dataset (e.g., all bookings for a year)? The system MUST support pagination or date-range filtering to avoid overwhelming responses.
- What happens when external service data contains unexpected or missing fields? The system MUST handle missing optional fields gracefully and report validation errors for missing required fields.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose MCP tools via stdio transport for integration with Claude Code
- **FR-002**: System MUST connect to N8N API to list, monitor, and execute workflows
- **FR-003**: System MUST connect to Airtable API to query, create, and update booking records
- **FR-004**: System MUST connect to Airtable API to query, create, and update contact records
- **FR-005**: System MUST connect to the scheduling service API to check available time slots
- **FR-006**: System MUST connect to the payment service API to query payment status and transaction history
- **FR-007**: System MUST validate all input parameters using schema validation before making external API calls
- **FR-008**: System MUST return structured, human-readable responses for all tool results
- **FR-009**: System MUST handle external service errors gracefully with clear error messages indicating the source and nature of the failure
- **FR-010**: System MUST load API credentials from environment variables (never hardcoded)
- **FR-011**: System MUST support date-range filtering for booking and payment queries to manage response size
- **FR-012**: System MUST log all external API calls for debugging purposes (without logging sensitive data)

### Key Entities

- **Booking**: Represents a client appointment — includes client reference, date/time, service type, status (pending, confirmed, completed, cancelled), payment status, and notes
- **Contact**: Represents a client — includes name, email, phone, address, notes, and relationship to bookings
- **Workflow**: Represents an N8N automation — includes name, status (active/inactive), trigger type, last execution status, and execution history
- **Payment**: Represents a financial transaction — includes amount, currency, client reference, booking reference, status (succeeded, pending, failed, refunded), and date
- **TimeSlot**: Represents an available scheduling period — includes date, start time, end time, service type, and availability status

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Operators can retrieve today's booking schedule in under 5 seconds
- **SC-002**: Operators can create a new booking from Claude Code in under 30 seconds (vs. navigating Airtable manually)
- **SC-003**: All external service errors are surfaced with actionable messages that include the service name and error type
- **SC-004**: 100% of tool inputs are validated before any external API call is made
- **SC-005**: Operators can trigger any N8N workflow and receive execution results without leaving Claude Code
- **SC-006**: Contact lookup by name, email, or phone returns results in under 3 seconds
- **SC-007**: The MCP server starts and connects successfully via stdio transport on first attempt

## Assumptions

- Family and Love is a photo/video studio that manages client bookings, contacts, and payments
- Airtable is used as the primary database for bookings and contacts (not a relational database)
- N8N is self-hosted and accessible via API with an API key
- Acuity Scheduling (or similar) is used for calendar/availability management
- Stripe is used for payment processing with standard API access
- The MCP server runs locally alongside Claude Code (stdio transport, not HTTP)
- API credentials are stored in environment variables on the operator's machine
- The operator is a single user (studio owner/manager) — no multi-user access control needed
- All dates and times use the studio's local timezone (UTC+2)
