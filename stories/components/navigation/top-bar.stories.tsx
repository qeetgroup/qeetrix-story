import { QeetLogo } from "@qeetrix/icons";
import { ActivityIcon } from "@qeetrix/icons/icons/activity";
import { AppWindowIcon } from "@qeetrix/icons/icons/app-window";
import { BellIcon } from "@qeetrix/icons/icons/bell";
import { CircleQuestionMarkIcon } from "@qeetrix/icons/icons/circle-question-mark";
import { HouseIcon } from "@qeetrix/icons/icons/house";
import { LayoutGridIcon } from "@qeetrix/icons/icons/layout-grid";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { UsersIcon } from "@qeetrix/icons/icons/users";
import {
  Avatar,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
  Text,
} from "@qeetrix/react";
import {
  AppShell,
  type AppShellDrawer,
  CommandPalette,
  PageContent,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  TopBar,
  TopBarSearch,
  type TopBarStatus,
  TopBarSwitcher,
} from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

/**
 * The console's router link, in miniature: like a router's `Link`, it handles the click itself.
 * Storybook sends a plain link to the parent frame, which would leave Storybook.
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

const routerLink = <RouterLink />;

/** The suite launcher: Qeet's products behind a neutral IconButton. */
function Launcher() {
  return (
    <Menu>
      <MenuTrigger
        render={<IconButton icon={LayoutGridIcon} aria-label="Qeet products" tone="neutral" />}
      />
      <MenuContent>
        <MenuItem>Qeet ID</MenuItem>
        <MenuItem>Qeet Pay</MenuItem>
        <MenuItem>Qeet People</MenuItem>
        <MenuItem>Qeet Notify</MenuItem>
        <MenuItem>Qeet Logs</MenuItem>
      </MenuContent>
    </Menu>
  );
}

const ENVIRONMENTS: { value: string; label: string; status: TopBarStatus }[] = [
  { value: "production", label: "Production", status: "success" },
  { value: "staging", label: "Staging", status: "info" },
  { value: "development", label: "Development", status: "warning" },
  { value: "sandbox", label: "Sandbox", status: "neutral" },
];

