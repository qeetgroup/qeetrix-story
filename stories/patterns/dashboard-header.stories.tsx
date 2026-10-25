import { QeetLogo } from "@qeetrix/icons";
import { AppWindowIcon } from "@qeetrix/icons/icons/app-window";
import { BuildingIcon } from "@qeetrix/icons/icons/building";
import { CircleXIcon } from "@qeetrix/icons/icons/circle-x";
import { EllipsisIcon } from "@qeetrix/icons/icons/ellipsis";
import { FingerprintPatternIcon } from "@qeetrix/icons/icons/fingerprint-pattern";
import { HouseIcon } from "@qeetrix/icons/icons/house";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { LayoutGridIcon } from "@qeetrix/icons/icons/layout-grid";
import { LifeBuoyIcon } from "@qeetrix/icons/icons/life-buoy";
import { LogInIcon } from "@qeetrix/icons/icons/log-in";
import { MonitorSmartphoneIcon } from "@qeetrix/icons/icons/monitor-smartphone";
import { PlusIcon } from "@qeetrix/icons/icons/plus";
import { ScrollTextIcon } from "@qeetrix/icons/icons/scroll-text";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { ShieldUserIcon } from "@qeetrix/icons/icons/shield-user";
import { UserGroupIcon } from "@qeetrix/icons/icons/user-group";
import { UsersIcon } from "@qeetrix/icons/icons/users";
import { WebhookIcon } from "@qeetrix/icons/icons/webhook";
import {
  Avatar,
  Button,
  Card,
  Grid,
  GridItem,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Meter,
  Stack,
  Tab,
  Tabs,
  TabsList,
  Toggle,
  ToggleGroup,
} from "@qeetrix/react";
import {
  Alert,
  AppShell,
  Breadcrumb,
  BreadcrumbItem,
  PageContent,
  PageHeader,
  type PageHeaderProps,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  Stat,
  StatGroup,
  Timeline,
  TimelineGroup,
  TimelineItem,
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
            <SidebarItem
              label="Overview"
              href="#overview"
              render={route}
              icon={HouseIcon}
              current
            />
          </SidebarGroup>
          <SidebarGroup label="Directory">
            <SidebarItem
              label="Users"
              href="#users"
              render={route}
              icon={UsersIcon}
              badge="1,284"
            />
            <SidebarItem
              label="Groups"
              href="#groups"
              render={route}
              icon={UserGroupIcon}
              badge="38"
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

type Period = "24h" | "7d" | "30d";

/** The key numbers per period; trends oldest first. */
const FIGURES: Record<
  Period,
  { active: number; passkey: string; failed: number; invites: number; trend: number[] }
> = {
  "24h": { active: 3412, passkey: "95.2%", failed: 21, invites: 64, trend: [3, 5, 4, 6, 8, 7, 9] },
  "7d": { active: 9870, passkey: "94.6%", failed: 140, invites: 64, trend: [5, 6, 6, 8, 7, 9, 10] },
  "30d": {
    active: 12480,
    passkey: "94.1%",
    failed: 318,
    invites: 64,
    trend: [9, 10, 10, 11, 12, 11, 13, 14, 13, 15, 16, 17],
  },
};

const PERIOD_NOTE: Record<Period, string> = {
  "24h": "vs. the previous day",
  "7d": "vs. the previous 7 days",
  "30d": "vs. the previous 30 days",
};

/** At most four numbers: more is a report, not a summary. */
function KeyNumbers({ period = "30d" }: { period?: Period }) {
  const figures = FIGURES[period];
  return (
    <StatGroup>
      <Stat
        label="Active users"
        value={figures.active}
        note={`+8.2% ${PERIOD_NOTE[period]}`}
        tone="positive"
        trend={figures.trend}
      />
      <Stat
        label="Sign-ins with a passkey"
        value={figures.passkey}
        note="+3.4 pts. Target for FY27 is 95%"
        tone="positive"
        trend={[81, 84, 86, 88, 90, 91, 93, 94]}
      />
      <Stat
        label="Failed sign-ins"
        value={figures.failed}
        note="+41%, mostly one IP range in Mumbai"
        tone="negative"
        trend={[12, 10, 14, 11, 18, 26, 31, 40]}
      />
      <Stat
        label="Pending invitations"
        value={figures.invites}
        note="9 expire this week"
        tone="warning"
        trend={[30, 34, 31, 40, 38, 45, 52, 64]}
      />
    </StatGroup>
  );
}

/** One choice: a single-select segmented ToggleGroup. */
function PeriodPicker({
  period,
  onPeriodChange,
}: {
  period: Period;
  onPeriodChange: (period: Period) => void;
}) {
  return (
    <ToggleGroup
      aria-label="Reporting period"
      value={[period]}
      onValueChange={(value) => {
        const next = value[0] as Period | undefined;
        if (next) onPeriodChange(next);
      }}
    >
      <Toggle value="24h">24 hours</Toggle>
      <Toggle value="7d">7 days</Toggle>
      <Toggle value="30d">30 days</Toggle>
    </ToggleGroup>
  );
}

/** Everything past the one solid and one soft button goes in a menu. */
function MoreActions() {
  return (
    <Menu>
      <MenuTrigger
        render={<IconButton icon={EllipsisIcon} aria-label="More actions" tone="neutral" />}
      />
      <MenuContent align="end">
        <MenuItem>Download tenant report</MenuItem>
        <MenuItem>Open audit logs</MenuItem>
        <MenuItem>Manage data residency</MenuItem>
        <MenuSeparator />
        <MenuItem tone="danger">Suspend organisation</MenuItem>
      </MenuContent>
    </Menu>
  );
}

const trail = (
  <Breadcrumb>
    <BreadcrumbItem href="#org" render={route}>
      Acme Pvt Ltd
    </BreadcrumbItem>
    <BreadcrumbItem current>Overview</BreadcrumbItem>
  </Breadcrumb>
);

/** Under the header: recent activity in the main column, the plan, secondary, beside it. */
function OverviewBody() {
  return (
    <PageContent>
      <Grid columns={{ base: 1, expanded: 3 }} gap="md">
        <GridItem span={{ expanded: 2 }}>
          <Card
            title="Recent activity"
            level={2}
            actions={<Button variant="ghost">View all</Button>}
          >
            <Timeline aria-label="Recent activity" variant="compact">
              <TimelineGroup label="Today">
                <TimelineItem
                  icon={LogInIcon}
                  title="Priya Sharma signed in with a passkey"
                  description="Bengaluru · Chrome on macOS"
                  time="2 min ago"
                />
                <TimelineItem
                  icon={CircleXIcon}
                  tone="danger"
                  title="12 failed sign-ins for rahul.verma@acme.in"
                  description="Mumbai · blocked for 15 minutes"
                  time="09:12"
                />
                <TimelineItem
                  icon={FingerprintPatternIcon}
                  title="Ananya Iyer added a passkey"
                  description="iPhone 16 · Face ID"
                  time="08:40"
                />
              </TimelineGroup>
            </Timeline>
          </Card>
        </GridItem>
        <GridItem>
          <Card
            title="Plan usage"
            level={2}
            variant="subdued"
            description="Business plan, renews on 1 April 2027."
          >
            <Stack gap="lg">
              <Meter label="Monthly active users" value={12480} max={15000} showValue tone="info" />
              <Meter label="Applications" value={12} max={25} showValue tone="info" />
            </Stack>
          </Card>
        </GridItem>
      </Grid>
    </PageContent>
  );
}

/** The header, with the period wired to the numbers. */
function OverviewHeader(header: Partial<PageHeaderProps>) {
  const [period, setPeriod] = useState<Period>("30d");
  return (
    <PageHeader
      breadcrumb={trail}
      title="Overview"
      description="Identity and access for Acme Pvt Ltd, in ap-south-1 (Mumbai)."
      actions={
        <>
          <PeriodPicker period={period} onPeriodChange={setPeriod} />
          <MoreActions />
          <Button icon={PlusIcon}>Invite users</Button>
        </>
      }
      summary={<KeyNumbers period={period} />}
      {...header}
    />
  );
}

const meta: Meta = {
  title: "Patterns/Dashboard header",
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, iframeHeight: 720 },
      description: { component: "The top of a Qeet ID overview: title, actions and key numbers." },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ConsoleFrame>
      <Tabs defaultValue="summary">
        <OverviewHeader
          tabs={
            <TabsList>
              <Tab value="summary">Summary</Tab>
              <Tab value="sign-ins">Sign-ins</Tab>
              <Tab value="security">Security events</Tab>
            </TabsList>
          }
        />
        <OverviewBody />
      </Tabs>
    </ConsoleFrame>
  ),
};

