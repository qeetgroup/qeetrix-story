import { Button, PageHeader } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon } from "lucide-react";

const meta: Meta<typeof PageHeader> = {
  title: "Primitives/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The standard top-of-page title block used across all Qeet product admin UIs. Accepts an optional `breadcrumb` eyebrow, a `title`, a `description`, and right-aligned `actions`. Presentational and router-agnostic — pass pre-resolved strings or React nodes.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <PageHeader
        breadcrumb={<span>Settings › API keys</span>}
        title="API keys"
        description="Manage the keys used to authenticate machine-to-machine requests to the Qeet ID API. Keys with the client_credentials grant never expire unless manually revoked."
        actions={
          <Button>
            <PlusIcon /> New key
          </Button>
        }
      />
    </div>
  ),
};

export const NoActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Read-only pages (e.g. audit log view in qeet-logs) omit the `actions` slot — the title and description stand alone.",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-3xl">
      <PageHeader
        breadcrumb={<span>qeet-logs › Audit log</span>}
        title="Audit log"
        description="A tamper-evident record of every action performed in your organisation — exported as JSON or streamed via webhook."
      />
    </div>
  ),
};
