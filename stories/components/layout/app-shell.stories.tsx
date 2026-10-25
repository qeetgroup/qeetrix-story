import { QeetLogo } from "@qeetrix/icons";
import { ActivityIcon } from "@qeetrix/icons/icons/activity";
import { AppWindowIcon } from "@qeetrix/icons/icons/app-window";
import { BuildingIcon } from "@qeetrix/icons/icons/building";
import { CircleQuestionMarkIcon } from "@qeetrix/icons/icons/circle-question-mark";
import { CodeXmlIcon } from "@qeetrix/icons/icons/code-xml";
import { Columns3Icon } from "@qeetrix/icons/icons/columns-3";
import { DownloadIcon } from "@qeetrix/icons/icons/download";
import { EyeIcon } from "@qeetrix/icons/icons/eye";
import { FingerprintPatternIcon } from "@qeetrix/icons/icons/fingerprint-pattern";
import { HouseIcon } from "@qeetrix/icons/icons/house";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { LayoutGridIcon } from "@qeetrix/icons/icons/layout-grid";
import { LifeBuoyIcon } from "@qeetrix/icons/icons/life-buoy";
import { ListFilterIcon } from "@qeetrix/icons/icons/list-filter";
import { MonitorSmartphoneIcon } from "@qeetrix/icons/icons/monitor-smartphone";
import { PlugIcon } from "@qeetrix/icons/icons/plug";
import { PlusIcon } from "@qeetrix/icons/icons/plus";
import { ScrollTextIcon } from "@qeetrix/icons/icons/scroll-text";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { ShieldCheckIcon } from "@qeetrix/icons/icons/shield-check";
import { ShieldUserIcon } from "@qeetrix/icons/icons/shield-user";
import { SparklesIcon } from "@qeetrix/icons/icons/sparkles";
import { UserGroupIcon } from "@qeetrix/icons/icons/user-group";
import { UsersIcon } from "@qeetrix/icons/icons/users";
import { WebhookIcon } from "@qeetrix/icons/icons/webhook";
import { WrenchIcon } from "@qeetrix/icons/icons/wrench";
import {
  Avatar,
  Badge,
  Button,
  Card,
  formatRelativeTime,
  IconButton,
  Inline,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  QeetrixProvider,
  Select,
  Stack,
  Tab,
  Table,
  Tabs,
  TabsList,
  Text,
} from "@qeetrix/react";
import {
  Alert,
  AppShell,
  type AppShellDrawer,
  AvatarItem,
  Breadcrumb,
  BreadcrumbItem,
  PageContent,
  PageHeader,
  Pagination,
  SearchField,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  Stat,
  StatGroup,
  TopBar,
  TopBarSearch,
  TopBarSwitcher,
} from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { expect, fn, screen, waitFor } from "storybook/test";
import { qx } from "../../_contract";

/**
 * The console's router link, in miniature: like a router's `Link`, it handles the click itself.
 * Storybook sends a plain link to the parent frame, which would leave Storybook.
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

const routerLink = <RouterLink />;

// The Qeet ID console frame, after qeetrix-react's tests/fixtures/qeet-id-console.tsx.

/** A fixed "now", so relative times read the same in every run. */
const NOW = Date.UTC(2026, 9, 25, 9, 30);
const minutesAgo = (n: number) => NOW - n * 60_000;

const USERS = [
  ["Priya Sharma", "priya@acme.in", "Active", "Passkey", "Engineering", minutesAgo(2)],
  ["Rahul Verma", "rahul.verma@acme.in", "Active", "Passkey", "Finance", minutesAgo(18)],
  ["Ananya Iyer", "ananya@acme.in", "Active", "Authenticator", "Engineering", minutesAgo(64)],
  ["Karthik Reddy", "karthik.r@acme.in", "Invited", "—", "Sales", minutesAgo(180)],
  ["Meera Nair", "meera.nair@acme.in", "Active", "Passkey", "People", minutesAgo(26 * 60)],
  ["Arjun Mehta", "arjun@acme.in", "Blocked", "Authenticator", "Support", minutesAgo(3 * 1440)],
  ["Sneha Kulkarni", "sneha.k@acme.in", "Active", "Passkey", "Design", minutesAgo(5 * 1440)],
  ["Vikram Singh", "vikram.singh@acme.in", "Active", "SMS", "Operations", minutesAgo(8 * 1440)],
] as const;

