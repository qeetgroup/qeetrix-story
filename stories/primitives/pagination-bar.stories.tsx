import { Pagination } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Pagination> = {
  title: "Primitives/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A page-navigation control for large result sets. Accepts `total`, `pageSize`, `itemsOnPage`, `hasPrev`, and `hasNext` props and emits page-change events. Use it below any paginated list in Qeet products — audit log entries, qeet-logs event tables, Members lists, or qeet-people employee directories.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Mid-set page — previous and next both enabled, showing page 3 of 7 in a 138-item audit log.",
      },
    },
  },
  render: () => (
    <div className="w-136">
      <Pagination hasPrev hasNext itemsOnPage={20} pageSize={20} total={138} />
    </div>
  ),
};

export const FirstPage: Story = {
  parameters: {
    docs: {
      description: {
        story: "First page of results — `hasPrev` is false so the previous button is disabled.",
      },
    },
  },
  render: () => (
    <div className="w-136">
      <Pagination hasPrev={false} hasNext itemsOnPage={20} pageSize={20} total={138} />
    </div>
  ),
};

export const LastPage: Story = {
  parameters: {
    docs: {
      description: {
        story: "Final page — `hasNext` is false and `itemsOnPage` reflects the partial remainder.",
      },
    },
  },
  render: () => (
    <div className="w-136">
      <Pagination hasPrev hasNext={false} itemsOnPage={18} pageSize={20} total={138} />
    </div>
  ),
};
