import { Badge, Card, QeetrixProvider, Stack, Table, type TableColumn, Text } from "@qeetrix/react";
import { Pagination, type PaginationProps } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, within } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Pagination> = {
  title: "Components/Navigation/Pagination",
  component: Pagination,
  parameters: {
    qeetrix: qx({ category: "navigation", status: "experimental" }),
    layout: "padded",
  },
  args: {
    offset: 25,
    pageSize: 25,
    total: 1284,
    onOffsetChange: fn(),
  },
  render: (args) => (
    <div style={{ inlineSize: 680 }}>
      <Pagination {...args} />
    </div>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Playground: Story = {};

const STATES: { label: string; props: Partial<PaginationProps> }[] = [
  { label: "First page", props: { offset: 0 } },
  { label: "Loading", props: { loading: true } },
  { label: "Empty", props: { offset: 0, total: 0 } },
];

export const States: Story = {
  render: (args) => (
    <Stack gap="lg" style={{ inlineSize: 680 }}>
      {STATES.map(({ label, props }) => (
        <Stack key={label} gap="xs">
          <Text size="sm" tone="subtle">
            {label}
          </Text>
          {/* Each bar is a navigation landmark: give each its own name. */}
          <Pagination {...args} {...props} messages={{ label: `Pagination, ${label}` }} />
        </Stack>
      ))}
    </Stack>
  ),
};

export const WithoutTotal: Story = {
  name: "Without a total",
  parameters: {
    docs: {
      description: { story: "For APIs that don't count: Next stays on while pages are full." },
    },
  },
  args: { offset: 50, total: undefined, itemsOnPage: 25 },
};

export const RowsPerPage: Story = {
  name: "Rows per page",
  args: { offset: 0, pageSizes: [25, 50, 100], onPageSizeChange: fn() },
};

interface User {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Invited" | "Suspended";
}

const FIRST = ["Priya", "Rahul", "Ananya", "Vikram", "Meera", "Arjun", "Kavya", "Rohan", "Sneha"];
const LAST = ["Sharma", "Verma", "Iyer", "Nair", "Reddy", "Gupta", "Menon", "Joshi", "Rao"];
const STATUSES: User["status"][] = ["Active", "Active", "Active", "Invited", "Suspended"];

/** 137 users of Acme Pvt Ltd, the same on every render. */
const USERS: User[] = Array.from({ length: 137 }, (_, index) => {
  const first = FIRST[index % FIRST.length] as string;
  const last = LAST[(index * 4 + Math.floor(index / FIRST.length)) % LAST.length] as string;
  return {
    id: `usr_${String(index + 1).padStart(4, "0")}`,
    name: `${first} ${last}`,
    email: `${first}.${last}${index > 8 ? index : ""}@acme.in`.toLowerCase(),
    status: STATUSES[index % STATUSES.length] as User["status"],
  };
});

const TONE = { Active: "success", Invited: "info", Suspended: "danger" } as const;

const COLUMNS: TableColumn<User>[] = [
  { id: "name", header: "Name", cell: (user) => user.name },
  { id: "email", header: "Email", cell: (user) => user.email },
  {
    id: "status",
    header: "Status",
    cell: (user) => <Badge tone={TONE[user.status]}>{user.status}</Badge>,
  },
];

/** A server-paged list: the page of rows and the bar move together. */
function UsersCard({ pageSize: initialSize = 5 }: { pageSize?: number }) {
  const [offset, setOffset] = useState(0);
  const [pageSize, setPageSize] = useState(initialSize);
  return (
    <Card
      title="Users"
      level={2}
      footer={
        <Pagination
          offset={offset}
          pageSize={pageSize}
          total={USERS.length}
          onOffsetChange={setOffset}
          pageSizes={[5, 10, 25]}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setOffset(0);
          }}
        />
      }
    >
      <Table
        label="Users"
        rows={USERS.slice(offset, offset + pageSize)}
        rowId={(user) => user.id}
        rowLabel={(user) => user.name}
        columns={COLUMNS}
      />
    </Card>
  );
}

