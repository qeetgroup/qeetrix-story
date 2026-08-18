import { AreaChart, Button, type ChartConfig, PageHeader, Stat } from "@qeetrix/ui";
import { DashboardShell } from "@qeetrix/ui/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof DashboardShell> = {
  title: "Blocks/DashboardShell",
  component: DashboardShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The app frame for product dashboards — a responsive sidebar + header + scrollable content region. Compose it with `PageHeader`, `Stat`, charts and tables to build an admin home like the Qeet ID console; the shell only owns layout, so the navigation and content are entirely yours.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DashboardShell>;

const trend = [
  { month: "Jan", users: 420 },
  { month: "Feb", users: 510 },
  { month: "Mar", users: 680 },
  { month: "Apr", users: 740 },
  { month: "May", users: 910 },
  { month: "Jun", users: 1120 },
];
const trendConfig = {
  users: { label: "Users", color: "var(--chart-1)" },
} satisfies ChartConfig;

export const ReferenceDashboard: Story = {
  render: () => (
    <DashboardShell
      sidebar={
        <aside className="hidden w-56 shrink-0 border-e bg-sidebar p-4 md:block">
          <div className="mb-4 font-heading text-sm font-semibold">Qeet</div>
          <nav className="flex flex-col gap-1 text-sm">
            {["Overview", "Users", "Sessions", "Settings"].map((item, i) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className={`rounded-md px-2 py-1.5 ${i === 0 ? "bg-sidebar-accent font-medium" : "text-muted-foreground hover:bg-sidebar-accent"}`}
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>
      }
      header={<span className="text-sm font-medium">Acme Inc.</span>}
    >
      <PageHeader
        title="Overview"
        description="Your workspace at a glance."
        actions={<Button size="sm">Invite</Button>}
        className="mb-6"
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Active users" value="1,120" delta="+18%" trend="up" />
        <Stat label="Sessions" value="8,402" delta="+4%" trend="up" />
        <Stat label="Error rate" value="0.4%" delta="-1.2%" trend="down" />
      </div>
      <div className="rounded-xl p-4 ring-1 ring-foreground/10">
        <AreaChart data={trend} config={trendConfig} categoryKey="month" dataKeys={["users"]} />
      </div>
    </DashboardShell>
  ),
};
