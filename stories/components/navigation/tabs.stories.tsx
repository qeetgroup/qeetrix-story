import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { LayoutGridIcon } from "@qeetrix/icons/icons/layout-grid";
import { ShieldCheckIcon } from "@qeetrix/icons/icons/shield-check";
import { UsersIcon } from "@qeetrix/icons/icons/users";
import {
  Badge,
  Box,
  QeetrixProvider,
  Stack,
  Tab,
  Tabs,
  TabsList,
  TabsPanel,
  Text,
} from "@qeetrix/react";
import { PageContent, PageHeader } from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, fn, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

/** A panel's content, padded from the list. */
function Panel({ value, children }: { value: string; children: ReactNode }) {
  return (
    <TabsPanel value={value}>
      <Box paddingBlock="md">
        <Text tone="subtle">{children}</Text>
      </Box>
    </TabsPanel>
  );
}

/** Priya Sharma's user page. */
function UserPanels() {
  return (
    <>
      <Panel value="profile">priya@acme.in · Engineering</Panel>
      <Panel value="security">2 passkeys · Two-step sign-in on</Panel>
      <Panel value="sessions">3 active sessions</Panel>
      <Panel value="groups">Engineering, Payroll approvers</Panel>
      <Panel value="activity">Signed in from Bengaluru 2 minutes ago</Panel>
    </>
  );
}

const meta: Meta<typeof Tabs> = {
  title: "Components/Navigation/Tabs",
  component: Tabs,
  subcomponents: { TabsList, Tab, TabsPanel },
  parameters: {
    qeetrix: qx({ category: "navigation", status: "stable" }),
    layout: "padded",
  },
  args: {
    defaultValue: "profile",
    onValueChange: fn(),
  },
  render: (args) => (
    <div style={{ inlineSize: 560 }}>
      <Tabs {...args}>
        <TabsList aria-label="Priya Sharma">
          <Tab value="profile">Profile</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="sessions">Sessions</Tab>
          <Tab value="groups">Groups</Tab>
          <Tab value="activity">Activity</Tab>
        </TabsList>
        <UserPanels />
      </Tabs>
    </div>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Playground: Story = {};

export const Variants: Story = {
  args: { defaultValue: "all" },
  render: (args) => (
    <Stack gap="xl" style={{ inlineSize: 560 }}>
      {(["line", "contained"] as const).map((variant) => (
        <Stack key={variant} gap="sm">
          <Text size="sm" tone="subtle">
            {variant === "line" ? "Line" : "Contained"}
          </Text>
          <Tabs {...args}>
            <TabsList variant={variant} aria-label="Users">
              <Tab value="all">All users</Tab>
              <Tab value="invitations">Invitations</Tab>
              <Tab value="blocked">Blocked</Tab>
            </TabsList>
          </Tabs>
        </Stack>
      ))}
    </Stack>
  ),
};

export const Vertical: Story = {
  args: { defaultValue: "general", orientation: "vertical" },
  render: (args) => (
    <div style={{ inlineSize: 560 }}>
      <Tabs {...args}>
        <TabsList aria-label="Organisation settings">
          <Tab value="general">General</Tab>
          <Tab value="domains">Domains</Tab>
          <Tab value="branding">Branding</Tab>
          <Tab value="billing">Billing</Tab>
        </TabsList>
        <Box paddingInline="xl">
          <Panel value="general">Acme Pvt Ltd · Bengaluru</Panel>
          <Panel value="domains">acme.in · acme.co.in</Panel>
          <Panel value="branding">Logo and colours</Panel>
          <Panel value="billing">Business plan · ₹1,24,500 a year</Panel>
        </Box>
      </Tabs>
    </div>
  ),
};

export const Overflow: Story = {
  parameters: {
    docs: { description: { story: "More tabs than fit: the list scrolls sideways." } },
  },
  args: { defaultValue: "overview" },
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <Tabs {...args}>
        <TabsList aria-label="Payroll portal">
          {["Overview", "Users", "Groups", "Sign-in", "Credentials", "Branding", "Logs"].map(
            (label) => (
              <Tab key={label} value={label.toLowerCase()}>
                {label}
              </Tab>
            ),
          )}
        </TabsList>
        <Panel value="overview">642 sign-ins this month</Panel>
      </Tabs>
    </div>
  ),
};

export const InContext: Story = {
  name: "In context",
  parameters: { layout: "fullscreen" },
  args: { defaultValue: "users" },
  render: (args) => (
    <Tabs {...args}>
      <PageHeader
        title="Payroll portal"
        status={<Badge tone="success">Active</Badge>}
        tabs={
          <TabsList aria-label="Payroll portal">
            <Tab value="overview" icon={LayoutGridIcon} filledWhenSelected>
              Overview
            </Tab>
            <Tab value="users" icon={UsersIcon} filledWhenSelected badge={642}>
              Users
            </Tab>
            <Tab value="sign-in" icon={ShieldCheckIcon} filledWhenSelected>
              Sign-in
            </Tab>
            <Tab value="credentials" icon={KeyRoundIcon} filledWhenSelected>
              Credentials
            </Tab>
          </TabsList>
        }
      />
      <PageContent>
        <TabsPanel value="overview">
          <Text tone="subtle">OIDC · created 14 March 2024</Text>
        </TabsPanel>
        <TabsPanel value="users">
          <Text tone="subtle">Engineering, Finance and People</Text>
        </TabsPanel>
        <TabsPanel value="sign-in">
          <Text tone="subtle">Passkeys required</Text>
        </TabsPanel>
        <TabsPanel value="credentials">
          <Text tone="subtle">Secret rotated 1 September 2026</Text>
        </TabsPanel>
      </PageContent>
    </Tabs>
  ),
};

export const KeyboardInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: one Tab stop, arrows select",
  play: async ({ args, canvas, userEvent }) => {
    const tab = (name: string) => canvas.getByRole("tab", { name });

    await userEvent.tab();
    await expect(tab("Profile")).toHaveFocus();

    // activateOnFocus is on by default: moving selects.
    await userEvent.keyboard("{ArrowRight}");
    await expect(tab("Security")).toHaveFocus();
    await expect(tab("Security")).toHaveAttribute("aria-selected", "true");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("security", expect.anything());
    await expect(canvas.getByRole("tabpanel", { name: "Security" })).toHaveTextContent(
      "2 passkeys",
    );

    await userEvent.keyboard("{End}");
    await expect(tab("Activity")).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(tab("Profile")).toHaveFocus();

    // The panel follows the list in the Tab order.
    await userEvent.tab();
    await expect(canvas.getByRole("tabpanel", { name: "Profile" })).toHaveFocus();
  },
};

