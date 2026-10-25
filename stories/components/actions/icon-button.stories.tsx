import { CopyIcon } from "@qeetrix/icons/icons/copy";
import { DownloadIcon } from "@qeetrix/icons/icons/download";
import { RefreshCwIcon } from "@qeetrix/icons/icons/refresh-cw";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { TrashIcon } from "@qeetrix/icons/icons/trash";
import { IconButton, Inline, Stack, Text } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof IconButton> = {
  title: "Components/Actions/IconButton",
  component: IconButton,
  parameters: {
    qeetrix: qx({ category: "actions", status: "stable" }),
    layout: "centered",
  },
  args: {
    icon: SettingsIcon,
    "aria-label": "Open settings",
    onClick: fn(),
  },
  argTypes: {
    // A component reference: not something a control can edit.
    icon: { control: false },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof IconButton>;

/** The tooltip popup portals to the end of <body>, outside the canvas. */
const tooltipPopup = () => document.querySelector<HTMLElement>("[data-slot=tooltip-popup]");

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack gap="lg">
      {(["brand", "neutral", "danger"] as const).map((tone) => (
        <Inline key={tone} gap="md">
          <IconButton {...args} tone={tone} variant="ghost" icon={TrashIcon} aria-label="Remove" />
          <IconButton {...args} tone={tone} variant="soft" icon={TrashIcon} aria-label="Revoke" />
          <IconButton {...args} tone={tone} variant="solid" icon={TrashIcon} aria-label="Delete" />
        </Inline>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Inline gap="md">
      <IconButton {...args} size="sm" aria-label="Settings, small" />
      <IconButton {...args} size="md" aria-label="Settings, medium" />
      <IconButton {...args} size="lg" aria-label="Settings, large" />
    </Inline>
  ),
};

export const States: Story = {
  render: (args) => (
    <Inline gap="md">
      <IconButton {...args} icon={RefreshCwIcon} aria-label="Refresh sessions" loading />
      <IconButton {...args} icon={TrashIcon} aria-label="Delete workspace" disabled />
    </Inline>
  ),
};

export const CustomTooltip: Story = {
  name: "Custom tooltip",
  parameters: {
    docs: {
      description: {
        story: "`tooltip` replaces the text, `false` hides it, `tooltipSide` moves it.",
      },
    },
  },
  render: (args) => (
    <Inline gap="md">
      <IconButton
        {...args}
        icon={DownloadIcon}
        aria-label="Download invoice"
        tooltip="Download INV-2026-0042 (PDF)"
      />
      <IconButton
        {...args}
        icon={RefreshCwIcon}
        aria-label="Refresh sessions"
        tooltipSide="bottom"
      />
      <Inline gap="xs">
        <Text mono>usr_01J8K2M4PQ</Text>
        <IconButton {...args} icon={CopyIcon} aria-label="Copy user ID" tooltip={false} />
      </Inline>
    </Inline>
  ),
};

export const ClickInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: named by its aria-label",
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Open settings" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
    await expect(button).toHaveFocus();
  },
};

export const TooltipInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: focus shows the label as a tooltip",
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Open settings" });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await waitFor(() => expect(tooltipPopup()).toHaveTextContent("Open settings"));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(tooltipPopup()).toBeNull());
    await expect(button).toHaveFocus();
  },
};

export const TooltipSideInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: tooltipSide opens the tooltip below",
  args: { tooltipSide: "bottom" },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Open settings" });
    await userEvent.tab();
    await waitFor(() => expect(tooltipPopup()).toHaveAttribute("data-side", "bottom"));
    await waitFor(() =>
      expect(tooltipPopup()?.getBoundingClientRect().top ?? 0).toBeGreaterThan(
        button.getBoundingClientRect().bottom,
      ),
    );
  },
};
