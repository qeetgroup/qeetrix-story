import {
  DescriptionDetails,
  DescriptionItem,
  DescriptionList,
  DescriptionTerm,
  StatusPill,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof DescriptionList> = {
  title: "Components/Data Display/DescriptionList",
  component: DescriptionList,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Semantic `<dl>` wrapper for key/value metadata panels. Pairs `DescriptionTerm` (`<dt>`) with `DescriptionDetails` (`<dd>`) to present structured record details such as tenant settings, API key metadata, or employee profiles. The term is a quiet muted label and the value is the data.\n\nTwo axes, from `descriptionListVariants`: `layout` — `horizontal` (term and value columns from `sm`, stacked below; the default), `vertical` (term above value at every width, for drawers and side sheets) and `grid` (a responsive grid of term-over-value cells for summary panels) — and `divided`, which rules a hairline between pairs. Wrap a pair in `DescriptionItem` (a `<div>`, which `<dl>` permits) to group it: the term sits tight against its own value, the rule runs under the whole pair, and one term can carry several values. `DescriptionItem` is optional for `horizontal` and `vertical` and required for `grid`. Spacing follows density.",
      },
    },
  },
  argTypes: {
    layout: {
      control: "select",
      options: ["horizontal", "vertical", "grid"],
    },
    divided: { control: "boolean" },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DescriptionList>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A Qeet ID tenant overview panel showing plan, status, primary domain, and creation date. A `StatusPill` is embedded directly inside `DescriptionDetails` for inline status display.",
      },
    },
  },
  args: { layout: "horizontal", divided: false },
  render: (args) => (
    <DescriptionList {...args} className="max-w-xl">
      <DescriptionTerm>Tenant</DescriptionTerm>
      <DescriptionDetails>Acme Inc.</DescriptionDetails>

      <DescriptionTerm>Plan</DescriptionTerm>
      <DescriptionDetails>Enterprise</DescriptionDetails>

      <DescriptionTerm>Status</DescriptionTerm>
      <DescriptionDetails>
        <StatusPill status="active" />
      </DescriptionDetails>

      <DescriptionTerm>Primary domain</DescriptionTerm>
      <DescriptionDetails>auth.acme.com</DescriptionDetails>

      <DescriptionTerm>Created</DescriptionTerm>
      <DescriptionDetails>March 4, 2026</DescriptionDetails>
    </DescriptionList>
  ),
};

export const ApiKeyDetails: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Qeet ID API key detail panel. The secret is truncated and rendered as inline code. Scopes are listed as plain text; an active `StatusPill` confirms the key is live.",
      },
    },
  },
  render: () => (
    <DescriptionList className="max-w-xl">
      <DescriptionTerm>Key name</DescriptionTerm>
      <DescriptionDetails>Production backend</DescriptionDetails>

      <DescriptionTerm>Key ID</DescriptionTerm>
      <DescriptionDetails>kid_8f2c1a9b</DescriptionDetails>

      <DescriptionTerm>Secret</DescriptionTerm>
      <DescriptionDetails>
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">qid_live_8f2c…4e7d</code>
      </DescriptionDetails>

      <DescriptionTerm>Scopes</DescriptionTerm>
      <DescriptionDetails>read:users write:sessions</DescriptionDetails>

      <DescriptionTerm>Created</DescriptionTerm>
      <DescriptionDetails>Jun 1, 2026 · by Ada Lovelace</DescriptionDetails>

      <DescriptionTerm>Last used</DescriptionTerm>
      <DescriptionDetails>2 minutes ago</DescriptionDetails>

      <DescriptionTerm>Status</DescriptionTerm>
      <DescriptionDetails>
        <StatusPill status="active" />
      </DescriptionDetails>
    </DescriptionList>
  ),
};

export const EmployeeProfile: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "qeet-people HCM employee profile panel. Demonstrates the component's suitability for HR record displays with org-chart fields like department, role, and reporting line.",
      },
    },
  },
  render: () => (
    <DescriptionList className="max-w-xl">
      <DescriptionTerm>Employee</DescriptionTerm>
      <DescriptionDetails>Grace Hopper</DescriptionDetails>

      <DescriptionTerm>Department</DescriptionTerm>
      <DescriptionDetails>Engineering</DescriptionDetails>

      <DescriptionTerm>Role</DescriptionTerm>
      <DescriptionDetails>Principal Engineer</DescriptionDetails>

      <DescriptionTerm>Reports to</DescriptionTerm>
      <DescriptionDetails>Ada Lovelace</DescriptionDetails>

      <DescriptionTerm>Location</DescriptionTerm>
      <DescriptionDetails>Bengaluru, India</DescriptionDetails>

      <DescriptionTerm>Joined</DescriptionTerm>
      <DescriptionDetails>March 4, 2026</DescriptionDetails>

      <DescriptionTerm>Status</DescriptionTerm>
      <DescriptionDetails>
        <StatusPill status="active" />
      </DescriptionDetails>
    </DescriptionList>
  ),
};

