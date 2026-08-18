import { Stepper } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const ONBOARDING_STEPS = [
  { label: "Account", description: "Your details" },
  { label: "Workspace", description: "Name & URL" },
  { label: "Invite team", description: "Optional" },
  { label: "Done" },
];

const PAYMENT_STEPS = [
  { label: "Billing address", description: "India GST supported" },
  { label: "Payment method", description: "UPI or card" },
  { label: "Review", description: "Confirm plan" },
  { label: "Activated" },
];

const meta: Meta<typeof Stepper> = {
  title: "Primitives/Stepper",
  component: Stepper,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Horizontal step indicator for multi-step wizards — Qeet ID organisation onboarding, qeet-pay payment setup, and qeet-people employee onboarding flows. Steps before `activeStep` (zero-based) render as complete with a check; the active step is highlighted; upcoming steps are muted.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Qeet ID organisation onboarding — step 2 (Workspace) is active; step 1 (Account) is complete.",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-2xl">
      <Stepper steps={ONBOARDING_STEPS} activeStep={1} />
    </div>
  ),
};

export const PaymentSetup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "qeet-pay checkout wizard at the payment-method step — one step complete, two remaining.",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-2xl">
      <Stepper steps={PAYMENT_STEPS} activeStep={1} />
    </div>
  ),
};

export const Complete: Story = {
  parameters: {
    docs: {
      description: {
        story: "All steps complete — drive `activeStep` to `steps.length` to show all checks.",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-2xl">
      <Stepper steps={ONBOARDING_STEPS} activeStep={4} />
    </div>
  ),
};
