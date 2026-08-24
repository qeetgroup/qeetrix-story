import { type TreeNode, TreeView } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Building, Document, Folder, People, User } from "@qeetrix/icons";

const data: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: Folder,
    defaultOpen: true,
    children: [
      {
        id: "components",
        label: "components",
        icon: Folder,
        children: [
          { id: "button", label: "button.tsx", icon: Document },
          { id: "card", label: "card.tsx", icon: Document },
        ],
      },
      { id: "index", label: "index.ts", icon: Document },
    ],
  },
  { id: "pkg", label: "package.json", icon: Document },
];

const orgData: TreeNode[] = [
  {
    id: "acme",
    label: "Acme Inc.",
    icon: Building,
    defaultOpen: true,
    children: [
      {
        id: "engineering",
        label: "Engineering",
        icon: People,
        defaultOpen: true,
        children: [
          { id: "ada", label: "Ada Lovelace", icon: User },
          { id: "alan", label: "Alan Turing", icon: User },
        ],
      },
      {
        id: "product",
        label: "Product",
        icon: People,
        children: [{ id: "grace", label: "Grace Hopper", icon: User }],
      },
      {
        id: "finance",
        label: "Finance",
        icon: People,
        children: [{ id: "katherine", label: "Katherine Johnson", icon: User }],
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
          "File-system tree for a small TypeScript project. Folder nodes use `Folder` and are collapsible; leaf nodes use `Document`. `defaultOpen: true` on the root node ensures the first level is visible without user interaction.",
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
          "Organisation chart for a qeet-people HCM tenant. Department nodes (`People`) are collapsible; individual members (`User`) are leaf nodes. Use `defaultOpen: true` on the top-level org node and selected departments to surface the most relevant structure without overwhelming the view.",
      },
    },
  },
  render: () => (
    <div className="w-72 rounded-lg border p-2">
      <TreeView data={orgData} />
    </div>
  ),
};
