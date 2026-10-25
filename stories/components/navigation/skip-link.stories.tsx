import { Box, Heading, Inline, Link, QeetrixProvider, SkipLink, Stack, Text } from "@qeetrix/react";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

/** A console page: a header with navigation, then the main region the link jumps to. */
function Page({ mainId = "main", children }: { mainId?: string; children: ReactNode }) {
  return (
    <Stack gap="none" style={{ minBlockSize: 320 }}>
      {children}
      <Box paddingInline="xl" paddingBlock="md" border="subtle" background="raised">
        <Inline gap="xl" justify="between">
          <Text weight="semibold">Qeet ID</Text>
          <nav aria-label="Main">
            <Inline gap="lg">
              <Link href="#users" tone="subtle">
                Users
              </Link>
              <Link href="#applications" tone="subtle">
                Applications
              </Link>
              <Link href="#audit-log" tone="subtle">
                Audit log
              </Link>
            </Inline>
          </nav>
        </Inline>
      </Box>
      <Box render={<main id={mainId} tabIndex={-1} />} padding="xl">
        <Stack gap="xs">
          <Heading level={1}>Users</Heading>
          <Text tone="subtle">1,284 people at Acme Pvt Ltd</Text>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: Meta<typeof SkipLink> = {
  title: "Components/Navigation/SkipLink",
  component: SkipLink,
  parameters: {
    qeetrix: qx({ category: "navigation", status: "stable" }),
    layout: "fullscreen",
  },
  render: (args) => (
    <Page>
      <SkipLink {...args} />
    </Page>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SkipLink>;

/** Hidden until focused: click the canvas, then press Tab. */
export const Playground: Story = {};

export const Focused: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Skip to main content" })).toHaveFocus();
  },
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Page>
        {/* Server-safe, yet the label still comes from the provider, through a client leaf. */}
        <SkipLink />
      </Page>
    </QeetrixProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "मुख्य सामग्री पर जाएँ" })).toHaveFocus();
  },
};

export const SkipInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the first Tab stop, pointing at the main region",
  play: async ({ canvas, canvasElement, userEvent }) => {
    const link = canvas.getByRole("link", { name: "Skip to main content" });
    await expect(link.getBoundingClientRect().width).toBeLessThanOrEqual(1);

    // It comes before the navigation in the Tab order, and shows once focused.
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await expect(link.getBoundingClientRect().width).toBeGreaterThan(40);

    // Its target is the main region, which can take focus when the link is followed.
    // (Following it here would navigate the test runner's own page.)
    await expect(link).toHaveAttribute("href", "#main");
    const main = canvasElement.querySelector("main#main");
    await expect(main).toHaveAttribute("tabindex", "-1");

    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Users" })).toHaveFocus();
  },
};

export const CustomTargetInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: another target, and a label from messages",
  render: (args) => (
    <Page mainId="audit-feed">
      <SkipLink {...args} href="#audit-feed" messages={{ label: "Skip to the audit log" }} />
    </Page>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Skip to the audit log" })).toHaveAttribute(
      "href",
      "#audit-feed",
    );
  },
};
