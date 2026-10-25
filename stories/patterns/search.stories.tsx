import { QeetLogo } from "@qeetrix/icons";
import { AppWindowIcon } from "@qeetrix/icons/icons/app-window";
import { BuildingIcon } from "@qeetrix/icons/icons/building";
import { FileDownIcon } from "@qeetrix/icons/icons/file-down";
import { FingerprintPatternIcon } from "@qeetrix/icons/icons/fingerprint-pattern";
import { HouseIcon } from "@qeetrix/icons/icons/house";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { LayoutGridIcon } from "@qeetrix/icons/icons/layout-grid";
import { LifeBuoyIcon } from "@qeetrix/icons/icons/life-buoy";
import { LockKeyholeIcon } from "@qeetrix/icons/icons/lock-keyhole";
import { MonitorSmartphoneIcon } from "@qeetrix/icons/icons/monitor-smartphone";
import { ScrollTextIcon } from "@qeetrix/icons/icons/scroll-text";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { ShieldCheckIcon } from "@qeetrix/icons/icons/shield-check";
import { ShieldUserIcon } from "@qeetrix/icons/icons/shield-user";
import { TimerIcon } from "@qeetrix/icons/icons/timer";
import { UserGroupIcon } from "@qeetrix/icons/icons/user-group";
import { UserPlusIcon } from "@qeetrix/icons/icons/user-plus";
import { UsersIcon } from "@qeetrix/icons/icons/users";
import { WebhookIcon } from "@qeetrix/icons/icons/webhook";
import { Avatar, IconButton, Menu, MenuContent, MenuItem, MenuTrigger } from "@qeetrix/react";
import {
  AppShell,
  type CommandGroup,
  type CommandItem,
  CommandPalette,
  PageHeader,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  TopBar,
  TopBarSearch,
  TopBarSwitcher,
} from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useRef, useState } from "react";
import { expect, waitFor, within } from "storybook/test";

/** The Qeet ID console frame (qeetrix-react's `tests/fixtures/qeet-id-console.tsx`). */
function ConsoleFrame({ search, children }: { search: ReactNode; children: ReactNode }) {
  return (
    <AppShell
      topBar={
        <TopBar
          launcher={<IconButton icon={LayoutGridIcon} aria-label="Qeet products" tone="neutral" />}
          logo={<QeetLogo variant="dark" height={20} />}
          product="Qeet ID"
          href="#home"
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
          search={search}
          account={<Avatar name="Priya Sharma" size="sm" />}
        />
      }
      sidebar={
        <Sidebar
          label="Qeet ID"
          footer={
            <SidebarGroup>
              <SidebarItem label="Settings" href="#settings" icon={SettingsIcon} />
              <SidebarItem label="Help and docs" href="#help" icon={LifeBuoyIcon} />
            </SidebarGroup>
          }
        >
          <SidebarGroup>
            <SidebarItem label="Overview" href="#overview" icon={HouseIcon} current />
          </SidebarGroup>
          <SidebarGroup label="Directory">
            <SidebarItem label="Users" href="#users" icon={UsersIcon} badge="1,284" />
            <SidebarItem label="Groups" href="#groups" icon={UserGroupIcon} badge="38" />
            <SidebarItem label="Organisations" href="#orgs" icon={BuildingIcon} />
          </SidebarGroup>
          <SidebarGroup label="Access">
            <SidebarItem label="Applications" href="#apps" icon={AppWindowIcon} badge="12" />
            <SidebarItem label="Roles" href="#roles" icon={ShieldUserIcon} />
          </SidebarGroup>
          <SidebarGroup label="Security">
            <SidebarItem label="Authentication" href="#authn" icon={FingerprintPatternIcon} />
            <SidebarItem label="Sessions" href="#sessions" icon={MonitorSmartphoneIcon} />
            <SidebarItem label="Audit logs" href="#audit" icon={ScrollTextIcon} />
          </SidebarGroup>
          <SidebarGroup label="Developers">
            <SidebarItem label="API keys" href="#keys" icon={KeyRoundIcon} />
            <SidebarItem label="Webhooks" href="#webhooks" icon={WebhookIcon} />
          </SidebarGroup>
        </Sidebar>
      }
    >
      {children}
    </AppShell>
  );
}

