import { QeetLogo } from "@qeetrix/icons";
import { AppWindowIcon } from "@qeetrix/icons/icons/app-window";
import { BanIcon } from "@qeetrix/icons/icons/ban";
import { BuildingIcon } from "@qeetrix/icons/icons/building";
import { CircleXIcon } from "@qeetrix/icons/icons/circle-x";
import { EllipsisIcon } from "@qeetrix/icons/icons/ellipsis";
import { FingerprintPatternIcon } from "@qeetrix/icons/icons/fingerprint-pattern";
import { HouseIcon } from "@qeetrix/icons/icons/house";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { LayoutGridIcon } from "@qeetrix/icons/icons/layout-grid";
import { LifeBuoyIcon } from "@qeetrix/icons/icons/life-buoy";
import { LogInIcon } from "@qeetrix/icons/icons/log-in";
import { LogOutIcon } from "@qeetrix/icons/icons/log-out";
import { MonitorSmartphoneIcon } from "@qeetrix/icons/icons/monitor-smartphone";
import { PencilIcon } from "@qeetrix/icons/icons/pencil";
import { ScrollTextIcon } from "@qeetrix/icons/icons/scroll-text";
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
  formatDate,
  formatDateTime,
  formatRelativeTime,
  Grid,
  GridItem,
  IconButton,
  Inline,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Skeleton,
  Stack,
  Tab,
  Table,
  type TableColumn,
  Tabs,
  TabsList,
  TabsPanel,
  Text,
} from "@qeetrix/react";
import {
  Alert,
  AppShell,
  CopyButton,
  DataState,
  DescriptionItem,
  DescriptionList,
  EmptyState,
  PageContent,
  PageHeader,
  PageHeaderBack,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  Stat,
  StatGroup,
  Timeline,
  TimelineGroup,
  TimelineItem,
  type TimelineTone,
  TopBar,
  TopBarSearch,
  TopBarSwitcher,
} from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, type ReactNode, useState } from "react";
import { expect, waitFor } from "storybook/test";

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
function ConsoleFrame({
  notifications,
  children,
}: {
  notifications?: ReactNode;
  children: ReactNode;
}) {
  return (
    <AppShell
      notifications={notifications}
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
              badge="36"
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

/* ── One user: Rahul Verma, the second row of Patterns/Users table ────────────────────────────── */

/** Inside the Storybook iframe, links open stories in the top window. */
const USERS_TABLE = "./?path=/story/patterns-users-table--default";

/** A fixed "now" (3:00 pm IST), the Users table's, so times read the same in every run. */
const NOW = Date.UTC(2026, 9, 25, 9, 30);
const minutesAgo = (minutes: number) => NOW - minutes * 60_000;

const USER = {
  id: "usr_002",
  name: "Rahul Verma",
  email: "rahul.verma@acme.in",
  created: Date.UTC(2025, 2, 14, 4, 50),
  lastSignIn: minutesAgo(43),
};

/** `active` and `suspended` are loaded; `loading` is the first paint, before the user arrives. */
type View = "active" | "suspended" | "loading";

interface Session {
  id: string;
  device: string;
  location: string;
  ip: string;
  signedIn: number;
  lastActive: number;
}

const SESSIONS: Session[] = [
  {
    id: "ses_01",
    device: "Edge on Windows 11",
    location: "Mumbai, Maharashtra",
    ip: "103.21.58.14",
    signedIn: USER.lastSignIn,
    lastActive: minutesAgo(2),
  },
  {
    id: "ses_02",
    device: "Safari on iPhone 16",
    location: "Mumbai, Maharashtra",
    ip: "49.36.12.201",
    signedIn: Date.UTC(2026, 9, 24, 13, 0),
    lastActive: minutesAgo(190),
  },
  {
    id: "ses_03",
    device: "Chrome on macOS",
    location: "Pune, Maharashtra",
    ip: "117.98.4.66",
    signedIn: Date.UTC(2026, 9, 21, 3, 32),
    lastActive: minutesAgo(2 * 24 * 60 + 30),
  },
];

const SESSION_COLUMNS: TableColumn<Session>[] = [
  { id: "device", header: "Device", cell: (session) => session.device },
  { id: "location", header: "Location", cell: (session) => session.location },
  { id: "ip", header: "IP address", cell: (session) => session.ip },
  { id: "signedIn", header: "Signed in", cell: (session) => formatDateTime(session.signedIn) },
  {
    id: "lastActive",
    header: "Last active",
    align: "end",
    cell: (session) => formatRelativeTime(session.lastActive, "en-IN", NOW),
  },
];

interface Event {
  id: string;
  icon: typeof LogInIcon;
  tone?: TimelineTone;
  title: string;
  description: string;
  time: string;
  dateTime: string;
}

/** Newest first, by day. Sign-ins are brand, changes made by an admin are info. */
const ACTIVITY: { day: string; events: Event[] }[] = [
  {
    day: "Today",
    events: [
      {
        id: "e1",
        icon: LogInIcon,
        tone: "brand",
        title: "Signed in with a passkey",
        description: "Mumbai · Edge on Windows 11",
        time: "2:17 pm",
        dateTime: "2026-10-25T14:17+05:30",
      },
      {
        id: "e2",
        icon: UserGroupIcon,
        tone: "info",
        title: "Added to Finance approvers",
        description: "By Priya Sharma",
        time: "11:05 am",
        dateTime: "2026-10-25T11:05+05:30",
      },
      {
        id: "e3",
        icon: AppWindowIcon,
        title: "Opened Qeet Pay",
        description: "Single sign-on",
        time: "9:48 am",
        dateTime: "2026-10-25T09:48+05:30",
      },
    ],
  },
  {
    day: "Yesterday",
    events: [
      {
        id: "e4",
        icon: FingerprintPatternIcon,
        tone: "success",
        title: "Registered a passkey",
        description: "iPhone 16 · Face ID",
        time: "6:32 pm",
        dateTime: "2026-10-24T18:32+05:30",
      },
      {
        id: "e5",
        icon: LogInIcon,
        tone: "brand",
        title: "Signed in with an authenticator app",
        description: "Mumbai · Safari on iPhone 16",
        time: "6:30 pm",
        dateTime: "2026-10-24T18:30+05:30",
      },
    ],
  },
  {
    day: formatDate("2026-10-21"),
    events: [
      {
        id: "e6",
        icon: ShieldUserIcon,
        tone: "info",
        title: "Role changed to Billing admin",
        description: "By Priya Sharma",
        time: "10:15 am",
        dateTime: "2026-10-21T10:15+05:30",
      },
      {
        id: "e7",
        icon: LogInIcon,
        tone: "brand",
        title: "Signed in with a passkey",
        description: "Pune · Chrome on macOS",
        time: "9:02 am",
        dateTime: "2026-10-21T09:02+05:30",
      },
    ],
  },
];

/** What a suspension adds to the top of today. */
const SUSPENSION: Event[] = [
  {
    id: "s1",
    icon: BanIcon,
    tone: "danger",
    title: "Suspended by Priya Sharma",
    description: "After 12 failed sign-ins",
    time: "2:40 pm",
    dateTime: "2026-10-25T14:40+05:30",
  },
  {
    id: "s2",
    icon: CircleXIcon,
    tone: "warning",
    title: "12 failed sign-ins",
    description: "Mumbai · 103.48.196.7",
    time: "2:31 pm",
    dateTime: "2026-10-25T14:31+05:30",
  },
];

function activityFor(view: View) {
  if (view !== "suspended") return ACTIVITY;
  const [today, ...earlier] = ACTIVITY as [(typeof ACTIVITY)[number]];
  return [{ ...today, events: [...SUSPENSION, ...today.events] }, ...earlier];
}

function Events({ events }: { events: Event[] }) {
  return events.map((event) => (
    <TimelineItem
      key={event.id}
      icon={event.icon}
      tone={event.tone}
      title={event.title}
      description={event.description}
      time={event.time}
      dateTime={event.dateTime}
    />
  ));
}

/* ── The page ─────────────────────────────────────────────────────────────────────────────────── */

/** Past Edit, everything goes in the menu; each item says what it does to Rahul. */
function MoreActions({ suspended }: { suspended: boolean }) {
  return (
    <Menu>
      <MenuTrigger
        render={<IconButton icon={EllipsisIcon} aria-label="More actions" tone="neutral" />}
      />
      <MenuContent align="end">
        <MenuItem description="He registers a new passkey at next sign-in.">Reset MFA</MenuItem>
        <MenuItem description={suspended ? "He has no active sessions." : "Ends all 3 sessions."}>
          Sign out everywhere
        </MenuItem>
        <MenuItem description={`A one-time link to ${USER.email}.`}>Send sign-in link</MenuItem>
        <MenuSeparator />
        {suspended ? (
          <MenuItem description="He can sign in again straight away.">Restore access</MenuItem>
        ) : (
          <MenuItem tone="danger" description="Blocks sign-in until you restore access.">
            Suspend user
          </MenuItem>
        )}
      </MenuContent>
    </Menu>
  );
}

/** Four key numbers; while loading, each holds its place. */
function KeyNumbers({ view }: { view: View }) {
  const loading = view === "loading";
  const suspended = view === "suspended";
  return (
    <StatGroup>
      <Stat
        label="Sign-ins, 30 days"
        value={48}
        note="+6 vs. the previous 30 days"
        loading={loading}
      />
      <Stat
        label="Applications"
        value={5}
        note="Qeet Pay, Qeet People and 3 more"
        loading={loading}
      />
      <Stat
        label="Active sessions"
        value={suspended ? 0 : SESSIONS.length}
        note={suspended ? "Signed out when suspended" : "On 3 devices"}
        loading={loading}
      />
      <Stat
        label="Failed sign-ins"
        value={suspended ? 12 : 0}
        note={suspended ? "All today, from one IP in Mumbai" : "None in 30 days"}
        tone={suspended ? "negative" : "neutral"}
        loading={loading}
      />
    </StatGroup>
  );
}

/** One destructive setting: what it is, what it does, and its button. */
function DangerRow({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <Inline gap="md" justify="between" wrap={false}>
      <Stack gap="xs">
        <Text weight="medium">{title}</Text>
        <Text size="sm" tone="subtle">
          {description}
        </Text>
      </Stack>
      {action}
    </Inline>
  );
}

function OverviewPanel({ view, onViewAll }: { view: View; onViewAll: () => void }) {
  const loading = view === "loading";
  const recent = activityFor(view)[0]?.events.slice(0, 3) ?? [];
  // The values' shapes while the user loads; the terms are known already.
  const value = (text: ReactNode, width: number) =>
    loading ? <Skeleton style={{ inlineSize: width }} /> : text;
  return (
    <Grid columns={{ base: 1, expanded: 3 }} gap="md">
      <GridItem span={{ expanded: 2 }}>
        <Stack gap="md">
          <Card title="Details" level={2} aria-busy={loading || undefined}>
            <DescriptionList>
              <DescriptionItem term="Email">
                {value(
                  <>
                    {USER.email}
                    <Badge tone="success" size="sm">
                      Verified
                    </Badge>
                  </>,
                  200,
                )}
              </DescriptionItem>
              <DescriptionItem term="User ID">
                {value(
                  <>
                    {USER.id}
                    <CopyButton value={USER.id} label="Copy user ID" size="sm" />
                  </>,
                  96,
                )}
              </DescriptionItem>
              <DescriptionItem term="Role">{value("Billing admin", 120)}</DescriptionItem>
              <DescriptionItem term="MFA">{value("Passkey, 2 registered", 160)}</DescriptionItem>
              <DescriptionItem term="Created">
                {value(formatDateTime(USER.created), 160)}
              </DescriptionItem>
              <DescriptionItem term="Last sign-in">
                {value(formatDateTime(USER.lastSignIn), 160)}
              </DescriptionItem>
            </DescriptionList>
          </Card>
          <Card
            title="Recent activity"
            level={2}
            actions={
              <Button variant="ghost" onClick={onViewAll}>
                View all
              </Button>
            }
          >
            <DataState loading={loading}>
              <Timeline aria-label="Recent activity" variant="compact">
                <Events events={recent} />
              </Timeline>
            </DataState>
          </Card>
        </Stack>
      </GridItem>
      <GridItem>
        <Stack gap="md">
          <Card
            title="Directory"
            level={2}
            variant="subdued"
            description="Synced from Azure AD 2 hours ago."
            aria-busy={loading || undefined}
          >
            {loading ? (
              <Skeleton lines={4} />
            ) : (
              <DescriptionList>
                <DescriptionItem term="Department">Finance</DescriptionItem>
                <DescriptionItem term="Manager">Meera Nair</DescriptionItem>
                <DescriptionItem term="Groups">
                  <Badge>Finance</Badge>
                  <Badge>Approvers</Badge>
                  <Badge>All staff</Badge>
                </DescriptionItem>
                <DescriptionItem term="Office">Mumbai, BKC</DescriptionItem>
              </DescriptionList>
            )}
          </Card>
          <Card title="Danger zone" level={2} tone="danger">
            <Stack gap="lg">
              {view !== "suspended" && (
                <DangerRow
                  title="Suspend user"
                  description="Ends his sessions and blocks sign-in."
                  action={
                    <Button variant="soft" tone="danger">
                      Suspend
                    </Button>
                  }
                />
              )}
              <DangerRow
                title="Delete user"
                description="Removes Rahul and his access for good."
                action={<Button tone="danger">Delete</Button>}
              />
            </Stack>
          </Card>
        </Stack>
      </GridItem>
    </Grid>
  );
}

function SessionsPanel({ view }: { view: View }) {
  const suspended = view === "suspended";
  return (
    <Card
      title="Active sessions"
      level={2}
      actions={
        suspended ? undefined : (
          <Button variant="ghost" tone="danger" icon={LogOutIcon}>
            Sign out everywhere
          </Button>
        )
      }
    >
      <Table
        label="Active sessions"
        rows={suspended ? [] : SESSIONS}
        loading={view === "loading"}
        loadingRows={3}
        rowId={(session) => session.id}
        rowLabel={(session) => session.device}
        columns={SESSION_COLUMNS}
        rowActions={() => <MenuItem tone="danger">Sign out of this device</MenuItem>}
        empty={
          <EmptyState
            size="section"
            icon={MonitorSmartphoneIcon}
            title="No active sessions"
            description="Suspending Rahul signed him out everywhere."
          />
        }
      />
    </Card>
  );
}

function ActivityPanel({ view }: { view: View }) {
  return (
    <Card
      title="Activity"
      level={2}
      actions={
        <Button variant="ghost" icon={ScrollTextIcon}>
          Open audit logs
        </Button>
      }
    >
      <DataState loading={view === "loading"}>
        <Timeline aria-label="Activity">
          {activityFor(view).map((group) => (
            <TimelineGroup key={group.day} label={group.day}>
              <Events events={group.events} />
            </TimelineGroup>
          ))}
        </Timeline>
      </DataState>
    </Card>
  );
}

/** Directory › Users › Rahul Verma: a back link, key numbers, and the record in three tabs. */
function UserDetailPage({ view = "active" }: { view?: View }) {
  const [tab, setTab] = useState<string>("overview");
  const suspended = view === "suspended";
  return (
    <ConsoleFrame
      notifications={
        suspended ? (
          <Alert
            tone="danger"
            title="Rahul Verma is suspended"
            actions={<Button variant="soft">Restore access</Button>}
          >
            Priya Sharma suspended him at 2:40 pm, after 12 failed sign-ins. He can't sign in.
          </Alert>
        ) : undefined
      }
    >
      <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
        <PageHeader
          back={
            <PageHeaderBack href={USERS_TABLE} target="_top">
              Users
            </PageHeaderBack>
          }
          title={
            <Inline gap="sm" wrap={false} render={<span />}>
              <Avatar name={USER.name} size="lg" decorative />
              {USER.name}
            </Inline>
          }
          status={
            view === "loading" ? undefined : (
              <Badge tone={suspended ? "danger" : "success"} variant="solid">
                {suspended ? "Suspended" : "Active"}
              </Badge>
            )
          }
          actions={
            <>
              <MoreActions suspended={suspended} />
              <Button variant="soft" icon={PencilIcon}>
                Edit profile
              </Button>
            </>
          }
          summary={<KeyNumbers view={view} />}
          tabs={
            <TabsList>
              <Tab value="overview">Overview</Tab>
              <Tab value="sessions" badge={view === "active" ? SESSIONS.length : undefined}>
                Sessions
              </Tab>
              <Tab value="activity">Activity</Tab>
            </TabsList>
          }
        />
        <PageContent>
          <TabsPanel value="overview">
            <OverviewPanel view={view} onViewAll={() => setTab("activity")} />
          </TabsPanel>
          <TabsPanel value="sessions">
            <SessionsPanel view={view} />
          </TabsPanel>
          <TabsPanel value="activity">
            <ActivityPanel view={view} />
          </TabsPanel>
        </PageContent>
      </Tabs>
    </ConsoleFrame>
  );
}

const meta: Meta = {
  title: "Patterns/User detail",
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, iframeHeight: 960 },
      description: { component: "One Qeet ID user: profile, sessions and activity, in tabs." },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <UserDetailPage />,
};

export const Loading: Story = {
  render: () => <UserDetailPage view="loading" />,
};

export const Suspended: Story = {
  render: () => <UserDetailPage view="suspended" />,
};

export const BackToUsers: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the back link returns to Users",
  render: () => <UserDetailPage />,
  play: async ({ canvas, userEvent }) => {
    // Named for screen readers, and opened in the top window, out of the Storybook iframe. Not
    // clicked: it would leave the test page.
    const back = canvas.getByRole("link", { name: "Back to Users" });
    await expect(back).toHaveAttribute("href", USERS_TABLE);
    await expect(back).toHaveAttribute("target", "_top");
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent("Rahul Verma");

    // In-page `#` links are router links: the click is handled here, not sent to the parent frame.
    const groups = canvas.getByRole("link", { name: /^Groups/ });
    let followed: boolean | undefined;
    groups.ownerDocument.addEventListener(
      "click",
      (event) => {
        followed = !event.defaultPrevented;
      },
      { once: true },
    );
    await userEvent.click(groups);
    await expect(followed).toBe(false);
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent("Rahul Verma");
  },
};

export const SwitchTabs: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a tab shows its panel",
  render: () => <UserDetailPage />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("heading", { name: "Details" })).toBeVisible();

    const sessions = canvas.getByRole("tab", { name: /^Sessions/ });
    await userEvent.click(sessions);
    await waitFor(() => expect(sessions).toHaveAttribute("aria-selected", "true"));
    const table = canvas.getByRole("table", { name: "Active sessions" });
    await expect(table).toBeVisible();
    await expect(canvas.getByText("Safari on iPhone 16")).toBeVisible();
    await expect(canvas.queryByRole("heading", { name: "Details" })).toBeNull();

    // Recent activity's View all opens the Activity tab.
    await userEvent.click(canvas.getByRole("tab", { name: "Overview" }));
    await userEvent.click(await canvas.findByRole("button", { name: "View all" }));
    await waitFor(() =>
      expect(canvas.getByRole("tab", { name: "Activity" })).toHaveAttribute(
        "aria-selected",
        "true",
      ),
    );
    await expect(canvas.getByRole("list", { name: "Activity" })).toBeVisible();
  },
};
