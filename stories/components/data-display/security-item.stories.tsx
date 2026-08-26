import { Key, Monitor, ShieldTick } from "@qeetrix/icons";
import { Button, SecurityItem } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof SecurityItem> = {
  title: "Components/Data Display/SecurityItem",
  component: SecurityItem,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Product-neutral security-resource anatomy for sessions, devices, credentials, passkeys, integrations, and API keys. Products own protocol state, authorization, confirmation, revocation, validation, and persistence.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof SecurityItem>;

export const Resources: Story = {
  render: () => (
    <div className="grid gap-3">
      <SecurityItem
        title="MacBook Pro"
        description="Current browser session"
        status="active"
        icon={<Monitor />}
        details={[
          { label: "Location", value: "Minneapolis, MN" },
          { label: "Last active", value: "Just now" },
        ]}
        actions={
          <Button variant="destructive" size="sm">
            Revoke
          </Button>
        }
      />
      <SecurityItem
        title="Touch ID passkey"
        description="Synced credential"
        status="verified"
        icon={<ShieldTick />}
        details={[{ label: "Added", value: "August 18, 2026" }]}
        actions={
          <Button variant="outline" size="sm">
            Rename
          </Button>
        }
      />
      <SecurityItem
        title="Reporting API key"
        description="Read-only analytics integration"
        status="expiring"
        icon={<Key />}
        details={[
          { label: "Prefix", value: "qx_live_4f2a" },
          { label: "Expires", value: "September 1, 2026" },
        ]}
        actions={
          <Button variant="outline" size="sm">
            Rotate
          </Button>
        }
      />
    </div>
  ),
};
