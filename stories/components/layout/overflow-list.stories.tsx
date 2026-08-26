import { Badge, OverflowList } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof OverflowList> = {
  title: "Components/Layout/OverflowList",
  component: OverflowList,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Renders a list of items that gracefully collapses to a `+N more` overflow badge when they don't fit the container. Use it for tag lists on Qeet ID user profiles, filter chip rows in qeet-logs, or team-member avatars in qeet-people — wherever horizontal space is finite and a full count still needs to be communicated.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof OverflowList>;

const SCOPES = [
  "openid",
  "profile",
  "email",
  "org:read",
  "org:write",
  "audit:read",
  "billing:read",
  "webhooks:write",
  "sessions:manage",
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "OAuth scope badges collapse as the container narrows — drag the right edge to see the overflow badge appear.",
      },
    },
  },
  render: () => (
    <div className="w-80 resize-x overflow-auto rounded-md border p-2">
      <OverflowList
        items={SCOPES.map((s) => (
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      />
      <p className="mt-2 text-xs text-muted-foreground">Drag the right edge to resize.</p>
    </div>
  ),
};

export const CollapseFromStart: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`collapseFrom="start"` is useful for breadcrumb-style paths where the current page (rightmost item) should always remain visible.',
      },
    },
  },
  render: () => (
    <div className="w-64 rounded-md border p-2">
      <OverflowList
        collapseFrom="start"
        items={["Home", "Organisations", "Qeet Engineering", "Members", "Permissions"].map((t) => (
          <span key={t} className="text-sm text-muted-foreground">
            {t}
          </span>
        ))}
      />
    </div>
  ),
};
