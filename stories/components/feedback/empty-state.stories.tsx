import {
  BellIcon,
  InboxIcon,
  PlusIcon,
  ReceiptIcon,
  RefreshCwIcon,
  SearchXIcon,
} from "@qeetrix/icons";
import { Button, EmptyState } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof EmptyState> = {
  title: "Components/Feedback/EmptyState",
  component: EmptyState,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Zero-data placeholder for list and table views — API key lists in Qeet ID, log streams in qeet-logs, and member rosters in qeet-people. Accepts an `icon`, `title`, `description`, and an optional `action` to guide the user toward their next step. `variant` says *why* the surface is empty and sets the icon tile's tone and default glyph: `default` (an empty collection), `first-use` (an invitation to create the first thing — the only Qeet-tinted tile), `no-results` (a filter excluded everything), `no-permission` (the data exists but the viewer can't see it) and `error` (loading failed). `size` is `sm` for a table body or side panel, `default`, or `lg` for a full page. `emptyStateVariants` and `emptyStateIconVariants` export the layout and icon-tile classes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "first-use", "no-results", "no-permission", "error"],
    },
    size: {
      control: "inline-radio",
      options: ["sm", "default", "lg"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Zero-key state for the Qeet ID API Keys list with a primary CTA to create the first key.",
      },
    },
  },
  render: () => (
    <div className="rounded-xl ring-1 ring-foreground/10">
      <EmptyState
        icon={InboxIcon}
        title="No API keys yet"
        description="Create your first key to start authenticating requests to the Qeet ID API."
        action={
          <Button>
            <PlusIcon /> New API key
          </Button>
        }
      />
    </div>
  ),
};

export const NoResults: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Search-empty state — `variant="no-results"`, no action button; just a message inviting the user to refine their query. The variant already defaults to the search glyph, so `icon` is optional here.',
      },
    },
  },
  render: () => (
    <div className="rounded-xl ring-1 ring-foreground/10">
      <EmptyState
        variant="no-results"
        icon={SearchXIcon}
        title="No matches"
        description="No results for “acme-prod”. Try a different search term."
      />
    </div>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'One empty state per reason — the reason decides the treatment, so pick the variant first and write the copy second. `first-use` is the only variant with the Qeet tint: pair it with the primary Button. `no-results` pairs with a secondary "clear filters" action. `no-permission` and `error` bring their own glyph (a lock, a warning) and should say who can grant access or offer a retry. `error` tints the tile only — the copy stays neutral so a failure reads as recoverable.',
      },
    },
  },
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl ring-1 ring-foreground/10">
        <EmptyState
          variant="default"
          icon={ReceiptIcon}
          title="No invoices yet"
          description="Invoices for your qeet-pay subscription will appear here each billing cycle."
        />
      </div>
      <div className="rounded-xl ring-1 ring-foreground/10">
        <EmptyState
          variant="first-use"
          icon={BellIcon}
          title="Send your first notification"
          description="Create a template in Qeet Notify and deliver it by email, SMS or push."
          action={<Button>Create template</Button>}
        />
      </div>
      <div className="rounded-xl ring-1 ring-foreground/10">
        <EmptyState
          variant="no-results"
          title="No log events match"
          description="Nothing in qeet-logs matches level:error in the last 15 minutes."
          action={<Button variant="outline">Clear filters</Button>}
        />
      </div>
      <div className="rounded-xl ring-1 ring-foreground/10">
        <EmptyState
          variant="no-permission"
          title="You can't view payroll runs"
          description="Ask a workspace owner to grant you the Payroll admin role in Qeet ID."
        />
      </div>
      <div className="rounded-xl ring-1 ring-foreground/10 md:col-span-2">
        <EmptyState
          variant="error"
          title="Couldn't load API keys"
          description="The Qeet ID API didn't respond. Your keys are safe — try again in a moment."
          action={
            <Button variant="outline">
              <RefreshCwIcon /> Retry
            </Button>
          }
        />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`size` scales the padding, icon tile and title together. `sm` fits a table body, a card or a side panel; `default` suits a list view; `lg` is for a whole page with nothing else on it.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="rounded-xl ring-1 ring-foreground/10">
          <EmptyState
            size={size}
            icon={InboxIcon}
            title={`No webhooks yet · ${size}`}
            description="Add an endpoint to receive Qeet ID events as they happen."
            action={
              <Button size={size === "sm" ? "sm" : "default"} variant="outline">
                Add endpoint
              </Button>
            }
          />
        </div>
      ))}
    </div>
  ),
};
