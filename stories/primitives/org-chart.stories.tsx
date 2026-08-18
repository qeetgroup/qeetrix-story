import { OrgChart, type OrgNode } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const DATA: OrgNode = {
  id: "1",
  label: "Ada Lovelace",
  sublabel: "CEO",
  children: [
    {
      id: "2",
      label: "Grace Hopper",
      sublabel: "CTO",
      children: [
        { id: "4", label: "Alan Turing", sublabel: "Eng Lead" },
        { id: "5", label: "Katherine Johnson", sublabel: "Data Lead" },
      ],
    },
    { id: "3", label: "Margaret Hamilton", sublabel: "CFO" },
  ],
};

const meta: Meta<typeof OrgChart> = {
  title: "Primitives/OrgChart",
  component: OrgChart,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Recursive org-chart tree used in qeet-people to visualise reporting hierarchies. Pass a root `OrgNode` with nested `children`; each node renders a card with `label` (name) and optional `sublabel` (title or role). The tree expands top-down and handles arbitrary depth.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof OrgChart>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Qeet engineering org — three-level tree rooted at the CEO, with CTO/CFO on level 2 and two individual-contributor leads beneath the CTO.",
      },
    },
  },
  render: () => <OrgChart data={DATA} />,
};
