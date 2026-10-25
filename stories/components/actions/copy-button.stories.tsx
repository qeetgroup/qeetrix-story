import { Box, Inline, QeetrixProvider, Stack, Text } from "@qeetrix/react";
import { CopyButton } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof CopyButton> = {
  title: "Components/Actions/CopyButton",
  component: CopyButton,
  parameters: {
    qeetrix: qx({ category: "actions", status: "experimental" }),
    layout: "centered",
  },
  args: {
    value: "usr_01J8K2M4PQ",
    label: "Copy user ID",
    onCopied: fn(),
    onCopyError: fn(),
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

/**
 * Tests stand in for the clipboard, so they neither depend on the browser granting access nor
 * overwrite the reader's clipboard. Returns the restore function.
 */
function stubClipboard(clipboard: Pick<Clipboard, "writeText"> | undefined) {
  const original = Object.getOwnPropertyDescriptor(navigator, "clipboard");
  Object.defineProperty(navigator, "clipboard", { value: clipboard, configurable: true });
  return () => {
    if (original) Object.defineProperty(navigator, "clipboard", original);
    else Reflect.deleteProperty(navigator, "clipboard");
  };
}

const writeText = fn(async (_text: string) => {});

/** The polite live region each CopyButton renders beside itself. */
const announcement = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>("[role=status]");

const CREDENTIALS = [
  ["Client ID", "Copy client ID", "qid_app_01J9ZK4T7B2R"],
  ["Redirect URI", "Copy redirect URI", "https://console.acme.in/auth/callback"],
  ["Tenant", "Copy tenant ID", "tnt_acme_01HZX3"],
] as const;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Inline gap="md">
      <CopyButton {...args} variant="ghost" />
      <CopyButton {...args} variant="soft" label="Copy organisation ID" />
      <CopyButton {...args} variant="ghost">
        Copy ID
      </CopyButton>
      <CopyButton {...args} variant="soft">
        Copy secret
      </CopyButton>
    </Inline>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Inline gap="md">
      <CopyButton {...args} size="sm" label="Copy user ID, small" />
      <CopyButton {...args} size="md" label="Copy user ID, medium" />
      <CopyButton {...args} size="lg" label="Copy user ID, large" />
    </Inline>
  ),
};

export const States: Story = {
  render: (args) => (
    <Inline gap="md">
      <CopyButton {...args} label="Copy API key" disabled />
      <CopyButton {...args} variant="soft" disabled>
        Copy secret
      </CopyButton>
    </Inline>
  ),
};

export const InContext: Story = {
  name: "In context",
  parameters: { layout: "padded" },
  render: (args) => (
    <Box padding="lg" border="subtle" radius="surface" style={{ inlineSize: 480 }}>
      <Stack gap="lg">
        {CREDENTIALS.map(([term, label, value]) => (
          <Inline key={term} justify="between" wrap={false}>
            <Stack gap="none">
              <Text size="sm" tone="subtle">
                {term}
              </Text>
              <Text mono truncate>
                {value}
              </Text>
            </Stack>
            <CopyButton {...args} value={value} label={label} />
          </Inline>
        ))}
      </Stack>
    </Box>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  args: { label: undefined },
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <CopyButton {...args} />
    </QeetrixProvider>
  ),
  beforeEach: () => stubClipboard({ writeText }),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "कॉपी करें" }));
    await waitFor(() => expect(announcement(canvasElement)).toHaveTextContent("कॉपी हो गया"));
  },
};

export const CopyInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: copies, announces and keeps focus",
  beforeEach: () => stubClipboard({ writeText }),
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    writeText.mockClear();
    const button = canvas.getByRole("button", { name: "Copy user ID" });
    await userEvent.click(button);
    await waitFor(() => expect(announcement(canvasElement)).toHaveTextContent("Copied"));
    await expect(writeText).toHaveBeenCalledWith("usr_01J8K2M4PQ");
    await expect(args.onCopied).toHaveBeenCalledWith("usr_01J8K2M4PQ");
    await expect(button).toHaveAttribute("data-state", "copied");
    await expect(button).toHaveFocus();
  },
};

export const FailureInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: fails visibly without a clipboard",
  beforeEach: () => stubClipboard(undefined),
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Copy user ID" });
    await userEvent.click(button);
    await waitFor(() => expect(announcement(canvasElement)).toHaveTextContent("Couldn't copy"));
    await expect(button).toHaveAttribute("data-state", "failed");
    await expect(args.onCopyError).toHaveBeenCalledOnce();
  },
};