export const ManualActivationInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: manual activation for slow panels",
  render: (args) => (
    <div style={{ inlineSize: 560 }}>
      <Tabs {...args}>
        <TabsList aria-label="Priya Sharma" activateOnFocus={false}>
          <Tab value="profile">Profile</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="sessions">Sessions</Tab>
          <Tab value="groups">Groups</Tab>
          <Tab value="activity">Activity</Tab>
        </TabsList>
        <UserPanels />
      </Tabs>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const tab = (name: string) => canvas.getByRole("tab", { name });

    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await expect(tab("Sessions")).toHaveFocus();
    await expect(tab("Sessions")).toHaveAttribute("aria-selected", "false");
    await expect(tab("Profile")).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{Enter}");
    await expect(tab("Sessions")).toHaveAttribute("aria-selected", "true");
    await waitFor(() =>
      expect(canvas.getByRole("tabpanel", { name: "Sessions" })).toHaveTextContent(
        "3 active sessions",
      ),
    );
  },
};

export const RightToLeftInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: arrow keys follow right-to-left",
  render: (args) => (
    <QeetrixProvider direction="rtl">
      <div dir="rtl" style={{ inlineSize: 560 }}>
        <Tabs {...args}>
          <TabsList aria-label="Priya Sharma">
            <Tab value="profile">Profile</Tab>
            <Tab value="security">Security</Tab>
            <Tab value="sessions">Sessions</Tab>
          </TabsList>
          <UserPanels />
        </Tabs>
      </div>
    </QeetrixProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("tab", { name: "Profile" })).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(canvas.getByRole("tab", { name: "Security" })).toHaveFocus();
  },
};

export const CountInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a count follows the locale",
  render: (args) => (
    <Stack gap="md" style={{ inlineSize: 560 }}>
      <Tabs {...args} defaultValue="payments">
        <TabsList aria-label="Payments, en-IN">
          <Tab value="payments" badge={128400}>
            Payments
          </Tab>
          <Tab value="refunds" badge={<Badge tone="danger">3</Badge>}>
            Refunds
          </Tab>
        </TabsList>
      </Tabs>
      <QeetrixProvider locale="en-US">
        <Tabs {...args} defaultValue="payments">
          <TabsList aria-label="Payments, en-US">
            <Tab value="payments" badge={128400}>
              Payments
            </Tab>
          </TabsList>
        </Tabs>
      </QeetrixProvider>
    </Stack>
  ),
  play: async ({ canvas }) => {
    const [india, us] = canvas.getAllByRole("tablist");
    // A number is formatted for the provider's locale; a Badge passes through as it is.
    await expect(
      within(india as HTMLElement).getByRole("tab", { name: "Payments 1,28,400" }),
    ).toBeVisible();
    await expect(
      within(india as HTMLElement).getByRole("tab", { name: "Refunds 3" }),
    ).toBeVisible();
    await expect(
      within(us as HTMLElement).getByRole("tab", { name: "Payments 128,400" }),
    ).toBeVisible();
  },
};
