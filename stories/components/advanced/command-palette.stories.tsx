import { Button, CommandPalette, type CommandPaletteItem } from "@qeetrix/ui";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof CommandPalette> = {
  title: "Components/Advanced/CommandPalette",
  component: CommandPalette,
  parameters: {
    qeetrix: qx({ category: "advanced", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A keyboard-driven command palette (⌘K) for fast navigation and action dispatch. Accepts a flat list of `CommandPaletteItem` objects organised into named groups — navigate to any Qeet ID screen or trigger global actions like creating an API key or inviting a teammate without reaching for the mouse.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CommandPalette>;

const items: CommandPaletteItem[] = [
  { id: "overview", title: "Overview", group: "Navigate" },
  { id: "members", title: "Members", group: "Navigate" },
  { id: "api-keys", title: "API keys", group: "Navigate" },
  { id: "webhooks", title: "Webhooks", group: "Navigate" },
  { id: "audit", title: "Audit log", group: "Navigate" },
  { id: "billing", title: "Billing", group: "Navigate" },
  { id: "new-key", title: "Create API key", group: "Actions" },
  { id: "invite", title: "Invite teammate", group: "Actions" },
  { id: "rotate-key", title: "Rotate signing key", group: "Actions" },
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Palette pre-opened with Qeet ID navigation and action commands — press ⌘K in-app to summon it.",
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="flex h-72 items-start justify-center">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open palette (⌘K)
        </Button>
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          items={items}
          onSelect={() => setOpen(false)}
        />
      </div>
    );
  },
};
