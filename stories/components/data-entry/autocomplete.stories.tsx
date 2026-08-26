import { Autocomplete } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof Autocomplete> = {
  title: "Components/Data Entry/Autocomplete",
  component: Autocomplete,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A text input with suggestion dropdown that filters as the user types. Unlike `Combobox`, the typed text is always the submitted value — suggestions are optional hints. Use for org name search in Qeet ID's admin console, webhook event type filtering in qeet-notify, and country/city lookup in qeet-people.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Autocomplete>;

const ORGS = [
  "Acme Inc.",
  "Acme Corp",
  "Globex",
  "Globex Finance",
  "Initech",
  "Umbrella Corp",
  "Wayne Enterprises",
  "Stark Industries",
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Organisation search in the Qeet ID admin console — type to filter across all registered tenants.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Autocomplete aria-label="Organisation" items={ORGS} placeholder="Search organisations…" />
    </div>
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Controlled usage — the selected org name is echoed below, ready to be posted to the API.",
      },
    },
  },
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <div className="w-72 space-y-2">
        <Autocomplete
          aria-label="Organisation"
          items={ORGS}
          value={value}
          onValueChange={setValue}
          placeholder="Search organisations…"
        />
        <p className="text-sm text-muted-foreground">Selected: {value || "—"}</p>
      </div>
    );
  },
};
