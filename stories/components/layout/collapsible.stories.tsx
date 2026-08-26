import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Collapsible> = {
  title: "Components/Layout/Collapsible",
  component: Collapsible,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A single toggle-able section with a trigger and expandable content area. Lighter than `Accordion` when you only need one independently collapsible region — for example hiding advanced OIDC token settings, optional webhook retry config, or a secondary filter panel until the user opts in.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Advanced OIDC settings panel — hidden by default so basic users aren't overwhelmed.",
      },
    },
  },
  render: () => (
    <Collapsible className="w-72">
      <CollapsibleTrigger
        render={
          <Button variant="outline" size="sm">
            Advanced settings
          </Button>
        }
      />
      <CollapsibleContent className="mt-2 rounded-md border border-border p-3 text-sm text-muted-foreground">
        Token lifetime: 3600 s · Clock skew tolerance: 30 s · Audience: api.id.qeet.in
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const WebhookRetry: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Collapsible retry configuration for a Qeet ID webhook — shown only when the user wants to override defaults.",
      },
    },
  },
  render: () => (
    <Collapsible className="w-72">
      <CollapsibleTrigger
        render={
          <Button variant="outline" size="sm">
            Retry configuration
          </Button>
        }
      />
      <CollapsibleContent className="mt-2 rounded-md border border-border p-3 text-sm text-muted-foreground">
        Max attempts: 5 · Backoff: exponential · Timeout: 10 s
      </CollapsibleContent>
    </Collapsible>
  ),
};
