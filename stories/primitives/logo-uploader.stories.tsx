import { LogoUploader } from "@qeetrix/ui";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof LogoUploader> = {
  title: "Primitives/LogoUploader",
  component: LogoUploader,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A drop-zone + URL-paste combo for uploading a brand logo — used in Qeet ID's organisation branding settings and qeet-people's company profile page. Accepts a file (converted to a data URL client-side) or a hosted URL string; both are surfaced through the same `value`/`onChange` interface so the caller treats them identically.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LogoUploader>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Empty state — drop an image file or paste a URL (e.g. a CDN-hosted SVG). Accepts PNG, JPG, SVG, and WEBP up to 2 MB.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="w-96">
        <LogoUploader
          value={value}
          onChange={setValue}
          hint="Recommended: square SVG, minimum 256 × 256 px."
        />
      </div>
    );
  },
};

export const WithExistingLogo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pre-populated state — shown when an org already has a logo set in Qeet ID branding settings. Replace and Remove actions are always visible.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState(
      "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=128&h=128&fit=crop&q=80",
    );
    return (
      <div className="w-96">
        <LogoUploader value={value} onChange={setValue} />
      </div>
    );
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Disabled while a save is in flight — pointer events are blocked and opacity is reduced.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="w-96">
        <LogoUploader value={value} onChange={setValue} disabled />
      </div>
    );
  },
};
