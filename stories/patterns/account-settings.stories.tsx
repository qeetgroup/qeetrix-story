import { QeetLogo } from "@qeetrix/icons";
import { AppWindowIcon } from "@qeetrix/icons/icons/app-window";
import { BuildingIcon } from "@qeetrix/icons/icons/building";
import { FingerprintPatternIcon } from "@qeetrix/icons/icons/fingerprint-pattern";
import { HouseIcon } from "@qeetrix/icons/icons/house";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { LayoutGridIcon } from "@qeetrix/icons/icons/layout-grid";
import { LifeBuoyIcon } from "@qeetrix/icons/icons/life-buoy";
import { MailIcon } from "@qeetrix/icons/icons/mail";
import { MonitorSmartphoneIcon } from "@qeetrix/icons/icons/monitor-smartphone";
import { ScrollTextIcon } from "@qeetrix/icons/icons/scroll-text";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { ShieldUserIcon } from "@qeetrix/icons/icons/shield-user";
import { SmartphoneIcon } from "@qeetrix/icons/icons/smartphone";
import { UserGroupIcon } from "@qeetrix/icons/icons/user-group";
import { UsersIcon } from "@qeetrix/icons/icons/users";
import { WebhookIcon } from "@qeetrix/icons/icons/webhook";
import {
  Avatar,
  Button,
  Card,
  Field,
  IconButton,
  Inline,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Text,
  TextField,
} from "@qeetrix/react";
import {
  AppShell,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  PageContent,
  PageHeader,
  Sidebar,
  SidebarGroup,
  SidebarItem,
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
function ConsoleFrame({ children }: { children: ReactNode }) {
  return (
    <AppShell
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
              <SidebarItem
                label="Settings"
                href="#settings"
                render={route}
                icon={SettingsIcon}
                current
              />
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

function SettingsPage({ children }: { children: ReactNode }) {
  return (
    <ConsoleFrame>
      <PageHeader
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbItem href="#settings" render={route}>
              Settings
            </BreadcrumbItem>
            <BreadcrumbItem current>Account</BreadcrumbItem>
          </Breadcrumb>
        }
        title="Account settings"
        description="How you appear across every Qeet product."
      />
      <PageContent width="narrow">
        <Stack gap="xl">{children}</Stack>
      </PageContent>
    </ConsoleFrame>
  );
}

const TIME_ZONES = [
  { value: "Asia/Kolkata", label: "(GMT+05:30) India Standard Time" },
  { value: "Asia/Singapore", label: "(GMT+08:00) Singapore" },
  { value: "Europe/London", label: "(GMT+00:00) London" },
];

const LANGUAGES = [
  { value: "en-IN", label: "English (India)" },
  { value: "hi-IN", label: "हिन्दी" },
];

/**
 * Values that change together are saved together: a Form around the Card, Save in its footer.
 * `dirty` starts with edits made; `errors` are the server's, keyed by field `name`. Either way,
 * Form's error summary lists them above the Card: an `h2`, beside the Card's title.
 */
function ProfileCard({
  dirty: initiallyDirty = false,
  errors,
}: {
  dirty?: boolean;
  errors?: Record<string, string>;
}) {
  const [dirty, setDirty] = useState(initiallyDirty);
  return (
    <Form
      aria-label="Profile"
      summaryTitle="Fix this to save your profile"
      errors={errors}
      onChange={() => setDirty(true)}
      onReset={() => setDirty(false)}
      onFormSubmit={() => setDirty(false)}
    >
      <Card
        title="Profile"
        level={2}
        description="Shown to everyone in Acme Pvt Ltd."
        footer={
          <Inline gap="sm" justify="between" style={{ flex: 1 }}>
            <Text size="sm" tone="subtle">
              {dirty ? "You have unsaved changes." : ""}
            </Text>
            <Inline gap="sm">
              <Button type="reset" variant="ghost" disabled={!dirty}>
                Discard changes
              </Button>
              <Button type="submit" disabled={!dirty}>
                Save changes
              </Button>
            </Inline>
          </Inline>
        }
      >
        <Stack gap="lg">
          <TextField
            label="Full name"
            name="name"
            defaultValue={initiallyDirty ? "Priya S. Sharma" : "Priya Sharma"}
            autoComplete="name"
            validate={(value) => (String(value ?? "").trim() ? null : "Enter your full name")}
          />
          <TextField
            label="Work email"
            name="email"
            type="email"
            defaultValue="priya@acme.in"
            readOnly
            description="Synced from Azure AD."
          />
          <TextField label="Job title" name="title" defaultValue="Engineering Manager" optional />
          <Field label="Time zone" name="timeZone">
            <Select
              items={TIME_ZONES}
              defaultValue={initiallyDirty ? "Asia/Singapore" : "Asia/Kolkata"}
            />
          </Field>
          <Field label="Language" name="language">
            <Select items={LANGUAGES} defaultValue="en-IN" />
          </Field>
        </Stack>
      </Card>
    </Form>
  );
}

/** Each method needs a line of explanation, so they're choice tiles. */
function SignInCard() {
  return (
    <Form aria-label="Preferred sign-in">
      <Card
        title="Preferred sign-in"
        level={2}
        description="What Qeet ID asks for first."
        footer={<Button type="submit">Save preference</Button>}
      >
        <RadioGroup
          label="Sign in with"
          name="method"
          variant="tile"
          columns={3}
          defaultValue="passkey"
        >
          <Radio
            value="passkey"
            icon={FingerprintPatternIcon}
            label="Passkey"
            description="Touch ID, Windows Hello or a security key."
          />
          <Radio
            value="authenticator"
            icon={SmartphoneIcon}
            label="Authenticator app"
            description="A 6-digit code that changes every 30 seconds."
          />
          <Radio
            value="email"
            icon={MailIcon}
            label="Email code"
            description="Turned off by your administrator."
            disabled
          />
        </RadioGroup>
      </Card>
    </Form>
  );
}

/** Switches apply at once, so this card has no Save button. */
function NotificationsCard() {
  return (
    <Card title="Email notifications" level={2} description="Sent to priya@acme.in.">
      <Stack gap="lg">
        <Switch
          label="Weekly summary"
          description="Sign-in anomalies and expiring keys."
          defaultChecked
        />
        <Switch label="Product updates" description="New releases, about once a month." />
        <Switch
          label="Security alerts"
          description="Required by Acme Pvt Ltd."
          defaultChecked
          disabled
        />
      </Stack>
    </Card>
  );
}

const meta: Meta = {
  title: "Patterns/Account settings",
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, iframeHeight: 900 },
      description: {
        component: "A Qeet ID settings page: forms that save, and switches that apply at once.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SettingsPage>
      <ProfileCard />
      <SignInCard />
      <NotificationsCard />
    </SettingsPage>
  ),
};

export const UnsavedChanges: Story = {
  name: "Unsaved changes",
  render: () => (
    <SettingsPage>
      <ProfileCard dirty />
    </SettingsPage>
  ),
};

export const SaveFailed: Story = {
  name: "Save failed",
  render: () => (
    <SettingsPage>
      <ProfileCard
        dirty
        errors={{ name: "Acme Pvt Ltd manages names in Azure AD. Change yours there." }}
      />
    </SettingsPage>
  ),
};

export const EditWakesSave: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: editing turns Save on",
  render: () => (
    <SettingsPage>
      <ProfileCard />
    </SettingsPage>
  ),
  play: async ({ canvas, userEvent }) => {
    // Disabled buttons stay focusable, so they're `aria-disabled` rather than `disabled`.
    const save = canvas.getByRole("button", { name: "Save changes" });
    await expect(save).toHaveAttribute("aria-disabled", "true");
    const jobTitle = canvas.getByRole("textbox", { name: /Job title/ });
    await userEvent.clear(jobTitle);
    await userEvent.type(jobTitle, "Director of Engineering");
    await waitFor(() => expect(save).toHaveAttribute("aria-disabled", "false"));
    await expect(canvas.getByText("You have unsaved changes.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Discard changes" }));
    await waitFor(() => expect(save).toHaveAttribute("aria-disabled", "true"));
    await expect(jobTitle).toHaveValue("Engineering Manager");
  },
};

