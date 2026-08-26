import { Label, Radio, RadioGroup } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Data Entry/Radio Group",
  component: RadioGroup,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A single-selection group of radio buttons. Used in Qeet ID for plan selection, MFA method choice, and log retention tier picking in qeet-logs. Wrap each `Radio` with a `Label` and manage selection via `defaultValue` or the controlled `value` + `onValueChange` props.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

const PLANS: Array<[string, string]> = [
  ["starter", "Starter — up to 5 members"],
  ["growth", "Growth — up to 50 members"],
  ["enterprise", "Enterprise — unlimited members + SSO"],
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Qeet ID plan picker — `growth` is pre-selected as the recommended tier.",
      },
    },
  },
  render: () => (
    <RadioGroup defaultValue="growth" aria-label="Qeet ID plan">
      {PLANS.map(([value, label]) => (
        <div key={value} className="flex items-center gap-2">
          <Radio id={`plan-${value}`} value={value} />
          <Label htmlFor={`plan-${value}`}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Plan selection locked — the current subscription is managed by a Globex billing admin.",
      },
    },
  },
  render: () => (
    <RadioGroup defaultValue="enterprise" disabled aria-label="Qeet ID plan (locked)">
      {PLANS.map(([value, label]) => (
        <div key={value} className="flex items-center gap-2">
          <Radio id={`dplan-${value}`} value={value} />
          <Label htmlFor={`dplan-${value}`}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};
