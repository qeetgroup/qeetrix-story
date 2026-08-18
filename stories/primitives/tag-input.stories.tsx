import { TagInput } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof TagInput> = {
  title: "Primitives/TagInput",
  component: TagInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A freeform tag entry that renders each confirmed value as a removable chip. Supports `maxTags` to cap the list and a `validate` callback to sanitise or reject input before it becomes a tag. Used in Qeet ID for allowed redirect URI lists, qeet-logs for log stream labels, and qeet-notify for notification recipient email lists.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Allowed redirect URIs for a Qeet ID OAuth application — each URI becomes a chip.",
      },
    },
  },
  render: () => {
    const [tags, setTags] = React.useState<string[]>([
      "https://app.acme.com/callback",
      "https://staging.acme.com/callback",
    ]);
    return (
      <div className="w-80">
        <TagInput value={tags} onChange={setTags} placeholder="Add a redirect URI…" />
      </div>
    );
  },
};

export const WithMax: Story = {
  parameters: {
    docs: {
      description: {
        story: "Webhook subscription event types — capped at 3 on the Starter plan.",
      },
    },
  },
  render: () => {
    const [tags, setTags] = React.useState<string[]>(["user.created", "user.deleted"]);
    return (
      <div className="w-80">
        <TagInput
          value={tags}
          onChange={setTags}
          maxTags={3}
          placeholder="Add an event type (max 3)…"
        />
      </div>
    );
  },
};

export const Validated: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "qeet-notify recipient list — the `validate` callback rejects non-email input and lowercases before adding.",
      },
    },
  },
  render: () => {
    const [tags, setTags] = React.useState<string[]>([
      "ada.lovelace@acme.com",
      "grace.hopper@globex.com",
    ]);
    return (
      <div className="w-80">
        <TagInput
          value={tags}
          onChange={setTags}
          placeholder="Add recipient email…"
          validate={(t) => (/^\S+@\S+\.\S+$/.test(t) ? t.toLowerCase() : null)}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Read-only tag display — shown when the field is locked by an org-level policy.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <TagInput value={["audit-logs", "prod", "ap-south-1"]} onChange={() => {}} disabled />
    </div>
  ),
};
