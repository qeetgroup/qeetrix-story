import { Columns3Icon } from "@qeetrix/icons/icons/columns-3";
import { CopyIcon } from "@qeetrix/icons/icons/copy";
import { EllipsisIcon } from "@qeetrix/icons/icons/ellipsis";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { LinkIcon } from "@qeetrix/icons/icons/link";
import { LogOutIcon } from "@qeetrix/icons/icons/log-out";
import { MailIcon } from "@qeetrix/icons/icons/mail";
import { PencilIcon } from "@qeetrix/icons/icons/pencil";
import { RotateCcwIcon } from "@qeetrix/icons/icons/rotate-ccw";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { ShieldIcon } from "@qeetrix/icons/icons/shield";
import { TrashIcon } from "@qeetrix/icons/icons/trash";
import { UserIcon } from "@qeetrix/icons/icons/user";
import { UserPlusIcon } from "@qeetrix/icons/icons/user-plus";
import {
  Box,
  Button,
  ContextMenu,
  type ContextMenuProps,
  ContextMenuTrigger,
  IconButton,
  Inline,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  type MenuProps,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuTrigger,
} from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Menu> = {
  title: "Components/Overlays/Menu",
  component: Menu,
  subcomponents: {
    MenuTrigger,
    MenuContent,
    MenuItem,
    MenuGroup,
    MenuGroupLabel,
    MenuSeparator,
    MenuCheckboxItem,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSubmenu,
    MenuSubmenuTrigger,
    ContextMenu,
    ContextMenuTrigger,
  },
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
    layout: "centered",
  },
  args: {
    onOpenChange: fn(),
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Menu>;

const onEdit = fn();

/** The account menu in the top bar. */
function AccountMenu(props: Omit<MenuProps, "children">) {
  return (
    <Menu {...props}>
      <MenuTrigger render={<Button variant="soft">Priya Sharma</Button>} />
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>priya.sharma@acme.in</MenuGroupLabel>
          <MenuItem icon={UserIcon}>Profile</MenuItem>
          <MenuItem icon={KeyRoundIcon}>Passkeys</MenuItem>
          <MenuItem icon={SettingsIcon}>Settings</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem icon={LogOutIcon}>Sign out</MenuItem>
      </MenuContent>
    </Menu>
  );
}

/** A member row's actions in the Qeet ID members table. */
function MemberRowMenu(props: Omit<MenuProps, "children">) {
  return (
    <Menu {...props}>
      <MenuTrigger
        render={<IconButton icon={EllipsisIcon} aria-label="Actions for Rahul Verma" />}
      />
      <MenuContent>
        <MenuItem icon={PencilIcon} shortcut="E" onClick={onEdit}>
          Edit member
        </MenuItem>
        <MenuItem icon={CopyIcon} shortcut="Ctrl+C">
          Copy user ID
        </MenuItem>
        <MenuSubmenu>
          <MenuSubmenuTrigger icon={ShieldIcon}>Change role</MenuSubmenuTrigger>
          <MenuContent>
            <MenuRadioGroup defaultValue="admin">
              <MenuRadioItem value="owner">Owner</MenuRadioItem>
              <MenuRadioItem value="admin">Admin</MenuRadioItem>
              <MenuRadioItem value="member">Member</MenuRadioItem>
              <MenuRadioItem value="viewer">Viewer</MenuRadioItem>
            </MenuRadioGroup>
          </MenuContent>
        </MenuSubmenu>
        <MenuItem icon={RotateCcwIcon}>Reset passkeys</MenuItem>
        <MenuItem icon={KeyRoundIcon} disabled>
          Transfer ownership
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={TrashIcon} tone="danger">
          Remove from Acme Pvt Ltd
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

/** A members table's view menu. */
function TableViewMenu(props: Omit<MenuProps, "children">) {
  return (
    <Menu {...props}>
      <MenuTrigger
        render={
          <Button variant="soft" icon={Columns3Icon}>
            View
          </Button>
        }
      />
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>Columns</MenuGroupLabel>
          <MenuCheckboxItem defaultChecked>Email</MenuCheckboxItem>
          <MenuCheckboxItem defaultChecked>Role</MenuCheckboxItem>
          <MenuCheckboxItem>Last sign-in</MenuCheckboxItem>
          <MenuCheckboxItem>Passkeys</MenuCheckboxItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuRadioGroup defaultValue="name">
          <MenuGroupLabel>Sort by</MenuGroupLabel>
          <MenuRadioItem value="name">Name</MenuRadioItem>
          <MenuRadioItem value="last-sign-in">Last sign-in</MenuRadioItem>
          <MenuRadioItem value="added">Date added</MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
}

/** The members page's Invite menu: each choice says what it does. */
function InviteMenu(props: Omit<MenuProps, "children">) {
  return (
    <Menu {...props}>
      <MenuTrigger
        render={
          <Button variant="soft" icon={UserPlusIcon}>
            Invite
          </Button>
        }
      />
      <MenuContent>
        <MenuItem icon={MailIcon} description="Up to 50 work emails at once">
          Invite by email
        </MenuItem>
        <MenuItem icon={LinkIcon} description="Anyone at acme.in can join">
          Copy invite link
        </MenuItem>
        <MenuSeparator />
        <MenuRadioGroup defaultValue="member">
          <MenuGroupLabel>Joins as</MenuGroupLabel>
          <MenuRadioItem value="member" description="Uses the apps they're given">
            Member
          </MenuRadioItem>
          <MenuRadioItem value="admin" description="Manages members and settings">
            Admin
          </MenuRadioItem>
        </MenuRadioGroup>
        <MenuSeparator />
        <MenuCheckboxItem defaultChecked description="On their first sign-in">
          Require a passkey
        </MenuCheckboxItem>
      </MenuContent>
    </Menu>
  );
}

/** An API key's actions, at the pointer on right-click, or on Shift+F10. */
function KeyContextMenu(props: Omit<ContextMenuProps, "children">) {
  return (
    <ContextMenu {...props}>
      <ContextMenuTrigger
        render={<Box border="subtle" radius="surface" background="raised" padding="lg" />}
      >
        <Button variant="ghost" icon={KeyRoundIcon}>
          Production key
        </Button>
      </ContextMenuTrigger>
      <MenuContent>
        <MenuItem icon={CopyIcon}>Copy key ID</MenuItem>
        <MenuItem icon={RotateCcwIcon}>Rotate key</MenuItem>
        <MenuSeparator />
        <MenuItem icon={TrashIcon} tone="danger">
          Revoke key
        </MenuItem>
      </MenuContent>
    </ContextMenu>
  );
}

export const Playground: Story = {
  render: (args) => <AccountMenu {...args} />,
};

export const RowActions: Story = {
  name: "Row actions",
  render: (args) => <MemberRowMenu {...args} />,
};

export const CheckboxAndRadioItems: Story = {
  name: "Checkbox and radio",
  render: (args) => <TableViewMenu {...args} />,
};

export const Descriptions: Story = {
  render: (args) => <InviteMenu {...args} />,
};

export const Context: Story = {
  name: "Context menu",
  render: () => <KeyContextMenu />,
};

export const ContextInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: right-click and Shift+F10 open the context menu",
  render: () => <KeyContextMenu />,
  play: async ({ canvas, userEvent }) => {
    const key = canvas.getByRole("button", { name: "Production key" });
    await userEvent.pointer({ keys: "[MouseRight]", target: key });
    const menu = await screen.findByRole("menu");
    await expect(within(menu).getAllByRole("menuitem")).toHaveLength(3);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());

    key.focus();
    await userEvent.keyboard("{Shift>}{F10}{/Shift}");
    await waitFor(() =>
      expect(screen.getByRole("menu").contains(document.activeElement)).toBe(true),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(key).toHaveFocus());
  },
};

export const OpenCloseInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: focus moves in, Escape returns it",
  render: (args) => <AccountMenu {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Priya Sharma" });
    await userEvent.click(trigger);

    // The menu portals to the end of <body>, outside the canvas.
    const menu = await screen.findByRole("menu");
    await waitFor(() => expect(menu.contains(document.activeElement)).toBe(true));
    await expect(within(menu).getAllByRole("menuitem")).toHaveLength(4);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  },
};

export const KeyboardInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: arrow keys move, Enter activates",
  render: (args) => <MemberRowMenu {...args} />,
  play: async ({ canvas, userEvent }) => {
    onEdit.mockClear();
    const trigger = canvas.getByRole("button", { name: "Actions for Rahul Verma" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const menu = await screen.findByRole("menu");
    await waitFor(() =>
      expect(within(menu).getByRole("menuitem", { name: "Edit member" })).toHaveFocus(),
    );

    await userEvent.keyboard("re");
    await waitFor(() =>
      expect(within(menu).getByRole("menuitem", { name: /Reset passkeys/ })).toHaveFocus(),
    );
    // A disabled item is still reached, and announced as unavailable.
    await userEvent.keyboard("{ArrowDown}");
    const transfer = within(menu).getByRole("menuitem", { name: "Transfer ownership" });
    await expect(transfer).toHaveFocus();
    await expect(transfer).toHaveAttribute("aria-disabled", "true");
    await userEvent.keyboard("{ArrowDown}");
    await expect(within(menu).getByRole("menuitem", { name: /Remove from/ })).toHaveFocus();

    await userEvent.keyboard("{Home}");
    await expect(within(menu).getByRole("menuitem", { name: "Edit member" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(onEdit).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

export const ItemsInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: checkbox, radio and submenu",
  render: (args) => (
    <Inline gap="sm">
      <TableViewMenu {...args} />
      <MemberRowMenu />
    </Inline>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Actions for Rahul Verma" }));
    let menu = await screen.findByRole("menu");
    const changeRole = within(menu).getByRole("menuitem", { name: "Change role" });
    changeRole.focus();
    await userEvent.keyboard("{ArrowRight}");
    const viewer = await screen.findByRole("menuitemradio", { name: "Viewer" });
    await waitFor(() => expect(screen.getByRole("menuitemradio", { name: "Owner" })).toHaveFocus());
    await expect(viewer).toHaveAttribute("aria-checked", "false");
    await userEvent.keyboard("{ArrowLeft}");
    await waitFor(() => expect(changeRole).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());

    await userEvent.click(canvas.getByRole("button", { name: "View" }));
    menu = await screen.findByRole("menu");
    const lastSignIn = within(menu).getByRole("menuitemcheckbox", { name: "Last sign-in" });
    await userEvent.click(lastSignIn);
    await expect(lastSignIn).toHaveAttribute("aria-checked", "true");
    const added = within(menu).getByRole("menuitemradio", { name: "Date added" });
    await userEvent.click(added);
    await expect(added).toHaveAttribute("aria-checked", "true");
    await expect(within(menu).getByRole("menuitemradio", { name: "Name" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    // Still open after choosing: polled, since the popup may be mid-transition on a slow runner.
    await waitFor(() => expect(menu).toBeVisible());
  },
};

export const DescriptionInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the label names an item, the description describes it",
  render: (args) => <InviteMenu {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Invite" }));
    const menu = await screen.findByRole("menu");
    await expect(
      within(menu).getByRole("menuitem", { name: "Copy invite link" }),
    ).toHaveAccessibleDescription("Anyone at acme.in can join");
    await expect(
      within(menu).getByRole("menuitemradio", { name: "Admin" }),
    ).toHaveAccessibleDescription("Manages members and settings");
    await expect(
      within(menu).getByRole("menuitemcheckbox", { name: "Require a passkey" }),
    ).toHaveAccessibleDescription("On their first sign-in");

    // Left open so the accessibility check runs over the descriptions.
  },
};
