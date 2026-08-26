import { AccessReview, type AccessReviewItem, Button } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const initialItems: AccessReviewItem[] = [
  {
    id: "members.read",
    label: "View members",
    description: "Read member profiles and organisation membership.",
    state: "granted",
    scope: "Organisation",
    inherited: true,
    locked: true,
  },
  {
    id: "members.manage",
    label: "Manage members",
    description: "Invite, suspend, and update member records.",
    state: "mixed",
    scope: "Engineering and Product",
  },
  {
    id: "audit.export",
    label: "Export audit history",
    state: "pending",
    scope: "Organisation",
  },
  {
    id: "billing.manage",
    label: "Manage billing",
    state: "denied",
    scope: "Organisation",
  },
];

const meta: Meta<typeof AccessReview> = {
  title: "Components/Advanced/AccessReview",
  component: AccessReview,
  parameters: {
    qeetrix: qx({ category: "advanced", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Product-neutral access assignment and review anatomy for granted, denied, mixed, pending, inherited, locked, and scoped state. Callers own roles, policy evaluation, inheritance, authorization, persistence, and confirmation.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AccessReview>;

export const States: Story = {
  render: () => {
    const [items, setItems] = React.useState(initialItems);
    return (
      <AccessReview
        items={items}
        aria-label="Organisation access review"
        onStateChange={(id, state) =>
          setItems((current) => current.map((item) => (item.id === id ? { ...item, state } : item)))
        }
        renderActions={(item) =>
          !item.locked && item.state !== "pending" ? (
            <Button variant="ghost" size="sm">
              Review
            </Button>
          ) : null
        }
      />
    );
  },
};
