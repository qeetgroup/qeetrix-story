import { Button } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

// Sample story — copy this file when adding coverage for a new
// primitive. The argTypes block doubles as a usage cheat-sheet.
const meta: Meta<typeof Button> = {
  title: "Components/Actions/Button",
  component: Button,
  parameters: {
    qeetrix: qx({ category: "actions", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "The foundational action primitive used throughout Qeet products. Use `variant` to communicate intent — `default` for primary actions (e.g. signing in via Qeet ID), `destructive` for irreversible operations (revoking an API key), `outline`/`ghost` for secondary actions, and `link` for inline navigation.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Continue",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete user",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Cancel",
  },
};

export const Loading: Story = {
  args: {
    children: "Working…",
    disabled: true,
  },
};

/**
 * Reference interaction test — copy this shape when a component has behaviour worth
 * asserting, not just an appearance worth looking at.
 *
 * The `play` function runs in the workshop (Interactions panel) *and* as a real
 * Vitest case in headless Chromium via `bun run test`. Query by accessible role
 * rather than test ids: an assertion that can only pass for a keyboard- and
 * screen-reader-reachable button is worth more than one that reaches into the DOM.
 */
export const ClickInteraction: Story = {
  name: "Interaction: click focuses",
  args: {
    children: "Continue",
  },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Continue" });

    await userEvent.click(button);

    await expect(button).toHaveFocus();
  },
};
