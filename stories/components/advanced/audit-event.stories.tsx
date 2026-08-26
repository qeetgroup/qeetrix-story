import { AuditEvent, AuditLog, Button, DiffViewer, JSONTree } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
          "Typed audit-event anatomy composed inside the APG Feed primitive. Actor, action, resource, severity, timestamp, metadata, diff, raw payload, and actions are display contracts; products own event schemas, redaction, filtering, retention, authorization, and transport.",
      },
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
