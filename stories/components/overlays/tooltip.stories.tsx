import { CopyIcon } from "@qeetrix/icons/icons/copy";
import { DownloadIcon } from "@qeetrix/icons/icons/download";
import { ListFilterIcon } from "@qeetrix/icons/icons/list-filter";
import { RefreshCwIcon } from "@qeetrix/icons/icons/refresh-cw";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { Button, IconButton, Inline, Tooltip, TooltipProvider } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Overlays/Tooltip",
  component: Tooltip,
  subcomponents: { TooltipProvider },
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
    layout: "centered",
  },
  args: {
    content: "Rotates every 90 days.",
  },
  argTypes: {
    // The trigger element comes from each story's render.
    children: { control: false },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

/** The popup portals to the end of <body>, outside the canvas. */
const tooltipPopup = () => document.querySelector<HTMLElement>("[data-slot=tooltip-popup]");

export const Playground: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="soft">Rotate key</Button>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: () => (
    <Inline gap="2xl">
      <Tooltip content="Download invoice" side="top">
        <IconButton icon={DownloadIcon} aria-label="Download invoice" tooltip={false} />
      </Tooltip>
      <Tooltip content="Copy user ID" side="bottom">
        <IconButton icon={CopyIcon} aria-label="Copy user ID" tooltip={false} />
      </Tooltip>
      <Tooltip content="Refresh sessions" side="left">
        <IconButton icon={RefreshCwIcon} aria-label="Refresh sessions" tooltip={false} />
      </Tooltip>
      <Tooltip content="Workspace settings" side="right">
        <IconButton icon={SettingsIcon} aria-label="Workspace settings" tooltip={false} />
      </Tooltip>
    </Inline>
  ),
};

export const WithProvider: Story = {
  name: "With provider",
  parameters: {
    docs: { description: { story: "Once one tooltip is open, its neighbours open at once." } },
  },
  render: () => (
    <TooltipProvider>
      <Inline gap="xs">
        <IconButton icon={RefreshCwIcon} aria-label="Refresh log stream" tone="neutral" />
        <IconButton icon={ListFilterIcon} aria-label="Filter by level" tone="neutral" />
        <IconButton icon={DownloadIcon} aria-label="Export as CSV" tone="neutral" />
        <IconButton icon={SettingsIcon} aria-label="Stream settings" tone="neutral" />
      </Inline>
    </TooltipProvider>
  ),
};

export const FocusInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: focus opens it, Escape closes it",
  render: Playground.render,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Rotate key" });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await waitFor(() => expect(tooltipPopup()).toHaveTextContent("Rotates every 90 days."));
    await expect(trigger).toHaveFocus();
    await expect(tooltipPopup()).toHaveAttribute("role", "tooltip");
    await expect(trigger).toHaveAccessibleDescription("Rotates every 90 days.");

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(tooltipPopup()).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const HoverInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: hover opens it after the delay",
  render: Playground.render,
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole("button", { name: "Rotate key" }));
    await expect(tooltipPopup()).toBeNull();
    await waitFor(() => expect(tooltipPopup()).toBeVisible(), { timeout: 2000 });
  },
};

export const SideOffsetInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: sideOffset sets the gap",
  args: { sideOffset: 12 },
  render: Playground.render,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Rotate key" });
    await userEvent.tab();
    await waitFor(() => expect(tooltipPopup()).toBeVisible());
    // Measured on the side it opened on: it flips when the canvas has no room above.
    const gap = () => {
      const popup = tooltipPopup();
      const from = trigger.getBoundingClientRect();
      const to = popup?.getBoundingClientRect();
      if (!popup || !to) return Number.NaN;
      return Math.round(
        popup.dataset.side === "bottom" ? to.top - from.bottom : from.top - to.bottom,
      );
    };
    await waitFor(() => expect(gap()).toBe(12));
  },
};
