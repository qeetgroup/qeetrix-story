import { BellIcon, DownloadIcon, SettingsIcon, TrashIcon } from "@qeetrix/icons";
import { Button, Icon, VisuallyHidden } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof VisuallyHidden> = {
  title: "Components/Utilities/VisuallyHidden",
  component: VisuallyHidden,
  parameters: {
    qeetrix: qx({ category: "utilities", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Renders content that is visually invisible but remains fully accessible to screen readers and assistive technology. The canonical use-case is labelling an icon-only button — the visible affordance is the icon; the accessible name is the hidden text. Applies `sr-only` under the hood, which satisfies WCAG 2.4.6 (headings and labels) and WCAG 4.1.2 (name, role, value). See the WAI-ARIA [button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/).",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

export const IconButtonLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The most common usage: an icon-only button gets a hidden text label so screen readers announce it correctly. Tab to the button — the visual appearance is icon-only, but the accessible name is 'Notifications'.",
      },
    },
  },
  render: () => (
    <Button variant="ghost" size="icon" aria-label="Notifications">
      <Icon icon={BellIcon} />
      <VisuallyHidden>Notifications</VisuallyHidden>
    </Button>
  ),
};

export const IconButtonGallery: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Several icon-only toolbar actions each wrapped with a `VisuallyHidden` label. In a real Qeet ID console these sit in the top-right header strip — sighted users read the icon, screen-reader users hear the label.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon">
        <Icon icon={BellIcon} />
        <VisuallyHidden>Notifications</VisuallyHidden>
      </Button>
      <Button variant="ghost" size="icon">
        <Icon icon={SettingsIcon} />
        <VisuallyHidden>Settings</VisuallyHidden>
      </Button>
      <Button variant="ghost" size="icon">
        <Icon icon={DownloadIcon} />
        <VisuallyHidden>DocumentDownload report</VisuallyHidden>
      </Button>
      <Button variant="ghost" size="icon" className="text-destructive">
        <Icon icon={TrashIcon} />
        <VisuallyHidden>Delete record</VisuallyHidden>
      </Button>
    </div>
  ),
};

export const AriaDescribedBy: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `VisuallyHidden` paired with `aria-describedby` when you want to attach a supplementary description to a control without surfacing that description visually — e.g. password complexity rules or API key usage warnings.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      <VisuallyHidden id="passkey-hint">
        This passkey is device-bound and cannot be exported. Removing it may lock you out if it is
        your only credential.
      </VisuallyHidden>
      <Button variant="destructive" aria-describedby="passkey-hint">
        Remove passkey
      </Button>
      <p className="text-xs text-muted-foreground">
        Inspect the DOM — the hidden hint is present and wired via <code>aria-describedby</code>.
      </p>
    </div>
  ),
};
