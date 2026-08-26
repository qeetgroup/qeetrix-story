import { Label, ToggleTip, ToggleTipContent, ToggleTipTrigger } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof ToggleTip> = {
  title: "Components/Overlays/ToggleTip",
  component: ToggleTip,
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'A click-activated informational popover that supplements a label or icon-only control with contextual help. Unlike a Tooltip (hover/focus only, `role="tooltip"`), a ToggleTip is toggled by click and uses the Popover\'s `role="dialog"` — the correct ARIA pattern for click-toggled disclosures per WCAG 2.2 and the APG. Use it next to form field labels, policy settings in Qeet ID, and notification-channel explanations in Qeet Notify.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ToggleTip>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "ToggleTip next to a field label explaining the passkey rotation policy — click the info icon to reveal the details panel.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-1.5">
      <Label htmlFor="rotation-policy">Rotation policy</Label>
      <ToggleTip>
        <ToggleTipTrigger label="Learn about rotation policy" />
        <ToggleTipContent aria-label="Rotation policy details">
          <p className="font-medium">Passkey rotation</p>
          <p className="mt-1 text-muted-foreground">
            Qeet ID automatically re-registers each passkey every 90 days. Users receive an in-app
            prompt 7 days before expiry.
          </p>
        </ToggleTipContent>
      </ToggleTip>
    </div>
  ),
};

export const OpenState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pre-opened ToggleTip using `defaultOpen` — useful for docs snapshots and onboarding callouts.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-1.5">
      <Label>Session timeout</Label>
      <ToggleTip defaultOpen>
        <ToggleTipTrigger label="Learn about session timeout" />
        <ToggleTipContent aria-label="Session timeout details">
          <p className="font-medium">Idle session expiry</p>
          <p className="mt-1 text-muted-foreground">
            After 30 minutes of inactivity the session token is revoked and the user is redirected
            to the Qeet ID login page.
          </p>
        </ToggleTipContent>
      </ToggleTip>
    </div>
  ),
};

export const InlineHelp: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "ToggleTip placed inline within a sentence — explains a technical term without leaving the current screen.",
      },
    },
  },
  render: () => (
    <p className="flex items-baseline gap-1 text-sm text-muted-foreground">
      Events are signed with an
      <span className="inline-flex items-center gap-0.5 font-medium text-foreground">
        HMAC-SHA256
        <ToggleTip>
          <ToggleTipTrigger label="What is HMAC-SHA256?" />
          <ToggleTipContent aria-label="HMAC-SHA256 explanation">
            <p className="font-medium">HMAC-SHA256 signing</p>
            <p className="mt-1 text-muted-foreground">
              Each webhook delivery includes an{" "}
              <code className="rounded bg-muted px-1 font-mono text-xs">X-Qeet-Signature</code>{" "}
              header. Compute the HMAC over the raw request body using your secret to verify
              authenticity.
            </p>
          </ToggleTipContent>
        </ToggleTip>
      </span>
      secret.
    </p>
  ),
};
