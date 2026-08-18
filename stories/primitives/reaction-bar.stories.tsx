import { type Reaction, ReactionBar } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof ReactionBar> = {
  title: "Primitives/ReactionBar",
  component: ReactionBar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Emoji reaction strip used in Qeet collaboration and comment surfaces. Renders existing reactions as togglable pill buttons and appends an emoji-picker trigger for adding new ones. Pass `reactions` and `onToggle` to keep state in the parent; counts update optimistically.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ReactionBar>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Active reactions on a team announcement in qeet-people — the thumbs-up is already toggled by the current user; click any pill or the picker to add more.",
      },
    },
  },
  render: () => {
    const [rs, setRs] = React.useState<Reaction[]>([
      { emoji: "👍", count: 4, reacted: true },
      { emoji: "🎉", count: 2 },
      { emoji: "❤️", count: 1 },
      { emoji: "🚀", count: 1 },
    ]);
    const toggle = (e: string) =>
      setRs((cur) => {
        const found = cur.find((r) => r.emoji === e);
        if (found) {
          return cur
            .map((r) =>
              r.emoji === e
                ? {
                    ...r,
                    reacted: !r.reacted,
                    count: r.count + (r.reacted ? -1 : 1),
                  }
                : r,
            )
            .filter((r) => r.count > 0);
        }
        return [...cur, { emoji: e, count: 1, reacted: true }];
      });
    return <ReactionBar reactions={rs} onToggle={toggle} />;
  },
};
