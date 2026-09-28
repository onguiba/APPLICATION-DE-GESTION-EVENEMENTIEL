# Requirements Document: Participant Dashboard

## Introduction

The Participant Dashboard is a specialized view within EventFlow designed for participants attending events. Unlike the organizer dashboard which shows all events and comprehensive budget management, the participant dashboard provides a personalized experience showing only events the participant is attending, their ticket purchases, event history, and relevant notifications. This feature enables participants to track their event attendance, manage their tickets, view past event reports, and stay informed about events they're involved with.

## Glossary

- **Participant**: A user with account type "Participant" who attends events organized by others
- **Event**: An organized gathering with a specific date, time, location, and capacity
- **Ticket**: A purchased entry to an event by a participant, with associated payment
- **Budget**: The financial allocation for an event, tracked by the organizer
- **Notification**: A message sent to a participant about events they're associated with
- **News Feed**: A chronological list of updates and announcements related to participant's events
- **Report**: A summary document of a past event including date, time, location, and attendance details
- **Payment Status**: The state of a ticket purchase (Pending, Completed, Refunded)
- **Event Status**: The lifecycle state of an event (Planned, In Progress, Completed, Draft)
- **Organizer**: A user with account type "Organizer" who creates and manages events

## Requirements

### Requirement 1: Participant News Feed

**User Story:** As a participant, I want to see a news feed of updates related to my events, so that I stay informed about important announcements and changes.

#### Acceptance Criteria

1. WHEN a participant accesses the dashboard, THE Dashboard SHALL display a News Feed tab as the default landing section
2. THE News_Feed SHALL display chronologically ordered updates from all events the participant is attending
3. WHEN an organizer posts an announcement to an event, THE News_Feed SHALL display that announcement for all participants of that event
4. WHEN a participant's event status changes (e.g., date rescheduled, location changed), THE News_Feed SHALL display the update
5. THE News_Feed SHALL show the event name, update timestamp, and update description for each item
6. WHERE a participant has no upcoming events, THE News_Feed SHALL display a message indicating no events are scheduled

### Requirement 2: Participant Event Filtering

**User Story:** As a participant, I want to see only events I'm attending, so that I can focus on my relevant events without clutter.

#### Acceptance Criteria

1. WHEN a participant accesses the Events tab, THE Dashboard SHALL display only events where the participant's status is "Confirmé" (Confirmed)
2. THE Dashboard SHALL NOT display events with status "En cours" (In Progress) or "Brouillon" (Draft)
3. THE Dashboard SHALL NOT display events where the participant has not registered or has status "Annulé" (Cancelled)
4. WHEN an event transitions to "Terminé" (Completed), THE Dashboard SHALL move it from the Events tab to the Reports tab
5. THE Events_Tab SHALL display event name, date, time, location, and participant status for each event
6. THE Events_Tab SHALL sort events by date in ascending order (upcoming events first)

### Requirement 3: Remove Participant Tab

**User Story:** As a participant, I want a simplified dashboard interface, so that I can focus on my own event attendance without managing other participants.

#### Acceptance Criteria

1. THE Dashboard SHALL NOT display a "Participant" tab in the participant view
2. THE Dashboard SHALL only display tabs relevant to participant functionality: News Feed, Events, Budget, and Reports
3. WHEN a participant accesses the dashboard, THE Dashboard SHALL not provide access to participant management features

### Requirement 4: Participant Notifications

**User Story:** As a participant, I want to receive notifications only about events I'm attending, so that I'm not overwhelmed with irrelevant information.

#### Acceptance Criteria

1. WHEN an event the participant is attending is updated, THE Notification_System SHALL send a notification to that participant
2. WHEN an event the participant is attending is cancelled, THE Notification_System SHALL send a cancellation notification
3. WHEN a participant's payment status changes, THE Notification_System SHALL send a payment status notification
4. THE Notification_System SHALL NOT send notifications for events the participant is not attending
5. THE Notification_System SHALL NOT send notifications for organizer-only events or draft events
6. WHEN a notification is created for a participant event, THE Notification_System SHALL include the event name and update type in the message
7. WHERE a participant has notification preferences configured, THE Notification_System SHALL respect those preferences for channel selection (Email, SMS, WhatsApp, Push)

### Requirement 5: Participant Budget Tab - Ticket Summary

**User Story:** As a participant, I want to see a summary of tickets I've purchased, so that I can track my spending on events.

#### Acceptance Criteria

