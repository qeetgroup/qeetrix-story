import { CheckboxCard, CheckboxCardGroup } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof CheckboxCard> = {
  title: "Primitives/CheckboxCard",
  component: CheckboxCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A selectable card that wraps a checkbox inside a bordered, interactive label — ideal for plan, feature, or permission selection where each option needs richer visual context than a bare checkbox. Use `CheckboxCardGroup` as the container. Supports controlled (`checked` + `onCheckedChange`) and uncontrolled (`defaultChecked`) modes. Matches the APG checkbox pattern.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CheckboxCard>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A group of Qeet ID feature add-ons where users can select multiple options — SSO pre-selected.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <CheckboxCardGroup>
        <CheckboxCard value="sso" defaultChecked>
          <p className="text-sm font-medium">Single Sign-On (SSO)</p>
          <p className="text-xs text-muted-foreground">
            SAML 2.0 and OIDC for your identity provider
          </p>
        </CheckboxCard>
        <CheckboxCard value="audit">
          <p className="text-sm font-medium">Audit Logs</p>
          <p className="text-xs text-muted-foreground">Full event trail via Qeet Logs</p>
        </CheckboxCard>
        <CheckboxCard value="scim">
          <p className="text-sm font-medium">SCIM Provisioning</p>
          <p className="text-xs text-muted-foreground">Auto-sync users from your directory</p>
        </CheckboxCard>
      </CheckboxCardGroup>
    </div>
  ),
};

export const Checked: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Selected visual state — border shifts to the primary brand colour with a light fill.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <CheckboxCard value="pro" checked onCheckedChange={() => {}}>
        <p className="text-sm font-medium">Qeet People — Pro Plan</p>
        <p className="text-xs text-muted-foreground">Unlimited employees · payroll · attendance</p>
      </CheckboxCard>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Disabled cards — locked by org policy (checked) or unavailable on the current plan (unchecked).",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <CheckboxCardGroup>
        <CheckboxCard value="sso" checked disabled onCheckedChange={() => {}}>
          <p className="text-sm font-medium">Single Sign-On (enforced)</p>
          <p className="text-xs text-muted-foreground">
            Managed by your org admin — cannot be disabled
          </p>
        </CheckboxCard>
        <CheckboxCard value="mfa" disabled>
          <p className="text-sm font-medium">Hardware Security Keys</p>
          <p className="text-xs text-muted-foreground">Requires Enterprise plan upgrade</p>
        </CheckboxCard>
      </CheckboxCardGroup>
    </div>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Fully controlled group — check state is managed locally and the card border updates on every toggle.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = React.useState<Record<string, boolean>>({
      notify: true,
      logs: false,
      pay: false,
    });
    const toggle = (key: string) => setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
    return (
      <div className="w-80">
        <CheckboxCardGroup>
          <CheckboxCard
            value="notify"
            checked={selected.notify}
            onCheckedChange={() => toggle("notify")}
          >
            <p className="text-sm font-medium">Qeet Notify</p>
            <p className="text-xs text-muted-foreground">Email, SMS and in-app notifications</p>
          </CheckboxCard>
          <CheckboxCard value="logs" checked={selected.logs} onCheckedChange={() => toggle("logs")}>
            <p className="text-sm font-medium">Qeet Logs</p>
            <p className="text-xs text-muted-foreground">Privacy-first audit log management</p>
          </CheckboxCard>
          <CheckboxCard value="pay" checked={selected.pay} onCheckedChange={() => toggle("pay")}>
            <p className="text-sm font-medium">Qeet Pay</p>
            <p className="text-xs text-muted-foreground">UPI, cards and GST invoicing</p>
          </CheckboxCard>
        </CheckboxCardGroup>
      </div>
    );
  },
};
