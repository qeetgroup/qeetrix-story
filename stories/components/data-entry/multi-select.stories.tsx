import { type ComboboxOption, MultiSelect } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const scopes: ComboboxOption[] = [
  { label: "openid", value: "openid" },
  { label: "profile", value: "profile" },
  { label: "email", value: "email" },
  { label: "offline_access", value: "offline_access" },
  { label: "users:read", value: "users:read" },
  { label: "users:write", value: "users:write" },
  { label: "tenants:read", value: "tenants:read" },
];

const meta: Meta<typeof MultiSelect> = {
  title: "Components/Data Entry/MultiSelect",
  component: MultiSelect,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A searchable multi-select that renders chosen options as removable chips inside the trigger. Ideal for OAuth scope selection in Qeet ID application settings, notification channel targeting in qeet-notify, and role assignment in qeet-people.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Empty scope picker for a new Qeet ID application — the developer adds the scopes they need.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <MultiSelect items={scopes} placeholder="Add OAuth scopes…" />
    </div>
  ),
};

export const Preselected: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Standard OIDC scopes pre-selected — `openid` and `email` are required for Qeet ID authentication.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <MultiSelect items={scopes} defaultValue={["openid", "email", "profile"]} />
    </div>
  ),
};
