import { resolveStatusKind, type StatusKind, StatusPill } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof StatusPill> = {
  title: "Components/Data Display/StatusPill",
  component: StatusPill,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A compact inline badge for conveying record or entity status at a glance. Supports six semantic colour variants (`kind`) or a convenience `status` string prop that resolves both colour and label from a curated lookup table — ideal for rendering API-returned status values without a mapping layer in consumer code.\n\nThe lookup is case-insensitive, and an unknown string falls back to `neutral` with the status title-cased (`past_due` → “Past due”). `info` is the blue info badge, not the solid Qeet fill. When another surface has to agree with the pill — a row edge, an icon tone — call `resolveStatusKind(status, kind)` for the kind the pill would render instead of re-implementing the table.",
      },
    },
  },
  argTypes: {
    kind: {
      control: "select",
      options: ["success", "warning", "danger", "info", "neutral", "muted"],
    },
    status: { control: "text" },
    dot: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatusPill>;

export const Success: Story = { args: { kind: "success", children: "Active" } };
export const Warning: Story = {
  args: { kind: "warning", children: "Pending" },
};
export const Danger: Story = { args: { kind: "danger", children: "Revoked" } };
export const Info: Story = { args: { kind: "info", children: "Processing" } };

export const FromStatusString: Story = {
  args: { status: "expired" },
  parameters: {
    docs: {
      description: {
        story:
          "Passing a `status` string instead of `kind`+`children` resolves both from the curated lookup table — case-insensitive.",
      },
    },
  },
};

export const AllStatuses: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All common Qeet entity states rendered via the `status` prop in a single view. Use this as a visual reference when wiring status values returned by the Qeet ID or qeet-people APIs into list/table UIs.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusPill status="active" />
      <StatusPill status="pending" />
      <StatusPill status="revoked" />
      <StatusPill status="suspended" />
      <StatusPill status="expired" />
      <StatusPill status="archived" />
      <StatusPill status="draft" />
      <StatusPill status="verified" />
    </div>
  ),
};

/** The edge each kind paints on a row, so the row and its pill never disagree. */
const KIND_EDGE: Record<StatusKind, string> = {
  success: "border-s-success",
  info: "border-s-info",
  warning: "border-s-warning",
  danger: "border-s-destructive",
  muted: "border-s-border-strong",
  neutral: "border-s-border-strong",
};

const notifications = [
  { id: "ntf_9a1", channel: "Email", to: "ada@acme.com", status: "delivered" },
  { id: "ntf_9a2", channel: "SMS", to: "+91 98450 •••21", status: "queued" },
  { id: "ntf_9a3", channel: "Push", to: "Pixel 8 · Qeet ID app", status: "DEGRADED" },
  { id: "ntf_9a4", channel: "Webhook", to: "hooks.acme.com/qeet", status: "failed" },
  { id: "ntf_9a5", channel: "Email", to: "grace@acme.com", status: "soft_bounce" },
];

export const ResolveStatusKind: Story = {
  name: "resolveStatusKind",
  parameters: {
    docs: {
      description: {
        story:
          "qeet-notify deliveries where each row's inline-start edge is chosen with `resolveStatusKind(status)` — the same resolution the pill uses, so the two can never drift. Matching is case-insensitive (`DEGRADED`), and an unknown string such as `soft_bounce` resolves to `neutral` for both, with the pill title-casing it to “Soft bounce”. The kind is also written to the pill as `data-kind`. The edge is a second channel; the pill's label is what states the status.",
      },
    },
  },
  render: () => (
    <ul className="flex w-[420px] flex-col gap-2">
      {notifications.map(({ id, channel, to, status }) => (
        <li
          key={id}
          className={`flex items-center justify-between gap-3 rounded-(--qx-corner-control) border border-s-4 border-border bg-card px-3 py-2 ${KIND_EDGE[resolveStatusKind(status)]}`}
        >
          <div className="min-w-0">
            <p className="text-sm font-medium">{channel}</p>
            <p className="truncate text-sm text-muted-foreground">{to}</p>
          </div>
          <StatusPill status={status} />
        </li>
      ))}
    </ul>
  ),
};
