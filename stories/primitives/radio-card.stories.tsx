import { RadioCard, RadioCardGroup } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof RadioCardGroup> = {
  title: "Primitives/RadioCard",
  component: RadioCardGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A visually rich single-selection group built from bordered cards. Each `RadioCard` wraps a native radio input and becomes highlighted when selected. Use `RadioCardGroup` with `defaultValue` for uncontrolled or `value` + `onValueChange` for controlled selection. The group renders with `role="radiogroup"` and native arrow-key roving focus via the shared `name` attribute.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof RadioCardGroup>;

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    desc: "Up to 5 members · community support",
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹1,999/mo",
    desc: "Up to 50 members · priority support",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    desc: "Unlimited members · SSO · SLA",
  },
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Qeet ID plan picker — Growth pre-selected as the recommended tier. Uses uncontrolled `defaultValue`.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <RadioCardGroup defaultValue="growth" aria-label="Qeet ID plan">
        {PLANS.map((plan) => (
          <RadioCard key={plan.id} value={plan.id}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{plan.name}</p>
                <p className="text-xs text-muted-foreground">{plan.desc}</p>
              </div>
              <span className="text-sm font-semibold">{plan.price}</span>
            </div>
          </RadioCard>
        ))}
      </RadioCardGroup>
    </div>
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Controlled group — selection state is managed externally via `value` + `onValueChange`. Suitable for multi-step onboarding wizards where the parent must track the choice.",
      },
    },
  },
  render: () => {
    const [plan, setPlan] = React.useState("starter");
    return (
      <div className="w-80 space-y-3">
        <RadioCardGroup value={plan} onValueChange={setPlan} aria-label="Qeet ID plan (controlled)">
          {PLANS.map((p) => (
            <RadioCard key={p.id} value={p.id}>
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.desc}</p>
            </RadioCard>
          ))}
        </RadioCardGroup>
        <p className="text-xs text-muted-foreground">
          Selected: <strong className="text-foreground">{plan}</strong>
        </p>
      </div>
    );
  },
};

export const WithDisabledOption: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Enterprise option disabled — not available on the current billing cycle. The card fades and its radio is inert.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <RadioCardGroup defaultValue="growth" aria-label="Qeet ID plan">
        {PLANS.map((plan) => (
          <RadioCard key={plan.id} value={plan.id} disabled={plan.id === "enterprise"}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{plan.name}</p>
                <p className="text-xs text-muted-foreground">{plan.desc}</p>
              </div>
              <span className="text-sm font-semibold">{plan.price}</span>
            </div>
          </RadioCard>
        ))}
      </RadioCardGroup>
    </div>
  ),
};

export const Horizontal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Cards laid out in a row using `className` on the group — useful for a compact tier toggle at the top of a pricing table.",
      },
    },
  },
  render: () => (
    <RadioCardGroup
      defaultValue="monthly"
      aria-label="Billing cycle"
      className="flex flex-row gap-3"
    >
      <RadioCard value="monthly">
        <p className="text-sm font-medium">Monthly</p>
      </RadioCard>
      <RadioCard value="annual">
        <p className="text-sm font-medium">Annual</p>
        <p className="text-xs text-muted-foreground">Save 20%</p>
      </RadioCard>
    </RadioCardGroup>
  ),
};