const TONE = { Active: "success", Invited: "info", Blocked: "danger" } as const;

function Filters() {
  return (
    <Inline gap="sm" justify="between" style={{ flex: 1 }}>
      <Inline gap="sm">
        <SearchField
          aria-label="Search users"
          placeholder="Search by name, email or ID"
          style={{ inlineSize: 280 }}
        />
        <Select
          aria-label="Status"
          items={[
            { value: "any", label: "Status: Any" },
            { value: "active", label: "Active" },
            { value: "invited", label: "Invited" },
          ]}
          defaultValue="any"
          style={{ inlineSize: 140 }}
        />
        <Button variant="ghost" tone="neutral" size="lg" icon={ListFilterIcon}>
          More filters
        </Button>
      </Inline>
      <Inline gap="xs">
        <IconButton icon={Columns3Icon} aria-label="Columns" tone="neutral" size="lg" />
        <IconButton icon={DownloadIcon} aria-label="Download CSV" tone="neutral" size="lg" />
      </Inline>
    </Inline>
  );
}

function UsersTable() {
  return (
    <Card footer={<Pagination offset={0} pageSize={8} total={1284} onOffsetChange={() => {}} />}>
      <Table
        label="Users"
        rows={USERS}
        rowId={([, email]) => email}
        rowLabel={([name]) => name}
        selectable
        toolbar={<Filters />}
        defaultSort={{ column: "lastSignIn", direction: "descending" }}
        rowActions={() => (
          <>
            <MenuItem>View profile</MenuItem>
            <MenuItem>Reset MFA</MenuItem>
            <MenuItem tone="danger">Suspend</MenuItem>
          </>
        )}
        columns={[
          {
            id: "name",
            header: "Name",
            sortable: true,
            cell: ([name, email]) => <AvatarItem name={name} description={email} />,
          },
          {
            id: "status",
            header: "Status",
            cell: ([, , status]) => <Badge tone={TONE[status]}>{status}</Badge>,
          },
          { id: "mfa", header: "MFA", cell: ([, , , mfa]) => mfa },
          { id: "department", header: "Department", cell: ([, , , , department]) => department },
          {
            id: "lastSignIn",
            header: "Last sign-in",
            align: "end",
            sortable: true,
            sortFirst: "descending",
            cell: ([, , , , , last]) => formatRelativeTime(last, "en-IN", NOW),
          },
        ]}
      />
    </Card>
  );
}

/** Directory › Users: the page inside the frame. */
function UsersPage() {
  return (
    <Tabs defaultValue="all">
      <PageHeader
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbItem href="#directory" render={routerLink}>
              Directory
            </BreadcrumbItem>
            <BreadcrumbItem current>Users</BreadcrumbItem>
          </Breadcrumb>
        }
        title="Users"
        description="People who can sign in to Acme Pvt Ltd's applications. Synced from Azure AD 4 minutes ago."
        actions={
          <>
            <Button variant="soft" icon={DownloadIcon}>
              Export
            </Button>
            <Button icon={PlusIcon}>Invite users</Button>
          </>
        }
        summary={
          <StatGroup>
            <Stat
              label="Total users"
              value={1284}
              note="+38 this week"
              tone="positive"
              trend={[1080, 1094, 1110, 1121, 1139, 1150, 1172, 1190, 1205, 1231, 1246, 1284]}
            />
            <Stat
              label="Active, last 30 days"
              value={1102}
              note="85.8% of users"
              trend={[980, 1010, 995, 1040, 1032, 1061, 1050, 1072, 1068, 1090, 1085, 1102]}
            />
            <Stat
              label="Passkey adoption"
              value="72%"
              note="+6 pts this month"
              tone="positive"
              trend={[41, 44, 47, 50, 53, 55, 58, 61, 63, 66, 69, 72]}
            />
            <Stat
              label="Pending invitations"
              value={64}
              note="9 expire this week"
              tone="warning"
              trend={[30, 34, 31, 40, 38, 45, 52, 49, 55, 58, 61, 64]}
            />
          </StatGroup>
        }
        tabs={
          <TabsList>
            <Tab value="all">All users</Tab>
            <Tab value="invitations">Invitations</Tab>
            <Tab value="blocked">Blocked</Tab>
          </TabsList>
        }
      />
      <PageContent>
        <UsersTable />
      </PageContent>
    </Tabs>
  );
}

