import {
  Badge,
  Button,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Sheet> = {
  title: "Components/Overlays/Sheet",
  component: Sheet,
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A slide-in panel anchored to an edge of the viewport — right by default, via the `side` prop on `SheetContent`. `top`, `right`, `bottom` and `left` are physical and stay put in every writing direction; `inline-start` and `inline-end` follow the reading direction, so an `inline-end` details panel is on the right in English and on the left in Arabic. Use it for detail views, inline editing, and filter drawers that don't warrant a full-page navigation: inspecting a SAML connection, editing a Qeet ID webhook, or reviewing a qeet-logs stream config.\n\nCompose it as `SheetHeader` → `SheetBody` → `SheetFooter`. `SheetBody` is the scrolling region: long content scrolls inside it while the header and footer stay pinned. Without it the whole sheet scrolls, which is still bounded to the viewport.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Right-anchored panel (default) — used in Qeet ID to inspect and edit a SAML connection without leaving the Connections list. The connection details sit in `SheetBody`; the actions sit in `SheetFooter`, at the bottom of the panel.",
      },
    },
  },
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">View connection</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Okta SAML — Acme Inc.</SheetTitle>
          <SheetDescription>
            Inspect and edit this SAML connection. Changes take effect immediately.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2">
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              <Badge variant="success">Active</Badge>
            </dd>
            <dt className="text-muted-foreground">Entity ID</dt>
            <dd className="font-mono text-xs break-all">http://www.okta.com/exk8acme01</dd>
            <dt className="text-muted-foreground">SSO URL</dt>
            <dd className="font-mono text-xs break-all">https://acme.okta.com/app/qeet/sso/saml</dd>
            <dt className="text-muted-foreground">Certificate</dt>
            <dd>Expires 14 Mar 2027</dd>
          </dl>
        </SheetBody>
        <SheetFooter>
          <SheetClose render={<Button>Save connection</Button>} />
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const LeftSide: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Left-anchored sheet via `side="left"` — useful for secondary navigation panels or app sidebars on mobile breakpoints.',
      },
    },
  },
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open navigation</Button>} />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Qeet ID</SheetTitle>
          <SheetDescription>Jump to any section.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

const WEBHOOK_DELIVERIES = [
  ["evt_01JA9Q7Z", "user.created", "200 OK", "2 min ago"],
  ["evt_01JA9Q5K", "session.ended", "200 OK", "4 min ago"],
  ["evt_01JA9Q2D", "user.updated", "200 OK", "9 min ago"],
  ["evt_01JA9PZW", "session.created", "500 Internal Server Error", "12 min ago"],
  ["evt_01JA9PXA", "session.created", "200 OK", "12 min ago"],
  ["evt_01JA9PT3", "user.mfa_enrolled", "200 OK", "18 min ago"],
  ["evt_01JA9PQ8", "user.created", "200 OK", "21 min ago"],
  ["evt_01JA9PM1", "org.member_added", "200 OK", "26 min ago"],
  ["evt_01JA9PH6", "user.passkey_added", "200 OK", "31 min ago"],
  ["evt_01JA9PDS", "session.ended", "408 Request Timeout", "37 min ago"],
  ["evt_01JA9PB2", "session.ended", "200 OK", "37 min ago"],
  ["evt_01JA9P7N", "user.deleted", "200 OK", "44 min ago"],
  ["evt_01JA9P3C", "org.role_changed", "200 OK", "52 min ago"],
  ["evt_01JA9NZY", "user.updated", "200 OK", "58 min ago"],
  ["evt_01JA9NWE", "session.created", "200 OK", "1 h ago"],
  ["evt_01JA9NS0", "user.created", "200 OK", "1 h ago"],
  ["evt_01JA9NNJ", "session.ended", "200 OK", "1 h ago"],
  ["evt_01JA9NJ4", "user.mfa_removed", "200 OK", "2 h ago"],
  ["evt_01JA9NEQ", "org.member_removed", "200 OK", "2 h ago"],
  ["evt_01JA9NAB", "user.updated", "200 OK", "2 h ago"],
] as const;

/** Twenty deliveries: taller than the viewport, so the body has to scroll. */
function DeliveryLogSheet() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">View deliveries</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Recent deliveries</SheetTitle>
          <SheetDescription>https://api.acme.com/hooks/qeet · last 2 hours</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <ul aria-label="Deliveries" className="divide-y divide-border-subtle">
            {WEBHOOK_DELIVERIES.map(([id, event, status, when]) => (
              <li key={id} className="flex flex-col gap-0.5 py-2.5">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-foreground">{event}</span>
                  <span className="text-xs text-muted-foreground">{when}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {id} · {status}
                </span>
              </li>
            ))}
          </ul>
        </SheetBody>
        <SheetFooter>
          <Button>Redeliver failed (2)</Button>
          <SheetClose render={<Button variant="outline">Done</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export const WithBody: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A Qeet ID webhook's delivery log in `SheetBody`. Twenty deliveries are taller than the viewport, so the list scrolls inside the body while the endpoint title and the Redeliver action stay pinned — the footer is never pushed off-screen by the content above it.",
      },
    },
  },
  render: () => <DeliveryLogSheet />,
};

export const OpenCloseInteraction: Story = {
  name: "Interaction: open and escape",
  parameters: {
    docs: {
      description: {
        story:
          "A sheet slides in from an edge, so it spends longer mid-animation than a centred dialog — all the more reason its open and dismissed states are asserted rather than eyeballed.",
      },
    },
  },
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">View connection</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Okta SAML — Acme Inc.</SheetTitle>
          <SheetDescription>Inspect and edit this SAML connection.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "View connection" }));

    const sheet = await screen.findByRole("dialog");
    await waitFor(() => expect(sheet).toBeVisible());
    await expect(screen.getByText("Okta SAML — Acme Inc.")).toBeVisible();

    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  },
};

export const BodyScrollInteraction: Story = {
  name: "Interaction: body scrolls, footer stays",
  parameters: {
    docs: {
      description: {
        story:
          "`SheetBody` is what keeps the footer reachable. The test scrolls the body to its end and asserts the sheet itself did not scroll and the Redeliver action is still inside the panel's visible box, then dismisses with Escape.",
      },
    },
  },
  render: () => <DeliveryLogSheet />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "View deliveries" }));

    const sheet = await screen.findByRole("dialog");
    await waitFor(() => expect(sheet).toBeVisible());

    const list = within(sheet).getByRole("list", { name: "Deliveries" });
    const body = list.closest<HTMLElement>('[data-slot="sheet-body"]');
    await expect(body).not.toBeNull();
    if (!body) return;
    // The content really overflows — otherwise the rest of this test would pass vacuously.
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);

    body.scrollTop = body.scrollHeight;
    await waitFor(() => expect(body.scrollTop).toBeGreaterThan(0));

    await expect(sheet.scrollTop).toBe(0);
    const redeliver = within(sheet).getByRole("button", { name: "Redeliver failed (2)" });
    await expect(redeliver.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      sheet.getBoundingClientRect().bottom,
    );

    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
