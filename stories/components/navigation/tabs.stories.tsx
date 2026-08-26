import { Tabs, TabsContent, TabsList, TabsTrigger } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Tabs> = {
  title: "Components/Navigation/Tabs",
  component: Tabs,
  parameters: {
    qeetrix: qx({ category: "navigation", status: "stable" }),
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

export const SwitchInteraction: Story = {
  name: "Interaction: switching tabs",
  parameters: {
    docs: {
      description: {
        story:
          "Switching a tab must swap the visible panel and move `aria-selected` with it. Asserting the outgoing panel is gone catches the case where panels stack up instead of replacing one another.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="account" className="w-80">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-3 text-sm">
        Manage your name, email, and avatar.
      </TabsContent>
      <TabsContent value="security" className="p-3 text-sm">
        Configure passkeys, MFA, and recovery codes.
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas, userEvent }) => {
    const security = canvas.getByRole("tab", { name: "Security" });
    await expect(canvas.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await userEvent.click(security);

    await expect(security).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByText("Configure passkeys, MFA, and recovery codes.")).toBeVisible();
    // The outgoing panel stays mounted while it animates out, so this has to wait for
    // the unmount rather than checking on the next frame — asserting immediately here
    // passed roughly one run in four.
    await waitFor(() =>
      expect(canvas.queryByText("Manage your name, email, and avatar.")).not.toBeInTheDocument(),
    );
  },
};
