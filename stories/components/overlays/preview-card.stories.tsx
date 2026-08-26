import {
  PreviewCard,
  PreviewCardContent,
  PreviewCardDescription,
  PreviewCardImage,
  PreviewCardTitle,
  PreviewCardTrigger,
  PreviewCardUrl,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof PreviewCard> = {
  title: "Components/Overlays/PreviewCard",
  component: PreviewCard,
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A link-metadata preview card that appears on hover, giving users a peek at the destination without navigating away. Built on top of `HoverCard`. Use the structured props (`title`, `description`, `imageUrl`, `url`) for the built-in template, or compose the presentational sub-parts (`PreviewCardTitle`, `PreviewCardDescription`, `PreviewCardImage`, `PreviewCardUrl`) for a fully custom layout. Ideal for doc-link previews in Qeet Docs, audit-log reference links in Qeet Logs, and changelog entries in the Qeetrix docs site.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof PreviewCard>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Structured template — hover the link to preview a Qeet Docs page with title, description, and URL.",
      },
    },
  },
  render: () => (
    <PreviewCard>
      <PreviewCardTrigger className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline">
        Passkey setup guide
      </PreviewCardTrigger>
      <PreviewCardContent
        title="Getting started with passkeys"
        description="Learn how to register and use FIDO2 passkeys with Qeet ID. Covers device sync, cross-device authentication, and fallback recovery codes."
        url="docs.qeet.in/qeet-id/passkeys/setup"
      />
    </PreviewCard>
  ),
};

export const WithImage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Preview card with a hero image — hover a changelog link to see the release banner, title, and summary.",
      },
    },
  },
  render: () => (
    <PreviewCard>
      <PreviewCardTrigger className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline">
        v0.4.0 release notes
      </PreviewCardTrigger>
      <PreviewCardContent
        imageUrl="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&q=80"
        title="Qeetrix 2.0.0 — 145 UI modules"
        description="Ships Timer, QRCode, Tour, PreviewCard, ToggleTip, and ActionBar. All components pass WCAG AA colour-contrast checks."
        url="ui.qeet.in/changelog#v0.4.0"
      />
    </PreviewCard>
  ),
};

export const OpenState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pre-opened card using `defaultOpen` — useful for docs snapshots showing the preview content without hover interaction.",
      },
    },
  },
  render: () => (
    <PreviewCard defaultOpen>
      <PreviewCardTrigger className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline">
        WCAG 2.2 success criteria
      </PreviewCardTrigger>
      <PreviewCardContent
        title="WCAG 2.2 — Understanding Success Criterion 1.4.3"
        description="Minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text. All Qeetrix semantic colour pairs are validated on every token build."
        url="w3.org/WAI/WCAG22/Understanding/contrast-minimum"
      />
    </PreviewCard>
  ),
};

export const CustomContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Fully custom content using the presentational sub-parts — compose any layout inside the card without the structured template.",
      },
    },
  },
  render: () => (
    <PreviewCard>
      <PreviewCardTrigger className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline">
        Qeet Notify — channel overview
      </PreviewCardTrigger>
      <PreviewCardContent className="w-72 p-3">
        <PreviewCardImage
          src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=640&q=80"
          alt="Notification channels diagram"
          className="mb-2 h-28 rounded"
        />
        <PreviewCardTitle>5-channel delivery</PreviewCardTitle>
        <PreviewCardDescription className="mt-0.5">
          Email · SMS · WhatsApp · Push · In-App — all routed through a single Qeet Notify API call.
        </PreviewCardDescription>
        <PreviewCardUrl className="mt-1.5">docs.qeet.in/qeet-notify/channels</PreviewCardUrl>
      </PreviewCardContent>
    </PreviewCard>
  ),
};
