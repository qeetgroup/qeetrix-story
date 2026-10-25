import {
  Box,
  Card,
  Grid,
  Heading,
  type HeadingSize,
  Stack,
  Text,
  type TextSize,
  type TextTone,
  type TextWeight,
} from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment } from "react";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

/** A small comparison label. */
function Label({ children }: { children: string }) {
  return (
    <Text size="sm" tone="subtle">
      {children}
    </Text>
  );
}

const meta: Meta<typeof Text> = {
  title: "Components/Typography/TextAndHeading",
  component: Text,
  subcomponents: { Heading },
  parameters: {
    qeetrix: qx({ category: "typography", status: "stable" }),
    layout: "padded",
  },
  args: {
    children: "₹1,24,500.00 received from Acme Pvt Ltd on 24 October 2026.",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Playground: Story = {};

const SIZES: TextSize[] = ["sm", "md", "lg"];
const WEIGHTS: TextWeight[] = ["regular", "medium", "semibold"];

export const SizesAndWeights: Story = {
  name: "Sizes and weights",
  render: () => (
    <Grid columns={5} gap="md" align="center" style={{ inlineSize: 640 }}>
      <span />
      {[...WEIGHTS, "mono"].map((column) => (
        <Label key={column}>{column}</Label>
      ))}
      {SIZES.map((size) => (
        <Fragment key={size}>
          <Label>{size}</Label>
          {WEIGHTS.map((weight) => (
            <Text key={weight} size={size} weight={weight}>
              ₹1,24,500
            </Text>
          ))}
          <Text size={size} mono>
            usr_8f2c1a
          </Text>
        </Fragment>
      ))}
    </Grid>
  ),
};

const TONES: { tone: TextTone; text: string }[] = [
  { tone: "default", text: "Priya Sharma signed in" },
  { tone: "subtle", text: "2 minutes ago, Bengaluru" },
  { tone: "subtlest", text: "Synced from Azure AD" },
  { tone: "brand", text: "Passkey autofill is on" },
  { tone: "success", text: "acme.in verified" },
  { tone: "warning", text: "Signing key expires in 6 days" },
  { tone: "danger", text: "PAN must have 10 characters" },
  { tone: "info", text: "Invitations expire after 7 days" },
];

export const Tones: Story = {
  render: () => (
    <Grid columns={2} gap="sm" align="center" style={{ inlineSize: 480 }}>
      {TONES.map(({ tone, text }) => (
        <Fragment key={tone}>
          <Label>{tone}</Label>
          <Text tone={tone}>{text}</Text>
        </Fragment>
      ))}
      <Label>inverse</Label>
      <Box background="inverse" paddingInline="sm" paddingBlock="xs" radius="control">
        <Text tone="inverse">Viewing as Rahul Verma</Text>
      </Box>
    </Grid>
  ),
};

const HEADING_SIZES: HeadingSize[] = [
  "display-lg",
  "display-md",
  "display-sm",
  "heading-lg",
  "heading-md",
  "heading-sm",
  "title-lg",
  "title-md",
  "title-sm",
];

export const Headings: Story = {
  parameters: {
    docs: { description: { story: "`level` sets the element; `size` sets the look." } },
  },
  render: () => (
    <Stack gap="md">
      {HEADING_SIZES.map((size) => (
        <Stack key={size} gap="none">
          <Label>{size}</Label>
          <Heading level={2} size={size}>
            Payments for Acme Pvt Ltd
          </Heading>
        </Stack>
      ))}
    </Stack>
  ),
};

export const Truncation: Story = {
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 280 }}>
      <Stack gap="xs">
        <Label>One line</Label>
        <Heading level={2} size="title-md" truncate>
          Acme Retail Private Limited, Bengaluru South
        </Heading>
      </Stack>
      <Stack gap="xs">
        <Label>Two lines</Label>
        <Text tone="subtle" truncate={2}>
          The webhook https://hooks.acme.in/qeet/id/v2/users failed three deliveries in a row and
          was paused.
        </Text>
      </Stack>
    </Stack>
  ),
};

export const LevelsInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: levels and sizes are independent",
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 560 }}>
      <Heading level={1} size="display-sm">
        Good morning, Priya
      </Heading>
      <Card title="Sign-ins this week" level={2}>
        <Heading level={3} size="title-sm" tone="subtle">
          By method
        </Heading>
      </Card>
    </Stack>
  ),
  play: async ({ canvas }) => {
    const h1 = canvas.getByRole("heading", { level: 1, name: "Good morning, Priya" });
    await expect(h1).toHaveAttribute("data-size", "display-sm");
    await expect(
      canvas.getByRole("heading", { level: 2, name: "Sign-ins this week" }),
    ).toBeVisible();
    const h3 = canvas.getByRole("heading", { level: 3, name: "By method" });
    await expect(h3).toHaveAttribute("data-size", "title-sm");
  },
};

export const DefaultSizesInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: each level has a default size",
  render: () => (
    <Stack gap="md">
      <Heading level={1}>Users</Heading>
      <Heading level={2}>Priya Sharma</Heading>
      <Heading level={3}>Sign-in methods</Heading>
      <Heading level={4}>Passkeys</Heading>
      <Heading level={5}>MacBook Pro</Heading>
      <Heading level={6}>Registered 14 March 2024</Heading>
    </Stack>
  ),
  play: async ({ canvas }) => {
    const sizes = canvas.getAllByRole("heading").map((h) => h.getAttribute("data-size"));
    await expect(sizes).toEqual([
      "heading-lg",
      "heading-md",
      "heading-sm",
      "title-lg",
      "title-md",
      "title-sm",
    ]);
  },
};
