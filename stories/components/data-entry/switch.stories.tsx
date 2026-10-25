import { Stack, Switch } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Switch> = {
  title: "Components/Data Entry/Switch",
  component: Switch,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
  },
  args: {
    label: "Require a passkey for all members",
    onCheckedChange: fn(),
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <Stack gap="xs">
      <Switch label="Weekly security summary" />
      <Switch label="New device alerts" defaultChecked />
      <Switch label="Allow password sign-in" disabled />
      <Switch label="Audit log export" disabled defaultChecked />
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Stack gap="xs" style={{ inlineSize: 400 }}>
      <Switch
        label="New device sign-in"
        description="Email Priya Sharma when a member signs in from a new device."
        defaultChecked
      />
      <Switch label="Failed passkey attempts" description="After 5 in an hour." defaultChecked />
      <Switch label="Weekly security summary" description="Mondays at 9:00 IST." />
    </Stack>
  ),
};

export const SpaceToggles: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: Space toggles",
  play: async ({ args, canvas, userEvent }) => {
    const control = canvas.getByRole("switch", { name: "Require a passkey for all members" });
    await userEvent.tab();
    await expect(control).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(control).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());
    await userEvent.keyboard(" ");
    await expect(control).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false, expect.anything());
  },
};

export const LabelToggles: Story = {
  ...InContext,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the label toggles it",
  play: async ({ canvas, userEvent }) => {
    const control = canvas.getByRole("switch", { name: "New device sign-in" });
    await expect(control).toHaveAccessibleDescription(
      "Email Priya Sharma when a member signs in from a new device.",
    );
    await userEvent.click(canvas.getByText("New device sign-in"));
    await expect(control).not.toBeChecked();
  },
};

export const NamedWithoutLabel: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: aria-label names a switch with no visible label",
  args: { label: undefined, "aria-label": "Enable Acme HR" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("switch", { name: "Enable Acme HR" })).toBeVisible();
  },
};