1. WHEN a participant accesses the Budget tab, THE Budget_Tab SHALL display only tickets purchased by that participant
2. THE Budget_Tab SHALL display for each ticket: event name, ticket amount, payment status, and payment date
3. THE Budget_Tab SHALL calculate and display the total amount spent across all purchased tickets
4. THE Budget_Tab SHALL NOT display organizer budget information, category allocations, or other participants' tickets
5. WHEN a participant has no purchased tickets, THE Budget_Tab SHALL display a message indicating no tickets have been purchased
6. WHEN a ticket payment status changes, THE Budget_Tab SHALL update to reflect the new status (Pending, Completed, Refunded)
7. THE Budget_Tab SHALL group tickets by event for easier tracking

### Requirement 6: Participant Reports Tab - Event History

**User Story:** As a participant, I want to view a history of all past events I've attended, so that I can reference event details and download reports.

#### Acceptance Criteria

1. WHEN a participant accesses the Reports tab, THE Reports_Tab SHALL display all completed events where the participant attended
2. FOR each past event, THE Reports_Tab SHALL display: event name, date, time, location, and attendance status
3. WHEN a participant clicks on a past event, THE Reports_Tab SHALL display a detailed report including event summary and attendance information
4. THE Reports_Tab SHALL provide a download button for each event report in PDF format
5. WHEN a participant downloads a report, THE Report_Generator SHALL create a PDF containing event details, date, time, location, and participant attendance confirmation
6. THE Reports_Tab SHALL sort events by date in descending order (most recent first)
7. WHERE a participant has not attended any completed events, THE Reports_Tab SHALL display a message indicating no past events

### Requirement 7: Report Generation and Download

**User Story:** As a participant, I want to download event reports as PDF files, so that I can keep records of events I've attended.

#### Acceptance Criteria

1. WHEN a participant requests to download a report for a completed event, THE Report_Generator SHALL generate a PDF document
2. THE PDF_Report SHALL include: event name, date, time, location, organizer name, and participant attendance confirmation
3. THE PDF_Report SHALL be formatted professionally with EventFlow branding
4. WHEN the PDF is generated, THE System SHALL make it available for download with filename format: "EventFlow_Report_[EventName]_[Date].pdf"
5. THE Report_Generator SHALL complete PDF generation within 5 seconds
6. IF PDF generation fails, THE System SHALL return an error message to the participant
7. THE Report_Generator SHALL support downloading multiple reports without performance degradation

### Requirement 8: Dashboard Data Filtering and Isolation

**User Story:** As a participant, I want my dashboard to show only my data, so that my privacy is protected and I see only relevant information.

#### Acceptance Criteria

1. WHEN a participant accesses the dashboard, THE Dashboard_API SHALL filter all data based on the authenticated participant's ID
2. THE Dashboard_API SHALL only return events where the participant has a confirmed registration
3. THE Dashboard_API SHALL only return tickets and payments associated with the authenticated participant
4. THE Dashboard_API SHALL only return notifications created for the authenticated participant
5. IF a participant attempts to access another participant's data, THE System SHALL return an authorization error
6. THE Dashboard_API SHALL not expose organizer-specific budget details or other participants' information

### Requirement 9: Participant Dashboard Initialization

**User Story:** As a participant, I want the dashboard to load quickly with all relevant information, so that I can access my event information efficiently.

#### Acceptance Criteria

1. WHEN a participant first accesses the dashboard, THE Dashboard SHALL load within 2 seconds
2. THE Dashboard SHALL display the News Feed tab by default
3. THE Dashboard SHALL pre-load upcoming events and recent notifications
4. WHEN a participant switches between tabs, THE Dashboard SHALL load tab content within 1 second
5. THE Dashboard SHALL support pull-to-refresh functionality to manually update all sections
6. IF data loading fails, THE Dashboard SHALL display an error message with a retry option

### Requirement 10: Participant Event Status Transitions

**User Story:** As a participant, I want my event view to automatically reflect event status changes, so that I always see accurate event information.

#### Acceptance Criteria

1. WHEN an event transitions from "Planifié" to "En cours", THE Dashboard SHALL keep it visible in the Events tab
2. WHEN an event transitions from "En cours" to "Terminé", THE Dashboard SHALL move it from Events tab to Reports tab
3. WHEN an event is marked as "Brouillon", THE Dashboard SHALL not display it in any tab
4. WHEN an event status changes, THE Dashboard SHALL update the display within 30 seconds
5. THE Dashboard SHALL not display events with status "Brouillon" or "En cours" in the initial Events tab view
6. WHEN a participant's attendance status changes to "Annulé", THE Dashboard SHALL remove that event from all tabs

