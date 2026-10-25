import { Field, Stack, Textarea, TextField } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Textarea> = {
  title: "Components/Data Entry/Textarea",
  component: Textarea,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
  },
  args: {
    placeholder: "e.g. Net 30. Bank transfer to HDFC Bank.",
    onValueChange: fn(),
  },
  // A Textarea lives in a Field, which gives it its label, description and error.
  render: (args) => (
    <Field
      label="Invoice notes"
      description="Printed under the line items."
      style={{ inlineSize: 360 }}
    >
      <Textarea {...args} />
    </Field>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Playground: Story = {};

export const AutoGrow: Story = {
  name: "Auto-grow",
  args: {
    rows: 2,
    maxRows: 5,
    defaultValue: "Payment terms: Net 30.\nBank: HDFC Bank, Andheri East.\nIFSC: HDFC0000123.",
  },
};

export const States: Story = {
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Reason for suspension" error="Enter a reason for suspending Rahul Verma.">
        <Textarea />
      </Field>
      <Field label="Welcome email" disabled>
        <Textarea defaultValue="Welcome to Acme Pvt Ltd. Sign in with your passkey." />
      </Field>
      <Field label="Audit note">
        <Textarea readOnly defaultValue="Suspended by Priya Sharma on 25 Oct 2026." />
      </Field>
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 400 }}>
      <TextField label="Endpoint URL" type="url" defaultValue="https://hooks.acme.in/qeet-id" />
      <Field label="Description" optional>
        <Textarea placeholder="e.g. Sends user.created events to Acme HR." />
      </Field>
    </Stack>
  ),
};

export const GrowsAsYouType: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: grows as you type",
  args: { rows: 2, maxRows: 4, placeholder: undefined },
  play: async ({ args, canvas, userEvent }) => {
    const textarea = canvas.getByRole("textbox", { name: "Invoice notes" });
    await expect(textarea).toHaveAccessibleDescription("Printed under the line items.");
    const start = textarea.getBoundingClientRect().height;
    await userEvent.type(textarea, "Net 30.{Enter}HDFC Bank.{Enter}IFSC HDFC0000123.");
    const grown = textarea.getBoundingClientRect().height;
    await expect(grown).toBeGreaterThan(start);
    await userEvent.type(textarea, "{Enter}Andheri East.{Enter}Mumbai.");
    // Past maxRows it scrolls rather than growing.
    await expect(textarea.getBoundingClientRect().height).toBe(start + (grown - start) * 2);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      "Net 30.\nHDFC Bank.\nIFSC HDFC0000123.\nAndheri East.\nMumbai.",
      expect.anything(),
    );
  },
};
