import {
  BuildingComplexIcon,
  FingerprintPatternIcon,
  KeyRoundIcon,
  MonitorSmartphoneIcon,
  PlugIcon,
  QeetLogo,
  RefreshCwIcon,
  ScrollTextIcon,
  ShieldCheckIcon,
  WebhookIcon,
} from "@qeetrix/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Brand/Logo & Icons",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The Qeet logo and the icons Qeet products use for identity concepts, all from `@qeetrix/icons` — the package `@qeetrix/ui` draws its own icons from. `@qeetrix/ui/brand` was removed in 2.1.4; its logo wrappers and its ten custom icons map one-to-one onto the exports shown here.",
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
          '`QeetLogo` renders its published SVG unmodified, so it does not follow the theme by itself: `variant="dark"` is the drawing for dark surfaces. To follow the theme, render both — the default with `className="dark:hidden"` and the dark one with `className="hidden dark:block"`. It is decorative unless given an `aria-label`, and is sized by `height`.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <QeetLogo height={64} aria-label="Qeet" className="dark:hidden" />
        <QeetLogo height={64} aria-label="Qeet" variant="dark" className="hidden dark:block" />
        <code className="text-xs text-muted-foreground">follows the theme</code>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-4">
        <QeetLogo height={64} />
        <code className="text-xs text-neutral-600">default</code>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg bg-neutral-900 p-4">
        <QeetLogo height={64} variant="dark" />
        <code className="text-xs text-neutral-300">variant="dark"</code>
      </div>
    </div>
  ),
};

/** What each former `@qeetrix/ui/brand` icon drew, and its replacement (SAML and OIDC share one). */
const ICONS = [
  [FingerprintPatternIcon, "FingerprintPatternIcon", "passkey"],
  [ShieldCheckIcon, "ShieldCheckIcon", "MFA"],
  [PlugIcon, "PlugIcon", "SAML / OIDC connector"],
  [RefreshCwIcon, "RefreshCwIcon", "SCIM sync"],
  [WebhookIcon, "WebhookIcon", "webhook"],
  [KeyRoundIcon, "KeyRoundIcon", "API key"],
  [ScrollTextIcon, "ScrollTextIcon", "audit log"],
  [BuildingComplexIcon, "BuildingComplexIcon", "tenant"],
  [MonitorSmartphoneIcon, "MonitorSmartphoneIcon", "cross-device"],
] as const;

export const Icons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The identity concepts Qeet products draw, with the `@qeetrix/icons` export for each. Every icon accepts `size`, `shape` (`round` or `sharp`) and `variant`, and paints `currentColor`, so it tints with the surrounding text.",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-3 gap-x-8 gap-y-6 text-foreground">
      {ICONS.map(([Icon, name, concept]) => (
        <div key={name} className="flex flex-col items-center gap-1.5 text-center">
          <Icon size={28} />
          <code className="text-xs">{name}</code>
          <span className="text-xs text-muted-foreground">{concept}</span>
        </div>
      ))}
    </div>
  ),
};
