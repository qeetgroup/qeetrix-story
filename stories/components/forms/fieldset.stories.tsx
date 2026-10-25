import { Field, Fieldset, Grid, Select, Stack, TextField } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Fieldset> = {
  title: "Components/Forms/Fieldset",
  component: Fieldset,
  parameters: {
    qeetrix: qx({ category: "forms", status: "stable" }),
    layout: "centered",
  },
  args: {
    legend: "Billing address",
    description: "Printed on every GST invoice.",
  },
  // The fields are the story's own children, not a text control.
  argTypes: { children: { control: false } },
  render: (args) => (
    <Fieldset {...args} style={{ inlineSize: 360 }}>
      <TextField label="Address line" defaultValue="4th Floor, Prestige Tech Park" />
      <TextField label="City" defaultValue="Bengaluru" />
      <TextField label="PIN code" defaultValue="560103" inputMode="numeric" />
    </Fieldset>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Fieldset>;

export const Playground: Story = {};

export const Disabled: Story = {
  args: { legend: "Company", description: "Managed by your administrator.", disabled: true },
  render: (args) => (
    <Fieldset {...args} style={{ inlineSize: 360 }}>
      <TextField label="Legal name" defaultValue="Acme Private Limited" />
      <Field label="State">
        <Select
          items={[
            { value: "KA", label: "Karnataka" },
            { value: "MH", label: "Maharashtra" },
          ]}
          defaultValue="KA"
        />
      </Field>
    </Fieldset>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Stack gap="2xl" style={{ inlineSize: 480 }}>
      <Fieldset legend="Company" description="As registered with the MCA.">
        <TextField label="Legal name" defaultValue="Acme Private Limited" />
        <Grid columns={2} gap="lg">
          <TextField label="GSTIN" defaultValue="29ABCDE1234F1Z5" />
          <TextField label="PAN" defaultValue="ABCDE1234F" />
        </Grid>
      </Fieldset>
      <Fieldset legend="Billing contact">
        <Grid columns={2} gap="lg">
          <TextField label="Name" defaultValue="Ananya Iyer" />
          <TextField label="Email" type="email" defaultValue="finance@acme.in" />
        </Grid>
      </Fieldset>
    </Stack>
  ),
};

export const LegendAndDisabled: Story = {
  ...Disabled,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: legend names, description describes; disabled reaches every field",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("group", { name: "Company" })).toHaveAccessibleDescription(
      "Managed by your administrator.",
    );
    await expect(canvas.getByRole("textbox", { name: "Legal name" })).toBeDisabled();
    await expect(canvas.getByRole("combobox", { name: "State" })).toBeDisabled();
  },
};
