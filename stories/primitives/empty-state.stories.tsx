import { Button, EmptyState } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Add, DirectInbox, SearchNormal } from "@qeetrix/icons";

const meta: Meta<typeof EmptyState> = {
  title: "Primitives/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Zero-data placeholder for list and table views — API key lists in Qeet ID, log streams in qeet-logs, and member rosters in qeet-people. Accepts an `icon`, `title`, `description`, and an optional `action` button to guide the user toward their first item.",
      },
    },
  },
  tags: ["autodocs"],
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
        icon={DirectInbox}
        title="No API keys yet"
        description="Create your first key to start authenticating requests to the Qeet ID API."
        action={
          <Button>
            <Add /> New API key
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
          "Search-empty state — no action button; just a message inviting the user to refine their query.",
      },
    },
  },
  render: () => (
    <div className="rounded-xl ring-1 ring-foreground/10">
      <EmptyState
        icon={SearchNormal}
        title="No matches"
        description="No results for “acme-prod”. Try a different search term."
      />
    </div>
  ),
};
