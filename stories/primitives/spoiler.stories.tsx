import { Spoiler } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Spoiler> = {
  title: "Primitives/Spoiler",
  component: Spoiler,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Truncates long content to `maxLines` with an inline show-more/less toggle — useful for collapsing verbose log messages in qeet-logs, long org descriptions in Qeet ID admin, or extended changelog entries in qeet-docs. Customize toggle labels via `showLabel` and `hideLabel`.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Spoiler>;

export const Default: Story = {
  render: () => (
    <div className="max-w-md">
      <Spoiler maxLines={2}>
        <p className="text-sm text-muted-foreground">
          2026-06-14T08:32:11Z [ERROR] auth.middleware — incoming JWT failed RS256 signature
          verification. Token issuer claimed "id.qeet.in" but the JWKS endpoint returned a key set
          with no matching kid. This typically indicates a key rotation that occurred within the
          last 60 seconds; the upstream cache TTL was 300 s. Downstream services should retry with
          exponential backoff. Affected request id: req_01j2xq8vknfa3pm7.
        </p>
      </Spoiler>
    </div>
  ),
};

export const CustomLabels: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Override `showLabel` / `hideLabel` to match your product's voice — shown here with qeet-docs changelog language.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <Spoiler maxLines={3} showLabel="Read full changelog" hideLabel="Collapse">
        <p className="text-sm text-muted-foreground">
          <strong>v0.4.0 — 2026-06-14</strong> — @qeetrix/ui consolidates @qeetrix/tokens and
          @qeetrix/brand into a single package. Subpath exports <code>/tokens.css</code>,{" "}
          <code>/tokens.json</code>, <code>/qeetrix.css</code>, and <code>/brand</code> remain
          stable. Existing consumers on 0.3.x should update their import paths; the old packages are
          deprecated and will stop receiving security updates after 2026-09-01. Run{" "}
          <code>bun update @qeetrix/ui --latest</code> to migrate.
        </p>
      </Spoiler>
    </div>
  ),
};
