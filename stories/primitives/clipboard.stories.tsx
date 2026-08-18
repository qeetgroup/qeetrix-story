import { CopyButton } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof CopyButton> = {
  title: "Primitives/CopyButton",
  component: CopyButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A one-click button that copies a string value to the clipboard. After a successful write it briefly shows a check icon with the `copiedLabel` text (default `"Copied!"`) before reverting — the delay is controlled by `timeout` (default 1500 ms). Built on the `Button` primitive, so it accepts `variant` and `size`. The underlying `useCopyToClipboard` hook is also exported for headless clipboard usage.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Copies a Qeet ID API key to the clipboard — the standard usage on the Developer → API Keys settings page.",
      },
    },
  },
  render: () => (
    <CopyButton value="qid_live_8f2c1a9b4e7d6c0f3a2b1e9d8c7f6a5b" label="Copy API key" />
  ),
};

export const CustomLabels: Story = {
  parameters: {
    docs: {
      description: {
        story: "Custom `label` and `copiedLabel` for a webhook endpoint copy button.",
      },
    },
  },
  render: () => (
    <CopyButton
      value="https://hooks.qeet.in/v1/events/acme-corp"
      label="Copy endpoint"
      copiedLabel="Endpoint copied"
    />
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All standard Button `variant` values are supported — pick one that suits the surrounding context.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <CopyButton value="qid_live_abc123" variant="outline" label="outline" />
      <CopyButton value="qid_live_abc123" variant="secondary" label="secondary" />
      <CopyButton value="qid_live_abc123" variant="ghost" label="ghost" />
      <CopyButton value="qid_live_abc123" variant="default" label="default" />
    </div>
  ),
};

export const InlineCredentialRow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Inline credential row pairing a masked value with the copy button — typical layout in the OAuth Applications panel.",
      },
    },
  },
  render: () => (
    <div className="flex w-96 items-center justify-between rounded-md border px-3 py-2">
      <span className="font-mono text-sm text-muted-foreground">cs_live_••••••••••••••••</span>
      <CopyButton
        value="cs_live_9d7e2b4f1a3c8e5d6b2f9c4a7e1b3d8f"
        label="Copy"
        copiedLabel="Copied!"
      />
    </div>
  ),
};

export const WebhookSigningSecret: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Copying a webhook signing secret with a longer `timeout` (3 s) so the confirmation lingers in dense dashboards.",
      },
    },
  },
  render: () => (
    <CopyButton
      value="whsec_4f2c9a1b8e7d3f6c2a9b4e1d7c3f8b2e"
      label="Copy signing secret"
      copiedLabel="Secret copied — keep it safe"
      timeout={3000}
    />
  ),
};

export const SmallSize: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Size `"sm"` (default) alongside size `"xs"` — the compact form fits inside table cells and description lists.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <CopyButton value="qid_live_8f2c1a9b4e7d6c0f" label="Copy" size="sm" />
      <CopyButton value="qid_live_8f2c1a9b4e7d6c0f" label="Copy" size="xs" />
    </div>
  ),
};
