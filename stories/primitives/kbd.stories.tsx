import { Kbd, KbdGroup } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Kbd> = {
  title: "Primitives/Kbd",
  component: Kbd,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Keyboard shortcut hint glyph rendered as a `<kbd>` element. Use standalone for single keys or wrap multiple in `KbdGroup` for chord combinations — useful in tooltips, command palettes, and onboarding docs across Qeet products.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Single key glyph — use inline with tooltip copy or keyboard shortcut reference tables.",
      },
    },
  },
  render: () => <Kbd>Esc</Kbd>,
};

export const Combination: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Chord shortcut using KbdGroup — shown in command palette hints across Qeet products.",
      },
    },
  },
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <span className="text-xs text-muted-foreground">+</span>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
};

export const MultiKey: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three-key chord for advanced shortcuts — e.g. opening the audit log filter in qeet-logs.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span>Open audit log filter</span>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <span className="text-xs">+</span>
        <Kbd>⇧</Kbd>
        <span className="text-xs">+</span>
        <Kbd>F</Kbd>
      </KbdGroup>
    </div>
  ),
};
