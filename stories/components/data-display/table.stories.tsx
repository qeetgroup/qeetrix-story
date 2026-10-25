import { DownloadIcon } from "@qeetrix/icons/icons/download";
import { PlusIcon } from "@qeetrix/icons/icons/plus";
import { UsersIcon } from "@qeetrix/icons/icons/users";
import {
  Badge,
  Button,
  Card,
  formatRelativeTime,
  IconButton,
  Inline,
  MenuItem,
  MenuSeparator,
  QeetrixProvider,
  Stack,
  Table,
  type TableColumn,
  type TableSort,
  Text,
} from "@qeetrix/react";
import {
  AvatarItem,
  DataState,
  EmptyState,
  Pagination,
  SearchField,
} from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { expect, fn, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

/** A fixed "now", so relative times read the same in every run. */
const NOW = Date.UTC(2026, 9, 25, 9, 30);
const minutes = (n: number) => NOW - n * 60_000;

type Status = "Active" | "Invited" | "Blocked";

interface User {
  name: string;
  email: string;
  status: Status;
  mfa: string;
  department: string;
  lastSignIn: number;
}

const user = (
  name: string,
  email: string,
  status: Status,
  mfa: string,
  department: string,
  lastSignIn: number,
): User => ({ name, email, status, mfa, department, lastSignIn });

/** The Qeet ID console's Users page (qeetrix-react tests/fixtures/qeet-id-console.tsx). */
const USERS: User[] = [
  user("Priya Sharma", "priya@acme.in", "Active", "Passkey", "Engineering", minutes(2)),
  user("Rahul Verma", "rahul.verma@acme.in", "Active", "Passkey", "Finance", minutes(18)),
  user("Ananya Iyer", "ananya@acme.in", "Active", "Authenticator", "Engineering", minutes(64)),
  user("Karthik Reddy", "karthik.r@acme.in", "Invited", "—", "Sales", minutes(180)),
  user("Meera Nair", "meera.nair@acme.in", "Active", "Passkey", "People", minutes(26 * 60)),
  user("Arjun Mehta", "arjun@acme.in", "Blocked", "Authenticator", "Support", minutes(3 * 1440)),
  user("Sneha Kulkarni", "sneha.k@acme.in", "Active", "Passkey", "Design", minutes(5 * 1440)),
  user("Vikram Singh", "vikram.singh@acme.in", "Active", "SMS", "Operations", minutes(8 * 1440)),
  user("Fatima Shaikh", "fatima@acme.in", "Invited", "—", "Legal", minutes(9 * 1440)),
  user("Rohan Das", "rohan.das@acme.in", "Active", "Passkey", "Engineering", minutes(12 * 1440)),
  user("Divya Pillai", "divya@acme.in", "Active", "Authenticator", "Finance", minutes(20 * 1440)),
  user("Aditya Joshi", "aditya.j@acme.in", "Active", "Passkey", "Sales", minutes(31 * 1440)),
];

const TONE = { Active: "success", Invited: "info", Blocked: "danger" } as const;

const COLUMNS: TableColumn<User>[] = [
  {
    id: "name",
    header: "Name",
    sortable: true,
    cell: (row) => <AvatarItem name={row.name} description={row.email} />,
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => <Badge tone={TONE[row.status]}>{row.status}</Badge>,
  },
  { id: "mfa", header: "MFA", cell: (row) => row.mfa },
  { id: "department", header: "Department", cell: (row) => row.department },
  {
    id: "lastSignIn",
    header: "Last sign-in",
    align: "end",
    sortable: true,
    sortFirst: "descending",
    cell: (row) => formatRelativeTime(row.lastSignIn, "en-IN", NOW),
  },
];

/** The rows in a sort's order: what the server would send back. */
function sorted(rows: readonly User[], sort: TableSort | null): User[] {
  if (!sort) return [...rows];
  const sign = sort.direction === "ascending" ? 1 : -1;
  return [...rows].sort((a, b) =>
    sort.column === "name"
      ? sign * a.name.localeCompare(b.name, "en-IN")
      : sign * (a.lastSignIn - b.lastSignIn),
  );
}

const userActions = () => (
  <>
    <MenuItem>View profile</MenuItem>
    <MenuItem>Reset MFA</MenuItem>
    <MenuSeparator />
    <MenuItem tone="danger">Suspend</MenuItem>
  </>
);

/** Toolbar controls are the field height, so the icon button is `size="lg"`. */
const toolbar = (
  <Inline gap="md" justify="between" style={{ flex: 1 }}>
    <SearchField
      aria-label="Search users"
      placeholder="Search by name or email"
      style={{ inlineSize: 280 }}
    />
    <IconButton icon={DownloadIcon} aria-label="Download CSV" tone="neutral" size="lg" />
  </Inline>
);

const bulkActions = () => (
  <>
    <Button size="sm" variant="soft" tone="neutral">
      Reset MFA
    </Button>
    <Button size="sm" variant="soft" tone="danger">
      Suspend
    </Button>
  </>
);

const meta: Meta<typeof Table<User>> = {
  title: "Components/Data Display/Table",
  component: Table,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "padded",
  },
  args: {
    label: "Users",
    rows: USERS.slice(0, 5),
    rowId: (row) => row.email,
    rowLabel: (row) => row.name,
    columns: COLUMNS,
    selectable: false,
    loading: false,
    onSortChange: fn(),
    onSelectedChange: fn(),
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table<User>>;

export const Playground: Story = {};

/** Sorts the rows in place of the server, so the headers have something to do. */
function SortedUsers(props: { onSortChange?: (sort: TableSort | null) => void }) {
  const [sort, setSort] = useState<TableSort | null>({
    column: "lastSignIn",
    direction: "descending",
  });
  return (
    <Table
      label="Users"
      rows={sorted(USERS.slice(0, 5), sort)}
      rowId={(row) => row.email}
      rowLabel={(row) => row.name}
      columns={COLUMNS}
      sort={sort}
      onSortChange={(next) => {
        setSort(next);
        props.onSortChange?.(next);
      }}
    />
  );
}

export const Sorting: Story = {
  render: (args) => <SortedUsers onSortChange={args.onSortChange} />,
};

export const Selection: Story = {
  args: {
    selectable: true,
    defaultSelected: ["rahul.verma@acme.in", "karthik.r@acme.in"],
    bulkActions,
  },
};

/**
 * The console's router link, in miniature: like a router's `Link`, it handles the click itself.
 * Storybook sends a plain link to the parent frame, which would leave Storybook.
 */
function RouterLink({ to, onClick, ...props }: ComponentProps<"a"> & { to: string }) {
  return (
    <a
      {...props}
      href={to}
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault();
      }}
    />
  );
}

