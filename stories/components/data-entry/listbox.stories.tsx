import { Listbox } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof Listbox> = {
  title: "Components/Data Entry/Listbox",
  component: Listbox,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "An accessible listbox built on Base UI. Supports single and multiple selection, disabled options, and keyboard navigation. Pass an `options` array with optional `disabled` flags; bind `value` and `onValueChange` for controlled usage.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Listbox>;

const OPTIONS = [
  { label: "Owner", value: "owner" },
  { label: "Admin", value: "admin" },
  { label: "Member", value: "member" },
  { label: "Billing", value: "billing", disabled: true },
  { label: "Guest", value: "guest" },
];

export const SingleSelect: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Single-selection mode. Used in Qeet ID role pickers where a member can hold exactly one role. The `Billing` option is disabled to demonstrate how unavailable choices are rendered.",
      },
    },
  },
  render: () => {
    const [v, setV] = React.useState("admin");
    return (
      <div className="w-56">
        <Listbox
          aria-label="Role"
          options={OPTIONS}
          value={v}
          onValueChange={(x) => setV(x as string)}
        />
      </div>
    );
  },
};

export const MultiSelect: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Multiple-selection mode. Useful when assigning more than one role or permission group to a user. Selected values are highlighted; toggling an item adds or removes it from the value array.",
      },
    },
  },
  render: () => {
    const [v, setV] = React.useState<string[]>(["owner", "member"]);
    return (
      <div className="w-56">
        <Listbox
          aria-label="Roles"
          multiple
          options={OPTIONS}
          value={v}
          onValueChange={(x) => setV(x as string[])}
        />
      </div>
    );
  },
};

const SCOPE_OPTIONS = [
  { label: "read:users", value: "read:users" },
  { label: "write:users", value: "write:users" },
  { label: "read:sessions", value: "read:sessions" },
  { label: "read:audit_logs", value: "read:audit_logs" },
  { label: "admin:org", value: "admin:org", disabled: true },
];

export const ScopeSelector: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "OAuth scope picker for Qeet ID API key creation. `admin:org` is disabled because it requires an Enterprise plan upgrade. Default selection pre-checks the minimum read scopes needed for most integrations.",
      },
    },
  },
  render: () => {
    const [v, setV] = React.useState<string[]>(["read:users", "read:sessions"]);
    return (
      <div className="w-64">
        <Listbox
          aria-label="API key scopes"
          multiple
          options={SCOPE_OPTIONS}
          value={v}
          onValueChange={(x) => setV(x as string[])}
        />
      </div>
    );
  },
};
