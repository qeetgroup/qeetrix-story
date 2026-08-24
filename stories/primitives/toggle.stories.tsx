import { Toggle, ToggleGroup } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextBold, TextItalic, TextUnderline } from "@qeetrix/icons";

const meta: Meta<typeof Toggle> = {
  title: "Primitives/Toggle",
  component: Toggle,
  parameters: {
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
      <TextBold />
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
      <TextItalic />
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
        <TextBold />
      </Toggle>
      <Toggle value="italic" variant="outline" aria-label="Italic">
        <TextItalic />
      </Toggle>
      <Toggle value="underline" variant="outline" aria-label="Underline">
        <TextUnderline />
      </Toggle>
    </ToggleGroup>
  ),
};