export const WithNotification: Story = {
  name: "With notification",
  render: () => (
    <ConsoleFrame
      notifications={
        <Alert tone="warning" title="Figures are 6 hours behind">
          Sign-ins between 04:00 and 10:00 IST aren't counted yet.
        </Alert>
      }
    >
      <OverviewHeader />
      <OverviewBody />
    </ConsoleFrame>
  ),
};

export const Loading: Story = {
  render: () => (
    <ConsoleFrame>
      <OverviewHeader
        summary={
          <StatGroup>
            {[
              "Active users",
              "Sign-ins with a passkey",
              "Failed sign-ins",
              "Pending invitations",
            ].map((label) => (
              <Stat key={label} label={label} value={undefined} loading />
            ))}
          </StatGroup>
        }
      />
      <OverviewBody />
    </ConsoleFrame>
  ),
};

export const PeriodChangesNumbers: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the period changes the numbers",
  render: () => (
    <ConsoleFrame>
      <OverviewHeader />
    </ConsoleFrame>
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText("12,480")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "7 days" }));
    await waitFor(() => expect(canvas.getByText("9,870")).toBeVisible());
    await expect(canvas.getByRole("button", { name: "7 days" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(canvas.getByText(/vs. the previous 7 days/)).toBeVisible();
  },
};

export const MoreMenu: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the More menu opens and returns focus",
  render: () => (
    <ConsoleFrame>
      <OverviewHeader />
    </ConsoleFrame>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "More actions" });
    await userEvent.click(trigger);
    const body = canvasElement.ownerDocument.body;
    const menu = await waitFor(() => {
      const found = body.querySelector<HTMLElement>('[role="menu"]');
      if (!found) throw new Error("menu not open");
      return found;
    });
    await expect(menu).toHaveTextContent("Suspend organisation");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
