import { Badge, Marquee } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Marquee> = {
  title: "Components/Media/Marquee",
  component: Marquee,
  parameters: {
    qeetrix: qx({ category: "media", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "A continuous scrolling ticker — used on qeet.in's marketing pages to display customer logos or product feature pills. Pauses automatically when `prefers-reduced-motion` is active, and on hover via `pauseOnHover`. Control `direction`, `speed`, and `gap` to match your layout.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Marquee>;

const CUSTOMERS = ["Razorpay", "Zepto", "Groww", "CRED", "Meesho", "Slice", "Jar", "Fi Money"];

const FEATURES = [
  "Passkeys",
  "Magic links",
  "OIDC / OAuth 2.0",
  "Org management",
  "RBAC",
  "Audit logs",
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Customer-logo ticker as seen on the qeet.in homepage — scrolls left at a comfortable reading pace.",
      },
    },
  },
  render: () => (
    <Marquee aria-label="Customers using Qeet ID" speed={22}>
      {CUSTOMERS.map((name) => (
        <Badge key={name} variant="secondary" className="mx-3">
          {name}
        </Badge>
      ))}
    </Marquee>
  ),
};

export const RightToLeft: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Reverse direction for stacked tickers — a common marketing-page pattern for showing features beneath the customer strip.",
      },
    },
  },
  render: () => (
    <Marquee aria-label="Qeet ID features" direction="right" speed={28}>
      {FEATURES.map((f) => (
        <Badge key={f} variant="outline" className="mx-3">
          {f}
        </Badge>
      ))}
    </Marquee>
  ),
};
