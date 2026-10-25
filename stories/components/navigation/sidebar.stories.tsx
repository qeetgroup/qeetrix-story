import { AppWindowIcon } from "@qeetrix/icons/icons/app-window";
import { BuildingIcon } from "@qeetrix/icons/icons/building";
import { CodeXmlIcon } from "@qeetrix/icons/icons/code-xml";
import { HouseIcon } from "@qeetrix/icons/icons/house";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { LifeBuoyIcon } from "@qeetrix/icons/icons/life-buoy";
import { PlugIcon } from "@qeetrix/icons/icons/plug";
import { ScrollTextIcon } from "@qeetrix/icons/icons/scroll-text";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { ShieldCheckIcon } from "@qeetrix/icons/icons/shield-check";
import { UsersIcon } from "@qeetrix/icons/icons/users";
import { UsersRoundIcon } from "@qeetrix/icons/icons/users-round";
import { WebhookIcon } from "@qeetrix/icons/icons/webhook";
import { Badge, Box, QeetrixProvider, Text } from "@qeetrix/react";
import {
  AppShell,
  PageContent,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  TopBar,
} from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps, ReactNode } from "react";
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

/** The navigation column outside an AppShell: 256px on the canvas tone. */
function Column({ children }: { children: ReactNode }) {
  return (
    <Box background="canvas" border="default" style={{ inlineSize: 256, blockSize: 560 }}>
      {children}
    </Box>
  );
}

/** Qeet ID's navigation, with the item for `current` marked. */
function QeetIdItems({ current = "users" }: { current?: string }) {
  const is = (id: string) => current === id;
  return (
    <>
      <SidebarGroup>
        <SidebarItem
          label="Overview"
          href="#overview"
          render={routerLink}
          icon={HouseIcon}
          current={is("overview")}
        />
      </SidebarGroup>
      <SidebarGroup label="Directory">
        <SidebarItem
          label="Users"
          href="#users"
          render={routerLink}
          icon={UsersIcon}
          filledWhenCurrent
          current={is("users")}
          badge="1,284"
        />
        <SidebarItem
          label="Groups"
          href="#groups"
          render={routerLink}
          icon={UsersRoundIcon}
          badge="38"
        />
        {/* Outside the plan: shown, but greyed and out of the Tab order. */}
        <SidebarItem
          label="Organisations"
          href="#organisations"
          render={routerLink}
          icon={BuildingIcon}
          disabled
        />
      </SidebarGroup>
      <SidebarGroup label="Access">
        <SidebarItem
          label="Applications"
          href="#applications"
          render={routerLink}
          icon={AppWindowIcon}
          badge="12"
        />
        <SidebarItem label="Connections" icon={PlugIcon}>
          <SidebarItem
            label="Passkeys"
            href="#passkeys"
            render={routerLink}
            current={is("passkeys")}
          />
          <SidebarItem label="Enterprise SSO" href="#sso" render={routerLink} current={is("sso")} />
          <SidebarItem
            label="Social sign-in"
            href="#social"
            render={routerLink}
            current={is("social")}
          />
        </SidebarItem>
        <SidebarItem label="Policies" href="#policies" render={routerLink} icon={ShieldCheckIcon} />
      </SidebarGroup>
      <SidebarGroup label="Developers">
        <SidebarItem label="API keys" href="#api-keys" render={routerLink} icon={KeyRoundIcon} />
        <SidebarItem
          label="Webhooks"
          href="#webhooks"
          render={routerLink}
          icon={WebhookIcon}
          badge={<Badge tone="danger">Failing</Badge>}
        />
        <SidebarItem
          label="Audit log"
          href="#audit-log"
          render={routerLink}
          icon={ScrollTextIcon}
        />
      </SidebarGroup>
    </>
  );
}

const FOOTER = (
  <SidebarGroup>
    <SidebarItem label="Settings" href="#settings" render={routerLink} icon={SettingsIcon} />
    <SidebarItem label="Help and docs" href="#help" render={routerLink} icon={LifeBuoyIcon} />
  </SidebarGroup>
);

