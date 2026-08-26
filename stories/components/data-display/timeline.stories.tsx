import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Timeline> = {
  title: "Components/Data Display/Timeline",
  component: Timeline,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "A vertical event list for audit trails, activity feeds, and change histories. Each `TimelineItem` pairs an `TimelineIndicator` dot with a `TimelineContent` block that can hold a title, timestamp, and optional description. Items render in document order — newest-first is the recommended convention for audit logs.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A minimal three-event activity feed showing the kinds of actions tracked in a Qeet ID tenant: API key lifecycle, member management, and tenant provisioning. `TimelineDescription` is optional — omit it for terse events.",
      },
    },
  },
  render: () => (
    <Timeline className="w-80">
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineTitle>API key revoked</TimelineTitle>
          <TimelineTime>2 hours ago · by Ada</TimelineTime>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineTitle>Member invited</TimelineTitle>
          <TimelineTime>Yesterday · by Grace</TimelineTime>
          <TimelineDescription>alan@acme.com was invited with the Admin role.</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineTitle>Tenant created</TimelineTitle>
          <TimelineTime>Mar 4 · by system</TimelineTime>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};

export const AuditLog: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A fuller Qeet ID tenant audit trail demonstrating five distinct event types — passkey lifecycle, SAML federation, bulk member actions, webhook configuration, and tenant provisioning. Use `TimelineDescription` to surface key metadata (device, provider, reason, URL) inline without needing a detail drawer for common cases.",
      },
    },
  },
  render: () => (
    <Timeline className="w-96">
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineTitle>Passkey registered</TimelineTitle>
          <TimelineTime>5 min ago · by ada@acme.com</TimelineTime>
          <TimelineDescription>Device: iPhone 15 Pro</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineTitle>SAML connection enabled</TimelineTitle>
          <TimelineTime>1h ago · by alan@acme.com</TimelineTime>
          <TimelineDescription>Provider: Okta</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineTitle>2 members suspended</TimelineTitle>
          <TimelineTime>3h ago · by system</TimelineTime>
          <TimelineDescription>Reason: failed login threshold exceeded</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineTitle>Webhook endpoint added</TimelineTitle>
          <TimelineTime>2 days ago · by grace@acme.com</TimelineTime>
          <TimelineDescription>URL: https://hooks.acme.com/qeet</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineTitle>Organization created</TimelineTitle>
          <TimelineTime>Mar 4 · by system</TimelineTime>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};