/** What Qeet ID's palette finds: people, applications, settings and actions. */
const GROUPS: CommandGroup[] = [
  {
    label: "Users",
    items: [
      {
        value: "usr_001",
        label: "Priya Sharma",
        description: "priya@acme.in · Engineering",
        avatar: { name: "Priya Sharma" },
      },
      {
        value: "usr_014",
        label: "Priyanka Rao",
        description: "priyanka.rao@acme.in · Finance",
        avatar: { name: "Priyanka Rao" },
      },
      {
        value: "usr_002",
        label: "Rahul Verma",
        description: "rahul.verma@acme.in · Finance",
        avatar: { name: "Rahul Verma" },
      },
    ],
  },
  {
    label: "Applications",
    items: [
      { value: "app_hr", label: "Acme HR portal", meta: "OIDC", icon: AppWindowIcon },
      { value: "app_payroll", label: "Acme Payroll", meta: "SAML", icon: AppWindowIcon },
      { value: "app_support", label: "Priority support portal", meta: "OIDC", icon: AppWindowIcon },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        value: "set_mfa",
        label: "Two-step sign-in",
        meta: "Security › Policies",
        icon: ShieldCheckIcon,
        keywords: ["MFA", "2FA", "OTP"],
      },
      {
        value: "set_session",
        label: "Session lifetime",
        meta: "Security › Sessions",
        icon: TimerIcon,
      },
      {
        value: "set_password",
        label: "Password policy",
        meta: "Security › Policies",
        icon: LockKeyholeIcon,
      },
    ],
  },
  {
    label: "Actions",
    items: [
      { value: "act_invite", label: "Invite users", icon: UserPlusIcon, shortcut: ["I"] },
      { value: "act_export", label: "Export audit logs", icon: FileDownIcon },
    ],
  },
];

/** Every record the "server" knows, for the story that searches as you type. */
const DIRECTORY: CommandItem[] = GROUPS.flatMap((group) => group.items);

interface ConsoleProps {
  defaultOpen?: boolean;
  /** Search on the "server" as the query changes, instead of filtering `GROUPS`. */
  serverSearch?: boolean;
}

/** The TopBar's search and ⌘K open the palette; choosing a result goes to its page. */
function SearchConsole({ defaultOpen = false, serverSearch = false }: ConsoleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [opened, setOpened] = useState<CommandItem | null>(null);
  const [results, setResults] = useState<CommandGroup[]>([]);
  const [searching, setSearching] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const search = (query: string) => {
    window.clearTimeout(timer.current);
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    timer.current = window.setTimeout(() => {
      const needle = query.trim().toLowerCase();
      const found = DIRECTORY.filter((item) =>
        `${item.label} ${item.description ?? ""}`.toLowerCase().includes(needle),
      );
      setResults(found.length ? [{ label: "Results", items: found }] : []);
      setSearching(false);
    }, 600);
  };

  return (
    <ConsoleFrame
      search={
        <TopBarSearch
          placeholder="Search or jump to…"
          shortcut={["⌘", "K"]}
          aria-keyshortcuts="Meta+K Control+K"
          onClick={() => setOpen(true)}
        />
      }
    >
      <PageHeader
        title={opened?.label ?? "Overview"}
        description={opened?.description ?? "Identity and access for Acme Pvt Ltd."}
      />
      <CommandPalette
        groups={serverSearch ? results : GROUPS}
        open={open}
        onOpenChange={setOpen}
        onSelect={setOpened}
        {...(serverSearch ? { onQueryChange: search, loading: searching } : {})}
      />
    </ConsoleFrame>
  );
}

