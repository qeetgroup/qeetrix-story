import { Button, Card, Field, Inline, Stack, Text } from "@qeetrix/react";
import { CopyButton, OTPInput, QRCode, type QRCodeLevel } from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const OTPAUTH =
  "otpauth://totp/Acme%20Pvt%20Ltd:priya@acme.in?secret=JBSWY3DPEHPK3PXP&issuer=Acme%20Pvt%20Ltd";
const UPI = "upi://pay?pa=acme@qeetpay&pn=Acme%20Pvt%20Ltd&am=124500.00&cu=INR";

const meta: Meta<typeof QRCode> = {
  title: "Components/Media/QRCode",
  component: QRCode,
  parameters: {
    qeetrix: qx({ category: "media", status: "experimental" }),
    layout: "centered",
  },
  args: {
    value: OTPAUTH,
    label: "QR code to add Acme Pvt Ltd to your authenticator app",
    level: "M",
    size: 160,
  },
  argTypes: {
    size: { control: { type: "range", min: 96, max: 320, step: 8 } },
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof QRCode>;

export const Playground: Story = {};

const LEVELS: QRCodeLevel[] = ["L", "M", "Q", "H"];

export const Levels: Story = {
  render: (args) => (
    <Inline gap="lg" align="start">
      {LEVELS.map((level) => (
        <Stack key={level} gap="xs" align="center">
          <QRCode
            {...args}
            value={UPI}
            label={`UPI payment QR code, level ${level}`}
            level={level}
          />
          <Text size="sm" tone="subtle">
            {level}
          </Text>
        </Stack>
      ))}
    </Inline>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Inline gap="lg" align="end">
      {[120, 160, 200].map((size) => (
        <Stack key={size} gap="xs" align="center">
          <QRCode {...args} size={size} label={`Authenticator QR code, ${size}px`} />
          <Text size="sm" tone="subtle">
            {size}px
          </Text>
        </Stack>
      ))}
    </Inline>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <div style={{ inlineSize: 480 }}>
      <Card
        title="Set up an authenticator app"
        level={2}
        footer={<Button>Verify and turn on</Button>}
      >
        <Inline gap="lg" align="start" wrap={false}>
          <QRCode
            value={OTPAUTH}
            label="QR code to add Acme Pvt Ltd to your authenticator app"
            size={144}
          />
          <Stack gap="lg">
            <Inline gap="xs">
              <Text mono>JBSW Y3DP EHPK 3PXP</Text>
              <CopyButton value="JBSWY3DPEHPK3PXP" label="Copy the key" />
            </Inline>
            <Field label="6-digit code">
              <OTPInput />
            </Field>
          </Stack>
        </Inline>
      </Card>
    </div>
  ),
};

export const NamedImage: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: one image, named by its label",
  play: async ({ canvas, args }) => {
    const code = canvas.getByRole("img", { name: args.label });
    await expect(code).toHaveAttribute("width", String(args.size));
    // Always dark on white: the code pins the light scheme, whatever the page's.
    await expect(code).toHaveAttribute("data-qx-color-scheme", "light");
  },
};
