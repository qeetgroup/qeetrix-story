import { Highlight } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Highlight> = {
  title: "Components/Typography/Highlight",
  component: Highlight,
  parameters: {
    qeetrix: qx({ category: "typography", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Wraps matched substrings of a text node in `<mark>` elements — ideal for search-result emphasis in qeet-logs log viewers, qeet-docs site search, or the Qeet ID admin command palette. Pass a single string or an array of terms to `query`; matching is case-insensitive by default.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Highlight>;

export const Default: Story = {
  render: () => (
    <p className="max-w-md text-sm">
      <Highlight query="passkey">
        Qeet ID is a passkey-first identity platform; passkeys replace passwords entirely — no
        shared secrets, no phishing surface.
      </Highlight>
    </p>
  ),
};

export const MultipleTerms: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Passing an array to `query` highlights each term independently — useful for multi-keyword log searches in qeet-logs.",
      },
    },
  },
  render: () => (
    <p className="max-w-md text-sm">
      <Highlight query={["webhook", "HMAC"]}>
        qeet-notify delivers events via webhook; each payload is signed with an HMAC-SHA256
        signature so you can verify authenticity before processing.
      </Highlight>
    </p>
  ),
};

export const CaseSensitive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `caseSensitive` when the query must match exact casing — e.g. distinguishing `ERROR` log level from the word "error" in a message body.',
      },
    },
  },
  render: () => (
    <p className="max-w-md text-sm">
      <Highlight query="ERROR" caseSensitive>
        2026-06-14T08:32:11Z ERROR auth.middleware — token signature invalid (expected RS256, got
        none)
      </Highlight>
    </p>
  ),
};
