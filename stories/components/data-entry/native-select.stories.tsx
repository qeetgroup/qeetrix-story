import { Label, NativeSelect } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof NativeSelect> = {
  title: "Components/Data Entry/NativeSelect",
  component: NativeSelect,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A styled wrapper around the native `<select>` element with a decorative chevron indicator. Use where a full headless dropdown is unnecessary — simple enum pickers, language selectors, and compact filter controls. Accepts all standard `<select>` props. For rich option rendering or search, use the headless `Select` component instead.",
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NativeSelect>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Timezone picker shown during Qeet ID tenant setup — the selection drives the timezone displayed on the hosted login page.",
      },
    },
  },
  render: () => (
    <NativeSelect defaultValue="Asia/Kolkata" aria-label="Timezone" className="w-60">
      <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
      <option value="Asia/Singapore">Asia/Singapore (SGT +08:00)</option>
      <option value="Europe/London">Europe/London (GMT +00:00)</option>
      <option value="Europe/Berlin">Europe/Berlin (CET +01:00)</option>
      <option value="America/New_York">America/New_York (ET −05:00)</option>
      <option value="America/Los_Angeles">America/Los_Angeles (PT −08:00)</option>
    </NativeSelect>
  ),
};

export const WithLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Paired with a `Label` via `htmlFor` for full keyboard and screen-reader accessibility — the required pattern when the select appears inside a form.",
      },
    },
  },
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="log-level">Minimum log level</Label>
      <NativeSelect id="log-level" defaultValue="warn">
        <option value="debug">Debug</option>
        <option value="info">Info</option>
        <option value="warn">Warn</option>
        <option value="error">Error</option>
        <option value="fatal">Fatal</option>
      </NativeSelect>
    </div>
  ),
};

export const Grouped: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Native `<optgroup>` grouping for the data-residency region picker — no custom rendering needed when the list is short and the groups are static.",
      },
    },
  },
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="data-region-grouped">Data region</Label>
      <NativeSelect id="data-region-grouped" defaultValue="ap-south-1">
        <optgroup label="Asia Pacific">
          <option value="ap-south-1">Mumbai (ap-south-1)</option>
          <option value="ap-southeast-1">Singapore (ap-southeast-1)</option>
        </optgroup>
        <optgroup label="Europe">
          <option value="eu-west-1">Ireland (eu-west-1)</option>
          <option value="eu-central-1">Frankfurt (eu-central-1)</option>
        </optgroup>
        <optgroup label="Americas">
          <option value="us-east-1">N. Virginia (us-east-1)</option>
        </optgroup>
      </NativeSelect>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state when the setting is locked to an Enterprise plan — show a tooltip pointing to the upgrade path in Qeet Pay.",
      },
    },
  },
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="data-region-disabled">Data region</Label>
      <NativeSelect id="data-region-disabled" defaultValue="ap-south-1" disabled>
        <option value="ap-south-1">Mumbai (ap-south-1)</option>
        <option value="eu-west-1">Ireland (eu-west-1)</option>
        <option value="us-east-1">N. Virginia (us-east-1)</option>
      </NativeSelect>
    </div>
  ),
};
