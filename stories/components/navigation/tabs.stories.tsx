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
          "A tabbed navigation panel for switching between views within a single page context. Use it to organise related settings, reports, or resource details — for example the Account / Security / Sessions tabs on a Qeet ID profile page, or Overview / Members / API keys on an organisation detail page.\n\n`variant` is set on `TabsList` and read by its triggers. `default` is contained: a sunken well with the selected tab as the raised surface inside it — a segmented view switch for a card, a toolbar or a panel. `line` is the underline treatment: tabs sit on a 1px track and the selected tab carries a 2px Qeet indicator — page- and section-level navigation. Vertical `line` tabs put the indicator on the inline-start track. Horizontal lists scroll rather than overflow; arrow keys move focus between tabs and Enter or Space activates the focused one.",
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

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`variant="default"` (contained) and `variant="line"` (underline) on the same three tabs. Reach for `default` to switch views inside a card or panel, and `line` for page-level navigation, where a row of contained tabs would read as a control rather than a section header.',
      },
    },
  },
  render: () => (
    <div className="flex w-96 flex-col gap-8">
      {(["default", "line"] as const).map((variant) => (
        <Tabs key={variant} defaultValue="account">
          <TabsList variant={variant} aria-label={`Profile sections (${variant})`}>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="p-3 text-sm text-muted-foreground">
            {`variant="${variant}"`} — manage your name, email, and avatar.
          </TabsContent>
          <TabsContent value="security" className="p-3 text-sm text-muted-foreground">
            Configure passkeys, MFA, and recovery codes.
          </TabsContent>
          <TabsContent value="sessions" className="p-3 text-sm text-muted-foreground">
            Review and revoke active sessions.
          </TabsContent>
        </Tabs>
      ))}
    </div>
  ),
};

export const Line: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`variant="line"` as page navigation in qeet-logs. The list spans the full width on a 1px track, the selected tab carries the 2px Qeet indicator, and hovering a tab previews a neutral one.',
      },
    },
  },
  render: () => (
    <Tabs defaultValue="streams" className="w-120">
      <TabsList variant="line" aria-label="qeet-logs">
        <TabsTrigger value="streams">Streams</TabsTrigger>
        <TabsTrigger value="saved">Saved searches</TabsTrigger>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
        <TabsTrigger value="retention">Retention</TabsTrigger>
      </TabsList>
      <TabsContent value="streams" className="p-3 text-sm text-muted-foreground">
        12 streams · 4.2 GB ingested today
      </TabsContent>
      <TabsContent value="saved" className="p-3 text-sm text-muted-foreground">
        7 saved searches shared with the Platform team
      </TabsContent>
      <TabsContent value="alerts" className="p-3 text-sm text-muted-foreground">
        3 alert rules · 1 firing on auth-service
      </TabsContent>
      <TabsContent value="retention" className="p-3 text-sm text-muted-foreground">
        Hot storage 14 days · archive 1 year
      </TabsContent>
    </Tabs>
  ),
};

export const LineVertical: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Vertical `line` tabs for a qeet-pay settings page. The track and the 2px indicator move to the inline-start edge, matching the sidebar, and the panel sits beside the list.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="general" orientation="vertical" className="w-120">
      <TabsList variant="line" aria-label="qeet-pay settings">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="payouts">Payouts</TabsTrigger>
        <TabsTrigger value="gst">GST &amp; invoicing</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="px-3 text-sm text-muted-foreground">
        Business name, support email and statement descriptor.
      </TabsContent>
      <TabsContent value="payouts" className="px-3 text-sm text-muted-foreground">
        Daily payouts to HDFC Bank ••••4821, T+1 settlement.
      </TabsContent>
      <TabsContent value="gst" className="px-3 text-sm text-muted-foreground">
        GSTIN 29ABCDE1234F1Z5 · invoice prefix INV-2026-
      </TabsContent>
      <TabsContent value="webhooks" className="px-3 text-sm text-muted-foreground">
        2 endpoints · signing secret rotated 1 Sep 2026
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

export const LineKeyboardInteraction: Story = {
  name: "Interaction: line tabs keyboard switching",
  parameters: {
    docs: {
      description: {
        story:
          "Line tabs use manual activation: the arrow keys move focus along the list without changing the panel, and Enter commits. The test pins both halves — a focused tab is not yet selected, and the selected tab and its panel move only on Enter — plus End and Home jumping to the ends of the list.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="streams" className="w-120">
      <TabsList variant="line" aria-label="qeet-logs">
        <TabsTrigger value="streams">Streams</TabsTrigger>
        <TabsTrigger value="saved">Saved searches</TabsTrigger>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
      </TabsList>
      <TabsContent value="streams" className="p-3 text-sm">
        12 streams · 4.2 GB ingested today
      </TabsContent>
      <TabsContent value="saved" className="p-3 text-sm">
        7 saved searches shared with the Platform team
      </TabsContent>
      <TabsContent value="alerts" className="p-3 text-sm">
        3 alert rules · 1 firing on auth-service
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas, userEvent }) => {
    const streams = canvas.getByRole("tab", { name: "Streams" });
    const saved = canvas.getByRole("tab", { name: "Saved searches" });
    const alerts = canvas.getByRole("tab", { name: "Alerts" });

    // One tab stop: Tab lands on the selected tab.
    await userEvent.tab();
    await expect(streams).toHaveFocus();

    // Arrow keys move focus only — the selection stays put until the user commits.
    await userEvent.keyboard("{ArrowRight}");
    await expect(saved).toHaveFocus();
    await expect(saved).toHaveAttribute("aria-selected", "false");
    await expect(streams).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{Enter}");
    await expect(saved).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByText("7 saved searches shared with the Platform team")).toBeVisible();
    await waitFor(() =>
      expect(canvas.queryByText("12 streams · 4.2 GB ingested today")).not.toBeInTheDocument(),
    );

    await userEvent.keyboard("{End}");
    await expect(alerts).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(streams).toHaveFocus();
  },
};
