import { CreditCardIcon, KeyRoundIcon, ShieldAlertIcon, UserPlusIcon } from "@qeetrix/icons";
import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
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
          'A vertical event list for audit trails, activity feeds, and change histories. Each `TimelineItem` pairs an `TimelineIndicator` dot with a `TimelineContent` block that can hold a title, timestamp, and optional description. Items render in document order — newest-first is the recommended convention for audit logs.\n\nWrap `TimelineTitle` and `TimelineTime` in a `TimelineHeader` to put the time at the line\'s end; give `TimelineTime` a `dateTime` and it renders a `<time>` element. Events have three levels of hierarchy: `emphasis="minor"` on a `TimelineItem` for housekeeping noise, the default for meaningful events, and an `icon` on the `TimelineIndicator` for the ones that matter most. `tone` (`neutral` · `brand` · `info` · `success` · `warning` · `destructive`) colours the marker as a second channel only — the title still says what happened, and `label` adds screen-reader text when it does not. The marker rail is one box wide for dots, icons and custom children alike, so the connector stays centred.',
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

export const WithHeader: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`TimelineHeader` lays the title at the start and the time at the end of one line, wrapping to two lines in a narrow panel rather than truncating either. `TimelineTime` with `dateTime` renders `<time datetime>`, so a relative label (“5 min ago”) keeps an exact instant behind it.",
      },
    },
  },
  render: () => (
    <Timeline className="w-96">
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Payout of ₹4,82,000 settled</TimelineTitle>
            <TimelineTime dateTime="2026-08-18T09:42:00+05:30">5 min ago</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>HDFC Bank ••4421 · UTR HDFCN52026081812345</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Payout initiated</TimelineTitle>
            <TimelineTime dateTime="2026-08-18T09:15:00+05:30">32 min ago</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>Weekly settlement for Acme Retail Pvt Ltd</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Settlement batch closed</TimelineTitle>
            <TimelineTime dateTime="2026-08-17T23:59:00+05:30">Yesterday</TimelineTime>
          </TimelineHeader>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};

export const Tones: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Every `tone` on a default dot. `neutral` is the default because most history is routine — a stream where every dot is Qeet orange has nothing left to say “this one matters”. `danger` is still accepted as a deprecated alias of `destructive`.",
      },
    },
  },
  render: () => (
    <Timeline className="w-96">
      <TimelineItem>
        <TimelineIndicator tone="neutral" />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Profile updated</TimelineTitle>
            <TimelineTime>09:41</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>neutral — routine history</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator tone="brand" />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Upgraded to Qeet ID Enterprise</TimelineTitle>
            <TimelineTime>09:30</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>brand — a Qeet milestone</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator tone="info" />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>SCIM sync started</TimelineTitle>
            <TimelineTime>09:12</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>info — in progress</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator tone="success" />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Domain acme.com verified</TimelineTitle>
            <TimelineTime>08:55</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>success — a check passed</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator tone="warning" />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Signing key expires in 7 days</TimelineTitle>
            <TimelineTime>08:00</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>warning — needs attention soon</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator tone="destructive" />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Webhook delivery failed</TimelineTitle>
            <TimelineTime>07:48</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>destructive — something went wrong</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};

export const IconMarkers: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "An `icon` puts a glyph in an opaque, tinted circular marker — the strongest level, for the events a reviewer is scanning for. The icon is decorative; where the title does not already state the outcome, `label` gives the marker screen-reader text (“Failed”).",
      },
    },
  },
  render: () => (
    <Timeline className="w-96">
      <TimelineItem>
        <TimelineIndicator tone="destructive" icon={<CreditCardIcon />} label="Failed" />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Card payment for INV-2026-0418</TimelineTitle>
            <TimelineTime dateTime="2026-08-18T10:04:00+05:30">10:04</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>Issuer declined · insufficient funds · ₹18,400</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator tone="warning" icon={<ShieldAlertIcon />} />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Sign-in blocked from a new country</TimelineTitle>
            <TimelineTime dateTime="2026-08-18T09:20:00+05:30">09:20</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>grace@acme.com · Frankfurt, DE · risk score 82</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator tone="success" icon={<KeyRoundIcon />} />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Passkey added</TimelineTitle>
            <TimelineTime dateTime="2026-08-18T08:47:00+05:30">08:47</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>ada@acme.com · iPhone 15 Pro</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator tone="brand" icon={<UserPlusIcon />} />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Alan Turing joined Engineering</TimelineTitle>
            <TimelineTime dateTime="2026-08-17T10:00:00+05:30">Yesterday</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>Qeet People onboarding complete</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};

export const Emphasis: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`emphasis="minor"` for system and housekeeping events: a small marker, muted text and a tighter rhythm, so a run of them reads as one quiet block between the events that matter. A minor marker never takes its tone\'s colour.',
      },
    },
  },
  render: () => (
    <Timeline className="w-96">
      <TimelineItem>
        <TimelineIndicator tone="success" icon={<KeyRoundIcon />} />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>SAML connection enabled</TimelineTitle>
            <TimelineTime>11:02</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>Provider: Okta · 214 members can now sign in</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem emphasis="minor">
        <TimelineIndicator />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Attribute mapping saved</TimelineTitle>
            <TimelineTime>10:58</TimelineTime>
          </TimelineHeader>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem emphasis="minor">
        <TimelineIndicator tone="info" />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Metadata refreshed by system</TimelineTitle>
            <TimelineTime>10:57</TimelineTime>
          </TimelineHeader>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem emphasis="minor">
        <TimelineIndicator />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Connection renamed to “Okta (prod)”</TimelineTitle>
            <TimelineTime>10:51</TimelineTime>
          </TimelineHeader>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineIndicator />
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>SAML connection created</TimelineTitle>
            <TimelineTime>10:44</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>by alan@acme.com</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};
