import {
  AuditEvent,
  AuditEventMetadata,
  AuditLog,
  Button,
  DiffViewer,
  JSONTree,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect, within } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof AuditEvent> = {
  title: "Components/Advanced/AuditEvent",
  component: AuditEvent,
  parameters: {
    qeetrix: qx({ category: "advanced", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Typed audit-event anatomy composed inside the APG Feed primitive. Actor, action, resource, severity, timestamp, metadata, diff, raw payload, and actions are display contracts; products own event schemas, redaction, filtering, retention, authorization, and transport.\n\nEach event reads as a sentence — actor and resource emphasised, the verb quieter — with the time at the line's end, then the description, the status and the monospaced event ID. Warning and danger events show a visible status tag; info and success keep their label for screen readers only, so exceptions stand out in a long log. `statusLabel` replaces the severity's word (“Denied”, “Blocked”) and is always shown. Put the `metadata` slot in an `AuditEventMetadata` for the house key/value layout. The details disclosure can be controlled with `expanded` / `onExpandedChange`. Pass `timeZone` (and `locale`) when the log is server-rendered so both sides print the same time. `AuditLog` defaults to the `list` presentation; `deferOffscreen` skips layout for rows outside the viewport on very long logs.",
      },
    },
  },
  argTypes: {
    severity: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
    },
    statusLabel: { control: "text" },
    defaultExpanded: { control: "boolean" },
    timeZone: {
      control: "select",
      options: ["Asia/Kolkata", "UTC", "Europe/London"],
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AuditEvent>;

export const History: Story = {
  render: () => (
    <AuditLog aria-label="Organisation audit history" className="max-w-3xl">
      <AuditEvent
        eventId="evt_01J6TQ8"
        actor="Ada Lovelace"
        action="changed role for"
        resource="Grace Hopper"
        timestamp="2026-08-18T12:00:00.000Z"
        severity="warning"
        description="The member role changed from Member to Admin."
        metadata={
          <JSONTree value={{ ip: "203.0.113.7", source: "admin-console" }} initialOpenDepth={2} />
        }
        diff={<DiffViewer before="role: Member" after="role: Admin" mode="split" />}
        actions={
          <Button variant="outline" size="sm">
            Open event
          </Button>
        }
      />
      <AuditEvent
        eventId="evt_01J6TQ9"
        actor="System"
        action="completed access review"
        resource="Q3 contractor roles"
        timestamp="2026-08-18T12:05:00.000Z"
        severity="success"
      />
    </AuditLog>
  ),
};

export const WithMetadata: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`AuditEventMetadata` in the `metadata` slot: a two-column key/value list where technical identifiers marked `mono` are monospaced and select-all, and long values such as a user agent wrap instead of overflowing. `defaultExpanded` opens the details on first render; `timeZone` and `locale` pin the printed time to IST.",
      },
    },
  },
  render: () => (
    <AuditLog aria-label="Sign-in audit" className="max-w-3xl">
      <AuditEvent
        eventId="evt_01J7B2KQ4M"
        actor="grace@acme.com"
        action="signed in with a passkey to"
        resource="Qeet ID admin console"
        timestamp="2026-08-18T04:12:09.000Z"
        timeZone="Asia/Kolkata"
        locale="en-IN"
        severity="success"
        defaultExpanded
        metadata={
          <AuditEventMetadata
            items={[
              { label: "IP address", value: "203.0.113.42", mono: true },
              { label: "Location", value: "Bengaluru, Karnataka, IN" },
              { label: "Credential", value: "iCloud Keychain passkey" },
              { label: "Session ID", value: "ses_9f3c2a71e04b4d8a", mono: true },
              {
                label: "User agent",
                value:
                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
                mono: true,
              },
            ]}
          />
        }
      />
    </AuditLog>
  ),
};

