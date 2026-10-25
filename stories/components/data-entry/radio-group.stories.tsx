import { CodeXmlIcon } from "@qeetrix/icons/icons/code-xml";
import { GlobeIcon } from "@qeetrix/icons/icons/globe";
import { MonitorSmartphoneIcon } from "@qeetrix/icons/icons/monitor-smartphone";
import { ServerIcon } from "@qeetrix/icons/icons/server";
import { Badge, Grid, Radio, RadioGroup, Stack } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Data Entry/RadioGroup",
  component: RadioGroup,
  subcomponents: { Radio },
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
  },
  args: {
    label: "Billing cycle",
    defaultValue: "monthly",
    onValueChange: fn(),
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="monthly" label="Monthly" />
      <Radio value="quarterly" label="Quarterly" />
      <Radio value="yearly" label="Yearly" description="Two months free." />
    </RadioGroup>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <Grid columns={3} gap="2xl" style={{ inlineSize: 480 }}>
      <RadioGroup label="Billing cycle" defaultValue="monthly">
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Yearly" disabled />
      </RadioGroup>
      <RadioGroup label="Billing cycle" defaultValue="yearly" disabled>
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Yearly" />
      </RadioGroup>
      <RadioGroup label="Data region" error="Choose a region.">
        <Radio value="ap-south-1" label="Mumbai" />
        <Radio value="ap-south-2" label="Hyderabad" />
      </RadioGroup>
    </Grid>
  ),
};

export const Horizontal: Story = {
  args: { label: "Invoice language", defaultValue: "en", orientation: "horizontal" },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="en" label="English" />
      <Radio value="hi" label="हिन्दी" />
      <Radio value="ta" label="தமிழ்" />
    </RadioGroup>
  ),
};

export const Tiles: Story = {
  args: { label: "Application type", variant: "tile", columns: 2, defaultValue: "web" },
  render: (args) => (
    <div style={{ inlineSize: 480 }}>
      <RadioGroup {...args}>
        <Radio
          value="web"
          icon={GlobeIcon}
          label="Web app"
          description="Server-rendered, keeps a client secret."
        />
        <Radio
          value="spa"
          icon={MonitorSmartphoneIcon}
          label="Single-page or mobile"
          description="Runs in the browser or a phone, with PKCE."
        />
        <Radio
          value="m2m"
          icon={ServerIcon}
          label="Machine to machine"
          description="A backend service, client credentials."
        />
        <Radio
          value="saml"
          icon={CodeXmlIcon}
          disabled
          label={
            <>
              SAML app <Badge tone="info">Enterprise</Badge>
            </>
          }
          description="An enterprise app on SAML 2.0."
        />
      </RadioGroup>
    </div>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Stack gap="xl" style={{ inlineSize: 400 }}>
      <RadioGroup label="Sign users out after" defaultValue="8h">
        <Radio value="1h" label="1 hour" />
        <Radio value="8h" label="8 hours" description="A working day." />
        <Radio value="30d" label="30 days" description="Only on devices with a passkey." />
      </RadioGroup>
      <RadioGroup label="On a new device" defaultValue="notify" orientation="horizontal">
        <Radio value="allow" label="Allow" />
        <Radio value="notify" label="Allow and notify" />
        <Radio value="block" label="Block" />
      </RadioGroup>
    </Stack>
  ),
};

export const ArrowKeys: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: arrow keys move and select",
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole("radiogroup", { name: "Billing cycle" })).toBeVisible();
    // One tab stop: Tab lands on the checked radio.
    await userEvent.tab();
    const monthly = canvas.getByRole("radio", { name: "Monthly" });
    await expect(monthly).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    const quarterly = canvas.getByRole("radio", { name: "Quarterly" });
    await expect(quarterly).toHaveFocus();
    await expect(quarterly).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("quarterly", expect.anything());
    await userEvent.keyboard("{ArrowDown}");
    const yearly = canvas.getByRole("radio", { name: "Yearly" });
    await expect(yearly).toBeChecked();
    await expect(yearly).toHaveAccessibleDescription("Two months free.");
    // Up goes back.
    await userEvent.keyboard("{ArrowUp}");
    await expect(quarterly).toBeChecked();
  },
};

export const HorizontalArrows: Story = {
  ...Horizontal,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: horizontal groups move with Left and Right",
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("radio", { name: "English" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("radio", { name: "हिन्दी" })).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("hi", expect.anything());
  },
};

export const SkipsDisabled: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: arrows skip disabled options",
  args: { defaultValue: "quarterly" },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="monthly" label="Monthly" />
      <Radio value="quarterly" label="Quarterly" />
      <Radio value="yearly" label="Yearly" disabled />
    </RadioGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("radio", { name: "Quarterly" })).toHaveFocus();
    // Yearly is disabled, so Down wraps round to Monthly.
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("radio", { name: "Monthly" })).toBeChecked();
  },
};

export const TileArrowKeys: Story = {
  ...Tiles,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: arrows move between tiles, skipping the disabled one",
  play: async ({ args, canvas, userEvent }) => {
    const web = canvas.getByRole("radio", { name: "Web app" });
    // Named by its title, described by its line.
    await expect(web).toHaveAccessibleDescription("Server-rendered, keeps a client secret.");
    await userEvent.tab();
    await expect(web).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("radio", { name: "Single-page or mobile" })).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("spa", expect.anything());
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    // SAML is disabled, so the arrows go round to the first.
    await expect(web).toBeChecked();
  },
};

export const WholeTile: Story = {
  ...Tiles,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a click anywhere on a tile chooses it",
  play: async ({ args, canvas, userEvent }) => {
    // The label is stretched over the tile, so the point over the description hits the label.
    const description = canvas.getByText("A backend service, client credentials.");
    const box = description.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    const label = canvas.getByRole("radio", { name: "Machine to machine" }).closest("label");
    await expect(hit).toBe(label);
    await userEvent.click(hit as Element);
    await expect(canvas.getByRole("radio", { name: "Machine to machine" })).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("m2m", expect.anything());
  },
};
