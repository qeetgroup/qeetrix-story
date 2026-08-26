import { type CommentNode, CommentThread } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const SEED: CommentNode[] = [
  {
    id: "1",
    author: { name: "Ada Lovelace" },
    body: "Can we ship the analytics tab this sprint?",
    createdAt: Date.now() - 36e5,
    reactions: [{ emoji: "👍", count: 2, reacted: true }],
    replies: [
      {
        id: "2",
        author: { name: "Grace Hopper" },
        body: "Yes — backend is ready.",
        createdAt: Date.now() - 18e5,
      },
    ],
  },
  {
    id: "3",
    author: { name: "Alan Turing" },
    body: "Reviewed the designs — looks great.",
    createdAt: Date.now() - 6e5,
  },
];

const meta: Meta<typeof CommentThread> = {
  title: "Components/Advanced/CommentThread",
  component: CommentThread,
  parameters: {
    qeetrix: qx({ category: "advanced", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Threaded discussion widget used in Qeet collaboration surfaces. Renders a list of `CommentNode` objects with nested replies, emoji reactions, and an inline reply composer. Pass `currentUser` and `onSubmit` to make it interactive; omit `onSubmit` for a read-only view.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CommentThread>;

export const Default: Story = {
  render: () => {
    const [comments, setComments] = React.useState(SEED);
    return (
      <div className="max-w-xl">
        <CommentThread
          comments={comments}
          currentUser={{ name: "You" }}
          onReact={() => {}}
          onSubmit={(body, parentId) => {
            const node: CommentNode = {
              id: String(Date.now()),
              author: { name: "You" },
              body,
              createdAt: Date.now(),
            };
            setComments((cur) =>
              parentId
                ? cur.map((c) =>
                    c.id === parentId ? { ...c, replies: [...(c.replies ?? []), node] } : c,
                  )
                : [...cur, node],
            );
          }}
        />
      </div>
    );
  },
};
