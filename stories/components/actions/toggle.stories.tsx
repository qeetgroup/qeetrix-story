import { BoldIcon } from "@qeetrix/icons/icons/bold";
import { ItalicIcon } from "@qeetrix/icons/icons/italic";
import { LayoutGridIcon } from "@qeetrix/icons/icons/layout-grid";
import { ListIcon } from "@qeetrix/icons/icons/list";
import { TextAlignCenterIcon } from "@qeetrix/icons/icons/text-align-center";
import { TextAlignEndIcon } from "@qeetrix/icons/icons/text-align-end";
import { TextAlignStartIcon } from "@qeetrix/icons/icons/text-align-start";
import { UnderlineIcon } from "@qeetrix/icons/icons/underline";
import { Box, Inline, Separator, Stack, Toggle, ToggleGroup } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Toggle> = {
  title: "Components/Actions/Toggle",
  component: Toggle,
  subcomponents: { ToggleGroup },
  parameters: {
    qeetrix: qx({ category: "actions", status: "stable" }),
    layout: "centered",
  },
  args: {
    icon: BoldIcon,
    "aria-label": "Bold",
    onPressedChange: fn(),
  },
  argTypes: {
    // A component reference: not something a control can edit.
    icon: { control: false },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toggle>;

/** The tooltip popup portals to the end of <body>, outside the canvas. */
const tooltipPopup = () => document.querySelector<HTMLElement>("[data-slot=tooltip-popup]");

/** A single-choice group: one view among a few. */
function ViewSwitcher() {
  return (
    <ToggleGroup defaultValue={["grid"]} aria-label="Members view">
      <Toggle value="grid" icon={LayoutGridIcon} filledWhenPressed>
        Grid
      </Toggle>
      <Toggle value="list" icon={ListIcon}>
        List
      </Toggle>
    </ToggleGroup>
  );
}

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Inline gap="md">
      <Toggle {...args} size="sm" defaultPressed aria-label="Bold, small" />
      <Toggle {...args} size="md" defaultPressed aria-label="Bold, medium" />
      <Toggle {...args} size="lg" defaultPressed aria-label="Bold, large" />
    </Inline>
  ),
};

export const States: Story = {
  render: (args) => (
    <Inline gap="md">
      <Toggle {...args} aria-label="Bold" />
      <Toggle {...args} icon={ItalicIcon} aria-label="Italic" defaultPressed />
      <Toggle {...args} icon={UnderlineIcon} aria-label="Underline" disabled />
      <Toggle {...args} icon={ItalicIcon} aria-label="Italic, locked" disabled defaultPressed />
    </Inline>
  ),
};

export const SegmentedControl: Story = {
  name: "Segmented control",
  render: () => (
    <Stack gap="lg" align="start">
      <ViewSwitcher />
      <ToggleGroup defaultValue={["30d"]} aria-label="Sign-in activity period">
        <Toggle value="7d">7 days</Toggle>
        <Toggle value="30d">30 days</Toggle>
        <Toggle value="90d">90 days</Toggle>
      </ToggleGroup>
    </Stack>
  ),
};

/** An editor toolbar's formatting tools, with their shortcuts in the tooltips. */
const FORMATTING = [
  { value: "bold", icon: BoldIcon, label: "Bold", shortcut: "Ctrl+B" },
  { value: "italic", icon: ItalicIcon, label: "Italic", shortcut: "Ctrl+I" },
  { value: "underline", icon: UnderlineIcon, label: "Underline", shortcut: "Ctrl+U" },
] as const;

const ALIGNMENT = [
  { value: "start", icon: TextAlignStartIcon, label: "Align start" },
  { value: "center", icon: TextAlignCenterIcon, label: "Align centre" },
  { value: "end", icon: TextAlignEndIcon, label: "Align end" },
] as const;

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Box padding="sm" border="subtle" radius="surface">
      <Inline gap="md">
        <ToggleGroup variant="separate" multiple size="sm" aria-label="Formatting">
          {FORMATTING.map(({ value, icon, label, shortcut }) => (
            <Toggle
              key={value}
              value={value}
              icon={icon}
              aria-label={label}
              tooltip={`${label} (${shortcut})`}
              tooltipSide="bottom"
            />
          ))}
        </ToggleGroup>
        <Separator orientation="vertical" />
        <ToggleGroup size="sm" defaultValue={["start"]} aria-label="Text alignment">
          {ALIGNMENT.map(({ value, icon, label }) => (
            <Toggle key={value} value={value} icon={icon} aria-label={label} tooltipSide="bottom" />
          ))}
        </ToggleGroup>
      </Inline>
    </Box>
  ),
};

export const PressedInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: click and Space flip the pressed state",
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole("button", { name: "Bold" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(true, expect.anything());
    await userEvent.keyboard(" ");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  },
};

export const SegmentedInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: one view at a time, arrow keys move",
  render: () => <ViewSwitcher />,
  play: async ({ canvas, userEvent }) => {
    const grid = canvas.getByRole("button", { name: "Grid" });
    const list = canvas.getByRole("button", { name: "List" });
    await userEvent.tab();
    await expect(grid).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(list).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(list).toHaveAttribute("aria-pressed", "true");
    await expect(grid).toHaveAttribute("aria-pressed", "false");
  },
};

export const TooltipInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: an icon-only toggle shows its tooltip on tooltipSide",
  render: InContext.render,
  play: async ({ canvas, userEvent }) => {
    const bold = canvas.getByRole("button", { name: "Bold" });
    await userEvent.tab();
    await expect(bold).toHaveFocus();
    await waitFor(() => expect(tooltipPopup()).toHaveTextContent("Bold (Ctrl+B)"));
    await expect(tooltipPopup()).toHaveAttribute("data-side", "bottom");
    await expect(bold).toHaveAccessibleDescription("Bold (Ctrl+B)");
  },
};
