import { Skeleton } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Skeleton> = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Animated loading placeholder that mirrors the shape of incoming content — user cards, audit-event rows, or invoice tables. Compose multiple `<Skeleton>` elements with `className` to match your layout exactly; the pulse animation signals data is on its way.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Card: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "User card skeleton — avatar circle plus two text lines, mimicking a member row in qeet-people.",
      },
    },
  },
  render: () => (
    <div className="flex w-72 items-center gap-3">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
};

export const TableRow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Table row skeleton for audit-event or invoice lists while data loads from the server.",
      },
    },
  },
  render: () => (
    <div className="flex w-xl flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  ),
};
