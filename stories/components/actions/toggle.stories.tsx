import { BoldIcon, ItalicIcon, UnderlineIcon } from "@qeetrix/icons";
import { Toggle, ToggleGroup } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Toggle> = {
  title: "Components/Actions/Toggle",
  component: Toggle,
  parameters: {
    qeetrix: qx({ category: "actions", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A two-state pressed/unpressed button. Use it for toolbar formatting actions (bold, italic), feature flags, and filter chips — either standalone or grouped in a `ToggleGroup` for related options like text alignment in the qeet-notify email template editor.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Default filled toggle — pressed state active, as it would appear after the user enables bold in the template editor.",
      },
    },
  },
  render: () => (
    <Toggle aria-label="Toggle bold" defaultPressed>
      <BoldIcon />
    </Toggle>
  ),
};

export const Outline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Outline variant — lower visual weight, suitable for toolbar icons that sit alongside other controls.",
      },
    },
  },
  render: () => (
    <Toggle variant="outline" aria-label="Toggle italic">
      <ItalicIcon />
    </Toggle>
  ),
};

export const Group: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`ToggleGroup` for multi-select formatting — bold is pre-selected, italic and underline are available.",
      },
    },
  },
  render: () => (
    <ToggleGroup defaultValue={["bold"]} aria-label="Text formatting">
      <Toggle value="bold" variant="outline" aria-label="Bold">
        <BoldIcon />
      </Toggle>
      <Toggle value="italic" variant="outline" aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle value="underline" variant="outline" aria-label="Underline">
        <UnderlineIcon />
      </Toggle>
    </ToggleGroup>
  ),
};

export const PressedInteraction: Story = {
  name: "Interaction: pressed state flips",
  parameters: {
    docs: {
      description: {
        story:
          "A toggle's whole purpose is its two-state behaviour, and assistive technology reads that state from `aria-pressed` rather than from the styling. This asserts the attribute actually changes, not just the appearance.",
      },
    },
  },
  render: () => (
    <Toggle aria-label="Toggle bold" defaultPressed>
      <BoldIcon />
    </Toggle>
  ),
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("button", { name: "Toggle bold" });
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(toggle);

    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  },
};
