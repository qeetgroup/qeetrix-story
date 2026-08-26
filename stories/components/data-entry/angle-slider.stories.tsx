import { AngleSlider } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof AngleSlider> = {
  title: "Components/Data Entry/AngleSlider",
  component: AngleSlider,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A circular 0–360° angle picker (ARIA APG Slider) — drag or use arrow keys to set a value. Used in Qeetrix's token editor for gradient-angle design tokens and in the org-branding customiser within Qeet ID admin to configure background gradient directions.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AngleSlider>;

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Drag the handle or use arrow keys — PageUp/PageDown jumps ±10°, Home/End snaps to 0°/359°.",
      },
    },
  },
  render: () => {
    const [v, setV] = React.useState(135);
    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-24 w-48 rounded-lg"
          style={{ background: `linear-gradient(${v}deg, #F26D0E, #1e1b4b)` }}
        />
        <AngleSlider value={v} onValueChange={setV} size={96} aria-label="Brand gradient angle" />
        <span className="text-sm text-muted-foreground">Gradient angle: {v}°</span>
      </div>
    );
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Disabled state — shown when the org branding feature requires a paid plan upgrade.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <AngleSlider defaultValue={45} disabled size={96} aria-label="Gradient angle (locked)" />
      <span className="text-sm text-muted-foreground">Upgrade to Business to unlock</span>
    </div>
  ),
};
