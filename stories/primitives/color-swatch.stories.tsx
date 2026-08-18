import { ColorSwatch, ColorSwatchGroup } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof ColorSwatch> = {
  title: "Primitives/ColorSwatch",
  component: ColorSwatch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A colour chip that renders as either a display `<span role='img'>` or an interactive `<button aria-pressed>` depending on whether an `onClick` handler is provided. Four sizes: `xs` (16px), `sm` (20px), `md` (24px, default), `lg` (32px). Compose multiple swatches inside `ColorSwatchGroup` (a `<fieldset>`) to build accessible colour-picker palettes. Each swatch surfaces an `aria-label` from `label` or falls back to the raw `color` string. See the WAI-ARIA [radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) for the interactive variant.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    color: "#F26D0E",
    label: "Qeet orange",
    size: "md",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ColorSwatch>;

// --- Brand palette used across stories ---
const QEET_PALETTE = [
  { color: "#F26D0E", label: "Qeet orange" },
  { color: "#1A56DB", label: "Qeet blue" },
  { color: "#10B981", label: "Success green" },
  { color: "#F59E0B", label: "Warning amber" },
  { color: "#EF4444", label: "Destructive red" },
  { color: "#6B7280", label: "Muted grey" },
];

export const Display: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Without an `onClick` handler the swatch renders as a `<span role='img'>` — purely decorative/informational. Use in read-only colour previews like theme selection confirmation or brand guide galleries.",
      },
    },
  },
  args: {
    color: "#F26D0E",
    label: "Qeet orange",
    size: "md",
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Passing `onClick` promotes the swatch to an interactive `<button aria-pressed>`. The selected ring appears when `selected={true}`. Used inside colour-picker palettes and theme-selection grids.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = React.useState("#F26D0E");
    return (
      <div className="flex items-center gap-3">
        {QEET_PALETTE.slice(0, 4).map(({ color, label }) => (
          <ColorSwatch
            key={color}
            color={color}
            label={label}
            size="md"
            selected={selected === color}
            onClick={() => setSelected(color)}
          />
        ))}
      </div>
    );
  },
};

export const Selected: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`selected={true}` adds a `ring-2 ring-primary ring-offset-2` highlight. The swatch also surfaces `aria-pressed='true'` in the interactive variant to communicate state to screen readers.",
      },
    },
  },
  args: {
    color: "#F26D0E",
    label: "Qeet orange",
    selected: true,
    onClick: () => {},
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`disabled={true}` reduces opacity to 50% and blocks pointer/keyboard interaction. Use for colours that are unavailable in the current plan tier — e.g. custom brand colours locked behind the Enterprise plan.",
      },
    },
  },
  args: {
    color: "#1A56DB",
    label: "Qeet blue (unavailable on Starter)",
    disabled: true,
    onClick: () => {},
  },
};

export const SizeXs: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`size='xs'` (16px) — for inline colour hints in table cells, badge-adjacent labels, and compact metadata strips.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      {QEET_PALETTE.map(({ color, label }) => (
        <ColorSwatch key={color} color={color} label={label} size="xs" />
      ))}
    </div>
  ),
};

export const SizeSm: Story = {
  parameters: {
    docs: {
      description: {
        story: "`size='sm'` (20px) — for compact pickers embedded in sidebars or settings panels.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      {QEET_PALETTE.map(({ color, label }) => (
        <ColorSwatch key={color} color={color} label={label} size="sm" />
      ))}
    </div>
  ),
};

export const SizeMd: Story = {
  parameters: {
    docs: {
      description: {
        story: "`size='md'` (24px) — the default; right-sized for most palette pickers.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      {QEET_PALETTE.map(({ color, label }) => (
        <ColorSwatch key={color} color={color} label={label} size="md" />
      ))}
    </div>
  ),
};

export const SizeLg: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`size='lg'` (32px) — for prominent selection UIs such as onboarding theme pickers or brand customisation panels.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      {QEET_PALETTE.map(({ color, label }) => (
        <ColorSwatch key={color} color={color} label={label} size="lg" />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "All four size tokens side by side — `xs`, `sm`, `md`, `lg`.",
      },
    },
  },
  render: () => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <ColorSwatch color="#F26D0E" label={`Qeet orange — ${size}`} size={size} />
          <code className="text-xs text-muted-foreground">{size}</code>
        </div>
      ))}
    </div>
  ),
};

export const GroupGallery: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`ColorSwatchGroup` wraps swatches in a `<fieldset>` with `aria-label='Color swatches'` — the correct landmark for a grouped set of related colour choices. This example builds a single-select brand-colour picker: click a swatch to select it, and its `aria-pressed` state updates.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = React.useState<string | null>("#F26D0E");
    return (
      <div className="flex flex-col gap-3">
        <ColorSwatchGroup>
          {QEET_PALETTE.map(({ color, label }) => (
            <ColorSwatch
              key={color}
              color={color}
              label={label}
              size="lg"
              selected={selected === color}
              onClick={() => setSelected(color === selected ? null : color)}
            />
          ))}
        </ColorSwatchGroup>
        <p className="text-xs text-muted-foreground">
          Selected: <code className="bg-muted px-1 rounded">{selected ?? "none"}</code>
        </p>
      </div>
    );
  },
};

export const ReadOnlyPalette: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Display-only `ColorSwatchGroup` — no `onClick`, no selection state. Use in brand-guide pages, token documentation, and colour foundation galleries.",
      },
    },
  },
  render: () => (
    <ColorSwatchGroup>
      {QEET_PALETTE.map(({ color, label }) => (
        <ColorSwatch key={color} color={color} label={label} size="md" />
      ))}
    </ColorSwatchGroup>
  ),
};