export const Severities: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'All four severities in a qeet-pay log. Info and success are routine, so their status is screen-reader text only; warning and danger show a tag beside the event ID. The last row uses `statusLabel="Blocked"` to name a domain outcome while keeping the danger colour and glyph — a custom label is always visible.',
      },
    },
  },
  render: () => (
    <AuditLog aria-label="Payments audit" className="max-w-3xl">
      <AuditEvent
        eventId="evt_01J7C0A1"
        actor="System"
        action="generated GST invoice"
        resource="INV-2026-0418"
        timestamp="2026-08-18T05:30:00.000Z"
        timeZone="Asia/Kolkata"
        locale="en-IN"
        severity="info"
      />
      <AuditEvent
        eventId="evt_01J7C0A2"
        actor="Settlement service"
        action="settled payout"
        resource="PO-88213"
        timestamp="2026-08-18T05:42:00.000Z"
        timeZone="Asia/Kolkata"
        locale="en-IN"
        severity="success"
        description="₹4,82,000 credited to HDFC Bank ••4421."
      />
      <AuditEvent
        eventId="evt_01J7C0A3"
        actor="Alan Turing"
        action="raised refund limit for"
        resource="Acme Retail Pvt Ltd"
        timestamp="2026-08-18T06:05:00.000Z"
        timeZone="Asia/Kolkata"
        locale="en-IN"
        severity="warning"
        description="Single-refund cap changed from ₹25,000 to ₹1,00,000."
      />
      <AuditEvent
        eventId="evt_01J7C0A4"
        actor="Risk engine"
        action="declined payment from"
        resource="card ••0119"
        timestamp="2026-08-18T06:11:00.000Z"
        timeZone="Asia/Kolkata"
        locale="en-IN"
        severity="danger"
        statusLabel="Blocked"
        description="Velocity rule: 6 attempts in 2 minutes from 198.51.100.23."
      />
    </AuditLog>
  ),
};

const reviewEvents = [
  {
    eventId: "evt_01J7D4R1",
    actor: "Ada Lovelace",
    action: "granted Payroll Admin to",
    resource: "Grace Hopper",
    timestamp: "2026-08-18T07:20:00.000Z",
    items: [
      { label: "Approved by", value: "Alan Turing" },
      { label: "Request", value: "REQ-20431", mono: true },
    ],
  },
  {
    eventId: "evt_01J7D4R2",
    actor: "Ada Lovelace",
    action: "removed Attendance Editor from",
    resource: "Katherine Johnson",
    timestamp: "2026-08-18T07:24:00.000Z",
    items: [
      { label: "Reason", value: "Moved to the Finance team" },
      { label: "Request", value: "REQ-20432", mono: true },
    ],
  },
];

function ReviewLog() {
  const [open, setOpen] = React.useState<Record<string, boolean>>({});
  const allOpen = reviewEvents.every((event) => open[event.eventId]);
  return (
    <div className="flex max-w-3xl flex-col gap-3">
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setOpen(Object.fromEntries(reviewEvents.map((event) => [event.eventId, !allOpen])))
          }
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </Button>
      </div>
      <AuditLog aria-label="Qeet People role changes">
        {reviewEvents.map((event) => (
          <AuditEvent
            key={event.eventId}
            eventId={event.eventId}
            actor={event.actor}
            action={event.action}
            resource={event.resource}
            timestamp={event.timestamp}
            timeZone="Asia/Kolkata"
            locale="en-IN"
            severity="warning"
            expanded={open[event.eventId] ?? false}
            onExpandedChange={(next) =>
              setOpen((current) => ({ ...current, [event.eventId]: next }))
            }
            metadata={<AuditEventMetadata items={event.items} />}
          />
        ))}
      </AuditLog>
    </div>
  );
}

export const ControlledDetails: Story = {
  name: "Interaction: controlled details disclosure",
  parameters: {
    docs: {
      description: {
        story:
          "`expanded` + `onExpandedChange` hand the disclosure to the parent — here an access review in Qeet People with an “Expand all” control. The test asserts the parent can open every row, and that a row's own summary still toggles it through `onExpandedChange` while the parent stays authoritative.",
      },
    },
  },
  render: () => <ReviewLog />,
  play: async ({ canvas, userEvent }) => {
    const [first, second] = canvas.getAllByRole("article");
    const firstDetails = () => within(first).getByText("REQ-20431");
    const secondDetails = () => within(second).getByText("REQ-20432");
    await expect(firstDetails()).not.toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Expand all" }));
    await expect(firstDetails()).toBeVisible();
    await expect(secondDetails()).toBeVisible();

    await userEvent.click(within(first).getByText("Event details"));
    await expect(firstDetails()).not.toBeVisible();
    await expect(secondDetails()).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Expand all" })).toBeInTheDocument();
  },
};
