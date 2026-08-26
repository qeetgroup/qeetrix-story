import { Key } from "@qeetrix/icons";
import { Callout } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Callout> = {
  title: "Components/Feedback/Callout",
  component: Callout,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          'A static inline informational box with a coloured left-border accent. Use `variant` (`info` | `success` | `warning` | `error`) to match intent. Not dismissible — for user-dismissible notices use `Alert`. Carries `role="note"` for non-intrusive accessibility announcement without triggering a live region. Each variant ships a sensible default icon that can be replaced or suppressed.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Callout>;

export const Default: Story = {
  args: { variant: "info" },
  parameters: {
    docs: {
      description: {
        story:
          "Default info callout driven by the controls panel — use for general guidance or helpful context.",
      },
    },
  },
  render: (args) => (
    <Callout {...args} className="max-w-lg">
      API keys issued before 2024-01-01 use the legacy HMAC-SHA1 algorithm. We recommend rotating
      them to the new Ed25519 format in the Qeet ID Developer settings.
    </Callout>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: "All four semantic variants rendered side-by-side with their default icons.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Callout variant="info">
        Qeet ID supports OIDC Discovery — point your client to{" "}
        <code>.well-known/openid-configuration</code> to auto-configure.
      </Callout>
      <Callout variant="success">
        Domain <strong>acme.id.qeet.in</strong> verified. Branded login is now live.
      </Callout>
      <Callout variant="warning">
        You have 3 API keys expiring within 7 days. Rotate them before they are revoked
        automatically.
      </Callout>
      <Callout variant="error">
        SCIM provisioning is misconfigured — check the bearer token in your IdP settings.
      </Callout>
    </div>
  ),
};

export const WithTitle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Optional `title` prop renders a bold heading above the body text — use when the subject needs to be scannable at a glance.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Callout variant="warning" title="Key expiry approaching">
        Your primary signing key expires in 5 days. Generate a new key pair and update your
        integration before the deadline to avoid service interruption.
      </Callout>
      <Callout variant="info" title="Passkey requirements">
        Passkeys require a device with a secure enclave (Touch ID, Face ID, or a Windows Hello PIN).
        Browser-based passkeys work on Chrome 108+ and Safari 16+.
      </Callout>
    </div>
  ),
};

export const WithoutTitle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Body-only callout for brief, self-explanatory notes where a heading would be redundant.",
      },
    },
  },
  render: () => (
    <Callout variant="success" className="max-w-lg">
      Passkey authentication is enabled for all members of your organisation.
    </Callout>
  ),
};

export const CustomIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass a custom `icon` to replace the default variant icon with a context-specific one.",
      },
    },
  },
  render: () => (
    <Callout
      variant="info"
      icon={<Key width={16} height={16} className="mt-0.5 shrink-0" />}
      title="API key format"
      className="max-w-lg"
    >
      Production keys begin with <code>qid_live_</code>; sandbox keys begin with{" "}
      <code>qid_test_</code>. Never commit either to source control.
    </Callout>
  ),
};

export const NoIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `icon={null}` to suppress the icon entirely — useful for compact inline callouts or dense data panels.",
      },
    },
  },
  render: () => (
    <Callout variant="info" icon={null} className="max-w-lg">
      All timestamps in the Qeet Logs API are returned as UTC ISO 8601 strings.
    </Callout>
  ),
};