export const Layouts: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The three `layout` values on the same Qeet ID tenant record. `horizontal` splits term and value into columns from `sm`; `vertical` stacks them at every width, which is what a narrow drawer or side sheet needs; `grid` fills the width with term-over-value cells, and needs each pair wrapped in a `DescriptionItem`.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-3xl flex-col gap-8">
      <section aria-label="Horizontal layout" className="flex flex-col gap-2">
        <p className="text-caption font-medium text-muted-foreground">horizontal</p>
        <DescriptionList layout="horizontal">
          <DescriptionTerm>Tenant</DescriptionTerm>
          <DescriptionDetails>Acme Inc.</DescriptionDetails>
          <DescriptionTerm>Primary domain</DescriptionTerm>
          <DescriptionDetails>auth.acme.com</DescriptionDetails>
          <DescriptionTerm>Region</DescriptionTerm>
          <DescriptionDetails>Mumbai (ap-south-1)</DescriptionDetails>
        </DescriptionList>
      </section>
      <section aria-label="Vertical layout" className="flex w-72 flex-col gap-2">
        <p className="text-caption font-medium text-muted-foreground">vertical</p>
        <DescriptionList layout="vertical">
          <DescriptionTerm>Tenant</DescriptionTerm>
          <DescriptionDetails>Acme Inc.</DescriptionDetails>
          <DescriptionTerm>Primary domain</DescriptionTerm>
          <DescriptionDetails>auth.acme.com</DescriptionDetails>
          <DescriptionTerm>Region</DescriptionTerm>
          <DescriptionDetails>Mumbai (ap-south-1)</DescriptionDetails>
        </DescriptionList>
      </section>
      <section aria-label="Grid layout" className="flex flex-col gap-2">
        <p className="text-caption font-medium text-muted-foreground">grid</p>
        <DescriptionList layout="grid">
          <DescriptionItem>
            <DescriptionTerm>Plan</DescriptionTerm>
            <DescriptionDetails>Enterprise</DescriptionDetails>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>Region</DescriptionTerm>
            <DescriptionDetails>Mumbai (ap-south-1)</DescriptionDetails>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>Monthly active users</DescriptionTerm>
            <DescriptionDetails>27,400</DescriptionDetails>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>Status</DescriptionTerm>
            <DescriptionDetails>
              <StatusPill status="active" />
            </DescriptionDetails>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>Created</DescriptionTerm>
            <DescriptionDetails>March 4, 2026</DescriptionDetails>
          </DescriptionItem>
          <DescriptionItem>
            <DescriptionTerm>Owner</DescriptionTerm>
            <DescriptionDetails>Ada Lovelace</DescriptionDetails>
          </DescriptionItem>
        </DescriptionList>
      </section>
    </div>
  ),
};

export const Divided: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A qeet-pay invoice summary with `divided` rules between pairs. Each pair is a `DescriptionItem`, so the rule runs under the whole pair across both columns, and a term can carry more than one value — the GST line holds both its components. `divided` also works on bare term/value siblings.",
      },
    },
  },
  render: () => (
    <DescriptionList divided className="max-w-xl">
      <DescriptionItem>
        <DescriptionTerm>Invoice</DescriptionTerm>
        <DescriptionDetails className="font-mono">INV-2026-0418</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>Billed to</DescriptionTerm>
        <DescriptionDetails>Acme Retail Pvt Ltd · GSTIN 29AAACA1234F1Z5</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>Taxable value</DescriptionTerm>
        <DescriptionDetails>₹42,500.00</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>GST</DescriptionTerm>
        <DescriptionDetails>CGST 9% · ₹3,825.00</DescriptionDetails>
        <DescriptionDetails>SGST 9% · ₹3,825.00</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>Total</DescriptionTerm>
        <DescriptionDetails className="font-medium">₹50,150.00</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>Status</DescriptionTerm>
        <DescriptionDetails>
          <StatusPill status="pending" />
        </DescriptionDetails>
      </DescriptionItem>
    </DescriptionList>
  ),
};

export const DividedVertical: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`divided` with `layout="vertical"` in a Qeet People side sheet — bare term/value siblings, no `DescriptionItem` needed. The first pair has no rule above it and the last none below, so the list sits flush in its panel.',
      },
    },
  },
  render: () => (
    <DescriptionList layout="vertical" divided className="w-72">
      <DescriptionTerm>Employee ID</DescriptionTerm>
      <DescriptionDetails className="font-mono">QP-004127</DescriptionDetails>
      <DescriptionTerm>Department</DescriptionTerm>
      <DescriptionDetails>Engineering</DescriptionDetails>
      <DescriptionTerm>Reports to</DescriptionTerm>
      <DescriptionDetails>Ada Lovelace</DescriptionDetails>
      <DescriptionTerm>Leave balance</DescriptionTerm>
      <DescriptionDetails>14 days earned · 6 days casual</DescriptionDetails>
    </DescriptionList>
  ),
};
