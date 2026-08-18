import { Tabs, TabsContent, TabsList, TabsTrigger } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Tabs> = {
  title: "Primitives/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A tabbed navigation panel for switching between views within a single page context. Use it to organise related settings, reports, or resource details — for example the Account / Security / Sessions tabs on a Qeet ID profile page, or Overview / Members / API keys on an organisation detail page.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Qeet ID profile page tabs — Account, Security, and Sessions in a standard 3-tab layout.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="account" className="w-80">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-3 text-sm text-muted-foreground">
        Manage your name, email, and avatar.
      </TabsContent>
      <TabsContent value="security" className="p-3 text-sm text-muted-foreground">
        Configure passkeys, MFA, and recovery codes.
      </TabsContent>
      <TabsContent value="sessions" className="p-3 text-sm text-muted-foreground">
        Review and revoke active sessions.
      </TabsContent>
    </Tabs>
  ),
};

export const OrgDetail: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Organisation detail page tabs — five sections covering the full lifecycle of a Qeet ID tenant.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="overview" className="w-120">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="api-keys">API keys</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-3 text-sm text-muted-foreground">
        Acme Inc. · Pro plan · 24 members · Created 2025-01-14
      </TabsContent>
      <TabsContent value="members" className="p-3 text-sm text-muted-foreground">
        Manage roles: Admin, Member, Viewer.
      </TabsContent>
      <TabsContent value="api-keys" className="p-3 text-sm text-muted-foreground">
        2 live keys · last rotated 2026-03-01
      </TabsContent>
      <TabsContent value="webhooks" className="p-3 text-sm text-muted-foreground">
        3 active endpoints · 99.8% delivery rate
      </TabsContent>
      <TabsContent value="billing" className="p-3 text-sm text-muted-foreground">
        Next invoice: ₹12,400 on 2026-07-01
      </TabsContent>
    </Tabs>
  ),
};
