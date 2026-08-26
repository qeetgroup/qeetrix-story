import { QRCode } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof QRCode> = {
  title: "Components/Media/QRCode",
  component: QRCode,
  parameters: {
    qeetrix: qx({ category: "media", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Renders a QR code as an inline SVG via the `qrcode` library. Encode any string — a URL, a TOTP `otpauth://` URI, or plain text. A `Skeleton` placeholder is shown while the SVG is generated asynchronously so the layout does not shift. Control size (pixels), Reed–Solomon error-correction level (`L` / `M` / `Q` / `H`), and foreground/background colours. Provide a meaningful `aria-label` for screen readers. The `H` level is recommended when the QR code will carry a logo overlay. Use it in Qeet ID's TOTP enrollement screen, the Qeetrix brand kit download page, and deep-link sharing flows.",
      },
    },
  },
  argTypes: {
    level: {
      control: "select",
      options: ["L", "M", "Q", "H"],
    },
    size: { control: { type: "range", min: 80, max: 400, step: 8 } },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof QRCode>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "URL QR code at the default 200 px size with error-correction level M — suitable for most link-sharing scenarios.",
      },
    },
  },
  args: {
    value: "https://qeet.in",
    "aria-label": "QR code for qeet.in",
  },
};

export const TotpUri: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "TOTP `otpauth://` URI QR code — shown on the Qeet ID TOTP setup screen. The user scans it with any TOTP authenticator app to enrol.",
      },
    },
  },
  args: {
    value:
      "otpauth://totp/Qeet%20ID%3Aada%40acmeinc.io?secret=JBSWY3DPEHPK3PXP&issuer=Qeet%20ID&algorithm=SHA1&digits=6&period=30",
    "aria-label": "Scan to add Qeet ID to your authenticator app",
    level: "H",
    size: 220,
  },
};

export const SmallSize: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "80 px compact QR — useful for inline references such as a printed receipt footer or a notification thumbnail.",
      },
    },
  },
  args: {
    value: "https://docs.qeet.in",
    "aria-label": "QR code for Qeet documentation",
    size: 80,
    level: "L",
  },
};

export const LargeSize: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "320 px large QR — use in full-screen pairing flows or projected presentation slides.",
      },
    },
  },
  args: {
    value: "https://ui.qeet.in",
    "aria-label": "QR code for Qeetrix design system",
    size: 320,
    level: "Q",
  },
};

export const HighErrorCorrection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Error-correction level H (≈30% of data recoverable) — required when the QR code will have a logo centred on top of it.",
      },
    },
  },
  args: {
    value: "https://apis.qeet.in",
    "aria-label": "QR code for Qeet API portal",
    level: "H",
    size: 200,
  },
};

export const BrandColours: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Custom Qeet orange foreground on a dark card background — demonstrates the `fgColor` / `bgColor` colour props for on-brand printed materials.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-zinc-900 p-6">
      <QRCode
        value="https://qeet.in"
        size={200}
        level="Q"
        fgColor="#F26D0E"
        bgColor="#18181b"
        aria-label="Qeet.in — on-brand QR code"
      />
      <p className="text-xs font-medium text-zinc-300">qeet.in</p>
    </div>
  ),
};
