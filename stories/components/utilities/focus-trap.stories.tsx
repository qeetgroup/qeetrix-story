import { Button, FocusTrap, Input, Label } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof FocusTrap> = {
  title: "Components/Utilities/FocusTrap",
  component: FocusTrap,
  parameters: {
    qeetrix: qx({ category: "utilities", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Component wrapper around `useFocusTrap`. When `active` is `true`, keyboard Tab / Shift+Tab cycles exclusively within the contained focusable elements, preventing focus from escaping to the rest of the page. On deactivation (when `active` becomes `false`) focus is returned to the element that held it before the trap activated (`restoreFocus` defaults to `true`). Use this for custom overlay panels that cannot use the Base UI `Dialog` primitive. See the WAI-ARIA [dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).",
      },
    },
  },
  argTypes: {
    active: { control: "boolean" },
    restoreFocus: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FocusTrap>;

function FocusTrapDemo() {
  const [active, setActive] = React.useState(false);

  return (
    <div className="flex flex-col items-start gap-4 w-80">
      <Button onClick={() => setActive(true)} disabled={active}>
        Open panel (activates trap)
      </Button>

      <FocusTrap
        active={active}
        className="w-full rounded-lg border bg-background p-5 shadow-md"
        aria-label="Settings panel"
      >
        <h2 className="mb-4 text-sm font-semibold text-foreground">Organisation settings</h2>
        <div className="flex flex-col gap-3">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="ft-org-name">Organisation name</Label>
            <Input id="ft-org-name" defaultValue="Acme Corp" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="ft-domain">Domain</Label>
            <Input id="ft-domain" defaultValue="acme.qeet.in" />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setActive(false)}>
            Cancel
          </Button>
          <Button onClick={() => setActive(false)}>Save changes</Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Tab / Shift+Tab stays inside this panel while the trap is active.
        </p>
      </FocusTrap>
    </div>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Click 'Open panel' to activate the trap. Tab through the fields — focus cycles within the panel. Click 'Cancel' or 'Save changes' to deactivate; focus returns to the trigger button.",
      },
    },
  },
  render: () => <FocusTrapDemo />,
};

function InactiveDemo() {
  return (
    <div className="flex flex-col gap-4 w-80">
      <p className="text-sm text-muted-foreground">
        Tab through the fields below — focus escapes normally because{" "}
        <code className="bg-muted px-1 rounded text-xs">active=false</code>.
      </p>
      <FocusTrap active={false} className="rounded-lg border bg-muted/30 p-5">
        <div className="flex flex-col gap-3">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="ft-inactive-name">Display name</Label>
            <Input id="ft-inactive-name" placeholder="Ada Lovelace" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="ft-inactive-email">Email</Label>
            <Input id="ft-inactive-email" placeholder="ada@acme.com" type="email" />
          </div>
          <Button variant="outline">Submit</Button>
        </div>
      </FocusTrap>
    </div>
  );
}

export const Inactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`active={false}` — the component renders its children in a plain `<div>` with no focus interception. Use this state while the panel is hidden or before it has been opened for the first time.",
      },
    },
  },
  render: () => <InactiveDemo />,
};

function RestoreFocusDemo() {
  const [active, setActive] = React.useState(false);

  return (
    <div className="flex flex-col gap-4 w-80">
      <div className="flex gap-2">
        <Button id="trap-trigger" onClick={() => setActive(true)} disabled={active}>
          Open trap
        </Button>
        <Button variant="outline" disabled={active}>
          Another focusable
        </Button>
      </div>
      {active && (
        <FocusTrap
          active={active}
          restoreFocus
          className="rounded-lg border bg-background p-4 shadow"
        >
          <p className="text-sm text-foreground mb-3">
            Focus is trapped here. Dismiss to return focus to 'Open trap'.
          </p>
          <Button onClick={() => setActive(false)}>Dismiss</Button>
        </FocusTrap>
      )}
    </div>
  );
}

export const RestoreFocus: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`restoreFocus={true}` (the default) — when the trap deactivates, focus returns to the element that triggered it. This satisfies WCAG 2.4.3 (focus order) and prevents focus from being lost after a modal or overlay closes.",
      },
    },
  },
  render: () => <RestoreFocusDemo />,
};