function Organisation() {
  const [organisation, setOrganisation] = useState("Acme Pvt Ltd");
  return (
    <Menu>
      <MenuTrigger render={<TopBarSwitcher mark="AC" label={organisation} />} />
      <MenuContent>
        <MenuRadioGroup
          value={organisation}
          onValueChange={(value) => setOrganisation(value as string)}
        >
          <MenuRadioItem value="Acme Pvt Ltd">Acme Pvt Ltd</MenuRadioItem>
          <MenuRadioItem value="Acme Labs">Acme Labs</MenuRadioItem>
          <MenuRadioItem value="Acme Payments">Acme Payments</MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
}

function Environment({ defaultValue = "production" }: { defaultValue?: string }) {
  const [environment, setEnvironment] = useState(defaultValue);
  const env = ENVIRONMENTS.find((item) => item.value === environment) ?? ENVIRONMENTS[0];
  return (
    <Menu>
      <MenuTrigger render={<TopBarSwitcher status={env?.status} label={env?.label} />} />
      <MenuContent>
        <MenuRadioGroup
          value={environment}
          onValueChange={(value) => setEnvironment(value as string)}
        >
          {ENVIRONMENTS.map((item) => (
            <MenuRadioItem key={item.value} value={item.value}>
              {item.label}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
}

/**
 * The scope path: the organisation, then the environment, each switched from a Menu. A fragment,
 * so the bar sees each step: a slash before each, and the innermost on the compact bar.
 */
const scope = (defaultEnvironment?: string) => (
  <>
    <Organisation />
    <Environment defaultValue={defaultEnvironment} />
  </>
);

function SettingsMenu() {
  return (
    <Menu>
      <MenuTrigger
        render={<IconButton icon={SettingsIcon} aria-label="Settings" tone="neutral" />}
      />
      <MenuContent align="end">
        <MenuItem>Organisation settings</MenuItem>
        <MenuItem>Billing</MenuItem>
        <MenuSeparator />
        <MenuItem>Developer settings</MenuItem>
      </MenuContent>
    </Menu>
  );
}

const meta: Meta<typeof TopBar> = {
  title: "Components/Navigation/TopBar",
  component: TopBar,
  subcomponents: { TopBarSwitcher, TopBarSearch },
  parameters: {
    qeetrix: qx({ category: "navigation", status: "experimental" }),
    layout: "fullscreen",
  },
  args: {
    product: "Qeet ID",
    href: "#home",
    launcher: <Launcher />,
    logo: <QeetLogo variant="dark" height={20} />,
    context: scope(),
    search: (
      <TopBarSearch
        placeholder="Search or jump to…"
        shortcut={["⌘", "K"]}
        aria-keyshortcuts="Meta+K Control+K"
      />
    ),
    actions: (
      <>
        <IconButton icon={BellIcon} aria-label="Notifications" tone="neutral" />
        <SettingsMenu />
      </>
    ),
    account: <Avatar name="Priya Sharma" size="sm" />,
  },
  argTypes: {
    launcher: { control: false },
    logo: { control: false },
    context: { control: false },
    search: { control: false },
    actions: { control: false },
    account: { control: false },
    render: { control: false },
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof TopBar>;

export const Playground: Story = {};

export const Minimal: Story = {
  args: {
    launcher: undefined,
    context: undefined,
    search: undefined,
    actions: undefined,
    account: undefined,
  },
};

export const Environments: Story = {
  parameters: {
    docs: { description: { story: "The switcher's `status` dot colours the environment." } },
  },
  args: { context: scope("development"), search: undefined },
};

/** The bar's search opening the command palette, as a console wires it. */
function SearchToPalette(args: Story["args"]) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TopBar
        product="Qeet ID"
        {...args}
        search={
          <TopBarSearch
            placeholder="Search or jump to…"
            shortcut={["⌘", "K"]}
            aria-keyshortcuts="Meta+K Control+K"
            onClick={() => setOpen(true)}
          />
        }
      />
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        onSelect={() => {}}
        groups={[
          {
            label: "Applications",
            items: [{ value: "app_1", label: "Payroll portal", meta: "OIDC", icon: AppWindowIcon }],
          },
        ]}
      />
    </>
  );
}

/** Two panels, so a phone's bar gathers their triggers into one Tools menu. */
const DRAWERS: AppShellDrawer[] = [
  {
    id: "help",
    label: "Help",
    icon: CircleQuestionMarkIcon,
    content: <Text size="sm">Invite people, or connect a directory to sync them.</Text>,
  },
  {
    id: "activity",
    label: "Activity",
    icon: ActivityIcon,
    content: <Text size="sm">Azure AD sync added 3 users · 9:26 IST</Text>,
  },
];

/** The smallest frame that has a narrow mode: the bar over a two-item navigation. */
function Frame(args: Story["args"]) {
  return (
    <AppShell
      density="compact"
      topBar={<TopBar product="Qeet ID" {...args} />}
      drawers={DRAWERS}
      sidebar={
        <Sidebar label="Qeet ID">
          <SidebarGroup>
            <SidebarItem label="Overview" href="#overview" render={routerLink} icon={HouseIcon} />
            <SidebarItem label="Users" href="#users" render={routerLink} icon={UsersIcon} current />
          </SidebarGroup>
        </Sidebar>
      }
    >
      <PageContent>
        <Text tone="subtle">1,284 users</Text>
      </PageContent>
    </AppShell>
  );
}

export const Narrow: Story = {
  name: "Narrow window",
  globals: { viewport: { value: "mobile", isRotated: false } },
  // A pinned viewport can't show on the docs page, which renders every story at its own width.
  tags: ["!autodocs"],
  args: { actions: <IconButton icon={BellIcon} aria-label="Notifications" tone="neutral" /> },
  render: (args) => <Frame {...args} />,
};

export const SwitchScopeInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: switching the environment",
  play: async ({ canvas, canvasElement, userEvent }) => {
    const banner = canvas.getByRole("banner");
    await expect(within(banner).getByRole("link", { name: "Qeet ID" })).toHaveAttribute(
      "href",
      "#home",
    );

    const environment = within(banner).getByRole("button", { name: "Production" });
    await userEvent.click(environment);
    await waitFor(() => expect(environment).toHaveAttribute("aria-expanded", "true"));

    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(await body.findByRole("menuitemradio", { name: "Staging" }));
    await waitFor(() =>
      expect(within(banner).getByRole("button", { name: "Staging" })).toBeVisible(),
    );
  },
};

export const SearchInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the search opens the command palette",
  render: (args) => <SearchToPalette {...args} />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const search = await canvas.findByRole("button", { name: "Search or jump to…" });
    await expect(search).toHaveAttribute("aria-keyshortcuts", "Meta+K Control+K");
    await userEvent.click(search);

    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() =>
      expect(body.getByRole("dialog", { name: "Search or jump to" })).toBeVisible(),
    );
    await expect(body.getByRole("combobox", { name: "Search or jump to" })).toHaveFocus();
  },
};

export const NarrowInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: below 840px the search hides and a menu opens the navigation",
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "tablet", isRotated: false } },
  render: (args) => <Frame {...args} />,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("button", { name: "Open navigation" })).toBeVisible();
    const search = canvasElement.querySelector("[data-slot=top-bar-search]") as HTMLElement;
    await expect(getComputedStyle(search).display).toBe("none");
  },
};

export const PhoneInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: on a phone the scope and panels fold into menus",
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "mobile", isRotated: false } },
  render: (args) => <Frame {...args} />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const banner = canvas.getByRole("banner");
    const body = within(canvasElement.ownerDocument.body);
    await expect(within(banner).getByRole("link", { name: "Qeet ID" })).toBeVisible();

    // One switcher shows the innermost step and opens the whole path.
    await userEvent.click(within(banner).getByRole("button", { name: "Scope Production" }));
    const path = await body.findByRole("dialog", { name: "Scope" });
    await waitFor(() =>
      expect(within(path).getByRole("button", { name: "Acme Pvt Ltd" })).toBeVisible(),
    );
    await expect(within(path).getByRole("button", { name: "Production" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog", { name: "Scope" })).toBeNull());

    // The panels' triggers are one Tools menu.
    await expect(within(banner).queryByRole("button", { name: "Help" })).toBeNull();
    await userEvent.click(within(banner).getByRole("button", { name: "Tools" }));
    await userEvent.click(await body.findByRole("menuitemcheckbox", { name: "Help" }));
    await waitFor(() => expect(canvas.getByRole("complementary", { name: "Help" })).toBeVisible());
  },
};
