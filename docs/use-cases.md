# SafeCampus — Functional Use Cases

Derived from the SafeCampus App Design (Figma Make project) cover screen
(login) plus standard campus-safety product patterns, since only the cover
thumbnail was available (no live Figma MCP connection at build time).

## Actors
- **Student**: primary app user, campus community member.
- **Security**: campus security staff, triages alerts/incidents.
- **Admin**: manages official contacts and broadcasts notifications.

## UC-01 Authentication
Student registers with campus email, logs in, recovers password.
Session is a JWT bearer token stored on-device.

## UC-02 SOS Emergency Alert
Student taps a single SOS button. App captures GPS location and sends
an alert. Security receives it in real time (WebSocket) and can mark it
resolved. Student sees live status until resolved.

## UC-03 Incident Reporting
Student reports a non-urgent incident (theft, harassment, suspicious
activity, vandalism, other) with description, optional photo, and
location. Security reviews and updates status (pending → reviewed →
resolved).

## UC-04 Campus Safety Map
Student views a map with emergency stations and recent reported
incidents/alerts near them, to make informed routing decisions.

## UC-05 Emergency Contacts
Student views official campus contacts (security, health, fire) with
one-tap call, and manages a personal list of trusted contacts.

## UC-06 Campus Notifications
Admin/Security broadcasts a campus-wide notification (e.g. weather,
lockdown). Students receive it in real time and see a read history.

## UC-07 Profile
Student views/edits their profile (name, student ID, phone, avatar).

## Out of scope for this pass
Push notifications (native), offline support, and role-based admin
dashboards are noted as future work, not implemented here.
