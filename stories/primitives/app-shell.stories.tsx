import {
  AppShell,
  AppShellContent,
  AppShellHeader,
  AppShellMain,
  Badge,
  Button,
  PageHeader,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof AppShell> = {
  title: "Primitives/AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The top-level page chrome shared across every Qeet product. `AppShell` composes a persistent sidebar region with `AppShellMain` (header + scrollable content), giving each product a consistent full-bleed canvas without re-implementing layout logic.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Qeet ID admin layout — sidebar navigation with a top-bar action and a page header inside the main content pane.",
      },
    },
  },
  render: () => (
    <AppShell className="h-[28rem] min-h-0 overflow-hidden rounded-lg ring-1 ring-foreground/10">
      <aside className="hidden w-48 shrink-0 border-e bg-muted/30 p-3 text-sm sm:block">
        <div className="font-medium">Qeet ID</div>
        <nav className="mt-3 flex flex-col gap-1 text-muted-foreground">
          <span className="rounded px-2 py-1 text-foreground bg-accent">Dashboard</span>
          <span className="px-2 py-1">Users</span>
          <span className="px-2 py-1">API keys</span>
          <span className="px-2 py-1">Passkeys</span>
          <span className="px-2 py-1">Audit log</span>
          <span className="px-2 py-1">Webhooks</span>
        </nav>
      </aside>
      <AppShellMain>
        <AppShellHeader>
          <span className="text-sm font-medium">Admin · Qeet ID</span>
          <Button size="sm" className="ms-auto">
            Invite user
          </Button>
        </AppShellHeader>
        <AppShellContent>
          <PageHeader
            title="Users"
            description="Manage who can sign in to this tenant. Passkey and SSO users are listed together."
          />
        </AppShellContent>
      </AppShellMain>
    </AppShell>
  ),
};

export const WithBadge: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Shows how a nav item can carry an unread badge — useful for surfacing pending webhook deliveries or unacknowledged audit events.",
      },
    },
  },
  render: () => (
    <AppShell className="h-[28rem] min-h-0 overflow-hidden rounded-lg ring-1 ring-foreground/10">
      <aside className="hidden w-48 shrink-0 border-e bg-muted/30 p-3 text-sm sm:block">
        <div className="font-medium">Qeet ID</div>
        <nav className="mt-3 flex flex-col gap-1 text-muted-foreground">
          <span className="px-2 py-1">Dashboard</span>
          <span className="px-2 py-1">Users</span>
          <span className="flex items-center justify-between px-2 py-1">
            Webhooks
            <Badge variant="destructive" className="h-4 px-1 text-[10px]">
              3
            </Badge>
          </span>
          <span className="px-2 py-1">Audit log</span>
        </nav>
      </aside>
      <AppShellMain>
        <AppShellHeader>
          <span className="text-sm font-medium">Admin · Qeet ID</span>
        </AppShellHeader>
        <AppShellContent>
          <PageHeader
            title="Webhooks"
            description="3 endpoints have delivery failures in the last 24 hours."
          />
        </AppShellContent>
      </AppShellMain>
    </AppShell>
  ),
};
