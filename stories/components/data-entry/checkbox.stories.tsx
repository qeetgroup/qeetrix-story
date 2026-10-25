import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { MailIcon } from "@qeetrix/icons/icons/mail";
import { SmartphoneIcon } from "@qeetrix/icons/icons/smartphone";
import { Checkbox, CheckboxGroup, Grid, Stack } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

const SCOPES = [
  { value: "openid", label: "openid", description: "Confirm who they are." },
  { value: "profile", label: "profile", description: "Read their name and photo." },
  { value: "email", label: "email", description: "Read their work email." },
];

const meta: Meta<typeof Checkbox> = {
  title: "Components/Data Entry/Checkbox",
  component: Checkbox,
  subcomponents: { CheckboxGroup },
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
  },
  args: {
    label: "Keep me signed in on this device",
    onCheckedChange: fn(),
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <Stack gap="xs">
      <Checkbox label="Email GST invoices" />
      <Checkbox label="Send payment receipts" defaultChecked />
      <Checkbox label="2 of 5 users selected" indeterminate />
      <Checkbox label="Allow password sign-in" disabled />
      <Checkbox label="Require a passkey" disabled defaultChecked />
    </Stack>
  ),
};

export const Group: Story = {
  render: () => (
    <Grid columns={2} gap="2xl" style={{ inlineSize: 480 }}>
      <CheckboxGroup
        label="Notify me by"
        description="About sign-ins from new devices."
        defaultValue={["email"]}
      >
        <Checkbox value="email" label="Email" />
        <Checkbox value="sms" label="SMS" />
        <Checkbox value="whatsapp" label="WhatsApp" />
      </CheckboxGroup>
      <CheckboxGroup label="Weekly report" error="Choose at least one." orientation="horizontal">
        <Checkbox value="email" label="Email" />
        <Checkbox value="slack" label="Slack" />
      </CheckboxGroup>
    </Grid>
  ),
};

export const Tiles: Story = {
  render: () => (
    <div style={{ inlineSize: 400 }}>
      <CheckboxGroup label="Sign-in methods" variant="tile" defaultValue={["passkey", "totp"]}>
        <Checkbox
          value="passkey"
          icon={KeyRoundIcon}
          label="Passkey"
          description="Face, fingerprint or screen lock."
        />
        <Checkbox
          value="totp"
          icon={SmartphoneIcon}
          label="Authenticator app"
          description="A 6-digit code from an app."
        />
        <Checkbox
          value="email"
          icon={MailIcon}
          label="Email link"
          description="A one-time link to their inbox."
        />
      </CheckboxGroup>
    </div>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <CheckboxGroup
      label="Scopes Acme HR may use"
      allValues={SCOPES.map((scope) => scope.value)}
      defaultValue={["openid"]}
    >
      <Checkbox parent label="All scopes" />
      {SCOPES.map((scope) => (
        <Checkbox
          key={scope.value}
          value={scope.value}
          label={scope.label}
          description={scope.description}
          style={{ marginInlineStart: 24 }}
        />
      ))}
    </CheckboxGroup>
  ),
};

export const SpaceToggles: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: Space toggles",
  play: async ({ args, canvas, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Keep me signed in on this device" });
    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());
    await userEvent.keyboard(" ");
    await expect(checkbox).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false, expect.anything());
  },
};

export const LabelToggles: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the whole row is the click target",
  args: {
    label: "Email GST invoices",
    description: "To the billing contact, finance@acme.in.",
    defaultChecked: true,
  },
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Email GST invoices" });
    await expect(checkbox).toHaveAccessibleDescription("To the billing contact, finance@acme.in.");
    await userEvent.click(canvas.getByText("Email GST invoices"));
    await expect(checkbox).not.toBeChecked();
  },
};

export const ParentChecksAll: Story = {
  ...InContext,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the parent checks every scope, with a dash while mixed",
  play: async ({ canvas, userEvent }) => {
    // The mark's drawing: a dash while mixed, the tick once checked.
    const mark = (name: string) =>
      canvas.getByRole("checkbox", { name }).querySelector("[data-slot=checkbox-mark] svg")
        ?.innerHTML;
    const parent = canvas.getByRole("checkbox", { name: "All scopes" });
    await expect(parent).toHaveAttribute("aria-checked", "mixed");
    await expect(mark("All scopes")).toBeTruthy();
    await expect(mark("All scopes")).not.toBe(mark("openid"));
    await userEvent.click(parent);
    for (const scope of SCOPES) {
      await expect(canvas.getByRole("checkbox", { name: scope.label })).toBeChecked();
    }
    await expect(parent).toBeChecked();
    await expect(mark("All scopes")).toBe(mark("openid"));
    // Unchecking one child puts the parent back to mixed.
    await userEvent.click(canvas.getByRole("checkbox", { name: "email" }));
    await expect(parent).toHaveAttribute("aria-checked", "mixed");
  },
};

export const GroupErrorMarksOptions: Story = {
  ...Group,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a group error marks its options invalid",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("group", { name: "Notify me by" })).toBeVisible();
    await expect(canvas.getByRole("checkbox", { name: "Slack" })).toHaveAttribute(
      "data-invalid",
      "",
    );
  },
};

export const TilesKeys: Story = {
  ...Tiles,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: checkbox tiles each take Tab; Space toggles",
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("checkbox", { name: "Passkey" })).toHaveAccessibleDescription(
      "Face, fingerprint or screen lock.",
    );
    await userEvent.tab();
    await expect(canvas.getByRole("checkbox", { name: "Passkey" })).toHaveFocus();
    await userEvent.tab();
    await userEvent.tab();
    const email = canvas.getByRole("checkbox", { name: "Email link" });
    await expect(email).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(email).toBeChecked();
  },
};
