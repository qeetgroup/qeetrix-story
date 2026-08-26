import { Editable, EditableInput, EditablePreview } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof Editable> = {
  title: "Components/Data Entry/Editable",
  component: Editable,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A compound click-to-edit field that toggles between a static preview and an inline text input. Press Enter or blur to commit the edit; press Escape to cancel and restore the previous value. Supports uncontrolled (`defaultValue`) and controlled (`value` + `onValueChange`) modes. The compound API requires `<EditablePreview>` and `<EditableInput>` as direct children of `<Editable>`. Always supply an `aria-label` on `EditableInput` so screen readers announce the field purpose — the APG pattern is: <https://www.w3.org/WAI/ARIA/apg/patterns/editablecontent/>.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Editable>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Uncontrolled click-to-edit — click the preview to enter edit mode. Press Enter or click away to commit, Escape to cancel.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Editable defaultValue="Acme Corp">
        <EditablePreview />
        <EditableInput aria-label="Organisation name" />
      </Editable>
    </div>
  ),
};

export const WithPlaceholder: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Empty value with a custom placeholder — shown when no display name has been set in Qeet ID.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Editable defaultValue="" placeholder="Enter your display name">
        <EditablePreview />
        <EditableInput aria-label="Display name" />
      </Editable>
    </div>
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Controlled mode — value is managed externally via `value` + `onValueChange`. The committed value is reflected below on every save.",
      },
    },
  },
  render: () => {
    const [name, setName] = React.useState("Qeet People Workspace");
    return (
      <div className="w-72 space-y-2">
        <Editable value={name} onValueChange={setName}>
          <EditablePreview />
          <EditableInput aria-label="Workspace name" />
        </Editable>
        <p className="text-xs text-muted-foreground">
          Saved value: <strong className="text-foreground">{name}</strong>
        </p>
      </div>
    );
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state — the field cannot be activated. Use when the value is locked by org policy or read-only in context.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Editable defaultValue="enterprise-tenant-a3f9c2b1" disabled>
        <EditablePreview />
        <EditableInput aria-label="Tenant ID (read-only)" />
      </Editable>
    </div>
  ),
};

export const InAForm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Multiple editable fields in a settings panel — each field is independent and commits on blur or Enter.",
      },
    },
  },
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Organisation name
        </p>
        <Editable defaultValue="Acme Corp">
          <EditablePreview />
          <EditableInput aria-label="Organisation name" />
        </Editable>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Support email
        </p>
        <Editable defaultValue="support@acme.example.com">
          <EditablePreview />
          <EditableInput aria-label="Support email" type="email" inputMode="email" />
        </Editable>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Login domain
        </p>
        <Editable defaultValue="" placeholder="acme.id.qeet.in">
          <EditablePreview />
          <EditableInput aria-label="Custom login domain" />
        </Editable>
      </div>
    </div>
  ),
};