const userLink = (row: User) => <RouterLink to={`/users/${row.email}`} />;

export const ClickableRows: Story = {
  name: "Clickable rows",
  args: { renderRowLink: userLink, onRowClick: fn(), rowActions: userActions },
};

const STATE_COLUMNS = COLUMNS.filter((column) => column.id !== "mfa");

export const States: Story = {
  render: (args) => (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" tone="subtle">
          Loading
        </Text>
        <Table
          {...args}
          label="Users, loading"
          columns={STATE_COLUMNS}
          rows={[]}
          loading
          loadingRows={3}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="subtle">
          Refreshing
        </Text>
        <Table
          {...args}
          label="Users, refreshing"
          columns={STATE_COLUMNS}
          rows={USERS.slice(0, 3)}
          loading
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="subtle">
          Empty
        </Text>
        <Table
          {...args}
          label="Users, empty"
          columns={STATE_COLUMNS}
          rows={[]}
          empty={
            <EmptyState
              size="section"
              icon={UsersIcon}
              title="No users yet"
              description="Invite your team, or connect a directory."
              actions={<Button icon={PlusIcon}>Invite users</Button>}
            />
          }
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="subtle">
          Error
        </Text>
        <Table
          {...args}
          label="Users, failed"
          columns={STATE_COLUMNS}
          error={<DataState error="failed" onRetry={fn()} />}
        />
      </Stack>
    </Stack>
  ),
};

function UsersCard() {
  const [offset, setOffset] = useState(0);
  return (
    <Card
      footer={<Pagination offset={offset} pageSize={5} total={1284} onOffsetChange={setOffset} />}
    >
      <Table
        label="Users"
        rows={USERS.slice(0, 5)}
        rowId={(row) => row.email}
        rowLabel={(row) => row.name}
        columns={COLUMNS}
        selectable
        toolbar={toolbar}
        bulkActions={bulkActions}
        rowActions={userActions}
        renderRowLink={userLink}
      />
    </Card>
  );
}

export const InContext: Story = {
  name: "In context",
  render: () => <UsersCard />,
};

export const Refreshing: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: stale rows stay readable while loading",
  args: { loading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("table", { name: "Users" })).toHaveAttribute("aria-busy", "true");
    await expect(canvas.getByText("Priya Sharma")).toBeVisible();
    // The rows don't dim (that failed contrast); the busy line under the header shows instead.
    const row = canvas.getByRole("row", { name: /^Priya Sharma/ });
    await expect(getComputedStyle(row).opacity).toBe("1");
    await expect(canvas.getByText("Loading")).toBeInTheDocument();
  },
};

/** Where the clickable rows led, for the interaction below. */
const openUser = fn();

