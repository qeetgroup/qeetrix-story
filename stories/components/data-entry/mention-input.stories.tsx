import { MentionInput } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const PEOPLE = [
  { id: "1", label: "Ada Lovelace" },
  { id: "2", label: "Grace Hopper" },
  { id: "3", label: "Alan Turing" },
  { id: "4", label: "Katherine Johnson" },
];

const meta: Meta<typeof MentionInput> = {
  title: "Components/Data Entry/MentionInput",
  component: MentionInput,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "At-mention textarea used in Qeet collaboration surfaces — comment threads, team chat, and task descriptions. Typing `@` opens a filtered people-picker populated from the `people` prop. Selected mentions are tokenised inline and exposed as plain text via `onValueChange`.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MentionInput>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Mention picker triggered mid-sentence — type additional characters after `@` to filter the team roster.",
      },
    },
  },
  render: () => {
    const [v, setV] = React.useState("Hey @");
    return (
      <div className="w-80">
        <MentionInput
          aria-label="Comment body"
          value={v}
          onValueChange={setV}
          people={PEOPLE}
          placeholder="Type @ to mention a teammate…"
        />
      </div>
    );
  },
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Blank input as it appears when opening a new comment thread — placeholder guides the user to start typing or use `@` to mention.",
      },
    },
  },
  render: () => {
    const [v, setV] = React.useState("");
    return (
      <div className="w-80">
        <MentionInput
          aria-label="Comment body"
          value={v}
          onValueChange={setV}
          people={PEOPLE}
          placeholder="Type @ to mention a teammate…"
        />
      </div>
    );
  },
};
