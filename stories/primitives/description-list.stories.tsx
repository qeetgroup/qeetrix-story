import { DescriptionDetails, DescriptionList, DescriptionTerm, StatusPill } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof DescriptionList> = {
  title: "Primitives/DescriptionList",
  component: DescriptionList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Semantic `<dl>` wrapper for key/value metadata panels. Pairs `DescriptionTerm` (`<dt>`) with `DescriptionDetails` (`<dd>`) to present structured record details such as tenant settings, API key metadata, or employee profiles.",
      },
    },
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
  render: () => (
    <DescriptionList className="max-w-xl">
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
