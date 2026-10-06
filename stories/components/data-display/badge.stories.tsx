import { Badge, type BadgeProps } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Badge> = {
  title: "Components/Data Display/Badge",
  component: Badge,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'Compact inline label for status, tier, and protocol metadata. Nine variants in three kinds: `default` is the one solid Qeet fill (counts, "New") — the loudest a badge can be, so use it sparingly; `brand`, `info`, `success`, `warning` and `destructive` are quiet tints with a hairline border; `secondary`, `outline` and `muted` are graphite, for metadata that should not compete. Renders as a `<span>` — safe to place inside table cells, headings, or list items. A leading or trailing icon is sized to 12px automatically.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "outline",
        "brand",
        "info",
        "success",
        "warning",
        "destructive",
        "muted",
      ],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: "New" },
  parameters: {
    docs: {
      description: {
        story:
          'The solid `default` fill, driven by the controls panel — for a count or a "New" marker that should catch the eye. Switch `variant` to compare the tints and graphite badges.',
      },
    },
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All nine variants shown with Qeet-relevant labels. `Enterprise` (default) and `Beta` (secondary) signal plan or release stage; `SAML` (outline) labels a protocol; `Qeet Pro` (brand) marks a Qeet-branded tier or feature; `Rolling out` (info) flags neutral news; `Verified` / `Trial` / `Suspended` / `Archived` map to lifecycle states used across Qeet ID, Qeetrix, and Qeet Pay.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Enterprise</Badge>
      <Badge variant="secondary">Beta</Badge>
      <Badge variant="outline">SAML</Badge>
      <Badge variant="brand">Qeet Pro</Badge>
      <Badge variant="info">Rolling out</Badge>
      <Badge variant="success">Verified</Badge>
      <Badge variant="warning">Trial</Badge>
      <Badge variant="destructive">Suspended</Badge>
      <Badge variant="muted">Archived</Badge>
    </div>
  ),
};

/** Badge variants grouped by kind — loudest first. */
const BADGE_GROUPS: { group: string; badges: [NonNullable<BadgeProps["variant"]>, string][] }[] = [
  { group: "Solid", badges: [["default", "3 new"]] },
  {
    group: "Tint",
    badges: [
      ["brand", "Qeet AI"],
      ["info", "Rolling out"],
      ["success", "Settled"],
      ["warning", "KYC pending"],
      ["destructive", "Chargeback"],
    ],
  },
  {
    group: "Graphite",
    badges: [
      ["secondary", "v2.1.0"],
      ["outline", "OIDC"],
      ["muted", "Archived"],
    ],
  },
];

export const VariantGroups: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The three kinds of badge, grouped by how loud they are. Reach for the **solid** fill once per surface at most. Use a **tint** when the badge carries meaning — `brand` for something Qeet-branded (a plan, an AI feature), `info` for neutral news, and the status tints for lifecycle states. Use **graphite** for metadata that should sit back: versions, protocols, archived records.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3 text-sm">
      {BADGE_GROUPS.map(({ group, badges }) => (
        <div key={group} className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-xs font-medium text-muted-foreground">{group}</span>
          <div className="flex flex-wrap items-center gap-2">
            {badges.map(([variant, label]) => (
              <Badge key={variant} variant={variant}>
                {label}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const ContextualUsage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Badges inline with real content — the pattern used on API-key lists, webhook dashboards, and subscription management screens. Note that the badge sits flush with surrounding text thanks to `inline-flex` alignment.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono text-muted-foreground">qid_live_4xKz…9Rp2</span>
        <Badge variant="success">Active</Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground">https://hooks.acme.com/qeet</span>
        <Badge variant="warning">Trial</Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground">SSO · SAML 2.0 connection</span>
        <Badge variant="outline">SAML</Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">org_legacy_acme_corp</span>
        <Badge variant="muted">Archived</Badge>
      </div>
    </div>
  ),
};
