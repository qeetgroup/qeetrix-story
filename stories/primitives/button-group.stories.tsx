import { ButtonGroup, ButtonGroupItem } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ButtonGroup> = {
  title: "Primitives/ButtonGroup",
  component: ButtonGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A group of connected buttons with merged interior border-radius. Use `ButtonGroupItem` (a named alias for `Button`) as direct children so the rounded-corner overrides apply correctly. Supports `horizontal` (default) and `vertical` orientations. Suitable for filter toggles, time-range selectors, and primary/secondary action splits.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Layout direction of the group.",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Horizontal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Time-range filter for the Qeet Logs event viewer — four options joined as a single horizontal control. `outline` variant keeps the group visually lightweight inside a toolbar.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <ButtonGroupItem variant="outline">1 h</ButtonGroupItem>
      <ButtonGroupItem variant="outline">24 h</ButtonGroupItem>
      <ButtonGroupItem variant="outline">7 d</ButtonGroupItem>
      <ButtonGroupItem variant="outline">30 d</ButtonGroupItem>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Vertical navigation group used in the Qeet ID organisation settings sidebar — stacked layout for narrow panel columns.",
      },
    },
  },
  render: () => (
    <ButtonGroup orientation="vertical" className="w-44">
      <ButtonGroupItem variant="outline">Members</ButtonGroupItem>
      <ButtonGroupItem variant="outline">Roles</ButtonGroupItem>
      <ButtonGroupItem variant="outline">Policies</ButtonGroupItem>
      <ButtonGroupItem variant="outline">Audit log</ButtonGroupItem>
    </ButtonGroup>
  ),
};

export const PrimaryDestructive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Two-item horizontal group combining a primary action with a destructive alternative — used in Qeet Pay's invoice action bar.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <ButtonGroupItem>Save invoice</ButtonGroupItem>
      <ButtonGroupItem variant="destructive">Void invoice</ButtonGroupItem>
    </ButtonGroup>
  ),
};

export const MixedVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Outline group where one item is highlighted as `default` to indicate the active filter selection — a common pattern in data-table toolbars.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <ButtonGroupItem variant="outline">All events</ButtonGroupItem>
      <ButtonGroupItem variant="default">Errors</ButtonGroupItem>
      <ButtonGroupItem variant="outline">Warnings</ButtonGroupItem>
    </ButtonGroup>
  ),
};
