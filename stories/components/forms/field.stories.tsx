import { Field, Grid, Input, Link, QeetrixProvider, Select, Stack, Textarea } from "@qeetrix/react";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Field> = {
  title: "Components/Forms/Field",
  component: Field,
  parameters: {
    qeetrix: qx({ category: "forms", status: "stable" }),
    layout: "centered",
  },
  args: {
    label: "GSTIN",
    description: "15 characters, e.g. 29ABCDE1234F1Z5.",
  },
  // The control is the story's own child, not a text control.
  argTypes: { children: { control: false } },
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <Field {...args}>
        <Input />
      </Field>
    </div>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Trade name" optional description="As registered with the MCA.">
        <Input placeholder="e.g. Acme Pvt Ltd" />
      </Field>
      <Field label="PAN" description="10 characters." error="PAN has 10 characters.">
        <Input defaultValue="ABCDE12" />
      </Field>
      <Field label="Tenant ID" disabled description="Set when the tenant was created.">
        <Input defaultValue="ten_8f2c1a9b3e47" />
      </Field>
    </Stack>
  ),
};

export const WithHelp: Story = {
  name: "With help",
  args: {
    label: "Access token lifetime",
    description: "5 to 1,440 minutes.",
    help: (
      <>
        How long an access token stays valid after sign-in.{" "}
        <Link href="#tokens">How tokens work</Link>
      </>
    ),
  },
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <Field {...args}>
        <Input defaultValue="60" endAdornment="minutes" />
      </Field>
    </div>
  ),
};

export const AnyControl: Story = {
  name: "Any control",
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Legal name">
        <Input defaultValue="Acme Private Limited" />
      </Field>
      <Field label="Billing cycle">
        <Select
          items={[
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: "Yearly" },
          ]}
          defaultValue="monthly"
        />
      </Field>
      <Field label="Invoice notes" optional description="Printed under the line items.">
        <Textarea defaultValue="Net 30. Bank transfer to HDFC Bank." />
      </Field>
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Grid columns={2} gap="lg" style={{ inlineSize: 480 }}>
      <Field label="Access token" help="How long an access token stays valid after sign-in.">
        <Input defaultValue="60" endAdornment="minutes" />
      </Field>
      <Field label="Refresh token">
        <Input defaultValue="30" endAdornment="days" />
      </Field>
    </Grid>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Stack gap="lg" style={{ inlineSize: 360 }}>
        <Field label="व्यापार नाम" optional description="MCA में पंजीकृत नाम।">
          <Input placeholder="जैसे Acme Pvt Ltd" />
        </Field>
        <Field label="टोकन अवधि" help="साइन-इन के बाद एक्सेस टोकन कितनी देर मान्य रहता है।">
          <Input defaultValue="60" endAdornment="मिनट" />
        </Field>
      </Stack>
    </QeetrixProvider>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("(वैकल्पिक)")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "टोकन अवधि के बारे में" })).toBeVisible();
  },
};

export const NamesAndDescribes: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: label names, description describes",
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "GSTIN" });
    await expect(input).toHaveAccessibleDescription("15 characters, e.g. 29ABCDE1234F1Z5.");
    // A click on the label focuses the control.
    await userEvent.click(canvas.getByText("GSTIN"));
    await expect(input).toHaveFocus();
  },
};

export const LabelsAnyControl: Story = {
  ...AnyControl,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: labels any control inside",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Legal name" })).toBeVisible();
    await expect(canvas.getByRole("combobox", { name: "Billing cycle" })).toBeVisible();
    await expect(
      canvas.getByRole("textbox", { name: "Invoice notes (optional)" }),
    ).toHaveAccessibleDescription("Printed under the line items.");
  },
};

export const ErrorMarksInvalid: Story = {
  ...States,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: an error marks the control invalid and replaces the description",
  play: async ({ canvas }) => {
    const pan = canvas.getByRole("textbox", { name: "PAN" });
    await expect(pan).toHaveAttribute("aria-invalid", "true");
    // The error alone: the description makes way for it, on screen and for screen readers.
    await expect(pan).toHaveAccessibleDescription("PAN has 10 characters.");
    await expect(canvas.queryByText("10 characters.")).not.toBeInTheDocument();
    const tenant = canvas.getByRole("textbox", { name: "Tenant ID" });
    await expect(tenant).toBeDisabled();
    await expect(tenant).toHaveAccessibleDescription("Set when the tenant was created.");
  },
};

export const HelpToggletip: Story = {
  ...WithHelp,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: help opens on click, Escape returns focus",
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "About Access token lifetime" });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(button);
    const dialog = await screen.findByRole("dialog", { name: "Access token lifetime" });
    await expect(dialog).toHaveTextContent(/stays valid after sign-in/);
    // Visible once the popover's opening transition ends.
    await waitFor(() =>
      expect(screen.getByRole("link", { name: "How tokens work" })).toBeVisible(),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(button).toHaveFocus();
    // The ⓘ doesn't take over the label: it still names the input.
    await expect(canvas.getByRole("textbox", { name: "Access token lifetime" })).toBeVisible();
  },
};

export const RequiredOnBlur: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: required field shows the browser's message on blur",
  render: () => (
    <div style={{ inlineSize: 360 }}>
      <Field label="Work email" validationMode="onBlur">
        <Input type="email" required />
      </Field>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Work email" });
    await expect(input).toBeRequired();
    await expect(input).not.toHaveAttribute("aria-invalid");
    await userEvent.type(input, "priya");
    await userEvent.tab();
    await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));
    // The browser's validation message shows in the error row.
    const error = canvasElement.querySelector("[data-slot=field-error]");
    await expect(error?.textContent?.length).toBeGreaterThan(0);
  },
};

export const HiddenLabel: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a hidden label still names the control",
  args: { label: "Search users", description: undefined, hideLabel: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Search users" })).toBeVisible();
  },
};
