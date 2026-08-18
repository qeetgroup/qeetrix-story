import { type ActiveFilter, FilterBar, type FilterField } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const FIELDS: FilterField[] = [
  {
    key: "level",
    label: "Level",
    options: [
      { label: "Error", value: "error" },
      { label: "Warning", value: "warning" },
      { label: "Info", value: "info" },
    ],
  },
  { key: "service", label: "Service" },
  {
    key: "env",
    label: "Environment",
    options: [
      { label: "Production", value: "prod" },
      { label: "Staging", value: "staging" },
    ],
  },
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Archived", value: "archived" },
    ],
  },
];

const meta: Meta<typeof FilterBar> = {
  title: "Primitives/FilterBar",
  component: FilterBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Faceted filter bar used in qeet-logs and qeet-pay table views. Active filters render as removable `Chip` elements; clicking 'Add filter' opens a field → operator → value builder. Fully controlled via `value` / `onValueChange` so the parent owns query state.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "qeet-logs log stream view — pre-seeded with a level:error filter; click 'Add filter' to layer on service or environment constraints.",
      },
    },
  },
  render: () => {
    const [filters, setFilters] = React.useState<ActiveFilter[]>([
      { field: "level", operator: "is", value: "error" },
      { field: "env", operator: "is", value: "prod" },
    ]);
    return <FilterBar fields={FIELDS} value={filters} onValueChange={setFilters} />;
  },
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Empty state — no active filters applied; shows only the 'Add filter' trigger button.",
      },
    },
  },
  render: () => {
    const [filters, setFilters] = React.useState<ActiveFilter[]>([]);
    return <FilterBar fields={FIELDS} value={filters} onValueChange={setFilters} />;
  },
};
