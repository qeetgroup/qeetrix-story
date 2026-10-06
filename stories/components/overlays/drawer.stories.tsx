import {
  Button,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor, within } from "storybook/test";
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
          "The mobile bottom sheet: anchored to the bottom edge, rounded on top, with a grab handle — optimised for quick-action surfaces. It is built on Base UI's Drawer (Dialog plus gestures), so it is dismissed by swiping it down as well as by Escape, the close button or the backdrop, and focus containment and focus return are the Dialog's. The swipe always has a keyboard and screen-reader equivalent. Reach for `Drawer` for filter panels, quick settings, and contextual actions in qeet-logs or qeet-people mobile views; use `Sheet` for side panels and for anything that should not move under a finger.\n\nCompose it as `DrawerHeader` → `DrawerBody` → `DrawerFooter` (the same parts as Sheet). `DrawerBody` is the scrolling region: the drawer is capped at 85% of the viewport height, and long content scrolls inside the body while the header and footer stay pinned.",
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
        <DrawerBody className="text-sm text-muted-foreground">
          Level: ERROR · Service: auth-service · Last 24 h
        </DrawerBody>
        <DrawerFooter>
          <Button>Apply filters</Button>
          <DrawerClose render={<Button variant="outline">Cancel</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

const LOG_ENTRY_FIELDS: Array<[string, string]> = [
  ["timestamp", "2026-10-07T02:14:09.481Z"],
  ["level", "ERROR"],
  ["service", "auth-service"],
  ["environment", "production"],
  ["region", "ap-south-1"],
  ["host", "auth-7f9c4d-2xk8q"],
  ["trace_id", "4bf92f3577b34da6a3ce929d0e0e4736"],
  ["span_id", "00f067aa0ba902b7"],
  ["tenant_id", "tnt_acme_01HZX3"],
  ["user_id", "usr_01J8K2M4PQ"],
  ["route", "POST /oauth/token"],
  ["status", "500"],
  ["duration_ms", "1874"],
  ["client_id", "qeet-pay-reconciler"],
  ["grant_type", "client_credentials"],
  ["error.type", "UpstreamTimeout"],
  ["error.message", "JWKS fetch timed out after 1500 ms"],
  ["upstream", "https://id.qeet.in/.well-known/jwks.json"],
  ["retry_count", "2"],
  ["release", "auth-service@4.18.2"],
  ["sdk", "qeet-logs-node 3.2.0"],
  ["ingested_at", "2026-10-07T02:14:09.902Z"],
];

/** Taller than the drawer's 85dvh cap, so the body has to scroll. */
function LogEntryDrawer() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Inspect log entry</Button>} />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>JWKS fetch timed out</DrawerTitle>
          <DrawerDescription>auth-service · production · 2 min ago</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <dl className="divide-y divide-border-subtle">
            {LOG_ENTRY_FIELDS.map(([key, value]) => (
              <div key={key} className="flex flex-col gap-0.5 py-2">
                <dt className="font-mono text-xs text-muted-foreground">{key}</dt>
                <dd className="font-mono text-sm break-all text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </DrawerBody>
        <DrawerFooter>
          <Button>Open trace</Button>
          <DrawerClose render={<Button variant="outline">Done</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const WithBody: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A qeet-logs entry with 22 attributes is taller than the drawer's 85dvh cap. `DrawerBody` scrolls the attributes while the title and the Open trace / Done actions stay pinned at the top and bottom of the sheet — the action never disappears under a thumb.",
      },
    },
  },
  render: () => <LogEntryDrawer />,
};

export const OpenCloseInteraction: Story = {
  name: "Interaction: open, escape, close",
  parameters: {
    docs: {
      description: {
        story:
          "The swipe is a pointer-only gesture, so its keyboard equivalents are what this test pins: Escape closes the drawer, and so does the footer action. Both dismissals are asserted, because a drawer that can only be swiped away is unusable without a pointer.",
      },
    },
  },
  render: () => <LogEntryDrawer />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Inspect log entry" });
    await userEvent.click(trigger);

    // Portalled to document.body, and slides up from translate-y-full, so poll for it.
    const drawer = await screen.findByRole("dialog");
    await waitFor(() => expect(drawer).toBeVisible());
    await expect(within(drawer).getByText("JWKS fetch timed out")).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    // Reopen and dismiss through the footer this time.
    await userEvent.click(trigger);
    const reopened = await screen.findByRole("dialog");
    await waitFor(() => expect(reopened).toBeVisible());
    await userEvent.click(within(reopened).getByRole("button", { name: "Done" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
