import { CodeBlock } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof CodeBlock> = {
  title: "Components/Typography/CodeBlock",
  component: CodeBlock,
  parameters: {
    qeetrix: qx({ category: "typography", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A syntax-highlighted, copyable code block with optional line numbers, a caption bar, and a scrollable `maxHeight`. Supports `json`, `text`, `shell`, and `http` language modes. Used throughout Qeet ID developer docs, onboarding flows, and API reference panels.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CodeBlock>;

const sample = [
  'import { QeetClient } from "@qeet/sdk";',
  "",
  'const qeet = new QeetClient({ tenant: "acme" });',
  "await qeet.sessions.verify(token);",
].join("\n");

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "TypeScript quickstart snippet with line numbers, a copy button, and a file caption. This pattern appears in the Qeet ID onboarding wizard.",
      },
    },
  },
  render: () => (
    <div className="w-[34rem]">
      <CodeBlock value={sample} lineNumbers copy caption="quickstart.ts" />
    </div>
  ),
};

const userPayload = {
  id: "usr_8f2c1a9b4e7d",
  email: "ada@acme.com",
  name: "Ada Lovelace",
  role: "Owner",
  status: "active",
  mfa_enabled: true,
  created_at: "2026-03-04T08:00:00Z",
  last_login_at: "2026-06-01T14:30:00Z",
};

export const JsonResponse: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A Qeet ID REST API response rendered with `language="json"`. Use this pattern in API reference pages to show live response shapes next to endpoint descriptions.',
      },
    },
  },
  render: () => (
    <div className="w-[34rem]">
      <CodeBlock
        value={JSON.stringify(userPayload, null, 2)}
        language="json"
        copy
        caption="GET /v1/users/usr_8f2c1a9b4e7d"
      />
    </div>
  ),
};

const shellSnippet = [
  "npm install @qeet/sdk",
  "export QEET_SECRET_KEY=qid_live_8f2c1a9b4e7d6c0f3a2b1e9d8c7f6a5b",
].join("\n");

export const ShellCommand: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Shell commands with `language="shell"` and no line numbers — ideal for install and environment-setup instructions in onboarding wizards and README snippets.',
      },
    },
  },
  render: () => (
    <div className="w-[34rem]">
      <CodeBlock value={shellSnippet} language="shell" copy caption="Terminal" />
    </div>
  ),
};
