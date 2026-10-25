import { MailIcon } from "@qeetrix/icons/icons/mail";
import { Grid, Link, QeetrixProvider, Stack, TextField } from "@qeetrix/react";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";
import { qx } from "../../_contract";

/** GSTIN: state code, PAN, entity number, Z, check character. */
const GSTIN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const meta: Meta<typeof TextField> = {
  title: "Components/Forms/TextField",
  component: TextField,
  parameters: {
    qeetrix: qx({ category: "forms", status: "stable" }),
    layout: "centered",
  },
  args: {
    label: "Legal name",
    description: "As on the certificate of incorporation.",
    placeholder: "e.g. Acme Private Limited",
    onValueChange: fn(),
  },
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <TextField {...args} />
    </div>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <TextField label="Trade name" optional placeholder="e.g. Acme" />
      <TextField label="PAN" defaultValue="ABCDE1234F" error="This PAN is already registered." />
      <TextField label="Tenant ID" disabled defaultValue="ten_8f2c1a9b3e47" />
      <TextField label="Client ID" readOnly defaultValue="qid_live_8f2c1a9b3e47" />
    </Stack>
  ),
};

export const IconAndAffixes: Story = {
  name: "Icon and affixes",
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <TextField label="Work email" type="email" icon={MailIcon} placeholder="e.g. priya@acme.in" />
      <TextField label="Subdomain" defaultValue="acme" endAdornment=".qeet.in" />
      <TextField label="Credit limit" defaultValue="1,24,500" startAdornment="₹" />
    </Stack>
  ),
};

export const WithHelp: Story = {
  name: "With help",
  args: {
    label: "Redirect URI",
    description: "Must start with https://",
    placeholder: "e.g. https://payroll.acme.in/callback",
    help: (
      <>
        Where Qeet ID sends people back after they sign in.{" "}
        <Link href="#redirects">About redirect URIs</Link>
      </>
    ),
  },
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Grid columns={2} gap="lg" style={{ inlineSize: 480 }}>
      <TextField label="Full name" autoComplete="name" defaultValue="Rahul Verma" />
      <TextField label="Work email" type="email" defaultValue="rahul@acme.in" />
      <TextField label="Company" defaultValue="Acme Pvt Ltd" />
      <TextField label="Phone" optional type="tel" placeholder="e.g. 98765 43210" />
    </Grid>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Stack gap="lg" style={{ inlineSize: 360 }}>
        <TextField label="कानूनी नाम" defaultValue="Acme Private Limited" />
        <TextField label="व्यापार नाम" optional placeholder="जैसे Acme" />
      </Stack>
    </QeetrixProvider>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "व्यापार नाम (वैकल्पिक)" })).toBeVisible();
  },
};

export const Typing: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: typing reports the value",
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Legal name" });
    await expect(input).toHaveAccessibleDescription("As on the certificate of incorporation.");
    await userEvent.type(input, "Acme Private Limited");
    await expect(input).toHaveValue("Acme Private Limited");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      "Acme Private Limited",
      expect.anything(),
    );
  },
};

export const ValidateOnBlur: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: validate on blur",
  args: {
    label: "GSTIN",
    description: "15 characters, e.g. 29ABCDE1234F1Z5.",
    placeholder: undefined,
    validationMode: "onBlur",
    validate: (value) =>
      typeof value === "string" && GSTIN.test(value)
        ? null
        : "Enter a GSTIN with 15 characters, e.g. 29ABCDE1234F1Z5",
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "GSTIN" });
    await userEvent.type(input, "29ABCDE");
    await userEvent.tab();
    await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));
    await expect(
      canvas.getByText("Enter a GSTIN with 15 characters, e.g. 29ABCDE1234F1Z5"),
    ).toBeVisible();
    await userEvent.type(input, "1234F1Z5");
    await userEvent.tab();
    await waitFor(() => expect(input).not.toHaveAttribute("aria-invalid", "true"));
  },
};

export const HelpOpens: Story = {
  ...WithHelp,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: help opens on click, Escape returns focus",
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "About Redirect URI" });
    await userEvent.click(button);
    const dialog = await screen.findByRole("dialog", { name: "Redirect URI" });
    await expect(dialog).toHaveTextContent(/sends people back after they sign in/);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(button).toHaveFocus();
    // The ⓘ doesn't take over the label: it still names the input, and the description describes.
    await expect(canvas.getByRole("textbox", { name: "Redirect URI" })).toHaveAccessibleDescription(
      "Must start with https://",
    );
  },
};

export const StatesReachTheInput: Story = {
  ...States,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: states reach the input",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Trade name (optional)" })).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "PAN" })).toHaveAccessibleDescription(
      "This PAN is already registered.",
    );
    await expect(canvas.getByRole("textbox", { name: "Tenant ID" })).toBeDisabled();
    await expect(canvas.getByRole("textbox", { name: "Client ID" })).toHaveAttribute("readonly");
  },
};
