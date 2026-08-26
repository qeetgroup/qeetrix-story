import { Button, Notification } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Notification> = {
  title: "Components/Feedback/Notification",
  component: Notification,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Structured in-app notification card used by qeet-notify and the Qeet ID notification centre. Renders a title, description, optional `action` button, and a loading state for async events such as directory syncs or webhook deliveries. Use `variant` to signal intent; close via `onClose`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["info", "success", "warning", "error"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Notification>;

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All four intent variants with realistic Qeet copy — map these to your notification event types.",
      },
    },
  },
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <Notification
        variant="info"
        title="Heads up"
        description="Your trial ends in 3 days."
        onClose={() => {}}
      />
      <Notification
        variant="success"
        title="Saved"
        description="Your changes are live."
        onClose={() => {}}
      />
      <Notification
        variant="warning"
        title="Usage high"
        description="You're near your plan limit."
        onClose={() => {}}
      />
      <Notification
        variant="error"
        title="Payment failed"
        description="Update your card to continue."
        onClose={() => {}}
      />
    </div>
  ),
};

export const WithAction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Notification with an action button — prompt the user to review a suspicious sign-in or remediate a warning.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <Notification
        variant="info"
        title="New device sign-in"
        description="A new device signed in from Chennai."
        action={
          <Button size="sm" variant="outline">
            Review
          </Button>
        }
        onClose={() => {}}
      />
    </div>
  ),
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Loading state for long-running async operations such as SCIM directory syncs or bulk log exports.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <Notification
        variant="info"
        loading
        title="Syncing…"
        description="Importing your directory."
      />
    </div>
  ),
};
