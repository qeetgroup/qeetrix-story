import { PlusIcon } from "@qeetrix/icons";
import { Badge, Button, PageHeader } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof PageHeader> = {
  title: "Components/Layout/PageHeader",
  component: PageHeader,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "The standard top-of-page title block used across all Qeet product admin UIs. Accepts an optional `breadcrumb` eyebrow, a `title`, a `description`, a `metadata` row and trailing `actions`. Presentational and router-agnostic — pass pre-resolved strings or React nodes.\n\nIt responds to the width it is given, not to the viewport: the text column claims at least 20rem before it shares a line with the actions, so in a narrow panel, a split pane or a phone the actions wrap beneath the title instead of squeezing it to a word per line.",
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

export const WithMetadata: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`metadata` holds facts about the page's subject — a status badge, an identifier, a freshness stamp — laid out as a wrapping row beneath the description. Here, a qeet-pay invoice detail page.",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-3xl">
      <PageHeader
        breadcrumb={<span>qeet-pay › Invoices</span>}
        title="INV-2026-0412"
        description="Tax invoice for Acme Inc. — Growth plan, September 2026, including 18% IGST."
        metadata={
          <>
            <Badge variant="success">Paid</Badge>
            <span>GSTIN 29ABCDE1234F1Z5</span>
            <span>₹5,898.82</span>
            <span>Updated 4 min ago</span>
          </>
        }
        actions={
          <>
            <Button variant="outline">Download PDF</Button>
            <Button>Send receipt</Button>
          </>
        }
      />
    </div>
  ),
};

export const Narrow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The same header in a 20rem container — a split pane or a phone. The title column keeps its 20rem minimum, so the actions wrap beneath it instead of crushing the title. The layout follows the width it is given, not the viewport breakpoint.",
      },
    },
  },
  render: () => (
    <div className="w-80 rounded-md border border-dashed p-4">
      <PageHeader
        breadcrumb={<span>Qeet ID › Connections</span>}
        title="Okta SAML — Acme Inc."
        description="Members sign in through Okta. Changes apply to new sessions only."
        metadata={
          <>
            <Badge variant="success">Active</Badge>
            <span>24 members</span>
          </>
        }
        actions={
          <>
            <Button variant="outline">Test connection</Button>
            <Button>Edit</Button>
          </>
        }
      />
    </div>
  ),
};
