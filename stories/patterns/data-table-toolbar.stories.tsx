import { QeetLogo } from "@qeetrix/icons";
import { AppWindowIcon } from "@qeetrix/icons/icons/app-window";
import { BuildingIcon } from "@qeetrix/icons/icons/building";
import { Columns3Icon } from "@qeetrix/icons/icons/columns-3";
import { DownloadIcon } from "@qeetrix/icons/icons/download";
import { FingerprintPatternIcon } from "@qeetrix/icons/icons/fingerprint-pattern";
import { HouseIcon } from "@qeetrix/icons/icons/house";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { LayoutGridIcon } from "@qeetrix/icons/icons/layout-grid";
import { LifeBuoyIcon } from "@qeetrix/icons/icons/life-buoy";
import { ListFilterIcon } from "@qeetrix/icons/icons/list-filter";
import { MonitorSmartphoneIcon } from "@qeetrix/icons/icons/monitor-smartphone";
import { PlusIcon } from "@qeetrix/icons/icons/plus";
import { ScrollTextIcon } from "@qeetrix/icons/icons/scroll-text";
import { SearchIcon } from "@qeetrix/icons/icons/search";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { ShieldUserIcon } from "@qeetrix/icons/icons/shield-user";
import { UserGroupIcon } from "@qeetrix/icons/icons/user-group";
import { UsersIcon } from "@qeetrix/icons/icons/users";
import { WebhookIcon } from "@qeetrix/icons/icons/webhook";
import {
  Avatar,
  Badge,
  Button,
  Card,
  formatNumber,
  formatRelativeTime,
  IconButton,
  Inline,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Select,
  Stack,
  Table,
  type TableColumn,
  type TableSort,
} from "@qeetrix/react";
import {
  type AppliedFilter,
  AppShell,
  AvatarItem,
  Breadcrumb,
  BreadcrumbItem,
  EmptyState,
  FilterTags,
  PageContent,
  PageHeader,
  Pagination,
  SearchField,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  TopBar,
  TopBarSearch,
  TopBarSwitcher,
} from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, type ReactNode, useRef, useState } from "react";
import { expect, waitFor, within } from "storybook/test";

/**
 * The console's router link, in miniature: it handles the click itself. Storybook's preview sets
 * `<base target="_parent">`, so a plain `#` link would leave the workshop.
 */
function RouterLink({ href, onClick, ...props }: ComponentProps<"a">) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault();
      }}
    />
  );
}

/** For every in-page link: Sidebar, Breadcrumb and TopBar items take it as `render`. */
const route = <RouterLink />;

/** The Qeet ID console frame (qeetrix-react's `tests/fixtures/qeet-id-console.tsx`). */
function ConsoleFrame({ children }: { children: ReactNode }) {
  return (
    <AppShell
      topBar={
        <TopBar
          launcher={<IconButton icon={LayoutGridIcon} aria-label="Qeet products" tone="neutral" />}
          logo={<QeetLogo variant="dark" height={20} />}
          product="Qeet ID"
          href="#home"
          render={route}
          context={
            <>
              <Menu>
                <MenuTrigger render={<TopBarSwitcher mark="AC" label="Acme Pvt Ltd" />} />
                <MenuContent>
                  <MenuItem>Acme Pvt Ltd</MenuItem>
                  <MenuItem>Acme Labs</MenuItem>
                </MenuContent>
              </Menu>
              <TopBarSwitcher status="success" label="Production" />
            </>
          }
          search={<TopBarSearch placeholder="Search or jump to…" shortcut={["⌘", "K"]} />}
          account={<Avatar name="Priya Sharma" size="sm" />}
        />
      }
      sidebar={
        <Sidebar
          label="Qeet ID"
          footer={
            <SidebarGroup>
              <SidebarItem label="Settings" href="#settings" render={route} icon={SettingsIcon} />
              <SidebarItem label="Help and docs" href="#help" render={route} icon={LifeBuoyIcon} />
            </SidebarGroup>
          }
        >
          <SidebarGroup>
            <SidebarItem label="Overview" href="#overview" render={route} icon={HouseIcon} />
          </SidebarGroup>
          <SidebarGroup label="Directory">
            <SidebarItem
              label="Users"
              href="#users"
              render={route}
              icon={UsersIcon}
              filledWhenCurrent
              current
              badge={USERS.length}
            />
            <SidebarItem
              label="Groups"
              href="#groups"
              render={route}
              icon={UserGroupIcon}
              badge="6"
            />
            <SidebarItem label="Organisations" href="#orgs" render={route} icon={BuildingIcon} />
          </SidebarGroup>
          <SidebarGroup label="Access">
            <SidebarItem
              label="Applications"
              href="#apps"
              render={route}
              icon={AppWindowIcon}
              badge="12"
            />
            <SidebarItem label="Roles" href="#roles" render={route} icon={ShieldUserIcon} />
          </SidebarGroup>
          <SidebarGroup label="Security">
            <SidebarItem
              label="Authentication"
              href="#authn"
              render={route}
              icon={FingerprintPatternIcon}
            />
            <SidebarItem
              label="Sessions"
              href="#sessions"
              render={route}
              icon={MonitorSmartphoneIcon}
            />
            <SidebarItem label="Audit logs" href="#audit" render={route} icon={ScrollTextIcon} />
          </SidebarGroup>
          <SidebarGroup label="Developers">
            <SidebarItem label="API keys" href="#keys" render={route} icon={KeyRoundIcon} />
            <SidebarItem label="Webhooks" href="#webhooks" render={route} icon={WebhookIcon} />
          </SidebarGroup>
        </Sidebar>
      }
    >
      {children}
    </AppShell>
  );
}

