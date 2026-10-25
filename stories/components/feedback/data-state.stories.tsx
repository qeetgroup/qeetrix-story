import { FingerprintPatternIcon } from "@qeetrix/icons/icons/fingerprint-pattern";
import { Button, Card, Grid, QeetrixProvider, Stack, Text } from "@qeetrix/react";
import {
  DataState,
  DescriptionItem,
  DescriptionList,
  EmptyState,
} from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { qx } from "../../_contract";

const passkeys = (
  <DescriptionList>
    <DescriptionItem term="MacBook Pro">Last used 2 minutes ago</DescriptionItem>
    <DescriptionItem term="Pixel 8">Last used yesterday</DescriptionItem>
    <DescriptionItem term="YubiKey 5C NFC">Never used</DescriptionItem>
  </DescriptionList>
);

const noPasskeys = (
  <EmptyState
    size="section"
    icon={FingerprintPatternIcon}
    title="No passkeys yet"
    description="Priya signs in with a password until she adds one."
    actions={<Button variant="soft">Send passkey invitation</Button>}
  />
);

const meta: Meta<typeof DataState> = {
  title: "Components/Feedback/DataState",
  component: DataState,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "experimental" }),
    layout: "padded",
  },
  tags: ["autodocs", "experimental"],
  args: {
    loading: false,
    empty: false,
    error: undefined,
    onRetry: fn(),
    emptyState: noPasskeys,
    children: passkeys,
  },
  argTypes: {
    // Anything truthy is an error, so a switch is the control.
    error: { control: "boolean" },
  },
  render: (args) => (
    <Card title="Passkeys" level={2} style={{ maxInlineSize: 480 }}>
      <DataState {...args} />
    </Card>
  ),
};

export default meta;
type Story = StoryObj<typeof DataState>;

export const Playground: Story = {};

const STATES = [
  { label: "Loading", props: { loading: true } },
  { label: "Error", props: { error: true, onRetry: () => {} } },
  { label: "Empty", props: { empty: true, emptyState: noPasskeys } },
  { label: "Ready", props: {} },
] as const;

export const States: Story = {
  render: () => (
    <Grid columns={{ base: 1, expanded: 2 }} gap="lg" align="start">
      {STATES.map(({ label, props }) => (
        <Stack key={label} gap="sm">
          <Text size="sm" tone="subtle">
            {label}
          </Text>
          <Card>
            <DataState {...props}>{passkeys}</DataState>
          </Card>
        </Stack>
      ))}
    </Grid>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Stack gap="lg" style={{ maxInlineSize: 480 }}>
        <DataState error onRetry={() => {}}>
          {passkeys}
        </DataState>
        <DataState loading>{passkeys}</DataState>
      </Stack>
    </QeetrixProvider>
  ),
  play: async ({ canvas }) => {
    await expect(within(canvas.getByRole("alert")).getByText("यह लोड नहीं हो सका")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "फिर से कोशिश करें" })).toBeVisible();
    await expect(canvas.getByRole("status", { name: "लोड हो रहा है" })).toBeInTheDocument();
  },
};

export const RetryInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: Try again runs onRetry, the raw error stays hidden",
  args: { error: new Error("SQLSTATE 42P01: relation passkeys does not exist") },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByText("Couldn't load this")).toBeVisible();
    await expect(canvasElement).not.toHaveTextContent("SQLSTATE");
    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
  },
};

export const PrecedenceInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: loading wins over error and empty",
  args: { loading: true, error: true, empty: true },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    await expect(canvasElement.querySelector("[aria-busy=true]")).not.toBeNull();
    // The error is there only to hold the height: hidden, inert and never announced.
    await expect(canvas.queryByRole("alert")).toBeNull();
    await expect(canvas.queryByRole("button", { name: "Try again" })).toBeNull();
    await expect(
      canvas.getByText("Couldn't load this").closest("[data-slot=data-state-reserve]"),
    ).toHaveAttribute("aria-hidden", "true");
    await expect(canvas.queryByText("No passkeys yet")).toBeNull();
  },
};

export const EmptyInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: empty shows the EmptyState, not the content",
  args: { empty: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No passkeys yet")).toBeVisible();
    await expect(canvas.queryByText("YubiKey 5C NFC")).toBeNull();
  },
};

export const HeightInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: loading holds the error's height",
  render: () => (
    <Stack gap="lg" style={{ maxInlineSize: 480 }}>
      <DataState loading onRetry={() => {}}>
        {passkeys}
      </DataState>
      <DataState error onRetry={() => {}}>
        {passkeys}
      </DataState>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const height = (state: string) =>
      canvasElement.querySelector(`[data-state=${state}]`)?.getBoundingClientRect().height ?? 0;
    await expect(height("error")).toBeGreaterThan(0);
    await expect(Math.abs(height("loading") - height("error"))).toBeLessThan(1);
  },
};
