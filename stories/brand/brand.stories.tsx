import {
  IconApiKey,
  IconAuditLog,
  IconCrossDevice,
  IconMfaShield,
  IconOidcConnector,
  IconPasskey,
  IconSamlConnector,
  IconScimSync,
  IconTenant,
  IconWebhook,
  QeetLogo,
} from "@qeetrix/ui/brand";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Brand/Logo & Icons",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The Qeet brand marks bundled with the design system at `@qeetrix/ui/brand`: the theme-adaptive `QeetLogo` and the product icon set used across Qeet ID and the wider suite (passkey, MFA, SAML/OIDC/SCIM connectors, webhooks, API keys, audit log, tenant, cross-device). Import them as React components — no asset wiring required.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Logo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`QeetLogo` adapts to the current theme automatically; pin it with `variant="on-light"` or `variant="on-dark"` when it sits on a fixed-colour surface.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <QeetLogo size={64} />
        <code className="text-xs text-muted-foreground">auto</code>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-4">
        <QeetLogo variant="on-light" size={64} />
        <code className="text-xs text-neutral-500">on-light</code>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg bg-neutral-900 p-4">
        <QeetLogo variant="on-dark" size={64} />
        <code className="text-xs text-neutral-400">on-dark</code>
      </div>
    </div>
  ),
};

const ICONS = [
  [IconPasskey, "Passkey"],
  [IconMfaShield, "MfaShield"],
  [IconSamlConnector, "Saml"],
  [IconScimSync, "Scim"],
  [IconOidcConnector, "Oidc"],
  [IconWebhook, "Webhook"],
  [IconApiKey, "ApiKey"],
  [IconAuditLog, "AuditLog"],
  [IconTenant, "Tenant"],
  [IconCrossDevice, "CrossDevice"],
] as const;

export const Icons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The Qeet product icon set. Each is a React component that accepts a `size` and inherits `currentColor`, so it tints with the surrounding text.",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-5 gap-6 text-foreground">
      {ICONS.map(([Icon, name]) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon size={28} />
          <code className="text-xs text-muted-foreground">{name}</code>
        </div>
      ))}
    </div>
  ),
};
