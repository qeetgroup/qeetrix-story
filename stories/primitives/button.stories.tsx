import { Button } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

// Sample story — copy this file when adding coverage for a new
// primitive. The argTypes block doubles as a usage cheat-sheet.
const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  parameters: {
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
