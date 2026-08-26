import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Drawer> = {
  title: "Components/Overlays/Drawer",
  component: Drawer,
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A bottom-anchored sheet with a grab handle — optimised for mobile and quick-action surfaces. Built on top of `Sheet` with `side` fixed to `bottom`. Reach for `Drawer` for filter panels, quick settings, and contextual actions in qeet-logs or qeet-people mobile views.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Filter panel for a qeet-logs stream — select severity level and time window before applying.",
      },
    },
  },
  render: () => (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Filter logs</Button>} />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter stream</DrawerTitle>
          <DrawerDescription>
            Narrow the log stream by level, service, and time window.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-2 text-sm text-muted-foreground">
          Level: ERROR · Service: auth-service · Last 24 h
        </div>
        <DrawerFooter>
          <Button>Apply filters</Button>
          <DrawerClose render={<Button variant="outline">Cancel</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
