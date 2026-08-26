import { Pagination } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Pagination> = {
  title: "Components/Navigation/Pagination",
  component: Pagination,
  parameters: {
    qeetrix: qx({ category: "navigation", status: "stable" }),
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

export const NextPageInteraction: Story = {
  name: "Interaction: advancing a page",
  parameters: {
    docs: {
      description: {
        story:
          "Pagination is a controlled component — it renders no page state of its own and calls `onNext`/`onPrev` for the consumer to act on. This drives it from real state so the wiring, not just the markup, is exercised.",
      },
    },
  },
  render: () => {
    const [page, setPage] = React.useState(1);
    return (
      <div className="w-136">
        <Pagination
          hasPrev={page > 1}
          hasNext={page < 7}
          onNext={() => setPage((p) => p + 1)}
          onPrev={() => setPage((p) => p - 1)}
          label={`Page ${page} of 7`}
        />
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText("Page 1 of 7")).toBeVisible();

    const next = canvas.getByRole("button", { name: /next/i });
    await userEvent.click(next);

    await expect(canvas.getByText("Page 2 of 7")).toBeVisible();

    const prev = canvas.getByRole("button", { name: /prev/i });
    await userEvent.click(prev);

    await expect(canvas.getByText("Page 1 of 7")).toBeVisible();
  },
};
