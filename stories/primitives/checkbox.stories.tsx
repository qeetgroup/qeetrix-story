import { Checkbox, CheckboxGroup, Label } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Checkbox> = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A binary toggle for boolean settings and multi-select lists. Supports an `indeterminate` state for parent checkboxes in scope or permission trees — common in Qeet ID's OAuth scope selector and qeet-people's bulk-action tables.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" defaultChecked />
      <Label htmlFor="terms">I accept the Qeet ID terms of service</Label>
    </div>
  ),
};

export const Indeterminate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Parent checkbox when only some child scopes are selected — clicking it selects or deselects all.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="all" indeterminate />
      <Label htmlFor="all">Select all OAuth scopes</Label>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Org-level policy has locked this setting — an admin must override it in the Qeet ID security policy panel.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="locked" defaultChecked disabled />
      <Label htmlFor="locked">Require passkey for all members (enforced by policy)</Label>
    </div>
  ),
};

const SCOPES: Array<[string, string]> = [
  ["openid", "openid — verify identity"],
  ["profile", "profile — read display name & avatar"],
  ["email", "email — read email address"],
];

export const Group: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "OAuth scope picker shown during Qeet ID application consent — pre-selects required scopes.",
      },
    },
  },
  render: () => (
    <CheckboxGroup defaultValue={["openid", "email"]} aria-label="OAuth scopes">
      {SCOPES.map(([value, label]) => (
        <div key={value} className="flex items-center gap-2">
          <Checkbox id={`scope-${value}`} name={value} value={value} />
          <Label htmlFor={`scope-${value}`}>{label}</Label>
        </div>
      ))}
    </CheckboxGroup>
  ),
};