/** The palette is a modal dialog in a portal, so query it from the document, not the canvas. */
const page = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);

const meta: Meta = {
  title: "Patterns/Search",
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, iframeHeight: 720 },
      description: { component: "Search or jump to: the top bar's search opens CommandPalette." },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Open",
  render: () => <SearchConsole defaultOpen />,
};

export const Closed: Story = {
  render: () => <SearchConsole />,
};

export const NarrowsAsYouType: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: typing narrows the results",
  render: () => <SearchConsole defaultOpen />,
  play: async ({ canvasElement, userEvent }) => {
    const doc = page(canvasElement);
    const box = await doc.findByRole("combobox", { name: "Search or jump to" });
    await userEvent.type(box, "pri");
    await waitFor(() => expect(doc.getByRole("option", { name: /Priya Sharma/ })).toBeVisible());
    await expect(doc.getByRole("option", { name: /Priority support portal/ })).toBeVisible();
    await expect(doc.queryByRole("option", { name: /Rahul Verma/ })).toBeNull();
    // Keywords count: "mfa" finds Two-step sign-in.
    await userEvent.clear(box);
    await userEvent.type(box, "mfa");
    await waitFor(() =>
      expect(doc.getByRole("option", { name: /Two-step sign-in/ })).toBeVisible(),
    );
  },
};

export const NoResults: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: nothing matches",
  render: () => <SearchConsole defaultOpen />,
  play: async ({ canvasElement, userEvent }) => {
    const doc = page(canvasElement);
    await userEvent.type(
      await doc.findByRole("combobox", { name: "Search or jump to" }),
      "dorothy",
    );
    await waitFor(() => expect(doc.getByText("No results for “dorothy”")).toBeVisible());
    await expect(doc.queryAllByRole("option")).toHaveLength(0);
  },
};

export const ServerSearch: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the server searches as you type",
  // A pretend server answers in 600ms; `loading` shows Searching… meanwhile.
  render: () => <SearchConsole defaultOpen serverSearch />,
  play: async ({ canvasElement, userEvent }) => {
    const doc = page(canvasElement);
    await userEvent.type(await doc.findByRole("combobox", { name: "Search or jump to" }), "acme");
    await waitFor(() => expect(doc.getByRole("status")).toHaveTextContent("Searching…"));
    await waitFor(() => expect(doc.getByRole("option", { name: /Acme Payroll/ })).toBeVisible(), {
      timeout: 3000,
    });
  },
};

export const OpenFromTopBar: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the top bar opens it, Enter goes",
  render: () => <SearchConsole />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const doc = page(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Search or jump to…" });
    await userEvent.click(trigger);
    const box = await doc.findByRole("combobox", { name: "Search or jump to" });
    await waitFor(() => expect(box).toHaveFocus());
    await userEvent.type(box, "rahul");
    await waitFor(() =>
      expect(doc.getByRole("option", { name: /Rahul Verma/ })).toHaveAttribute("data-highlighted"),
    );
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(doc.queryByRole("dialog")).toBeNull());
    await expect(canvas.getByRole("heading", { level: 1, name: "Rahul Verma" })).toBeVisible();
  },
};

export const Hotkey: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: ⌘K opens it, Escape closes it",
  render: () => <SearchConsole />,
  play: async ({ canvasElement, userEvent }) => {
    const doc = page(canvasElement);
    await userEvent.keyboard("{Meta>}k{/Meta}");
    // It fades in, so wait for it to be visible, not just present.
    await waitFor(() =>
      expect(doc.getByRole("dialog", { name: "Search or jump to" })).toBeVisible(),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(doc.queryByRole("dialog")).toBeNull());
    await userEvent.keyboard("{Control>}k{/Control}");
    await waitFor(() =>
      expect(doc.getByRole("dialog", { name: "Search or jump to" })).toBeVisible(),
    );
  },
};
