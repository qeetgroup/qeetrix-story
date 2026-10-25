import { Inline, Link, QeetrixProvider, Stack, Text } from "@qeetrix/react";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Link> = {
  title: "Components/Navigation/Link",
  component: Link,
  parameters: {
    qeetrix: qx({ category: "navigation", status: "stable" }),
    layout: "centered",
  },
  args: {
    href: "#audit-log",
    children: "View audit log",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Inline gap="lg">
      <Link {...args}>View audit log</Link>
      <Link {...args} tone="subtle">
        Sync history
      </Link>
      <Text tone="danger">
        <Link {...args} tone="inherit">
          Check DNS records
        </Link>
      </Text>
    </Inline>
  ),
};

export const External: Story = {
  args: {
    external: true,
    href: "https://status.qeet.in",
    children: "Qeet status page",
  },
};

export const InContext: Story = {
  name: "In context",
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <Text render={<p />} tone="subtle">
        Rotate the signing secret in{" "}
        <Link {...args} href="#webhooks">
          webhook settings
        </Link>{" "}
        before 30 November. See{" "}
        <Link {...args} href="https://docs.qeet.in/webhooks/signatures" external>
          verifying webhook signatures
        </Link>
        .
      </Text>
    </div>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      {/* Server-safe: the external note comes from `messages`, not from the provider. */}
      <Link href="https://status.qeet.in" external messages={hi.link}>
        Qeet की स्थिति
      </Link>
    </QeetrixProvider>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("link", { name: "Qeet की स्थिति (नए टैब में खुलता है)" }),
    ).toBeVisible();
  },
};

export const ExternalInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: external links open safely and say so",
  render: () => (
    <Stack gap="sm" align="start">
      <Link href="https://status.qeet.in" external>
        Qeet status page
      </Link>
      <Link href="#api-keys">API keys</Link>
    </Stack>
  ),
  play: async ({ canvas, userEvent }) => {
    const external = canvas.getByRole("link", { name: "Qeet status page (opens in a new tab)" });
    await expect(external).toHaveAttribute("target", "_blank");
    await expect(external).toHaveAttribute("rel", "noopener noreferrer");

    await userEvent.tab();
    await expect(external).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "API keys" })).toHaveFocus();
  },
};

export const RouterInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: render swaps in a router link",
  render: () => (
    <Link render={<a href="#invoices" data-router="" />} tone="subtle">
      Invoices
    </Link>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Invoices" });
    await expect(link).toHaveAttribute("data-router", "");
    await expect(link).toHaveAttribute("data-slot", "link");
  },
};

export const WrapInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: wraps with its sentence",
  render: InContext.render,
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", {
      name: "verifying webhook signatures (opens in a new tab)",
    });
    await expect(getComputedStyle(link).display).toBe("inline");

    // The last word, and the arrow after it.
    const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
    let text = walker.nextNode();
    while (text && !text.textContent?.includes("signatures")) text = walker.nextNode();
    const word = document.createRange();
    word.selectNodeContents(text as Node);
    word.setStart(text as Node, (text?.textContent ?? "").indexOf("signatures"));
    const arrow = link.querySelector("[data-slot=link-icon]") as SVGElement;

    // At every width the link breaks across lines with the sentence, the arrow on its last word.
    const paragraph = link.closest("p") as HTMLElement;
    let wrapped = false;
    for (let width = 160; width <= 360; width += 8) {
      paragraph.style.inlineSize = `${width}px`;
      if (link.getClientRects().length > 1) wrapped = true;
      const last = word.getBoundingClientRect();
      const icon = arrow.getBoundingClientRect();
      await expect(icon.top).toBeGreaterThanOrEqual(last.top - 1);
      await expect(icon.bottom).toBeLessThanOrEqual(last.bottom + 1);
      await expect(icon.left).toBeGreaterThanOrEqual(last.right - 1);
    }
    await expect(wrapped).toBe(true);
  },
};
