import { Button } from "@qeetrix/ui";
import { PricingTable, PricingTier } from "@qeetrix/ui/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof PricingTable> = {
  title: "Blocks/PricingTable",
  component: PricingTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A responsive pricing grid built from `PricingTier` cards — name, price, feature list (with included / excluded states), an optional featured highlight and a CTA slot. Used for plan-selection and upgrade screens across the Qeet suite.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof PricingTable>;

export const ThreeTiers: Story = {
  render: () => (
    <PricingTable>
      <PricingTier
        name="Starter"
        price="$0"
        period="/mo"
        description="For trying things out"
        cta={
          <Button variant="outline" className="w-full">
            Get started
          </Button>
        }
        features={[
          "Up to 1,000 monthly active users",
          "Passwordless + passkeys",
          { text: "Audit logs", included: false },
          { text: "SSO / SAML", included: false },
        ]}
      />
      <PricingTier
        name="Pro"
        price="$29"
        period="/mo"
        description="For growing teams"
        featured
        badge="Most popular"
        cta={<Button className="w-full">Start free trial</Button>}
        features={[
          "Up to 50,000 monthly active users",
          "Passwordless + passkeys",
          "30-day audit logs",
          { text: "SSO / SAML", included: false },
        ]}
      />
      <PricingTier
        name="Enterprise"
        price="Custom"
        description="For large organizations"
        cta={
          <Button variant="outline" className="w-full">
            Contact sales
          </Button>
        }
        features={[
          "Unlimited monthly active users",
          "Passwordless + passkeys",
          "Unlimited audit logs",
          "SSO / SAML + SCIM",
        ]}
      />
    </PricingTable>
  ),
};
