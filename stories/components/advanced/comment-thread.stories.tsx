import { type CommentAuthor, CommentMention, type CommentNode, CommentThread } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect, screen, waitFor, within } from "storybook/test";
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
          "Threaded discussion widget used in Qeet collaboration surfaces. Renders a list of `CommentNode` objects with nested replies, emoji reactions, and an inline reply composer. Pass `currentUser` and `onSubmit` to make it interactive; omit `onSubmit` for a read-only view.\n\nRender @-mentions in a comment `body` with `CommentMention`: another person's mention reads as a link (pass `href` to make it one), and `self` gives a mention of the reader the quiet Qeet tint so “you were mentioned” is findable in a long thread. A rich body cannot seed the editor, so give such a comment its plain-text `source`. Pass `onEdit` / `onDelete` to enable Edit and a two-step Delete on the reader's own comments (`canEdit` / `canDelete` widen that); deleted comments leave a tombstone so their replies are not orphaned. `author.badge`, `editedAt`, `maxBodyLines`, `maxIndent`, `emptyState`, `locale` and `timeZone` cover the rest.",
      },
    },
  },
  argTypes: {
    maxBodyLines: { control: "number" },
    maxIndent: { control: "number" },
    placeholder: { control: "text" },
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

const PRIYA: CommentAuthor = { id: "u_priya", name: "Priya Sharma" };

const MENTION_THREAD: CommentNode[] = [
  {
    id: "m1",
    author: { id: "u_ada", name: "Ada Lovelace", badge: "HR admin" },
    body: (
      <>
        <CommentMention href="#people/grace-hopper">@Grace Hopper</CommentMention> can you confirm
        the August payroll cut-off moved to the 25th?{" "}
        <CommentMention self>@Priya Sharma</CommentMention> once it is confirmed, please update the
        leave policy in Qeet People.
      </>
    ),
    source:
      "@Grace Hopper can you confirm the August payroll cut-off moved to the 25th? @Priya Sharma once it is confirmed, please update the leave policy in Qeet People.",
    createdAt: Date.now() - 2 * 36e5,
    replies: [
      {
        id: "m2",
        author: { id: "u_grace", name: "Grace Hopper" },
        body: (
          <>
            Confirmed — finance signed off this morning. Looping in{" "}
            <CommentMention href="#people/alan-turing">@Alan Turing</CommentMention> for the
            attendance export.
          </>
        ),
        source:
          "Confirmed — finance signed off this morning. Looping in @Alan Turing for the attendance export.",
        createdAt: Date.now() - 36e5,
      },
    ],
  },
];

export const Mentions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`CommentMention` inside rich comment bodies, read by Priya. Mentions of other people are links to their Qeet People profile; the mention of the reader is `self`, tinted so it can be found at a glance while the name itself still says who is meant. Each rich body carries a plain-text `source` so it stays editable.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl">
      <CommentThread comments={MENTION_THREAD} currentUser={PRIYA} />
    </div>
  ),
};

const OWN_THREAD: CommentNode[] = [
  {
    id: "e1",
    author: { id: "u_alan", name: "Alan Turing" },
    body: "The GST invoice template still shows the old registered address.",
    createdAt: Date.now() - 3 * 36e5,
    replies: [
      {
        id: "e2",
        author: PRIYA,
        body: (
          <>
            Fixed in draft —{" "}
            <CommentMention href="#people/alan-turing">@Alan Turing</CommentMention> can you
            re-check INV-2026-0418?
          </>
        ),
        source: "Fixed in draft — @Alan Turing can you re-check INV-2026-0418?",
        createdAt: Date.now() - 2 * 36e5,
      },
      {
        id: "e3",
        author: PRIYA,
        body: "Ignore this, wrong thread.",
        createdAt: Date.now() - 36e5,
      },
    ],
  },
];

function updateNode(
  nodes: CommentNode[],
  id: string,
  update: (node: CommentNode) => CommentNode,
): CommentNode[] {
  return nodes.map((node) =>
    node.id === id
      ? update(node)
      : { ...node, replies: node.replies && updateNode(node.replies, id, update) },
  );
}

function EditableThread() {
  const [comments, setComments] = React.useState(OWN_THREAD);
  return (
    <div className="max-w-xl">
      <CommentThread
        comments={comments}
        currentUser={PRIYA}
        onEdit={(id, body) =>
          setComments((current) =>
            updateNode(current, id, (node) => ({
              ...node,
              body,
              source: undefined,
              editedAt: Date.now(),
            })),
          )
        }
        onDelete={(id) =>
          setComments((current) => updateNode(current, id, (node) => ({ ...node, deleted: true })))
        }
      />
    </div>
  );
}

export const EditAndDelete: Story = {
  name: "Interaction: editing and deleting your own comment",
  parameters: {
    docs: {
      description: {
        story:
          "With `onEdit` and `onDelete`, Priya's own comments get an actions menu; Alan's do not. Edit swaps the body for an editor seeded from `source` (⌘/Ctrl+Enter saves, Escape cancels) and adds an “edited” marker. Delete is two-step — the menu item opens an inline confirmation and only its destructive button emits `onDelete` — and the comment becomes a tombstone. The test drives both and asserts the outcomes.",
      },
    },
  },
  render: () => <EditableThread />,
  play: async ({ canvas, userEvent }) => {
    await expect(
      canvas.queryByRole("button", { name: "Comment actions for Alan Turing" }),
    ).not.toBeInTheDocument();
    const [ownMention, ownMistake] = canvas.getAllByRole("button", {
      name: "Comment actions for Priya Sharma",
    });

    // Edit: the rich body's plain-text source seeds the editor.
    await userEvent.click(ownMention);
    await userEvent.click(await screen.findByRole("menuitem", { name: "Edit" }));
    const editor = await canvas.findByRole("textbox", { name: "Edit comment" });
    await expect(editor).toHaveValue(
      "Fixed in draft — @Alan Turing can you re-check INV-2026-0418?",
    );
    await userEvent.clear(editor);
    await userEvent.type(editor, "Fixed — Alan, please re-check INV-2026-0418.");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(
      await canvas.findByText("Fixed — Alan, please re-check INV-2026-0418."),
    ).toBeInTheDocument();
    await expect(canvas.getByText("· edited")).toBeInTheDocument();

    // Delete: the menu item only opens a confirmation; its button emits onDelete.
    await userEvent.click(ownMistake);
    await userEvent.click(await screen.findByRole("menuitem", { name: "Delete" }));
    const confirm = await canvas.findByRole("group", { name: "Delete this comment?" });
    await expect(canvas.getByText("Ignore this, wrong thread.")).toBeInTheDocument();
    await userEvent.click(within(confirm).getByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(canvas.queryByText("Ignore this, wrong thread.")).not.toBeInTheDocument(),
    );
    await expect(canvas.getByText("This comment was deleted.")).toBeInTheDocument();
  },
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`emptyState` is shown above the composer while a thread has no comments yet — here on a fresh qeet-pay refund approval.",
      },
    },
  },
  render: () => (
    <div className="max-w-xl">
      <CommentThread
        comments={[]}
        currentUser={PRIYA}
        emptyState="No comments on this refund yet. Approvers see everything posted here."
        placeholder="Add context for the approvers…"
        onSubmit={() => {}}
      />
    </div>
  ),
};
