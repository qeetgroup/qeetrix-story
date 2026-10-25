import { CircleCheckIcon } from "@qeetrix/icons/icons/circle-check";
import { CircleXIcon } from "@qeetrix/icons/icons/circle-x";
import { CreditCardIcon } from "@qeetrix/icons/icons/credit-card";
import { FingerprintPatternIcon } from "@qeetrix/icons/icons/fingerprint-pattern";
import { GlobeIcon } from "@qeetrix/icons/icons/globe";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { LogInIcon } from "@qeetrix/icons/icons/log-in";
import { ShieldAlertIcon } from "@qeetrix/icons/icons/shield-alert";
import { SparklesIcon } from "@qeetrix/icons/icons/sparkles";
import { TriangleAlertIcon } from "@qeetrix/icons/icons/triangle-alert";
import { UserCogIcon } from "@qeetrix/icons/icons/user-cog";
import { UserPlusIcon } from "@qeetrix/icons/icons/user-plus";
import { Card, Grid, Stack, Text } from "@qeetrix/react";
import {
  Timeline,
  TimelineGroup,
  TimelineItem,
  type TimelineProps,
} from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

/** Priya Sharma's recent activity, as her Qeet ID user page shows it. */
function Activity(props: TimelineProps) {
  return (
    <Timeline
      aria-label="Recent activity"
      {...props}
      style={{ maxInlineSize: 420, ...props.style }}
    >
      <TimelineGroup label="Today">
        <TimelineItem
          icon={LogInIcon}
          title="Signed in with a passkey"
          description="Bengaluru, India · Chrome on macOS"
          time="2 min ago"
          dateTime="2026-10-25T09:28:00Z"
        />
        <TimelineItem
          icon={CircleXIcon}
          tone="danger"
          title="Failed sign-in"
          description="Wrong password · Mumbai, India"
          time="09:12"
          dateTime="2026-10-25T03:42:00Z"
        />
      </TimelineGroup>
      <TimelineGroup label="Yesterday">
        <TimelineItem
          icon={FingerprintPatternIcon}
          title="Added a passkey"
          description="MacBook Pro · Touch ID"
          time="18:40"
          dateTime="2026-10-24T13:10:00Z"
        />
        <TimelineItem
          icon={UserCogIcon}
          title="Role changed to Admin"
          description="By Rahul Verma"
          time="11:05"
          dateTime="2026-10-24T05:35:00Z"
        />
      </TimelineGroup>
    </Timeline>
  );
}

const meta: Meta<typeof Timeline> = {
  title: "Components/Data Display/Timeline",
  component: Timeline,
  subcomponents: { TimelineGroup, TimelineItem },
  parameters: {
    qeetrix: qx({ category: "data-display", status: "experimental" }),
    layout: "padded",
  },
  args: {
    variant: "default",
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Playground: Story = {
  render: (args) => <Activity {...args} />,
};

/** Every tone, in both variants. */
function Verification(props: TimelineProps) {
  return (
    <Timeline aria-label="Domain verification" {...props}>
      <TimelineItem icon={KeyRoundIcon} title="Signing key rotated" time="10:04" />
      <TimelineItem
        icon={CircleCheckIcon}
        tone="success"
        title="Domain acme.in verified"
        time="09:55"
      />
      <TimelineItem icon={GlobeIcon} tone="info" title="TXT record found" time="09:50" />
      <TimelineItem
        icon={TriangleAlertIcon}
        tone="warning"
        title="Signing key expires soon"
        time="09:30"
      />
      <TimelineItem icon={ShieldAlertIcon} tone="danger" title="Sign-in blocked" time="09:20" />
      <TimelineItem icon={SparklesIcon} tone="brand" title="Upgraded to Qeet Pro" time="09:02" />
    </Timeline>
  );
}

export const Variants: Story = {
  render: () => (
    <Grid columns={2} gap="xl" style={{ inlineSize: 720 }}>
      <Stack gap="md">
        <Text size="sm" tone="subtle">
          Default
        </Text>
        <Verification />
      </Stack>
      <Stack gap="md">
        <Text size="sm" tone="subtle">
          Compact
        </Text>
        <Verification variant="compact" aria-label="Domain verification, compact" />
      </Stack>
    </Grid>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <div style={{ inlineSize: 420 }}>
      <Card title="Payout history" level={2}>
        <Timeline aria-label="Payout history">
          <TimelineItem
            icon={CircleCheckIcon}
            tone="success"
            title="₹4,82,000 settled"
            description="HDFC Bank ••4421"
            time="5 min ago"
            dateTime="2026-10-25T09:25:00Z"
          />
          <TimelineItem
            icon={CreditCardIcon}
            title="Payout initiated"
            description="Weekly settlement"
            time="32 min ago"
            dateTime="2026-10-25T08:58:00Z"
          />
          <TimelineItem
            icon={UserPlusIcon}
            title="Bank account added"
            description="By Ananya Iyer"
            time="Yesterday"
            dateTime="2026-10-24T10:00:00Z"
          />
        </Timeline>
      </Card>
    </div>
  ),
};

export const OrderedByDay: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: an ordered list, grouped by day",
  render: () => <Activity />,
  play: async ({ canvas, canvasElement }) => {
    const list = canvas.getByRole("list", { name: "Recent activity" });
    await expect(list.tagName).toBe("OL");
    await expect(canvas.getByText("Today")).toBeVisible();
    const time = canvasElement.querySelector("time");
    await expect(time).toHaveAttribute("datetime", "2026-10-25T09:28:00Z");
    await expect(time).toHaveTextContent("2 min ago");
  },
};
