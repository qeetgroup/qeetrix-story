import { RichTextEditor } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof RichTextEditor> = {
  title: "Components/Advanced/RichTextEditor",
  component: RichTextEditor,
  parameters: {
    qeetrix: qx({ category: "advanced", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Tiptap-powered rich-text editor used wherever Qeet products need formatted prose — webhook payload descriptions, knowledge-base articles, or team announcements in qeet-people. Emits and accepts raw HTML via `value` / `onChange`; set `editable={false}` for read-only display.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Editing a Qeet ID webhook description — rich formatting with a live HTML output inspector below.",
      },
    },
  },
  render: () => {
    const [html, setHtml] = React.useState(
      "<h2>User signed in</h2><p>Fires whenever a user successfully authenticates via <strong>passkey</strong> or SSO. Use this webhook to sync session data to your SIEM or CRM.</p><ul><li>Payload includes <code>actor_id</code>, <code>ip_address</code>, and <code>device_fingerprint</code></li><li>Retried up to 3 times with exponential back-off on 5xx responses</li></ul>",
    );
    return (
      <div className="flex max-w-2xl flex-col gap-3">
        <RichTextEditor value={html} onChange={setHtml} />
        <details className="text-xs text-muted-foreground">
          <summary>HTML output</summary>
          <pre className="mt-2 overflow-x-auto rounded bg-muted p-2">{html}</pre>
        </details>
      </div>
    );
  },
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Blank editor ready for a new qeet-people announcement — shows the placeholder state before the user types.",
      },
    },
  },
  render: () => {
    const [html, setHtml] = React.useState("");
    return (
      <div className="max-w-2xl">
        <RichTextEditor
          value={html}
          onChange={setHtml}
          placeholder="Write your team announcement…"
        />
      </div>
    );
  },
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Read-only view hides the toolbar — used when rendering published knowledge-base articles or audit-event descriptions that should not be editable.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl">
      <RichTextEditor
        editable={false}
        defaultValue="<h3>Passkey enrollment required</h3><p>Your organisation's security policy requires all admins to enroll a passkey before accessing the Qeet ID dashboard. Passwords will be disabled on <strong>1 August 2026</strong>.</p>"
      />
    </div>
  ),
};