export const InContext: Story = {
  name: "In context",
  render: () => (
    <div style={{ inlineSize: 680 }}>
      <UsersCard />
    </div>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <div style={{ inlineSize: 680 }}>
      <QeetrixProvider locale="hi-IN" messages={hi}>
        <Pagination
          offset={0}
          pageSize={25}
          total={128400}
          pageSizes={[25, 50, 100]}
          onPageSizeChange={() => {}}
          onOffsetChange={() => {}}
        />
      </QeetrixProvider>
    </div>
  ),
  play: async ({ canvas }) => {
    const nav = canvas.getByRole("navigation", { name: "पेज नेविगेशन" });
    await expect(within(nav).getByRole("status")).toHaveTextContent("1,28,400 में से 1–25");
  },
};

export const StepInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: stepping through pages",
  render: () => (
    <div style={{ inlineSize: 680 }}>
      <UsersCard pageSize={10} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const nav = canvas.getByRole("navigation", { name: "Pagination" });
    const range = within(nav).getByRole("status");
    const button = (name: string) => within(nav).getByRole("button", { name });

    await expect(range).toHaveTextContent("1–10 of 137");
    await expect(button("Previous page")).toHaveAttribute("aria-disabled", "true");

    await userEvent.click(button("Next page"));
    await expect(range).toHaveTextContent("11–20 of 137");
    await expect(canvas.getByText(USERS[10]?.email as string)).toBeVisible();

    await userEvent.click(button("Last page"));
    await expect(range).toHaveTextContent("131–137 of 137");
    await expect(button("Next page")).toHaveAttribute("aria-disabled", "true");

    await userEvent.click(button("First page"));
    await expect(range).toHaveTextContent("1–10 of 137");
  },
};

export const PageSizeInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: changing rows per page",
  render: () => (
    <div style={{ inlineSize: 680 }}>
      <UsersCard pageSize={10} />
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const nav = canvas.getByRole("navigation", { name: "Pagination" });
    const range = within(nav).getByRole("status");

    await userEvent.click(within(nav).getByRole("button", { name: "Next page" }));
    await expect(range).toHaveTextContent("11–20 of 137");

    await userEvent.click(within(nav).getByRole("combobox", { name: "Rows per page" }));
    // The options open in a portal, outside the story's root.
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(await body.findByRole("option", { name: "25" }));
    await expect(range).toHaveTextContent("1–25 of 137");
  },
};

export const OpenEndedInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: without a total, a short page ends the list",
  args: { offset: 50, total: undefined, itemsOnPage: 7 },
  play: async ({ canvas }) => {
    const nav = canvas.getByRole("navigation", { name: "Pagination" });
    await expect(within(nav).getByRole("status")).toHaveTextContent("51–57");
    await expect(within(nav).getByRole("button", { name: "Next page" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(within(nav).queryByRole("button", { name: "Last page" })).toBeNull();
  },
};

export const RightToLeftInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the range reads right to left",
  render: (args) => (
    <QeetrixProvider direction="rtl">
      <div dir="rtl" style={{ inlineSize: 680 }}>
        <Pagination {...args} aria-label="Invoice pages" />
      </div>
    </QeetrixProvider>
  ),
  play: async ({ canvas }) => {
    // An aria-label renames the landmark.
    const nav = canvas.getByRole("navigation", { name: "Invoice pages" });
    const range = within(nav).getByRole("status");
    await expect(range).toHaveTextContent("26–50 of 1,284");
    // The range keeps its own reading order on a right-to-left page: 26, then 50, then 1,284.
    await expect(getComputedStyle(range).direction).toBe("ltr");
    const [start = 0, end = 0, total = 0] = [...range.querySelectorAll("bdi")].map(
      (number) => number.getBoundingClientRect().left,
    );
    await expect(start).toBeLessThan(end);
    await expect(end).toBeLessThan(total);
  },
};
