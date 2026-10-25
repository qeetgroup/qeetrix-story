import {
  Badge,
  Box,
  Card,
  Grid,
  type GridColumnCount,
  GridItem,
  Inline,
  type Space,
  Stack,
  Text,
} from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useSyncExternalStore } from "react";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const NUMBERS = [
  ["Total users", "1,284"],
  ["Active, last 30 days", "1,102"],
  ["Passkey adoption", "72%"],
  ["Pending invitations", "64"],
  ["Groups", "38"],
  ["Applications", "12"],
] as const;

function KeyNumber({ label, value }: { label: string; value: string }) {
  return (
    <Box padding="md" background="raised" border="default" radius="surface">
      <Stack gap="xs">
        <Text size="sm" tone="subtle">
          {label}
        </Text>
        <Text size="lg" weight="semibold">
          {value}
        </Text>
      </Stack>
    </Box>
  );
}

const meta: Meta<typeof Grid> = {
  title: "Components/Layout/Grid",
  component: Grid,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "padded",
  },
  args: {
    columns: 3,
  },
  render: (args) => (
    <Grid {...args}>
      {NUMBERS.map(([label, value]) => (
        <KeyNumber key={label} label={label} value={value} />
      ))}
    </Grid>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Grid>;

function Cell({ blockSize = 32 }: { blockSize?: number }) {
  return <Box background="brand" border="default" radius="sm" style={{ blockSize }} />;
}

/** A token-scale row: value, token, size, specimen. */
function ScaleRow({
  value,
  token,
  size,
  children,
}: Record<"value" | "token" | "size", string> & {
  children: ReactNode;
}) {
  return (
    <Inline gap="md" wrap={false}>
      <Text mono size="sm" style={{ inlineSize: 64, flex: "none" }}>
        {value}
      </Text>
      <Text mono size="sm" tone="subtle" style={{ inlineSize: 200, flex: "none" }}>
        {token}
      </Text>
      <Text size="sm" tone="subtle" style={{ inlineSize: 48, flex: "none" }}>
        {size}
      </Text>
      {children}
    </Inline>
  );
}

const cells = (count: number, blockSize?: number) =>
  Array.from({ length: count }, (_, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: specimen cells have no identity
    <Cell key={i} blockSize={blockSize} />
  ));

export const Playground: Story = {};

export const Columns: Story = {
  render: () => (
    <Stack gap="md">
      {([1, 2, 3, 4, 6, 12] as GridColumnCount[]).map((columns) => (
        <Inline key={columns} gap="md" wrap={false}>
          <Text size="sm" tone="subtle" style={{ inlineSize: 24, flex: "none" }}>
            {columns}
          </Text>
          <Grid columns={columns} gap="sm" style={{ flex: 1 }}>
            {cells(columns)}
          </Grid>
        </Inline>
      ))}
    </Stack>
  ),
};

/** GridItem spans on twelve columns, and one that starts in column 3. */
const SPANS: Array<{
  label: string;
  items: Array<{ span: GridColumnCount; start?: GridColumnCount }>;
}> = [
  { label: "8 + 4", items: [{ span: 8 }, { span: 4 }] },
  { label: "6 + 6", items: [{ span: 6 }, { span: 6 }] },
  { label: "3 + 6 + 3", items: [{ span: 3 }, { span: 6 }, { span: 3 }] },
  { label: "Start 3, span 8", items: [{ span: 8, start: 3 }] },
];

export const Spans: Story = {
  render: () => (
    <Stack gap="md">
      {SPANS.map(({ label, items }) => (
        <Inline key={label} gap="md" wrap={false}>
          <Text size="sm" tone="subtle" style={{ inlineSize: 112, flex: "none" }}>
            {label}
          </Text>
          <Grid columns={12} gap="sm" style={{ flex: 1 }}>
            {items.map(({ span, start }, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: specimen cells have no identity
              <GridItem key={index} span={span} start={start}>
                <Cell />
              </GridItem>
            ))}
          </Grid>
        </Inline>
      ))}
    </Stack>
  ),
};

const SPACE: Array<[Space, string, string]> = [
  ["none", "—", "0"],
  ["xs", "--qx-space-gap-xs", "4px"],
  ["sm", "--qx-space-gap-sm", "8px"],
  ["md", "--qx-space-gap-md", "12px"],
  ["lg", "--qx-space-gap-lg", "16px"],
  ["xl", "--qx-space-gap-xl", "24px"],
  ["2xl", "--qx-space-layout-md", "32px"],
  ["3xl", "--qx-space-layout-lg", "48px"],
  ["4xl", "--qx-space-layout-xl", "64px"],
];

export const GapScale: Story = {
  name: "Gap scale",
  render: () => (
    <Stack gap="md">
      {SPACE.map(([value, token, size]) => (
        <ScaleRow key={value} value={value} token={token} size={size}>
          <Grid columns={4} gap={value} style={{ inlineSize: 240 }}>
            {cells(8, 16)}
          </Grid>
        </ScaleRow>
      ))}
    </Stack>
  ),
};

/** The window size classes, widest first, with the width each starts at. */
const SIZE_CLASSES = [
  ["xlarge", 1600],
  ["large", 1200],
  ["expanded", 840],
  ["medium", 600],
  ["base", 0],
] as const;

const subscribe = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};
const currentClass = () => SIZE_CLASSES.find(([, min]) => window.innerWidth >= min)?.[0] ?? "base";

