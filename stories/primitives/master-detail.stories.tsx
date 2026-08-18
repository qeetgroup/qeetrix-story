import { MasterDetail } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof MasterDetail> = {
  title: "Primitives/MasterDetail",
  component: MasterDetail,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Responsive two-pane layout used in mail, inbox, and log-detail views. On desktop a resizable `ResizablePanelGroup` splits list and detail side-by-side; on mobile the detail opens as a slide-over `Sheet`. Control `detailOpen` / `onDetailOpenChange` to drive the mobile sheet from a row tap.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MasterDetail>;

const AUDIT_EVENTS = [
  {
    id: "evt_01",
    title: "User signed in",
    sub: "Ada Lovelace · passkey · Chennai",
  },
  {
    id: "evt_02",
    title: "API key created",
    sub: "Grace Hopper · prod key sk_live_…",
  },
  {
    id: "evt_03",
    title: "Webhook delivered",
    sub: "POST https://hooks.acme.com/qeet · 200",
  },
  {
    id: "evt_04",
    title: "Passkey registered",
    sub: "Alan Turing · macOS Touch ID",
  },
  {
    id: "evt_05",
    title: "Organisation updated",
    sub: "Katherine Johnson · billing email changed",
  },
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "qeet-logs audit event list — select an event in the left pane to see its full payload in the right detail pane. Drag the divider to resize.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = React.useState(AUDIT_EVENTS[0].id);
    const event = AUDIT_EVENTS.find((e) => e.id === selected) ?? AUDIT_EVENTS[0];
    return (
      <div className="h-96 p-4">
        <MasterDetail
          list={
            <div className="space-y-0.5 p-2">
              {AUDIT_EVENTS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setSelected(e.id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${e.id === selected ? "bg-accent font-medium" : "text-muted-foreground"}`}
                >
                  <div className="font-medium text-foreground">{e.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{e.sub}</div>
                </button>
              ))}
            </div>
          }
          detail={
            <div className="p-6">
              <p className="text-xs font-mono text-muted-foreground">{event.id}</p>
              <h3 className="mt-1 font-heading text-base font-medium">{event.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{event.sub}</p>
              <pre className="mt-4 rounded-md bg-muted p-3 text-xs">
                {JSON.stringify(
                  {
                    id: event.id,
                    type: event.title,
                    actor: event.sub,
                    timestamp: new Date().toISOString(),
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          }
        />
      </div>
    );
  },
};
