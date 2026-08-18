import { CopyableSecret } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof CopyableSecret> = {
  title: "Primitives/CopyableSecret",
  component: CopyableSecret,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A masked credential field with a one-click copy button. The value is hidden by default and revealed only in the clipboard — never shown in plain text. Used for API keys, client secrets, webhook signing secrets, and other sensitive credentials in settings panels.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CopyableSecret>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Standard API key display as seen in the Qeet ID Developer → API Keys settings page. The value is masked; clicking the copy icon places it in the clipboard.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <CopyableSecret label="API key" value="qid_live_8f2c1a9b4e7d6c0f3a2b1e9d8c7f6a5b" />
    </div>
  ),
};

export const ClientSecret: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "OAuth 2.0 client secret shown with `oneLine` to prevent wrapping. Used in the Qeet ID OAuth Applications panel alongside the client ID.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <CopyableSecret
        label="client_secret"
        value="cs_live_9d7e2b4f1a3c8e5d6b2f9c4a7e1b3d8f"
        oneLine
      />
    </div>
  ),
};

export const WebhookSigningSecret: Story = {
  parameters: {
    docs: {
      description: {
        story: "Compact `sm` size fits inside settings panels and drawer sidebars.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <CopyableSecret
        label="Signing secret"
        value="whsec_4f2c9a1b8e7d3f6c2a9b4e1d7c3f8b2e"
        size="sm"
      />
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The copy button is disabled while the key is being rotated or after it has been revoked.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <CopyableSecret label="API key" value="qid_live_8f2c1a9b4e7d6c0f3a2b1e9d8c7f6a5b" disabled />
    </div>
  ),
};
