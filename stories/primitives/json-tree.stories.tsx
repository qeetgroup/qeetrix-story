import { JSONTree } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof JSONTree> = {
  title: "Primitives/JSONTree",
  component: JSONTree,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Collapsible, syntax-highlighted JSON viewer. Use it to display structured event payloads, API responses, and audit-log entries inline in dashboards or developer consoles.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof JSONTree>;

const payload = {
  event: "session.verified",
  tenant: "acme",
  actor: { id: "usr_123", email: "ada@acme.com", mfa: true },
  factors: ["passkey", "totp"],
  occurredAt: "2026-05-29T12:00:00Z",
  metadata: { ip: "203.0.113.7", device: { os: "macOS", browser: "Safari" } },
};

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A Qeet ID `session.verified` event payload expanded to depth 2. Click any node to collapse or expand its subtree.",
      },
    },
  },
  render: () => (
    <div className="w-[34rem]">
      <JSONTree value={payload} rootLabel="payload" initialOpenDepth={2} />
    </div>
  ),
};

const webhookPayload = {
  event: "notification.delivered",
  id: "evt_7f3a9c2e1b4d",
  channel: "email",
  recipient: { id: "usr_456", email: "alan@globex.com" },
  template: "onboarding_welcome",
  sentAt: "2026-06-01T09:15:00Z",
  deliveredAt: "2026-06-01T09:15:03Z",
  metadata: { provider: "Resend", messageId: "msg_a1b2c3d4" },
};

export const WebhookPayload: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A qeet-notify `notification.delivered` webhook event payload. Shows delivery metadata including the downstream provider message ID alongside recipient and template details.",
      },
    },
  },
  render: () => (
    <div className="w-[34rem]">
      <JSONTree value={webhookPayload} rootLabel="webhookEvent" initialOpenDepth={2} />
    </div>
  ),
};
