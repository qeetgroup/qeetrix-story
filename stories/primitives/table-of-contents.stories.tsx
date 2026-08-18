import { TableOfContents } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof TableOfContents> = {
  title: "Primitives/TableOfContents",
  component: TableOfContents,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A scroll-spy table of contents with an `activeId` indicator — the backbone of qeet-docs' in-page navigation. Pass `items` with optional `depth` for nested headings; the component auto-detects the active section via `IntersectionObserver` or accepts a controlled `activeId`.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TableOfContents>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The active item is highlighted with a primary border — mimicking scroll position on a qeet-docs page.",
      },
    },
  },
  render: () => (
    <TableOfContents
      activeId="passkeys"
      items={[
        { id: "overview", label: "Overview" },
        { id: "quickstart", label: "Quick start" },
        { id: "auth-methods", label: "Authentication methods" },
        { id: "passkeys", label: "Passkeys", depth: 1 },
        { id: "magic-link", label: "Magic link", depth: 1 },
        { id: "otp", label: "OTP fallback", depth: 1 },
        { id: "tokens", label: "Token reference" },
        { id: "webhooks", label: "Webhooks" },
        { id: "faq", label: "FAQ" },
      ]}
    />
  ),
};

export const ShallowPage: Story = {
  parameters: {
    docs: {
      description: {
        story: "Flat (no-depth) variant for shorter docs pages with only top-level sections.",
      },
    },
  },
  render: () => (
    <TableOfContents
      activeId="billing"
      items={[
        { id: "overview", label: "Overview" },
        { id: "billing", label: "Billing & plans" },
        { id: "sla", label: "SLA & uptime" },
        { id: "changelog", label: "Changelog" },
      ]}
    />
  ),
};
