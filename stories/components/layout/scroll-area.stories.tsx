import { Box, Card, Inline, ScrollArea, Separator, Stack, Text } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment } from "react";
import { expect, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const PEOPLE = ["Priya Sharma", "Rahul Verma", "Ananya Iyer", "Karthik Reddy", "Meera Nair"];
const ACTIONS = [
  "signed in with a passkey",
  "reset MFA for a user",
  "created an API key",
  "updated the session policy",
  "invited 3 users",
  "revoked a session",
];

/** Thirty audit events, newest first. */
const EVENTS = Array.from({ length: 30 }, (_, i) => ({
  id: `evt_${String(4812 - i)}`,
  who: PEOPLE[i % PEOPLE.length] as string,
  what: ACTIONS[i % ACTIONS.length] as string,
  when: `${String(9 - Math.floor(i / 6)).padStart(2, "0")}:${String(59 - ((i * 7) % 60)).padStart(2, "0")} IST`,
}));

/** `inline` is the rows' side padding: `lg` in a Card, to line up with its header. */
function AuditEvents({ inline = "md" }: { inline?: "md" | "lg" }) {
  return (
    <Box paddingInline={inline} paddingBlock="md">
      <Stack gap="sm">
        {EVENTS.map((event, i) => (
          <Fragment key={event.id}>
            {i > 0 && <Separator />}
            <Stack gap="none">
              <Text size="sm">
                <Text weight="medium">{event.who}</Text> {event.what}
              </Text>
              <Text size="sm" tone="subtle">
                {event.when} · {event.id}
              </Text>
            </Stack>
          </Fragment>
        ))}
      </Stack>
    </Box>
  );
}

const meta: Meta<typeof ScrollArea> = {
  title: "Components/Layout/ScrollArea",
  component: ScrollArea,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "centered",
  },
  args: {
    style: { blockSize: 280, inlineSize: 340 },
  },
  render: (args) => (
    <Box border="default" radius="surface">
      <ScrollArea {...args}>
        <AuditEvents />
      </ScrollArea>
    </Box>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Playground: Story = {};

const REGIONS = [
  ["Mumbai", "ap-south-1"],
  ["Hyderabad", "ap-south-2"],
  ["Chennai", "in-chennai-1"],
  ["Delhi NCR", "in-delhi-1"],
  ["Bengaluru", "in-blr-1"],
  ["Pune", "in-pune-1"],
];

const RAW_EVENT = JSON.stringify(
  {
    id: "evt_4812",
    type: "user.mfa.reset",
    actor: { id: "usr_01J9Z3K4M2QX", name: "Priya Sharma", email: "priya@acme.in" },
    target: { id: "usr_01J9Z5R8T1VB", name: "Rahul Verma", email: "rahul.verma@acme.in" },
    context: {
      ip: "49.207.52.118",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_6) AppleWebKit/605.1.15 Safari/605.1.15",
    },
    occurredAt: "2026-10-25T09:28:41.522+05:30",
  },
  null,
  2,
);

export const Orientations: Story = {
  render: () => (
    <Stack gap="lg">
      <Stack gap="sm">
        <Text size="sm" tone="subtle">
          Horizontal
        </Text>
        <Box border="default" radius="surface">
          <ScrollArea orientation="horizontal" style={{ inlineSize: 420 }}>
            <Box padding="md">
              <Inline gap="sm" wrap={false}>
                {REGIONS.map(([city, id]) => (
                  <Box
                    key={id}
                    padding="md"
                    background="raised"
                    border="default"
                    radius="surface"
                    style={{ inlineSize: 140, flex: "none" }}
                  >
                    <Stack gap="xs">
                      <Text weight="semibold">{city}</Text>
                      <Text mono size="sm" tone="subtle">
                        {id}
                      </Text>
                    </Stack>
                  </Box>
                ))}
              </Inline>
            </Box>
          </ScrollArea>
        </Box>
      </Stack>
      <Stack gap="sm">
        <Text size="sm" tone="subtle">
          Both
        </Text>
        <Box border="default" radius="surface" background="sunken">
          <ScrollArea orientation="both" style={{ blockSize: 200, inlineSize: 420 }}>
            <Box padding="md">
              <Text mono size="sm" render={<pre />}>
                {RAW_EVENT}
              </Text>
            </Box>
          </ScrollArea>
        </Box>
      </Stack>
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: (args) => (
    <div style={{ inlineSize: 380 }}>
      <Card title="Audit log" level={2}>
        <ScrollArea {...args} style={{ blockSize: 260 }}>
          <AuditEvents inline="lg" />
        </ScrollArea>
      </Card>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the region is a Tab stop",
  play: async ({ canvasElement, userEvent }) => {
    // The focusable viewport has no role or name to query by, so find its slot.
    const viewport = canvasElement.querySelector<HTMLElement>("[data-slot=scroll-area-viewport]");
    const scrollbar = canvasElement.querySelector<HTMLElement>("[data-orientation=vertical]");
    await userEvent.tab();
    await expect(viewport).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(scrollbar as HTMLElement).opacity).toBe("1"));
  },
};
