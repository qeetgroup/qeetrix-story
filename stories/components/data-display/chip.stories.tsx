import { Chip, ChipGroup } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof Chip> = {
  title: "Components/Data Display/Chip",
  component: Chip,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A compact selection control for filter bars, tag inputs, and scope pickers. Use `ChipGroup` to manage single or multi-select state; use `Chip` with `onRemove` for dismissible token lists. Three sizes (`sm` / `md` / `lg`) let Chips sit comfortably inside toolbars, drawers, and full-page filter panels.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const SingleSelect: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Single-select filter bar for a qeet-logs log stream. Exactly one chip is active at a time — clicking a new chip deselects the previous one. Stateful via `React.useState`; pass `value` + `onValueChange` to `ChipGroup`.",
      },
    },
  },
  render: () => {
    const [value, setValue] = React.useState("all");
    return (
      <ChipGroup value={value} onValueChange={(v) => setValue(v as string)}>
        <Chip value="all">All logs</Chip>
        <Chip value="errors">Errors</Chip>
        <Chip value="warnings">Warnings</Chip>
      </ChipGroup>
    );
  },
};

export const MultiSelect: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Multi-select team/scope filter for a qeet-people people directory. Multiple chips can be active simultaneously. Pass the `multiple` prop to `ChipGroup` and manage an array of selected values.",
      },
    },
  },
  render: () => {
    const [value, setValue] = React.useState<string[]>(["engineering"]);
    return (
      <ChipGroup multiple value={value} onValueChange={(v) => setValue(v as string[])}>
        <Chip value="engineering">Engineering</Chip>
        <Chip value="product">Product</Chip>
        <Chip value="design">Design</Chip>
        <Chip value="leadership">Leadership</Chip>
      </ChipGroup>
    );
  },
};

export const Removable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Dismissible OAuth scope chips for a Qeet ID API key. Each chip renders an ×-button via `onRemove`; removing all chips leaves an empty grant set. Wire to your form state to track the active scope list.",
      },
    },
  },
  render: () => {
    const [scopes, setScopes] = React.useState(["openid", "profile", "email"]);
    return (
      <div className="flex gap-2">
        {scopes.map((s) => (
          <Chip key={s} onRemove={() => setScopes((cur) => cur.filter((x) => x !== s))}>
            {s}
          </Chip>
        ))}
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Chip size="sm" selected>
        Small
      </Chip>
      <Chip size="md" selected>
        Medium
      </Chip>
      <Chip size="lg" selected>
        Large
      </Chip>
    </div>
  ),
};
