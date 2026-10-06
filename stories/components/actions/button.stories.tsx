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
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    loadingLabel: { control: "text" },
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
  parameters: {
    docs: {
      description: {
        story:
          "`loading` is not `disabled`: the button keeps its colour, shows a spinner in the leading slot, reports `aria-busy` and ignores activation while keeping focus. `loadingLabel` replaces the label for the duration and becomes the accessible name; the button holds the wider of the two widths, so it does not jump.",
      },
    },
  },
  args: {
    children: "Save changes",
    loading: true,
    loadingLabel: "Saving…",
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
