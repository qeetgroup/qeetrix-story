import { type TreeNode, TreeView } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BuildingIcon, FileIcon, FolderIcon, UserIcon, UsersIcon } from "lucide-react";

const data: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: FolderIcon,
    defaultOpen: true,
    children: [
      {
        id: "components",
        label: "components",
        icon: FolderIcon,
        children: [
          { id: "button", label: "button.tsx", icon: FileIcon },
          { id: "card", label: "card.tsx", icon: FileIcon },
        ],
      },
      { id: "index", label: "index.ts", icon: FileIcon },
    ],
  },
  { id: "pkg", label: "package.json", icon: FileIcon },
];

const orgData: TreeNode[] = [
  {
    id: "acme",
    label: "Acme Inc.",
    icon: BuildingIcon,
    defaultOpen: true,
    children: [
      {
        id: "engineering",
        label: "Engineering",
        icon: UsersIcon,
        defaultOpen: true,
        children: [
          { id: "ada", label: "Ada Lovelace", icon: UserIcon },
          { id: "alan", label: "Alan Turing", icon: UserIcon },
        ],
      },
      {
        id: "product",
        label: "Product",
        icon: UsersIcon,
        children: [{ id: "grace", label: "Grace Hopper", icon: UserIcon }],
      },
      {
        id: "finance",
        label: "Finance",
        icon: UsersIcon,
        children: [{ id: "katherine", label: "Katherine Johnson", icon: UserIcon }],
      },
    ],
  },
];

const meta: Meta<typeof TreeView> = {
  title: "Primitives/TreeView",
  component: TreeView,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A recursive collapsible tree for hierarchical data — file systems, org charts, permission trees, and category taxonomies. Each node accepts an `icon`, a `label`, optional `children`, and a `defaultOpen` flag. The component manages expand/collapse state internally; control `defaultOpen` to pre-expand meaningful subtrees on first render.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TreeView>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "File-system tree for a small TypeScript project. Folder nodes use `FolderIcon` and are collapsible; leaf nodes use `FileIcon`. `defaultOpen: true` on the root node ensures the first level is visible without user interaction.",
      },
    },
  },
  render: () => (
    <div className="w-64 rounded-lg border p-2">
      <TreeView data={data} />
    </div>
  ),
};

export const OrgHierarchy: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Organisation chart for a qeet-people HCM tenant. Department nodes (`UsersIcon`) are collapsible; individual members (`UserIcon`) are leaf nodes. Use `defaultOpen: true` on the top-level org node and selected departments to surface the most relevant structure without overwhelming the view.",
      },
    },
  },
  render: () => (
    <div className="w-72 rounded-lg border p-2">
      <TreeView data={orgData} />
    </div>
  ),
};