export const EmptyNameIsCaught: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: an empty name is caught on Save",
  render: () => (
    <SettingsPage>
      <ProfileCard />
    </SettingsPage>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.clear(canvas.getByRole("textbox", { name: "Full name" }));
    await userEvent.click(canvas.getByRole("button", { name: "Save changes" }));
    const name = canvas.getByRole("textbox", { name: "Full name" });
    await waitFor(() => expect(name).toHaveAttribute("aria-invalid", "true"));
    await expect(name).toHaveAccessibleDescription(expect.stringContaining("Enter your full name"));
    // Form's error summary lists it too, linked to the field.
    const summary = canvas.getByRole("link", { name: "Enter your full name" });
    await expect(summary).toBeVisible();
    await expect(summary).toHaveAttribute("href", `#${name.id}`);
    // Its heading sits beside the Card's h2, and it takes focus so the heading is read first.
    const heading = canvas.getByRole("heading", {
      level: 2,
      name: "Fix this to save your profile",
    });
    await waitFor(() => expect(heading.closest("[data-slot=error-summary]")).toHaveFocus());
  },
};

export const ChooseSignIn: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a click anywhere on a tile chooses it",
  render: () => (
    <SettingsPage>
      <SignInCard />
    </SettingsPage>
  ),
  play: async ({ canvas, userEvent }) => {
    // The label covers the whole tile: click what's really under the description.
    const description = canvas.getByText("A 6-digit code that changes every 30 seconds.");
    const box = description.getBoundingClientRect();
    const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
    await expect(hit?.closest("label")).not.toBeNull();
    await userEvent.click(hit as HTMLElement);
    await expect(canvas.getByRole("radio", { name: /Authenticator app/ })).toBeChecked();
    await expect(canvas.getByRole("radio", { name: /Passkey/ })).not.toBeChecked();
  },
};
