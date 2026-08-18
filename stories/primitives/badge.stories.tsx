import { Badge } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Compact inline label for status, tier, and protocol metadata. Seven semantic variants: `default`, `secondary`, `outline`, `success`, `warning`, `destructive`, and `muted`. Renders as a `<span>` — safe to place inside table cells, headings, or list items.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All seven variants shown with Qeet-relevant labels. `Enterprise` (default) and `Beta` (secondary) signal plan or release stage; `SAML` (outline) labels a protocol; `Verified` / `Trial` / `Suspended` / `Archived` map to lifecycle states used across Qeet ID, Qeetrix, and Qeet Pay.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Enterprise</Badge>
      <Badge variant="secondary">Beta</Badge>
      <Badge variant="outline">SAML</Badge>
      <Badge variant="success">Verified</Badge>
      <Badge variant="warning">Trial</Badge>
      <Badge variant="destructive">Suspended</Badge>
      <Badge variant="muted">Archived</Badge>
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
