import { Card, Grid, QeetrixProvider, Stack, Text } from "@qeetrix/react";
import { CodeBlock } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const TSX = [
  'import { QeetIdProvider } from "@qeetid/react";',
  "",
  "// Sign-in for every page",
  "export default function App() {",
  '  return <QeetIdProvider issuer="https://acme.id.qeet.in" sessionMinutes={60} />;',
  "}",
].join("\n");

const SHELL = [
  "bun add @qeetid/node",
  'export QEETID_ISSUER="https://acme.id.qeet.in"',
  "export QEETID_CLIENT_ID=4f1c9a2e-payroll-portal",
].join("\n");

const TYPESCRIPT = [
  "interface SignInEvent {",
  '  type: "user.signed_in";',
  "  risk: number;",
  "  mfa: boolean;",
  "}",
  "",
  "export const isRisky = (event: SignInEvent) => event.risk > 0.7 && !event.mfa;",
].join("\n");

const JSON_EVENT = JSON.stringify(
  {
    type: "user.signed_in",
    user: { id: "usr_8f2c1a9b", email: "priya@acme.in" },
    method: "passkey",
    risk: 0.12,
    mfa: true,
    device: null,
  },
  null,
  2,
);

const XML = [
  "<!-- Acme's identity provider -->",
  '<EntityDescriptor entityID="https://acme.id.qeet.in/saml">',
  '  <SingleSignOnService Location="https://acme.id.qeet.in/saml/sso" />',
  "</EntityDescriptor>",
].join("\n");

const redirect = (path: string) =>
  JSON.stringify(
    {
      redirect_uri: `https://payroll.acme.in/oauth2/${path}?tenant=acme-pvt-ltd&return_to=%2Fpayslips`,
    },
    null,
    2,
  );

const meta: Meta<typeof CodeBlock> = {
  title: "Components/Typography/CodeBlock",
  component: CodeBlock,
  parameters: {
    qeetrix: qx({ category: "typography", status: "experimental" }),
    layout: "padded",
  },
  args: {
    code: TSX,
    language: "tsx",
  },
  render: (args) => (
    <div style={{ inlineSize: 640 }}>
      <CodeBlock {...args} />
    </div>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

export const Playground: Story = {};

export const Languages: Story = {
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 640 }}>
      <CodeBlock code={SHELL} language="shell" />
      <CodeBlock code={TYPESCRIPT} language="typescript" />
      <CodeBlock code={JSON_EVENT} language="json" />
      <CodeBlock code={XML} language="xml" />
    </Stack>
  ),
};

export const Command: Story = {
  parameters: {
    docs: { description: { story: "One line: no header or numbers, Copy beside it." } },
  },
  args: { code: "bun add @qeetid/react", language: "shell" },
};

export const LongLines: Story = {
  name: "Long lines",
  render: () => (
    <Grid columns={2} gap="lg" style={{ inlineSize: 760 }}>
      <Stack gap="xs">
        <Text size="sm" tone="subtle">
          Scroll
        </Text>
        <CodeBlock code={redirect("callback")} language="json" title="callback.json" />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="subtle">
          Wrap
        </Text>
        <CodeBlock code={redirect("logout")} language="json" title="logout.json" wrap />
      </Stack>
    </Grid>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <div style={{ inlineSize: 560 }}>
      <Card title="Connect your React app" level={2}>
        <Stack gap="md">
          <CodeBlock code="bun add @qeetid/react" language="shell" />
          <CodeBlock code={TSX} language="tsx" title="src/App.tsx" wrap />
        </Stack>
      </Card>
    </div>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <div style={{ inlineSize: 640 }}>
      <QeetrixProvider locale="hi-IN" messages={hi}>
        <CodeBlock code={SHELL} language="shell" />
      </QeetrixProvider>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "कोड कॉपी करें" })).toBeVisible();
    await expect(canvas.getByText("शेल", { exact: true })).toBeVisible();
  },
};

export const CopyInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: Copy copies the code alone",
  // The test browser has no clipboard permission: stand in for it, and put it back after.
  beforeEach: () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    return () => {
      delete (navigator as { clipboard?: unknown }).clipboard;
    };
  },
  args: { code: SHELL, language: "shell" },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Copy code" }));
    // The line numbers are drawn by CSS, so the copied text is the code exactly.
    await expect(navigator.clipboard.writeText).toHaveBeenCalledWith(SHELL);
    await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent("Copied"));
  },
};

export const ScrollInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the keyboard reaches a scrolling block",
  args: { code: redirect("callback"), language: "json", title: "client.json" },
  render: (args) => (
    <div style={{ inlineSize: 420 }}>
      <CodeBlock {...args} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const region = canvas.getByRole("region", { name: "client.json" });
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Copy code" })).toHaveFocus();
    await userEvent.tab();
    await expect(region).toHaveFocus();
  },
};

export const WrapKeepsIndent: Story = {
  ...LongLines,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a wrapped line keeps its indent",
  play: async ({ canvasElement }) => {
    const text = [
      ...canvasElement.querySelectorAll<HTMLElement>("[data-wrap] .qx-code-block-text"),
    ].find((line) => line.textContent?.includes("redirect_uri"));
    if (!text) throw new Error("No wrapped redirect_uri line");
    // Each row of the wrapped line starts at one place, two columns in from the line's start.
    const range = document.createRange();
    range.setStartAfter(text.querySelector(".qx-code-block-indent") as Node);
    range.setEnd(text, text.childNodes.length);
    const rows = new Map<number, number>();
    for (const rect of range.getClientRects()) {
      if (rect.width === 0) continue;
      const top = Math.round(rect.top);
      rows.set(top, Math.min(rows.get(top) ?? Number.POSITIVE_INFINITY, rect.left));
    }
    const starts = [...rows.values()];
    await expect(starts.length).toBeGreaterThan(1);
    for (const start of starts) await expect(Math.abs(start - (starts[0] ?? 0))).toBeLessThan(0.5);
    await expect((starts[0] ?? 0) - text.getBoundingClientRect().left).toBeGreaterThan(0);
  },
};

export const ThreeDigitNumbers: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the number column fits three-digit lines",
  args: {
    code: Array.from({ length: 120 }, (_, index) => `audit.log line ${index + 1}`).join("\n"),
    language: "text",
    title: "audit.log",
  },
  play: async ({ canvasElement }) => {
    const lines = canvasElement.querySelectorAll<HTMLElement>(".qx-code-block-line");
    await expect(lines).toHaveLength(120);
    // The column is at least as wide as "120"; every line's code starts at one place.
    const probe = document.createElement("span");
    probe.textContent = "120";
    probe.style.display = "inline-block";
    canvasElement.querySelector("pre code")?.append(probe);
    const digits = probe.getBoundingClientRect().width;
    probe.remove();
    const column = Number.parseFloat(getComputedStyle(lines[0] as HTMLElement).gridTemplateColumns);
    await expect(column).toBeGreaterThanOrEqual(digits - 0.5);
    const texts = canvasElement.querySelectorAll<HTMLElement>(".qx-code-block-text");
    const starts = [8, 98, 119].map((index) => texts[index]?.getBoundingClientRect().left);
    await expect(new Set(starts).size).toBe(1);
  },
};

export const CommandInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: one line has no header and no numbers",
  args: { code: "bun add @qeetid/react", language: "shell" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("[data-slot=code-block-header]")).toBeNull();
    await expect(canvasElement.querySelector("pre")).not.toHaveAttribute("data-numbers");
  },
};