const meta: Meta<typeof Sidebar> = {
  title: "Components/Navigation/Sidebar",
  component: Sidebar,
  subcomponents: { SidebarGroup, SidebarItem },
  parameters: {
    qeetrix: qx({ category: "navigation", status: "experimental" }),
    layout: "centered",
  },
  args: {
    label: "Qeet ID",
    title: "Identity",
    filter: false,
    footer: FOOTER,
  },
  argTypes: {
    footer: { control: false },
  },
  render: (args) => (
    <Column>
      <Sidebar {...args}>
        <QeetIdItems />
      </Sidebar>
    </Column>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Playground: Story = {};

export const NestedItems: Story = {
  name: "Nested items",
  parameters: {
    docs: { description: { story: "A category opens when it holds the current page." } },
  },
  render: (args) => (
    <Column>
      <Sidebar {...args}>
        <QeetIdItems current="sso" />
      </Sidebar>
    </Column>
  ),
};

export const Filter: Story = {
  args: { filter: true },
};

/** The collapsed frame: the rail needs an AppShell to collapse in. */
function Rail(args: Story["args"]) {
  return (
    <AppShell
      defaultSidebarCollapsed
      topBar={<TopBar product="Qeet ID" href="#home" />}
      sidebar={
        <Sidebar label="Qeet ID" {...args}>
          <QeetIdItems />
        </Sidebar>
      }
    >
      <PageContent>
        <Text tone="subtle">Priya Sharma, Rahul Verma and 1,282 more.</Text>
      </PageContent>
    </AppShell>
  );
}

export const CollapsedRail: Story = {
  name: "Collapsed rail",
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, iframeHeight: 480 } },
  },
  render: (args) => <Rail {...args} />,
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      {/* `lang` drops the group labels' tracking, which would loosen Devanagari conjuncts. */}
      <div lang="hi">
        <Column>
          <Sidebar label="Qeet ID" title="पहचान" filter>
            <SidebarGroup>
              <SidebarItem label="अवलोकन" href="#overview" render={routerLink} icon={HouseIcon} />
            </SidebarGroup>
            <SidebarGroup label="डायरेक्टरी">
              <SidebarItem
                label="उपयोगकर्ता"
                href="#users"
                render={routerLink}
                icon={UsersIcon}
                badge="1,284"
                current
              />
              <SidebarItem
                label="समूह"
                href="#groups"
                render={routerLink}
                icon={UsersRoundIcon}
                badge="38"
              />
            </SidebarGroup>
          </Sidebar>
        </Column>
      </div>
    </QeetrixProvider>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("searchbox", { name: "नेविगेशन में खोजें" })).toBeVisible();
  },
};

export const CategoryInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: categories open and close from the keyboard",
  render: NestedItems.render,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("navigation", { name: "Qeet ID" })).toBeVisible();
    const connections = canvas.getByRole("button", { name: "Connections" });
    await expect(connections).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("link", { name: "Enterprise SSO" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    // Every available item is in the Tab order: Overview, Users, Groups, Applications.
    for (let i = 0; i < 5; i++) await userEvent.tab();
    await expect(connections).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(connections).toHaveAttribute("aria-expanded", "false");
    // Closed, the category carries the current mark for its current child.
    await expect(connections).toHaveAttribute("data-current", "");
    await userEvent.keyboard("{Enter}");
    await expect(connections).toHaveAttribute("aria-expanded", "true");
  },
};

export const FilterInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: filtering the navigation",
  args: { filter: true },
  play: async ({ canvas, userEvent }) => {
    const filter = canvas.getByRole("searchbox", { name: "Filter navigation" });
    await userEvent.type(filter, "sso");
    await expect(canvas.getByRole("link", { name: "Enterprise SSO" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Connections" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(canvas.queryByRole("link", { name: /Groups/ })).toBeNull();

    await userEvent.clear(filter);
    await userEvent.type(filter, "invoices");
    await expect(canvas.getByRole("status")).toHaveTextContent("No pages match");
  },
};

export const RailInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a category in the rail expands it",
  parameters: { layout: "fullscreen" },
  render: (args) => <Rail {...args} />,
  play: async ({ canvas, userEvent }) => {
    const nav = await canvas.findByRole("navigation", { name: "Qeet ID" });
    // In the rail the label is hidden, but it stays the link's name.
    await expect(within(nav).getByRole("link", { name: /Users/ })).toBeInTheDocument();
    await userEvent.click(within(nav).getByRole("button", { name: "Connections" }));
    await waitFor(() => expect(within(nav).getByRole("link", { name: "Passkeys" })).toBeVisible());
  },
};

export const DisabledInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a disabled item is skipped",
  play: async ({ canvas, userEvent }) => {
    const organisations = canvas.getByRole("link", { name: "Organisations" });
    await expect(organisations).toHaveAttribute("aria-disabled", "true");
    await expect(organisations).not.toHaveAttribute("href");
    // Tab goes from Groups past Organisations to Applications.
    canvas.getByRole("link", { name: /^Groups/ }).focus();
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: /^Applications/ })).toHaveFocus();
  },
};

export const ElementPropsInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: item props reach the link",
  render: (args) => (
    <Column>
      <Sidebar {...args}>
        <SidebarGroup>
          <SidebarItem
            label="API reference"
            href="https://docs.qeet.in"
            icon={CodeXmlIcon}
            id="nav-api-reference"
            data-track="nav-docs"
            target="_blank"
            rel="noreferrer"
          />
        </SidebarGroup>
      </Sidebar>
    </Column>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "API reference" });
    await expect(link).toHaveAttribute("id", "nav-api-reference");
    await expect(link).toHaveAttribute("data-track", "nav-docs");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noreferrer");
  },
};