export const RowClickInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a click anywhere on a row opens it",
  args: { renderRowLink: userLink, onRowClick: openUser, rowActions: userActions },
  play: async ({ canvas, canvasElement, userEvent }) => {
    openUser.mockClear();
    const row = canvas.getByRole("row", { name: /^Rahul Verma/ });
    // The primary cell holds the row's one link.
    const links = within(row).getAllByRole("link");
    await expect(links).toHaveLength(1);
    await expect(links[0]).toHaveAccessibleName(/^Rahul Verma/);
    await expect(links[0]).toHaveAttribute("href", "/users/rahul.verma@acme.in");
    // The row's own controls don't open it.
    await userEvent.click(canvas.getByRole("button", { name: "Actions for Rahul Verma" }));
    const page = within(canvasElement.ownerDocument.body);
    await page.findByRole("menu");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("menu")).toBeNull());
    await expect(openUser).not.toHaveBeenCalled();
    // A click anywhere else on the row follows its link.
    await userEvent.click(within(row).getByRole("cell", { name: "Finance" }));
    await expect(openUser).toHaveBeenCalledTimes(1);
    await expect(openUser).toHaveBeenCalledWith(USERS[1]);
  },
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  args: {
    selectable: true,
    defaultSelected: ["priya@acme.in"],
    rowActions: userActions,
    bulkActions,
  },
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Table {...args} />
    </QeetrixProvider>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("checkbox", { name: "सभी पंक्तियाँ चुनें" })).toBeVisible();
    await expect(canvas.getByRole("checkbox", { name: "Priya Sharma चुनें" })).toBeChecked();
    await expect(
      canvas.getByRole("button", { name: "Priya Sharma के लिए कार्रवाइयाँ" }),
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: "चयन हटाएँ" })).toBeVisible();
  },
};

export const SortInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a header sorts one way, the other, then back",
  render: (args) => <SortedUsers onSortChange={args.onSortChange} />,
  play: async ({ args, canvas, userEvent }) => {
    const header = () => canvas.getByRole("columnheader", { name: "Name" });
    // Only sortable headers are buttons.
    await expect(canvas.queryByRole("button", { name: "Department" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Name" }));
    await expect(args.onSortChange).toHaveBeenLastCalledWith({
      column: "name",
      direction: "ascending",
    });
    await expect(header()).toHaveAttribute("aria-sort", "ascending");
    await expect(canvas.getAllByRole("row")[1]).toHaveTextContent("Ananya Iyer");
    await userEvent.click(canvas.getByRole("button", { name: "Name" }));
    await expect(header()).toHaveAttribute("aria-sort", "descending");
    await userEvent.click(canvas.getByRole("button", { name: "Name" }));
    await expect(args.onSortChange).toHaveBeenLastCalledWith(null);
    await expect(header()).not.toHaveAttribute("aria-sort");
  },
};

export const SelectInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: selecting rows swaps the toolbar for the bulk bar",
  args: { selectable: true, toolbar, bulkActions },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole("searchbox", { name: "Search users" })).toBeVisible();
    await userEvent.click(canvas.getByRole("checkbox", { name: "Select Priya Sharma" }));
    await userEvent.click(canvas.getByRole("checkbox", { name: "Select Rahul Verma" }));
    await expect(args.onSelectedChange).toHaveBeenLastCalledWith([
      "priya@acme.in",
      "rahul.verma@acme.in",
    ]);
    await expect(canvas.getByRole("checkbox", { name: "Select all rows" })).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
    await waitFor(() => expect(canvas.getAllByText("2 selected")[0]).toBeVisible());
    await expect(canvas.queryByRole("searchbox", { name: "Search users" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Clear selection" }));
    await expect(canvas.getByRole("searchbox", { name: "Search users" })).toBeVisible();
    // Clear hands focus back to the header checkbox.
    await expect(canvas.getByRole("checkbox", { name: "Select all rows" })).toHaveFocus();
  },
};

/** What the row menu's View profile did, for the interaction below. */
const viewProfile = fn();

export const RowActionsInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a row's menu is named for the row",
  args: {
    rowActions: (row) => (
      <>
        <MenuItem onClick={() => viewProfile(row.email)}>View profile</MenuItem>
        <MenuItem tone="danger">Suspend</MenuItem>
      </>
    ),
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    viewProfile.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Actions for Ananya Iyer" }));
    // The menu opens in a portal, outside the story's canvas.
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(await page.findByRole("menuitem", { name: "View profile" }));
    await expect(viewProfile).toHaveBeenCalledWith("ananya@acme.in");
    await waitFor(() => expect(page.queryByRole("menu")).toBeNull());
  },
};
