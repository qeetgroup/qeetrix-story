import { BuildingIcon } from "@qeetrix/icons/icons/building";
import { UserGroupIcon } from "@qeetrix/icons/icons/user-group";
import { Card } from "@qeetrix/react";
import { type TreeNode, TreeView } from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

const UNITS: TreeNode[] = [
  {
    id: "acme",
    label: "Acme Pvt Ltd",
    icon: BuildingIcon,
    meta: "1,284",
    children: [
      {
        id: "eng",
        label: "Engineering",
        icon: UserGroupIcon,
        meta: "412",
        children: [
          { id: "platform", label: "Platform", icon: UserGroupIcon, meta: "96" },
          { id: "mobile", label: "Mobile", icon: UserGroupIcon, meta: "58" },
        ],
      },
      { id: "fin", label: "Finance", icon: UserGroupIcon, meta: "74" },
      {
        id: "sales",
        label: "Sales",
        icon: UserGroupIcon,
        meta: "203",
        children: [
          { id: "north", label: "North India", meta: "88" },
          { id: "south", label: "South India", meta: "115" },
        ],
      },
    ],
  },
];

const PERMISSIONS: TreeNode[] = [
  {
    id: "users",
    label: "Users",
    children: [
      { id: "users.view", label: "View users" },
      { id: "users.mfa", label: "Reset MFA" },
      { id: "users.delete", label: "Delete users" },
    ],
  },
  {
    id: "apps",
    label: "Applications",
    children: [
      { id: "apps.view", label: "View applications" },
      // A permission this admin's own role can't grant.
      { id: "apps.secrets", label: "Rotate client secrets", disabled: true },
    ],
  },
  { id: "audit", label: "Audit log" },
];

const meta: Meta<typeof TreeView> = {
  title: "Components/Data Display/TreeView",
  component: TreeView,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "experimental" }),
    layout: "padded",
  },
  args: {
    label: "Organisation units",
    items: UNITS,
    defaultExpanded: ["acme"],
    onExpandedChange: fn(),
    onSelectedChange: fn(),
    onCheckedChange: fn(),
    style: { maxInlineSize: 360 },
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof TreeView>;

export const Playground: Story = {};

export const Checkable: Story = {
  args: {
    label: "Permissions",
    items: PERMISSIONS,
    checkable: true,
    defaultExpanded: ["users", "apps"],
    defaultChecked: ["users.view", "users.mfa", "audit"],
  },
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <div style={{ inlineSize: 360 }}>
      <Card title="Organisation units" level={2}>
        <TreeView
          label="Organisation units"
          items={UNITS}
          defaultExpanded={["acme", "eng"]}
          defaultSelected="platform"
        />
      </Card>
    </div>
  ),
};

const item = (name: string) => new RegExp(`^${name}`);

export const Keyboard: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: arrows, Home, End and type-ahead",
  play: async ({ canvas, userEvent, args }) => {
    const treeitem = (name: string) => canvas.getByRole("treeitem", { name: item(name) });
    treeitem("Acme Pvt Ltd").focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(treeitem("Engineering")).toHaveFocus();
    // Right opens a closed node, then steps into it.
    await userEvent.keyboard("{ArrowRight}");
    await expect(treeitem("Engineering")).toHaveAttribute("aria-expanded", "true");
    await expect(args.onExpandedChange).toHaveBeenLastCalledWith(["acme", "eng"]);
    await userEvent.keyboard("{ArrowRight}");
    await expect(treeitem("Platform")).toHaveFocus();
    // Left steps out to the parent, then closes it.
    await userEvent.keyboard("{ArrowLeft}");
    await expect(treeitem("Engineering")).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(treeitem("Engineering")).toHaveAttribute("aria-expanded", "false");
    await userEvent.keyboard("{End}");
    await expect(treeitem("Sales")).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(treeitem("Acme Pvt Ltd")).toHaveFocus();
    await userEvent.keyboard("f");
    await expect(treeitem("Finance")).toHaveFocus();
  },
};

export const Selecting: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: Enter or a click selects; the chevron only opens",
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const treeitem = (name: string) => canvas.getByRole("treeitem", { name: item(name) });
    treeitem("Finance").focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onSelectedChange).toHaveBeenLastCalledWith("fin");
    await expect(treeitem("Finance")).toHaveAttribute("aria-selected", "true");
    const chevron = treeitem("Sales").querySelector<HTMLElement>(".qx-tree-toggle");
    await expect(chevron).not.toBeNull();
    if (chevron) await userEvent.click(chevron);
    await expect(treeitem("Sales")).toHaveAttribute("aria-expanded", "true");
    await expect(args.onSelectedChange).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByText("North India"));
    await expect(args.onSelectedChange).toHaveBeenLastCalledWith("north");
    await expect(canvasElement.querySelectorAll('[aria-selected="true"]')).toHaveLength(1);
  },
};

export const Ticking: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a parent ticks all its nodes",
  args: Checkable.args,
  play: async ({ canvas, userEvent, args }) => {
    const treeitem = (name: string) => canvas.getByRole("treeitem", { name: item(name) });
    await expect(canvas.getByRole("tree")).toHaveAttribute("aria-multiselectable", "true");
    await expect(treeitem("Users")).toHaveAttribute("aria-checked", "mixed");
    treeitem("Delete users").focus();
    await userEvent.keyboard(" ");
    await expect(treeitem("Users")).toHaveAttribute("aria-checked", "true");
    treeitem("Users").focus();
    await userEvent.keyboard(" ");
    await expect(treeitem("View users")).toHaveAttribute("aria-checked", "false");
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(["audit"]);
  },
};

export const SkipDisabled: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the keys and ticks skip a disabled node",
  args: Checkable.args,
  play: async ({ canvas, userEvent, args }) => {
    const treeitem = (name: string) => canvas.getByRole("treeitem", { name: item(name) });
    await expect(treeitem("Rotate client secrets")).toHaveAttribute("aria-disabled", "true");
    treeitem("View applications").focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(treeitem("Audit log")).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(treeitem("View applications")).toHaveFocus();
    // The parent ticks what it can; the disabled node stays off, so the parent stays mixed.
    treeitem("Applications").focus();
    await userEvent.keyboard(" ");
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith([
      "users.view",
      "users.mfa",
      "audit",
      "apps.view",
    ]);
    await expect(treeitem("Rotate client secrets")).toHaveAttribute("aria-checked", "false");
    await expect(treeitem("Applications")).toHaveAttribute("aria-checked", "mixed");
  },
};
