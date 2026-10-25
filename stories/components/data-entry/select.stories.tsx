import { Field, Grid, Input, Select, Stack } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
];

const REGIONS = [
  {
    label: "India",
    items: [
      { value: "ap-south-1", label: "Mumbai (ap-south-1)" },
      { value: "ap-south-2", label: "Hyderabad (ap-south-2)" },
    ],
  },
  {
    label: "Asia Pacific",
    items: [{ value: "ap-southeast-1", label: "Singapore (ap-southeast-1)" }],
  },
  {
    label: "Europe",
    items: [{ value: "eu-central-1", label: "Frankfurt (eu-central-1)", disabled: true }],
  },
];

const meta: Meta<typeof Select<string>> = {
  title: "Components/Data Entry/Select",
  component: Select,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
  },
  args: {
    items: ROLES,
    placeholder: "e.g. Member",
    onValueChange: fn(),
  },
  // A Select lives in a Field, which labels its trigger.
  render: (args) => (
    <Field label="Default role" style={{ inlineSize: 360 }}>
      <Select {...args} />
    </Field>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select<string>>;

export const Playground: Story = {};

export const Multiple: Story = {
  render: () => (
    <Field label="Alert channels" style={{ inlineSize: 360 }}>
      <Select<string, true>
        multiple
        items={[
          { value: "email", label: "Email" },
          { value: "sms", label: "SMS" },
          { value: "whatsapp", label: "WhatsApp" },
        ]}
        defaultValue={["email", "sms"]}
      />
    </Field>
  ),
};

export const States: Story = {
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Data region" error="Choose a data region.">
        <Select items={REGIONS} placeholder="e.g. Mumbai (ap-south-1)" />
      </Field>
      <Field label="Default role" disabled>
        <Select items={ROLES} defaultValue="member" />
      </Field>
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Grid columns={2} gap="lg" style={{ inlineSize: 480 }}>
      <Field label="Data region">
        <Select items={REGIONS} defaultValue="ap-south-1" />
      </Field>
      <Field label="Session timeout">
        <Input defaultValue="30" endAdornment="minutes" />
      </Field>
    </Grid>
  ),
};

export const KeyboardChoose: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: choose with the keyboard",
  args: { defaultValue: "member" },
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Default role" });
    await expect(trigger).toHaveTextContent("Member");
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    // Down opens the list on the chosen option; Down again moves, Enter chooses.
    await userEvent.keyboard("{ArrowDown}");
    const listbox = await screen.findByRole("listbox");
    await waitFor(() => expect(listbox).toBeVisible());
    await expect(screen.getByRole("option", { name: "Member" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(trigger).toHaveTextContent("Viewer"));
    await expect(args.onValueChange).toHaveBeenLastCalledWith("viewer", expect.anything());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const EscapeCloses: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: disabled options are skipped; Escape closes",
  render: (args) => (
    <Field label="Plan" style={{ inlineSize: 360 }}>
      <Select
        {...args}
        items={[
          { value: "starter", label: "Starter" },
          { value: "growth", label: "Growth" },
          { value: "enterprise", label: "Enterprise: contact sales", disabled: true },
        ]}
        defaultValue="growth"
      />
    </Field>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Plan" });
    await userEvent.click(trigger);
    await screen.findByRole("listbox");
    await expect(screen.getByRole("option", { name: "Enterprise: contact sales" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    // From Growth, Down has nowhere to go: Enterprise is disabled.
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    await expect(trigger).toHaveTextContent("Growth");
    await expect(trigger).toHaveFocus();
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const GroupsOpen: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: groups list their options under a label",
  args: { items: REGIONS, placeholder: "e.g. Mumbai (ap-south-1)" },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Default role" }));
    await screen.findByRole("listbox");
    await waitFor(() => expect(screen.getByText("Asia Pacific")).toBeVisible());
    await expect(screen.getByRole("option", { name: "Frankfurt (eu-central-1)" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await userEvent.click(screen.getByRole("option", { name: "Hyderabad (ap-south-2)" }));
    await waitFor(() =>
      expect(canvas.getByRole("combobox", { name: "Default role" })).toHaveTextContent(
        "Hyderabad (ap-south-2)",
      ),
    );
  },
};

export const NamedWithoutField: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: aria-label names a Select without a Field",
  render: (args) => <Select {...args} aria-label="Role for Priya Sharma" defaultValue="admin" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "Role for Priya Sharma" })).toHaveTextContent(
      "Administrator",
    );
  },
};
