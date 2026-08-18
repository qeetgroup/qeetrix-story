import { Combobox, type ComboboxOption } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const timezones: ComboboxOption[] = [
  { label: "(UTC−08:00) Pacific Time", value: "pst" },
  { label: "(UTC−07:00) Mountain Time", value: "mst" },
  { label: "(UTC−06:00) Central Time", value: "cst" },
  { label: "(UTC−05:00) Eastern Time", value: "est" },
  { label: "(UTC+00:00) Coordinated Universal Time", value: "utc" },
  { label: "(UTC+01:00) Central European Time", value: "cet" },
  { label: "(UTC+05:30) India Standard Time", value: "ist" },
  { label: "(UTC+09:00) Japan Standard Time", value: "jst", disabled: true },
];

const meta: Meta<typeof Combobox> = {
  title: "Primitives/Combobox",
  component: Combobox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A searchable single-select that filters a static list as the user types. Unlike `Autocomplete`, the typed value must resolve to a valid option. Use for long but bounded lists such as time zones in Qeet ID user profiles, log stream regions in qeet-logs, and country codes in qeet-pay.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Time-zone picker for a Qeet ID user profile — type to filter the full IANA list.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Combobox items={timezones} placeholder="Search time zones…" />
    </div>
  ),
};

export const Preselected: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "IST pre-selected for an Acme Inc. org based in India — the default for new qeet-pay merchants.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Combobox items={timezones} defaultValue="ist" />
    </div>
  ),
};
