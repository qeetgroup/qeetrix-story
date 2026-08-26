import { Banner } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof Banner> = {
  title: "Components/Feedback/Banner",
  component: Banner,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-width top-of-page announcement bar for system-wide notices — scheduled maintenance, trial countdowns, or new feature rollouts across Qeet products. Supports `info`, `success`, `warning`, and `danger` variants and an optional dismiss button via `onDismiss`. Links inside are underlined automatically.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Info banner announcing a new Qeet ID feature with an inline link.",
      },
    },
  },
  render: () => (
    <Banner variant="info">
      <span>
        New: passkeys are now generally available. <a href="https://docs.qeet.in">Read more →</a>
      </span>
    </Banner>
  ),
};

export const Success: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Success banner for confirming a completed action, such as a plan upgrade or domain verification.",
      },
    },
  },
  render: () => (
    <Banner variant="success">
      Domain <strong>acme.id.qeet.in</strong> verified successfully. Your branded login is live.
    </Banner>
  ),
};

export const Dismissible: Story = {
  parameters: {
    docs: {
      description: {
        story: "Warning banner with a dismiss button — the user can hide it after acknowledging.",
      },
    },
  },
  render: () => {
    const [show, setShow] = React.useState(true);
    return show ? (
      <Banner variant="warning" onDismiss={() => setShow(false)}>
        Your trial ends in 3 days — add a payment method to keep access.
      </Banner>
    ) : (
      <p className="p-4 text-sm text-muted-foreground">Banner dismissed.</p>
    );
  },
};
