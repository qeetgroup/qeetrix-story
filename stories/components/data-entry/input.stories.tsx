import { MailIcon } from "@qeetrix/icons/icons/mail";
import { SearchIcon } from "@qeetrix/icons/icons/search";
import { Field, Grid, Input, Stack } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Input> = {
  title: "Components/Data Entry/Input",
  component: Input,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
  },
  args: {
    type: "email",
    placeholder: "e.g. priya@acme.in",
    onValueChange: fn(),
  },
  // An Input lives in a Field, which gives it its label, description and error.
  render: (args) => (
    <Field label="Work email" style={{ inlineSize: 360 }}>
      <Input {...args} />
    </Field>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Work email" error="Enter a full email address.">
        <Input type="email" defaultValue="priya@acme" />
      </Field>
      <Field label="Tenant ID" disabled>
        <Input defaultValue="ten_8f2c1a9b3e47" />
      </Field>
      <Field label="Client ID">
        <Input readOnly defaultValue="qid_live_8f2c1a9b3e47" />
      </Field>
    </Stack>
  ),
};

export const WithIcon: Story = {
  name: "With icon",
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Work email">
        <Input type="email" icon={MailIcon} placeholder="e.g. priya@acme.in" />
      </Field>
      <Field label="Search users" hideLabel>
        <Input type="search" icon={SearchIcon} placeholder="e.g. Ananya Iyer" />
      </Field>
    </Stack>
  ),
};

export const Adornments: Story = {
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Credit limit">
        <Input startAdornment="₹" defaultValue="1,24,500" inputMode="decimal" />
      </Field>
      <Field label="Subdomain">
        <Input endAdornment=".qeet.in" defaultValue="acme" />
      </Field>
      <Field label="Discount">
        <Input endAdornment="%" defaultValue="12.5" inputMode="decimal" />
      </Field>
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Grid columns={2} gap="lg" style={{ inlineSize: 480 }}>
      <Field label="Billing contact">
        <Input defaultValue="Ananya Iyer" />
      </Field>
      <Field label="Billing email">
        <Input type="email" defaultValue="finance@acme.in" />
      </Field>
      <Field label="Monthly budget">
        <Input startAdornment="₹" defaultValue="50,000" inputMode="decimal" />
      </Field>
      <Field label="PO number" optional>
        <Input placeholder="e.g. PO-2026-0142" />
      </Field>
    </Grid>
  ),
};

export const Typing: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: typing reports each change",
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Work email" });
    await userEvent.type(input, "priya@acme.in");
    await expect(input).toHaveValue("priya@acme.in");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("priya@acme.in", expect.anything());
  },
};

export const ReadOnlyTyping: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: read-only ignores typing but takes focus",
  render: (args) => (
    <Field label="Client ID" style={{ inlineSize: 360 }}>
      <Input {...args} type="text" readOnly defaultValue="qid_live_8f2c1a9b3e47d056" />
    </Field>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Client ID" });
    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await userEvent.keyboard("x");
    await expect(input).toHaveValue("qid_live_8f2c1a9b3e47d056");
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const SearchNamed: Story = {
  ...WithIcon,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a search with a hidden label keeps its name",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("searchbox", { name: "Search users" })).toBeVisible();
  },
};
