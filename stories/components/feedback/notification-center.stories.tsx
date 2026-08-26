import { NotificationCenter, type NotificationItem } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const SEED: NotificationItem[] = [
  {
    id: "1",
    title: "New device sign-in",
    description: "Chrome on macOS · Chennai",
    time: "2m ago",
    variant: "warning",
    read: false,
  },
  {
    id: "2",
    title: "Invoice paid",
    description: "₹49,900 · Acme Inc.",
    time: "1h ago",
    variant: "success",
    read: false,
  },
  {
    id: "3",
    title: "Welcome to Qeet",
    description: "Finish setting up your workspace.",
    time: "1d ago",
    variant: "info",
    read: true,
  },
];

const meta: Meta<typeof NotificationCenter> = {
  title: "Components/Feedback/NotificationCenter",
  component: NotificationCenter,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Bell-menu notification panel delivered by qeet-notify. Renders a list of `NotificationItem` objects with `variant` severity colouring (`warning`, `success`, `info`, `error`), individual dismiss controls, and a 'Mark all read' action. Typically mounted in the product top-bar next to the user avatar.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof NotificationCenter>;

export const Default: Story = {
  render: () => {
    const [items, setItems] = React.useState(SEED);
    return (
      <div className="flex h-72 w-full items-start justify-end">
        <NotificationCenter
          items={items}
          onMarkAllRead={() => setItems((xs) => xs.map((x) => ({ ...x, read: true })))}
          onDismiss={(id) => setItems((xs) => xs.filter((x) => x.id !== id))}
        />
      </div>
    );
  },
};
