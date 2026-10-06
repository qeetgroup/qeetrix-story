import {
  ActivityIcon,
  KeyRoundIcon,
  PlusIcon,
  RefreshCwIcon,
  TriangleAlertIcon,
  UsersIcon,
  WalletIcon,
} from "@qeetrix/icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  DataState,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  PageHeader,
  SegmentedControl,
  SegmentedControlItem,
  Stat,
  Typography,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../_contract";

function Trail() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#tenants">Acme Technologies</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#qeet-id">Qeet ID</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Overview</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function RangePicker() {
  return (
    <SegmentedControl
      size="sm"
      defaultValue="30d"
      aria-label="Reporting period"
      className="hidden md:inline-flex"
    >
      <SegmentedControlItem value="24h">24h</SegmentedControlItem>
      <SegmentedControlItem value="7d">7d</SegmentedControlItem>
      <SegmentedControlItem value="30d">30d</SegmentedControlItem>
    </SegmentedControl>
  );
}

function OverflowMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" aria-label="More overview actions">
            More
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Acme Technologies</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Download tenant report</DropdownMenuItem>
        <DropdownMenuItem>Open audit log</DropdownMenuItem>
        <DropdownMenuItem>Manage data residency</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Suspend tenant</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatsRow() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Stat
        label="Monthly active users"
        value="12,480"
        delta="+8.2%"
        trend="up"
        icon={UsersIcon}
        hint="vs. the previous 30 days"
      />
      <Stat
        label="Sign-ins with a passkey"
        value="94.1%"
        delta="+3.4 pts"
        trend="up"
        icon={KeyRoundIcon}
        hint="Target for FY26 is 95%"
      />
      <Stat
        label="Failed sign-ins"
        value="318"
        delta="+41%"
        trend="down"
        icon={ActivityIcon}
        hint="Mostly one IP range in ap-south-1"
      />
      <Stat
        label="Billed this cycle"
        value="₹4,86,200"
        delta="+2.1%"
        trend="neutral"
        icon={WalletIcon}
        hint="Invoiced by Qeet Pay on 01 Apr"
      />
    </div>
  );
}

const meta: Meta = {
  title: "Patterns/DashboardHeader",
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component: [
          "**The top of an overview screen.** A `Breadcrumb` trail, the `PageHeader` title and",
          "description, the actions for this page, and a `Stat` row of the four numbers the page is",
          "about — assembled in that order so the answer to “where am I / what is this / how is it",
          "doing / what can I do” is readable in one pass.",
          "",
          "**Use it** at the top of any product overview: the Qeet ID tenant dashboard, a Qeet Logs",
          "stream, a Qeet Pay settlement summary, a Qeet People payroll cycle. Keep the stat row to",
          "four tiles or fewer — a fifth stops being a summary and starts being a report, which",
          "belongs in the body of the page with a chart next to it.",
          "",
          "**Do not use it** on detail or edit screens: an entity page wants a `PageHeader` with a",
          "status and record identifiers, not aggregate KPIs. Do not use it as a navigation bar",
          "either — the app-level chrome is `AppShell` + `Sidebar`; this pattern lives *inside* the",
          "main region and describes one page.",
          "",
          "**Composition notes.** `PageHeader` owns the only `h1`, so nothing else here competes for",
          "it. The breadcrumb goes in the header's `breadcrumb` slot rather than floating above it,",
          "which keeps the trail and the title in one block for screen readers. Every delta names",
          "its own baseline in `hint` — a percentage with no “compared to what” is a decoration, and",
          "the trend colour is always paired with an arrow so it does not rely on colour alone.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The full assembly: trail, title, description, a period selector plus primary and overflow actions, and the stat row underneath.",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        breadcrumb={<Trail />}
        title="Qeet ID overview"
        description="Identity and access for the Acme Technologies tenant. Figures cover the last 30 days in ap-south-1."
        actions={
          <>
            <RangePicker />
            <OverflowMenu />
            <Button>
              <PlusIcon />
              Invite member
            </Button>
          </>
        }
      />
      <StatsRow />
    </div>
  ),
};

export const TitleOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The minimum that still reads as a page: trail, title, one sentence. Read-only screens with nothing to act on should look like this rather than manufacturing a button to fill the actions slot.",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        breadcrumb={<Trail />}
        title="Qeet ID overview"
        description="Identity and access for the Acme Technologies tenant."
      />
    </div>
  ),
};

export const WithStatusAndFreshness: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A dashboard that reports on live data has to say how live it is. The plan badge and the “updated 40 seconds ago” line sit under the title, and refresh is a plain labelled button rather than an unexplained icon.",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        breadcrumb={<Trail />}
        title="Qeet ID overview"
        description="Identity and access for the Acme Technologies tenant."
        actions={
          <>
            <Button variant="outline">
              <RefreshCwIcon />
              Refresh
            </Button>
            <Button>
              <PlusIcon />
              Invite member
            </Button>
          </>
        }
      >
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Enterprise plan</Badge>
          <Badge variant="muted">ap-south-1 (Mumbai)</Badge>
          <Typography variant="muted" className="text-xs">
            Updated 40 seconds ago · refreshes every minute
          </Typography>
        </div>
      </PageHeader>
      <StatsRow />
    </div>
  ),
};

export const WithIncidentBanner: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Something is wrong with the data behind the numbers. The `Alert` goes between the header and the stats — above the figures it undermines, below the title that identifies the page — so nobody reads a partial number as a real one.",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        breadcrumb={<Trail />}
        title="Qeet ID overview"
        description="Identity and access for the Acme Technologies tenant."
        actions={
          <Button>
            <PlusIcon />
            Invite member
          </Button>
        }
      />
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Figures are 6 hours behind</AlertTitle>
        <AlertDescription>
          Qeet Logs aggregation for ap-south-1 is catching up after a maintenance window. Sign-in
          counts below exclude 04:00–10:00 IST today.
        </AlertDescription>
      </Alert>
      <StatsRow />
    </div>
  ),
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The header renders immediately — its content comes from the route, not the API — while the stat row is held open by skeletons. Reversing that (spinner in the title, stats popping in) is what makes a dashboard feel like it is thrashing.",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        breadcrumb={<Trail />}
        title="Qeet ID overview"
        description="Identity and access for the Acme Technologies tenant."
        actions={
          <Button disabled>
            <PlusIcon />
            Invite member
          </Button>
        }
      />
      <DataState isLoading skeletonRows={2} skeletonHeight="h-24" className="p-0">
        <StatsRow />
      </DataState>
    </div>
  ),
};
