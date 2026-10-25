import { Accordion, AccordionItem, Heading, Inline, Stack, Text } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

const FAQ: Array<[string, string, string]> = [
  [
    "passkeys",
    "What is a passkey?",
    "A phishing-resistant credential bound to your device: face, fingerprint or screen lock.",
  ],
  [
    "mfa",
    "Can I require MFA for everyone?",
    "Yes. Admins can enforce MFA across Acme Pvt Ltd, with exceptions per role.",
  ],
  [
    "sso",
    "Which SSO protocols are supported?",
    "SAML 2.0 and OpenID Connect, for inbound and outbound federation.",
  ],
];

const meta: Meta<typeof Accordion> = {
  title: "Components/Layout/Accordion",
  component: Accordion,
  subcomponents: { AccordionItem },
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "centered",
  },
  // These props come from Base UI, so the declarations give them no controls.
  args: {
    multiple: false,
    disabled: false,
    defaultValue: ["passkeys"],
    onValueChange: fn(),
  },
  render: (args) => (
    <div style={{ inlineSize: 400 }}>
      <Accordion {...args}>
        {FAQ.map(([value, question, answer]) => (
          <AccordionItem key={value} value={value} title={question}>
            {answer}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Playground: Story = {};

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["passkeys", "mfa"] },
};

/** Qeet Pay's invoice settings, the last section locked to a higher plan. */
function InvoiceSettings(props: ComponentProps<typeof Accordion>) {
  return (
    <Accordion {...props}>
      <AccordionItem value="tax" title="Tax settings">
        GST at 18%. GSTIN 29ABCDE1234F1Z5.
      </AccordionItem>
      <AccordionItem value="numbering" title="Invoice numbering">
        INV-2026-0412
      </AccordionItem>
      <AccordionItem value="einvoice" title="E-invoicing (IRN)" disabled>
        Available on the Business plan.
      </AccordionItem>
    </Accordion>
  );
}

export const States: Story = {
  render: (args) => (
    <Inline gap="md" align="start">
      <Stack gap="sm" style={{ inlineSize: 320 }}>
        <Text size="sm" tone="subtle">
          Disabled item
        </Text>
        <InvoiceSettings {...args} defaultValue={["tax"]} />
      </Stack>
      <Stack gap="sm" style={{ inlineSize: 320 }}>
        <Text size="sm" tone="subtle">
          Disabled
        </Text>
        <Accordion {...args} defaultValue={["billing"]} disabled>
          <AccordionItem value="billing" title="Billing address">
            Acme Pvt Ltd, Bengaluru 560001
          </AccordionItem>
          <AccordionItem value="payment" title="Payment method">
            HDFC Bank ••4821
          </AccordionItem>
        </Accordion>
      </Stack>
    </Inline>
  ),
};

const ADVANCED = (
  <Stack gap="md" style={{ inlineSize: 400 }}>
    <Heading level={3} size="title-md">
      Advanced options
    </Heading>
    <Accordion>
      <AccordionItem value="tokens" headingLevel={4} title="Token lifetimes">
        Access tokens 1 hour, refresh tokens 30 days.
      </AccordionItem>
      <AccordionItem value="session" headingLevel={4} title="Session limits">
        12 hours, or 30 minutes idle.
      </AccordionItem>
      <AccordionItem value="ip" headingLevel={4} title="IP allow list">
        No ranges yet.
      </AccordionItem>
    </Accordion>
  </Stack>
);

export const InContext: Story = {
  name: "In context",
  render: () => ADVANCED,
};

export const HeadingLevelInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: triggers sit in headingLevel",
  render: () => ADVANCED,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Token lifetimes" });
    await expect(trigger.parentElement?.tagName).toBe("H4");
  },
};

export const SingleInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: opening one closes the other",
  play: async ({ args, canvas, userEvent }) => {
    const passkeys = canvas.getByRole("button", { name: "What is a passkey?" });
    const mfa = canvas.getByRole("button", { name: "Can I require MFA for everyone?" });
    await expect(passkeys).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(mfa);
    await expect(mfa).toHaveAttribute("aria-expanded", "true");
    await expect(passkeys).toHaveAttribute("aria-expanded", "false");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(["mfa"], expect.anything());
  },
};

export const KeyboardInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: each trigger is a Tab stop",
  args: { defaultValue: [] },
  play: async ({ canvas, userEvent }) => {
    const sso = canvas.getByRole("button", { name: "Which SSO protocols are supported?" });
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(sso).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(sso).toHaveAttribute("aria-expanded", "true");
    await expect(await canvas.findByText(/SAML 2.0 and OpenID Connect/)).toBeVisible();
    await userEvent.keyboard(" ");
    await expect(sso).toHaveAttribute("aria-expanded", "false");
  },
};

export const DisabledItemInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a disabled item doesn't open",
  render: (args) => (
    <div style={{ inlineSize: 400 }}>
      <InvoiceSettings {...args} defaultValue={["tax"]} />
    </div>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const einvoice = canvas.getByRole("button", { name: "E-invoicing (IRN)" });
    await userEvent.click(einvoice);
    await expect(einvoice).toHaveAttribute("aria-expanded", "false");
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};