/* ── The users: 36 people in Acme Pvt Ltd, searched, filtered and paged here ─────────────────── */

/** A fixed "now", so relative times read the same in every run. */
const NOW = Date.UTC(2026, 9, 25, 9, 30);

type Status = "Active" | "Invited" | "Blocked";
type Mfa = "Passkey" | "Authenticator" | "SMS" | "—";

interface User {
  id: string;
  name: string;
  email: string;
  status: Status;
  mfa: Mfa;
  department: string;
  lastSignIn: number;
}

const NAMES = [
  "Priya Sharma",
  "Rahul Verma",
  "Ananya Iyer",
  "Karthik Reddy",
  "Meera Nair",
  "Arjun Mehta",
  "Sneha Kulkarni",
  "Vikram Singh",
  "Fatima Shaikh",
  "Rohan Das",
  "Divya Pillai",
  "Aditya Joshi",
  "Kavya Menon",
  "Siddharth Rao",
  "Neha Gupta",
  "Imran Khan",
  "Pooja Desai",
  "Harsh Patel",
  "Lakshmi Krishnan",
  "Manish Agarwal",
  "Ishita Banerjee",
  "Varun Malhotra",
  "Deepa Hegde",
  "Nikhil Chauhan",
  "Riya Kapoor",
  "Suresh Babu",
  "Tanvi Bhatt",
  "Abhishek Mishra",
  "Shreya Ghosh",
  "Gaurav Saxena",
  "Anjali Thakur",
  "Rajesh Kumar",
  "Nandini Subramanian",
  "Kunal Bose",
  "Swati Jain",
  "Mohit Arora",
];

const DEPARTMENTS = [
  "Engineering",
  "Finance",
  "Sales",
  "People",
  "Support",
  "Design",
  "Operations",
  "Legal",
];
const METHODS: Mfa[] = ["Passkey", "Passkey", "Authenticator", "Passkey", "SMS"];

