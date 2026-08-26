import { Label, Switch } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Switch> = {
  title: "Components/Data Entry/Switch",
  component: Switch,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'A toggle for binary on/off settings that take effect immediately without a submit button. Supports a `size` prop (`"sm"` | `"default"`) and an `aria-invalid` state. Common uses include enabling MFA enforcement, toggling passkey-only login, and activating qeet-notify channels.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: { defaultChecked: true, "aria-label": "Enable passkey login" },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="mfa" defaultChecked />
      <Label htmlFor="mfa">Require MFA for all members</Label>
    </div>
  ),
};

export const Small: Story = {
  parameters: {
    docs: {
      description: {
        story: "Compact `sm` size for dense settings rows in the Qeet ID admin panel.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="email-notif" size="sm" defaultChecked />
      <Label htmlFor="email-notif">Email notifications</Label>
    </div>
  ),
};

export const ToggleInteraction: Story = {
  name: "Interaction: toggling the switch",
  parameters: {
    docs: {
      description: {
        story:
          "A switch reports its state through the `switch` role and checked state, which is what assistive technology reads — not the thumb position.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="interaction-mfa" defaultChecked />
      <Label htmlFor="interaction-mfa">Require MFA for all members</Label>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", { name: "Require MFA for all members" });
    await expect(toggle).toBeChecked();

    await userEvent.click(toggle);

    await expect(toggle).not.toBeChecked();
  },
};
