import { DataState } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof DataState> = {
  title: "Components/Feedback/DataState",
  component: DataState,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A wrapper that gates its `children` behind loading, error, and empty states. Pass `isLoading` to show a skeleton, `isError` + `error` to show an error fallback, `isEmpty` to show an empty-state illustration, or none of them to render children directly. Eliminates repetitive conditional rendering across data-driven pages.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DataState>;

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Skeleton placeholder shown while data is being fetched. `skeletonRows` controls how many shimmer rows appear — match this to the expected row count to minimise layout shift.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <DataState isLoading skeletonRows={3}>
        <div>loaded content</div>
      </DataState>
    </div>
  ),
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Empty state shown when a fetch succeeds but returns no rows. Supply `emptyTitle` and `emptyDescription` to guide the user toward their next action.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <DataState
        isEmpty
        emptyTitle="No connections yet"
        emptyDescription="Add a SAML or OIDC connection to get started."
      >
        <div>content</div>
      </DataState>
    </div>
  ),
};

export const ErrorState: Story = {
  name: "Error",
  parameters: {
    docs: {
      description: {
        story:
          "Error fallback rendered when the upstream request fails. Pass the caught `Error` object to `error` so the message is surfaced to the user.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <DataState
        isError
        error={new globalThis.Error("Failed to fetch audit logs — upstream timeout after 10 s")}
      >
        <div>content</div>
      </DataState>
    </div>
  ),
};

export const WithData: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When none of `isLoading`, `isError`, or `isEmpty` are true, children render directly.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <DataState>
        <p className="text-sm text-muted-foreground p-4">3 members loaded</p>
      </DataState>
    </div>
  ),
};