const USERS: User[] = NAMES.map((name, i) => {
  const status: Status =
    i % 9 === 3 || i % 11 === 8 ? "Invited" : i % 13 === 5 ? "Blocked" : "Active";
  return {
    id: `usr_${String(i + 1).padStart(3, "0")}`,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@acme.in`,
    status,
    mfa: status === "Invited" ? "—" : (METHODS[i % METHODS.length] as Mfa),
    department: DEPARTMENTS[i % DEPARTMENTS.length] as string,
    lastSignIn: NOW - (2 + i * i * 41) * 60_000,
  };
});

const TONE = { Active: "success", Invited: "info", Blocked: "danger" } as const;

/** Each row opens Patterns/User detail. */
const USER_DETAIL = "./?path=/story/patterns-user-detail--default";

/** A link to another story, opened in the top window: in the Storybook iframe it would nest. */
function StoryLink(props: ComponentProps<"a">) {
  return <a target="_top" {...props} />;
}

const COLUMNS: TableColumn<User>[] = [
  {
    id: "name",
    header: "Name",
    sortable: true,
    primary: true,
    cell: (user) => <AvatarItem name={user.name} description={user.email} />,
  },
  {
    id: "status",
    header: "Status",
    cell: (user) => <Badge tone={TONE[user.status]}>{user.status}</Badge>,
  },
  { id: "mfa", header: "MFA", cell: (user) => user.mfa },
  { id: "department", header: "Department", cell: (user) => user.department },
  {
    id: "lastSignIn",
    header: "Last sign-in",
    align: "end",
    sortable: true,
    sortFirst: "descending",
    cell: (user) => formatRelativeTime(user.lastSignIn, "en-IN", NOW),
  },
];

const STATUS_ITEMS = [
  { value: "any", label: "Status: Any" },
  { value: "Active", label: "Active" },
  { value: "Invited", label: "Invited" },
  { value: "Blocked", label: "Blocked" },
];

const MFA_ITEMS = [
  { value: "any", label: "MFA: Any" },
  { value: "Passkey", label: "Passkey" },
  { value: "Authenticator", label: "Authenticator" },
  { value: "SMS", label: "SMS" },
];

const PAGE_SIZE = 12;

/** The server's sort, done here: the Table holds the sort, and the rows arrive sorted. */
function sortUsers(users: User[], sort: TableSort | null): User[] {
  if (!sort) return users;
  const sign = sort.direction === "ascending" ? 1 : -1;
  return [...users].sort((a, b) =>
    sort.column === "name"
      ? sign * a.name.localeCompare(b.name, "en-IN")
      : sign * (a.lastSignIn - b.lastSignIn),
  );
}

interface UsersPageProps {
  /** The text in the search field. */
  query?: string;
  status?: string;
  mfa?: string;
  departments?: string[];
  /** Rows chosen on the first render. */
  defaultSelected?: string[];
}

/** Directory › Users: one Table in a Card, filters in its toolbar, Pagination in the footer. */
function UsersPage({
  query: initialQuery = "",
  status: initialStatus = "any",
  mfa: initialMfa = "any",
  departments: initialDepartments = [],
  defaultSelected,
}: UsersPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState(initialStatus);
  const [mfa, setMfa] = useState(initialMfa);
  const [departments, setDepartments] = useState(initialDepartments);
  const [sort, setSort] = useState<TableSort | null>({
    column: "lastSignIn",
    direction: "descending",
  });
  const [offset, setOffset] = useState(0);
  const search = useRef<HTMLInputElement>(null);

  const needle = query.trim().toLowerCase();
  const matching = sortUsers(
    USERS.filter(
      (user) =>
        (!needle || `${user.name} ${user.email} ${user.id}`.toLowerCase().includes(needle)) &&
        (status === "any" || user.status === status) &&
        (mfa === "any" || user.mfa === mfa) &&
        (departments.length === 0 || departments.includes(user.department)),
    ),
    sort,
  );
  const rows = matching.slice(offset, offset + PAGE_SIZE);
  const narrowed = Boolean(needle) || status !== "any" || mfa !== "any" || departments.length > 0;

  // Any change to what's asked for goes back to the first page.
  const refine =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setOffset(0);
    };

  const applied: AppliedFilter[] = [
    ...(status === "any" ? [] : [{ id: "status", label: "Status", value: status }]),
    ...(mfa === "any" ? [] : [{ id: "mfa", label: "MFA", value: mfa }]),
    ...(departments.length === 0
      ? []
      : [{ id: "department", label: "Department", value: departments.join(", ") }]),
  ];

  const toolbar = (
    <Stack gap="sm" style={{ flex: 1 }}>
      <Inline gap="sm" justify="between">
        <Inline gap="sm">
          <SearchField
            ref={search}
            aria-label="Search users"
            placeholder="Search by name, email or ID"
            value={query}
            onValueChange={refine(setQuery)}
            style={{ inlineSize: 300 }}
          />
          <Select
            aria-label="Status"
            items={STATUS_ITEMS}
            value={status}
            onValueChange={(value) => refine(setStatus)(value ?? "any")}
            style={{ inlineSize: 140 }}
          />
          <Select
            aria-label="MFA"
            items={MFA_ITEMS}
            value={mfa}
            onValueChange={(value) => refine(setMfa)(value ?? "any")}
            style={{ inlineSize: 160 }}
          />
          <Menu>
            <MenuTrigger
              render={
                <Button variant="ghost" tone="neutral" size="lg" icon={ListFilterIcon}>
                  More filters
                </Button>
              }
            />
            <MenuContent>
              <MenuGroup>
                <MenuGroupLabel>Department</MenuGroupLabel>
                {DEPARTMENTS.map((department) => (
                  <MenuCheckboxItem
                    key={department}
                    checked={departments.includes(department)}
                    onCheckedChange={(checked) =>
                      refine(setDepartments)(
                        checked
                          ? [...departments, department]
                          : departments.filter((d) => d !== department),
                      )
                    }
                  >
                    {department}
                  </MenuCheckboxItem>
                ))}
              </MenuGroup>
            </MenuContent>
          </Menu>
        </Inline>
        <Inline gap="xs">
          <IconButton icon={Columns3Icon} aria-label="Columns" tone="neutral" size="lg" />
          <IconButton icon={DownloadIcon} aria-label="Download CSV" tone="neutral" size="lg" />
        </Inline>
      </Inline>
      <FilterTags
        filters={applied}
        onRemove={(id) => {
          if (id === "status") setStatus("any");
          if (id === "mfa") setMfa("any");
          if (id === "department") setDepartments([]);
          setOffset(0);
        }}
        onClear={() => {
          setStatus("any");
          setMfa("any");
          setDepartments([]);
          setOffset(0);
        }}
        // Only while narrowed: with a summary, FilterTags shows even with no tags.
        summary={
          narrowed
            ? `${formatNumber(matching.length, "en-IN")} of ${formatNumber(USERS.length, "en-IN")} users`
            : undefined
        }
        returnFocusTo={search}
      />
    </Stack>
  );

  const empty = (
    <EmptyState
      size="section"
      icon={SearchIcon}
      title={needle ? `No users match “${query.trim()}”` : "No users match these filters"}
      description="Search covers names, emails and user IDs."
      actions={
        <Button
          variant="soft"
          onClick={() => {
            setQuery("");
            setStatus("any");
            setMfa("any");
            setDepartments([]);
          }}
        >
          Clear search and filters
        </Button>
      }
    />
  );

  return (
    <ConsoleFrame>
      <PageHeader
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbItem href="#directory" render={route}>
              Directory
            </BreadcrumbItem>
            <BreadcrumbItem current>Users</BreadcrumbItem>
          </Breadcrumb>
        }
        title="Users"
        count={USERS.length}
        description="People who can sign in to Acme Pvt Ltd's applications."
        actions={
          <>
            <Button variant="soft" icon={DownloadIcon}>
              Export
            </Button>
            <Button icon={PlusIcon}>Invite users</Button>
          </>
        }
      />
      <PageContent>
        <Card
          footer={
            rows.length > 0 ? (
              <Pagination
                offset={offset}
                pageSize={PAGE_SIZE}
                total={matching.length}
                onOffsetChange={setOffset}
              />
            ) : undefined
          }
        >
          <Table
            label="Users"
            rows={rows}
            empty={empty}
            rowId={(user) => user.id}
            rowLabel={(user) => user.name}
            renderRowLink={() => <StoryLink href={USER_DETAIL} />}
            columns={COLUMNS}
            sort={sort}
            onSortChange={setSort}
            selectable
            defaultSelected={defaultSelected}
            toolbar={toolbar}
            bulkActions={(ids) => (
              <>
                <Button size="sm" variant="soft" tone="neutral">
                  Reset MFA
                </Button>
                <Button size="sm" variant="ghost" tone="neutral" icon={DownloadIcon}>
                  Export {ids.length}
                </Button>
                <Button size="sm" variant="soft" tone="danger">
                  Suspend
                </Button>
              </>
            )}
            rowActions={(user) => (
              <>
                <MenuItem>Reset MFA</MenuItem>
                <MenuItem>Resend invitation</MenuItem>
                <MenuSeparator />
                <MenuItem tone="danger">Suspend {user.name}</MenuItem>
              </>
            )}
          />
        </Card>
      </PageContent>
    </ConsoleFrame>
  );
}

const meta: Meta = {
  title: "Patterns/Users table",
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, iframeHeight: 900 },
      description: { component: "Search, filters and bulk actions above a Qeet ID list." },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <UsersPage />,
};

export const WithActiveFilters: Story = {
  name: "With active filters",
  render: () => (
    <UsersPage status="Active" mfa="Passkey" departments={["Engineering", "Finance"]} />
  ),
};

export const BulkSelection: Story = {
  name: "Bulk selection",
  render: () => <UsersPage defaultSelected={["usr_002", "usr_003", "usr_005"]} />,
};

export const SearchAndFilters: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: search, then remove the filters",
  render: () => <UsersPage status="Active" mfa="Passkey" />,
  play: async ({ canvas, userEvent }) => {
    const table = canvas.getByRole("table", { name: "Users" });
    await userEvent.type(canvas.getByRole("searchbox", { name: "Search users" }), "sharma");
    await waitFor(() => expect(within(table).getAllByRole("row")).toHaveLength(2));
    await expect(within(table).getByText("Priya Sharma")).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }));
    await userEvent.click(canvas.getByRole("button", { name: "Remove filter Status: Active" }));
    // Focus moves on to the next tag; removing the last returns it to the search field.
    const mfa = canvas.getByRole("button", { name: "Remove filter MFA: Passkey" });
    await waitFor(() => expect(mfa).toHaveFocus());
    await userEvent.keyboard("{Enter}");
    await waitFor(() =>
      expect(canvas.getByRole("searchbox", { name: "Search users" })).toHaveFocus(),
    );
    await expect(canvas.queryByRole("list", { name: "Applied filters" })).toBeNull();
  },
};

export const SelectAll: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: select the page, then clear",
  render: () => <UsersPage />,
  play: async ({ canvas, userEvent }) => {
    const selectAll = canvas.getByRole("checkbox", { name: "Select all rows" });
    await userEvent.click(selectAll);
    // The count shows in the bar, and a hidden live region announces it.
    await waitFor(() => expect(canvas.getAllByText("12 selected")[0]).toBeVisible());
    await expect(canvas.getByRole("button", { name: "Export 12" })).toBeVisible();
    // The toolbar is replaced while rows are selected, and comes back after Clear selection.
    await expect(canvas.queryByRole("searchbox", { name: "Search users" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Clear selection" }));
    await waitFor(() => expect(selectAll).toHaveFocus());
    await expect(canvas.getByRole("searchbox", { name: "Search users" })).toBeVisible();
  },
};

export const NextPage: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: page through the users",
  render: () => <UsersPage />,
  play: async ({ canvas, userEvent }) => {
    const nav = canvas.getByRole("navigation", { name: "Pagination" });
    await expect(within(nav).getByRole("status")).toHaveTextContent("1–12 of 36");
    await userEvent.click(within(nav).getByRole("button", { name: "Next page" }));
    await waitFor(() => expect(within(nav).getByRole("status")).toHaveTextContent("13–24 of 36"));
  },
};

export const RowOpensUser: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a row links to the user",
  render: () => <UsersPage />,
  play: async ({ canvas }) => {
    const row = canvas.getByRole("row", { name: /Rahul Verma/ });
    // The name cell holds the row's one link. Not clicked: it opens in the top window.
    const links = within(row).getAllByRole("link");
    await expect(links).toHaveLength(1);
    await expect(links[0]).toHaveAccessibleName(expect.stringContaining("Rahul Verma"));
    await expect(links[0]).toHaveAttribute("href", USER_DETAIL);
    await expect(links[0]).toHaveAttribute("target", "_top");
    await expect(row).toHaveAttribute("data-clickable");
  },
};