/** The scope path: organisation, then environment, each a menu. */
function Scope() {
  return (
    <>
      <Menu>
        <MenuTrigger render={<TopBarSwitcher mark="AC" label="Acme Pvt Ltd" />} />
        <MenuContent>
          <MenuItem>Acme Pvt Ltd</MenuItem>
          <MenuItem>Acme Labs</MenuItem>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger render={<TopBarSwitcher status="success" label="Production" />} />
        <MenuContent>
          <MenuItem>Production</MenuItem>
          <MenuItem>Development</MenuItem>
        </MenuContent>
      </Menu>
    </>
  );
}

const consoleTopBar = (
  <TopBar
    launcher={<IconButton icon={LayoutGridIcon} aria-label="Qeet products" tone="neutral" />}
    logo={<QeetLogo variant="dark" height={20} />}
    product="Qeet ID"
    href="#home"
    context={<Scope />}
    search={<TopBarSearch placeholder="Search or jump to…" shortcut={["⌘", "K"]} />}
    actions={<IconButton icon={SettingsIcon} aria-label="Settings" tone="neutral" />}
    account={<Avatar name="Priya Sharma" size="sm" />}
  />
);

const consoleSidebar = (
  <Sidebar
    label="Qeet ID"
    footer={
      <SidebarGroup>
        <SidebarItem label="Settings" href="#settings" render={routerLink} icon={SettingsIcon} />
        <SidebarItem label="Help and docs" href="#help" render={routerLink} icon={LifeBuoyIcon} />
      </SidebarGroup>
    }
  >
    <SidebarGroup>
      <SidebarItem label="Overview" href="#overview" render={routerLink} icon={HouseIcon} />
    </SidebarGroup>
    <SidebarGroup label="Directory">
      <SidebarItem
        label="Users"
        href="#users"
        render={routerLink}
        icon={UsersIcon}
        current
        filledWhenCurrent
        badge="1,284"
      />
      <SidebarItem
        label="Groups"
        href="#groups"
        render={routerLink}
        icon={UserGroupIcon}
        badge="38"
      />
      <SidebarItem label="Organisations" href="#orgs" render={routerLink} icon={BuildingIcon} />
    </SidebarGroup>
    <SidebarGroup label="Access">
      <SidebarItem
        label="Applications"
        href="#apps"
        render={routerLink}
        icon={AppWindowIcon}
        badge="12"
      />
      <SidebarItem label="Connections" icon={PlugIcon}>
        <SidebarItem label="Passkeys" href="#passkeys" render={routerLink} />
        <SidebarItem label="Enterprise SSO" href="#sso" render={routerLink} />
        <SidebarItem label="Social" href="#social" render={routerLink} />
      </SidebarItem>
      <SidebarItem label="Roles" href="#roles" render={routerLink} icon={ShieldUserIcon} />
    </SidebarGroup>
    <SidebarGroup label="Security">
      <SidebarItem
        label="Authentication"
        href="#authn"
        render={routerLink}
        icon={FingerprintPatternIcon}
      />
      <SidebarItem
        label="Sessions"
        href="#sessions"
        render={routerLink}
        icon={MonitorSmartphoneIcon}
      />
      <SidebarItem label="Policies" href="#policies" render={routerLink} icon={ShieldCheckIcon} />
      <SidebarItem label="Audit logs" href="#audit" render={routerLink} icon={ScrollTextIcon} />
    </SidebarGroup>
    <SidebarGroup label="Developers">
      <SidebarItem label="API keys" href="#keys" render={routerLink} icon={KeyRoundIcon} />
      <SidebarItem label="Webhooks" href="#webhooks" render={routerLink} icon={WebhookIcon} />
      <SidebarItem label="SDKs" href="#sdks" render={routerLink} icon={CodeXmlIcon} />
    </SidebarGroup>
  </Sidebar>
);

