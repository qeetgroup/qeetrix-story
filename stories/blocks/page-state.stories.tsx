import { Button } from "@qeetrix/ui";
import { Maintenance, NotFound, ServerError } from "@qeetrix/ui/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Blocks/PageState",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-page status screens for the moments between content: `NotFound` (404), `ServerError` (500) and `Maintenance`. Each centres an illustration, message and optional actions, giving every Qeet product a consistent, on-brand fallback instead of a raw error.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Not_Found: Story = {
  render: () => (
    <NotFound
      actions={
        <>
          <Button variant="outline">Go back</Button>
          <Button>Go home</Button>
        </>
      }
    />
  ),
};

export const Server_Error: Story = {
  render: () => <ServerError actions={<Button>Retry</Button>} />,
};

export const Under_Maintenance: Story = {
  render: () => <Maintenance />,
};
