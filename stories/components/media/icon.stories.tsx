import {
  BellIcon,
  CheckIcon,
  LockIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  UserIcon,
  ZapIcon,
} from "@qeetrix/icons";
import { ICON_SIZE, ICON_STROKE, Icon } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Icon> = {
  title: "Components/Media/Icon",
  component: Icon,
  parameters: {
    qeetrix: qx({ category: "media", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Wrapper that places a `@qeetrix/icons` glyph onto the Qeetrix size and stroke scale. Decorative by default (`aria-hidden`); pass `title` for an accessible label. The scale mirrors `tokens/primitive/icon.json` — `xs` 14px · `sm` 16px · `md` 20px (default) · `lg` 24px.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Icon>;

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All four size tokens side by side. Use `md` (20px) in body copy and button labels; `lg` (24px) in standalone icon buttons and navigation; `sm` (16px) in compact rows; `xs` (14px) in badges and inline code.",
      },
    },
  },
  render: () => (
    <div className="flex items-end gap-6">
      {(Object.entries(ICON_SIZE) as [keyof typeof ICON_SIZE, number][]).map(([key, px]) => (
        <div key={key} className="flex flex-col items-center gap-2">
          <Icon icon={StarIcon} size={key} />
          <code className="text-xs text-muted-foreground">
            {key} · {px}px
          </code>
        </div>
      ))}
    </div>
  ),
};

export const Strokes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`regular` (2px) is the default stroke weight for the Icon wrapper. Use `thin` (1.5px) for display-scale icons inside hero headings or large stat tiles.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-8">
      {(Object.entries(ICON_STROKE) as [keyof typeof ICON_STROKE, number][]).map(([key, sw]) => (
        <div key={key} className="flex flex-col items-center gap-2">
          <Icon icon={ZapIcon} size="lg" stroke={key} />
          <code className="text-xs text-muted-foreground">
            {key} · {sw}px
          </code>
        </div>
      ))}
    </div>
  ),
};

export const Accessibility: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Without `title` the icon is `aria-hidden` (decorative — the surrounding text carries meaning). Pass `title` to make it a labelled image for stand-alone icon buttons or status indicators.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Icon icon={BellIcon} />
        <span className="text-foreground">Decorative — no title, aria-hidden</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon={LockIcon} title="Locked" />
        <span className="text-foreground">Labelled — title="Locked", role="img"</span>
      </div>
    </div>
  ),
};

export const Gallery: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Common Qeetrix icons at `md` size — the default configuration. Pass the icon component itself (not an element) as the `icon` prop.",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      {Object.entries({
        SearchIcon,
        BellIcon,
        UserIcon,
        SettingsIcon,
        CheckIcon,
        StarIcon,
        LockIcon,
        ZapIcon,
      }).map(([name, glyph]) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon icon={glyph} />
          <code className="text-xs text-muted-foreground">{name}</code>
        </div>
      ))}
    </div>
  ),
};

export const ExplicitPixelSize: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass a raw number when you need a size outside the token scale — e.g. fitting an icon inside a custom avatar or a non-standard button.",
      },
    },
  },
  render: () => (
    <div className="flex items-end gap-6">
      {[12, 18, 32, 48].map((px) => (
        <div key={px} className="flex flex-col items-center gap-2">
          <Icon icon={StarIcon} size={px} />
          <code className="text-xs text-muted-foreground">{px}px</code>
        </div>
      ))}
    </div>
  ),
};