const consoleDrawers: AppShellDrawer[] = [
  {
    id: "assistant",
    label: "Qeet AI",
    icon: SparklesIcon,
    badge: true,
    content: <Text>Ask about your users: "Who hasn't added a passkey yet?"</Text>,
  },
  {
    id: "help",
    label: "Help",
    icon: CircleQuestionMarkIcon,
    content: (
      <Stack gap="sm">
        <Text weight="semibold">Users</Text>
        <Text size="sm" tone="subtle">
          People who can sign in to your organisation's applications. Invite them, or connect a
          directory to sync them.
        </Text>
      </Stack>
    ),
  },
  {
    id: "activity",
    label: "Activity",
    icon: ActivityIcon,
    content: (
      <Stack gap="sm">
        <Text size="sm">Rahul Verma reset MFA for Arjun Mehta · 9:12 IST</Text>
        <Text size="sm">Azure AD sync added 3 users · 9:26 IST</Text>
      </Stack>
    ),
  },
];

const meta: Meta<typeof AppShell> = {
  title: "Components/Layout/AppShell",
  component: AppShell,
  parameters: {
    qeetrix: qx({ category: "layout", status: "experimental" }),
    layout: "fullscreen",
    docs: {
      // The frame fills the window (100dvh), so on the docs page each story gets its own frame.
      story: { inline: false, height: "720px" },
    },
  },
  args: {
    density: "compact",
    defaultSidebarCollapsed: false,
    onActiveDrawerChange: fn(),
    onSidebarCollapsedChange: fn(),
  },
  // The slots start as the Qeet ID console's; type into their controls to replace them.
  render: ({ topBar, sidebar, drawers, children, ...args }) => (
    <AppShell
      {...args}
      topBar={topBar ?? consoleTopBar}
      sidebar={sidebar ?? consoleSidebar}
      drawers={drawers ?? consoleDrawers}
    >
      {children ?? <UsersPage />}
    </AppShell>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof AppShell>;

export const Playground: Story = {};

export const Collapsed: Story = {
  name: "Collapsed rail",
  args: { defaultSidebarCollapsed: true },
};

export const PanelOpen: Story = {
  name: "Panel open",
  args: { defaultActiveDrawer: "help" },
};

export const WithBanners: Story = {
  name: "With banners",
  parameters: {
    docs: {
      description: { story: "App-wide `banners` under the bar; page `notifications` below." },
    },
  },
  args: {
    banners: (
      <>
        <Alert
          variant="banner"
          tone="info"
          icon={EyeIcon}
          title="Viewing as Rahul Verma"
          actions={
            <Button size="sm" variant="soft" tone="neutral">
              Stop viewing
            </Button>
          }
        >
          Changes are logged under your name.
        </Alert>
        <Alert variant="banner" tone="warning" icon={WrenchIcon} title="Scheduled maintenance">
          Read-only on Sunday 2 Nov, 01:00–02:00 IST.
        </Alert>
      </>
    ),
    notifications: (
      <Alert
        tone="danger"
        title="Directory sync failed"
        actions={
          <Button size="sm" variant="soft">
            Retry sync
          </Button>
        }
      >
        Azure AD returned 401 at 09:12 IST.
      </Alert>
    ),
  },
};

export const Narrow: Story = {
  name: "Narrow window",
  globals: { viewport: { value: "mobile", isRotated: false } },
  // A pinned viewport can't show on the docs page, which renders every story at its own width.
  tags: ["!autodocs"],
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  args: { defaultActiveDrawer: "help" },
  decorators: [
    (Story) => (
      <QeetrixProvider locale="hi-IN" messages={hi}>
        <Story />
      </QeetrixProvider>
    ),
  ],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "छोटा करें" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "पैनल बंद करें" })).toBeInTheDocument();
  },
};

