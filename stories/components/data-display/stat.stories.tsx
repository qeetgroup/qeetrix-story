import { Stat, StatGroup } from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Stat> = {
  title: "Components/Data Display/Stat",
  component: Stat,
  subcomponents: { StatGroup },
  parameters: {
    qeetrix: qx({ category: "data-display", status: "experimental" }),
    layout: "padded",
  },
  args: {
    label: "Total users",
    value: 1284,
    note: "+38 this week",
    tone: "positive",
    trend: [1080, 1094, 1110, 1121, 1139, 1150, 1172, 1190, 1205, 1231, 1246, 1284],
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof Stat>;

// A Stat is a term and its values, so it always sits in a StatGroup, the <dl>.
export const Playground: Story = {
  render: (args) => (
    <div style={{ inlineSize: 320 }}>
      <StatGroup>
        <Stat {...args} />
      </StatGroup>
    </div>
  ),
};

const USERS_AT_A_GLANCE = (
  <StatGroup aria-label="Users at a glance">
    <Stat
      label="Total users"
      value={1284}
      note="+38 this week"
      tone="positive"
      trend={[1080, 1094, 1110, 1121, 1139, 1150, 1172, 1190, 1205, 1231, 1246, 1284]}
    />
    <Stat
      label="Active, last 30 days"
      value={1102}
      note="85.8% of users"
      trend={[980, 1010, 995, 1040, 1032, 1061, 1050, 1072, 1068, 1090, 1085, 1102]}
    />
    <Stat
      label="Passkey adoption"
      value="72%"
      note="+6 pts this month"
      tone="positive"
      trend={[41, 44, 47, 50, 53, 55, 58, 61, 63, 66, 69, 72]}
    />
    <Stat
      label="Pending invitations"
      value={64}
      note="9 expire this week"
      tone="warning"
      trend={[30, 34, 31, 40, 38, 45, 52, 49, 55, 58, 61, 64]}
    />
  </StatGroup>
);

export const Variants: Story = {
  render: () => (
    <StatGroup aria-label="Security this week">
      <Stat label="Passkey sign-ins" value={8412} note="+12% on last week" tone="positive" />
      <Stat label="Failed sign-ins" value={312} note="Up 40% on last week" tone="negative" />
      <Stat label="Locked accounts" value={9} note="3 need an admin" tone="warning" />
      <Stat label="Median sign-in" value="1.8 s" note="Last 7 days" />
    </StatGroup>
  ),
};

/** The last two numbers come from slower queries, so they're still on their way. */
const STILL_LOADING = (
  <StatGroup aria-label="Users at a glance, loading">
    <Stat label="Total users" value={1284} note="+38 this week" tone="positive" />
    <Stat label="Active, last 30 days" value={1102} note="85.8% of users" />
    <Stat label="Passkey adoption" value={undefined} loading />
    <Stat label="Pending invitations" value={undefined} loading />
  </StatGroup>
);

export const Loading: Story = {
  render: () => STILL_LOADING,
};

export const InContext: Story = {
  name: "In context",
  render: () => USERS_AT_A_GLANCE,
};

export const LoadingRead: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a loading stat reads Loading",
  render: () => STILL_LOADING,
  play: async ({ canvas }) => {
    const stat = canvas.getByText("Passkey adoption").closest<HTMLElement>("[data-slot=stat]");
    if (!stat) throw new Error("no Passkey adoption stat");
    await expect(stat).toHaveAttribute("aria-busy", "true");
    // The value reads "Loading"; the note's placeholder is hidden, so it's the only definition.
    await expect(within(stat).getByRole("definition")).toHaveTextContent("Loading");
  },
};

export const ReadAsPairs: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: each label names its value",
  render: () => USERS_AT_A_GLANCE,
  play: async ({ canvas }) => {
    const terms = canvas.getAllByRole("term").map((term) => term.textContent);
    await expect(terms).toEqual([
      "Total users",
      "Active, last 30 days",
      "Passkey adoption",
      "Pending invitations",
    ]);
    await expect(canvas.getAllByRole("definition")[0]).toHaveTextContent("1,284");
  },
};