function WindowClass() {
  const sizeClass = useSyncExternalStore(subscribe, currentClass, () => "base");
  return (
    <Text size="sm" tone="subtle">
      Window: <Text weight="semibold">{sizeClass}</Text>
    </Text>
  );
}

/** Six numbers in 1, 2, 3 and 6 columns; `xlarge` inherits `large`'s. */
const RESPONSIVE = { base: 1, medium: 2, expanded: 3, large: 6 } as const;
const COLUMNS_BY_CLASS = { ...RESPONSIVE, xlarge: 6 } as const;

const SIGN_INS = [
  ["Priya Sharma", "Passkey", "2 min ago"],
  ["Rahul Verma", "Passkey", "18 min ago"],
  ["Ananya Iyer", "Authenticator", "1 hour ago"],
] as const;

const CONNECTIONS = [
  ["Passkeys", true],
  ["Azure AD", true],
  ["Okta", false],
] as const;

/** A directory overview: key numbers, then a main column beside a side column. */
function Overview() {
  return (
    <Stack gap="md">
      <WindowClass />
      <Grid render={<ul aria-label="Key numbers" />} columns={RESPONSIVE} gap="md">
        {NUMBERS.map(([label, value]) => (
          <li key={label}>
            <KeyNumber label={label} value={value} />
          </li>
        ))}
      </Grid>
      <Grid columns={{ base: 1, expanded: 3 }} gap="md">
        <GridItem span={{ expanded: 2 }}>
          <Card title="Recent sign-ins" level={2}>
            <Stack gap="sm">
              {SIGN_INS.map(([name, method, when]) => (
                <Inline key={name} justify="between">
                  <Text>
                    {name}{" "}
                    <Text tone="subtle" size="sm">
                      · {method}
                    </Text>
                  </Text>
                  <Text size="sm" tone="subtle">
                    {when}
                  </Text>
                </Inline>
              ))}
            </Stack>
          </Card>
        </GridItem>
        <Card title="Connections" level={2}>
          <Stack gap="sm">
            {CONNECTIONS.map(([name, on]) => (
              <Inline key={name} justify="between">
                <Text>{name}</Text>
                <Badge tone={on ? "success" : "neutral"}>{on ? "On" : "Off"}</Badge>
              </Inline>
            ))}
          </Stack>
        </Card>
      </Grid>
    </Stack>
  );
}

export const Responsive: Story = {
  parameters: {
    docs: {
      description: { story: "Columns and spans follow the window size class. Resize to see." },
    },
  },
  render: () => <Overview />,
};

const columnsOf = (element: HTMLElement) =>
  getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length;

/**
 * The overview at one window size class: its key numbers in that class's columns, and the main
 * column beside the side column from `expanded`, two of three columns wide; stacked below it.
 */
const atWindowClass =
  (sizeClass: keyof typeof COLUMNS_BY_CLASS): Story["play"] =>
  async ({ canvas }) => {
    await expect(canvas.getByText(sizeClass)).toBeInTheDocument();
    await expect(columnsOf(canvas.getByRole("list", { name: "Key numbers" }))).toBe(
      COLUMNS_BY_CLASS[sizeClass],
    );
    const main = canvas.getByRole("region", { name: "Recent sign-ins" }).getBoundingClientRect();
    const side = canvas.getByRole("region", { name: "Connections" }).getBoundingClientRect();
    if (sizeClass === "base" || sizeClass === "medium") {
      await expect(side.top).toBeGreaterThan(main.bottom);
      await expect(Math.abs(main.width - side.width)).toBeLessThanOrEqual(1);
    } else {
      await expect(Math.abs(side.top - main.top)).toBeLessThanOrEqual(1);
      await expect(main.width).toBeGreaterThan(side.width * 1.9);
    }
  };

export const WindowBase: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Test: base window",
  globals: { viewport: { value: "mobile", isRotated: false } },
  render: () => <Overview />,
  play: atWindowClass("base"),
};

export const WindowMedium: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Test: medium window",
  globals: { viewport: { value: "tablet", isRotated: false } },
  render: () => <Overview />,
  play: atWindowClass("medium"),
};

export const WindowExpanded: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Test: expanded window",
  globals: { viewport: { value: "laptop", isRotated: false } },
  render: () => <Overview />,
  play: atWindowClass("expanded"),
};

export const WindowLarge: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Test: large window",
  globals: { viewport: { value: "desktop", isRotated: false } },
  render: () => <Overview />,
  play: atWindowClass("large"),
};

export const WindowXlarge: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Test: xlarge window",
  globals: { viewport: { value: "wide", isRotated: false } },
  render: () => <Overview />,
  play: atWindowClass("xlarge"),
};