export const SkipLinkInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the skip link comes first",
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    const skip = canvas.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toHaveFocus();
    await expect(skip).toHaveAttribute("href", "#main");
    await expect(canvas.getByRole("main")).toHaveAttribute("id", "main");
  },
};

export const CollapseInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: collapse to the rail and back",
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Collapse" }));
    await expect(args.onSidebarCollapsedChange).toHaveBeenLastCalledWith(true);
    const expand = canvas.getByRole("button", { name: "Expand" });
    await expect(expand).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(expand);
    await expect(args.onSidebarCollapsedChange).toHaveBeenLastCalledWith(false);
  },
};

export const PanelInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the bar's tools open one panel at a time",
  play: async ({ args, canvas, userEvent }) => {
    const help = canvas.getByRole("button", { name: "Help" });
    await userEvent.click(help);
    await expect(help).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("complementary", { name: "Help" })).toBeVisible();
    await expect(args.onActiveDrawerChange).toHaveBeenLastCalledWith("help");

    await userEvent.click(canvas.getByRole("button", { name: "Activity" }));
    await expect(canvas.getByRole("complementary", { name: "Activity" })).toBeVisible();
    await expect(canvas.getAllByRole("complementary")).toHaveLength(1);

    await userEvent.click(canvas.getByRole("button", { name: "Close panel" }));
    await expect(args.onActiveDrawerChange).toHaveBeenLastCalledWith(null);
    await expect(canvas.queryByRole("complementary")).not.toBeInTheDocument();
  },
};

export const NarrowInteraction: Story = {
  name: "Interaction: the navigation drawer on a narrow window",
  globals: { viewport: { value: "mobile", isRotated: false } },
  tags: ["!autodocs", "!dev"],
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open navigation" }));
    // The drawer renders in a portal, outside the story's canvas.
    const drawer = await screen.findByRole("dialog", { name: "Navigation" });
    await expect(drawer).toBeVisible();
    // Keep the test page where it is: following "#orgs" would navigate the test runner's frame.
    const stay = (event: MouseEvent) => event.preventDefault();
    document.addEventListener("click", stay);
    try {
      await userEvent.click(screen.getByRole("link", { name: "Organisations" }));
      await waitFor(() =>
        expect(screen.queryByRole("dialog", { name: "Navigation" })).not.toBeInTheDocument(),
      );
    } finally {
      document.removeEventListener("click", stay);
    }
  },
};

export const NoTopBarInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: without a top bar, no empty band",
  globals: { viewport: { value: "desktop", isRotated: false } },
  render: (args) => (
    <AppShell {...args} sidebar={consoleSidebar}>
      <UsersPage />
    </AppShell>
  ),
  play: async ({ canvasElement }) => {
    const slot = (name: string) =>
      canvasElement.querySelector(`[data-slot=${name}]`) as HTMLElement | null;
    const top = (name: string) => slot(name)?.getBoundingClientRect().top ?? Number.NaN;
    await expect(slot("app-shell-top")).toBeNull();
    // The navigation and the page start at the frame's top edge.
    await expect(Math.abs(top("app-shell-nav") - top("app-shell"))).toBeLessThanOrEqual(0.5);
    await expect(Math.abs(top("app-shell-main") - top("app-shell"))).toBeLessThanOrEqual(0.5);
  },
};
