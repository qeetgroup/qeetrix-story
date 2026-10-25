import {
  Box,
  type ColorScheme,
  Field,
  formatCurrency,
  Grid,
  Input,
  QeetrixProvider,
  Stack,
  Tab,
  Tabs,
  TabsList,
  TabsPanel,
  Text,
  Toggle,
  ToggleGroup,
  useColorScheme,
  useLocale,
} from "@qeetrix/react";
import { Breadcrumb, BreadcrumbItem, Pagination } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, fn, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

/** A small comparison label. */
function Label({ children }: { children: ReactNode }) {
  return (
    <Text size="sm" tone="subtle">
      {children}
    </Text>
  );
}

/** The locale this section resolves, read with useLocale(). */
function LocaleReadout() {
  return <Label>useLocale(): {useLocale()}</Label>;
}

/** What a provider reaches: formatting in its locale, and client components' strings. */
function Sample({ company = "Company" }: { company?: string }) {
  const locale = useLocale();
  return (
    <Stack gap="lg">
      <LocaleReadout />
      <Text size="lg" weight="semibold">
        {formatCurrency(12845000, "INR", locale)}
      </Text>
      <Field label={company} optional>
        <Input defaultValue="Acme Pvt Ltd" />
      </Field>
      <Pagination offset={0} pageSize={25} total={128400} onOffsetChange={() => {}} />
    </Stack>
  );
}

/** A ruled section of the page. */
function Section({ children }: { children: ReactNode }) {
  return (
    <Box border="default" radius="surface" padding="lg" background="raised">
      <Stack gap="md">{children}</Stack>
    </Box>
  );
}

const meta: Meta<typeof QeetrixProvider> = {
  title: "Components/Utilities/QeetrixProvider",
  component: QeetrixProvider,
  parameters: {
    qeetrix: qx({ category: "utilities", status: "stable" }),
    layout: "padded",
  },
  args: {
    locale: "en-IN",
    direction: "ltr",
  },
  argTypes: {
    messages: { control: false },
    children: { control: false },
  },
  render: (args) => (
    <QeetrixProvider {...args}>
      <div dir={args.direction ?? "ltr"} style={{ inlineSize: 480 }}>
        <Sample />
      </div>
    </QeetrixProvider>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof QeetrixProvider>;

export const Playground: Story = {};

export const Locale: Story = {
  render: () => (
    <Grid columns={2} gap="lg" style={{ inlineSize: 560 }}>
      {(["en-IN", "en-US"] as const).map((locale) => (
        <QeetrixProvider key={locale} locale={locale}>
          <Section>
            <LocaleReadout />
            <Text size="lg" weight="semibold">
              {formatCurrency(12845000, "INR", locale)}
            </Text>
          </Section>
        </QeetrixProvider>
      ))}
    </Grid>
  ),
};

export const RightToLeft: Story = {
  name: "Right to left",
  parameters: {
    docs: {
      description: { story: 'Set `dir="rtl"` on the page too: the provider renders nothing.' },
    },
  },
  render: () => (
    <QeetrixProvider direction="rtl">
      <div dir="rtl" style={{ inlineSize: 480 }}>
        <Stack gap="lg">
          <Breadcrumb>
            <BreadcrumbItem href="#directory">Directory</BreadcrumbItem>
            <BreadcrumbItem href="#users">Users</BreadcrumbItem>
            <BreadcrumbItem current>Priya Sharma</BreadcrumbItem>
          </Breadcrumb>
          <Tabs defaultValue="profile">
            <TabsList aria-label="Priya Sharma">
              <Tab value="profile">Profile</Tab>
              <Tab value="security">Security</Tab>
              <Tab value="sessions">Sessions</Tab>
            </TabsList>
            {["profile", "security", "sessions"].map((value) => (
              <TabsPanel key={value} value={value}>
                <Box paddingBlock="md">
                  <Text tone="subtle">priya@acme.in</Text>
                </Box>
              </TabsPanel>
            ))}
          </Tabs>
          <Pagination offset={25} pageSize={25} total={1284} onOffsetChange={() => {}} />
        </Stack>
      </div>
    </QeetrixProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("tab", { name: "Profile" }));
    // In right-to-left text, the next tab is to the left.
    await userEvent.keyboard("{ArrowLeft}");
    await expect(canvas.getByRole("tab", { name: "Security" })).toHaveFocus();
    await expect(canvas.getByRole("tab", { name: "Security" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};

/** A scheme switch, as a product's settings page would offer it. */
function SchemeSwitch() {
  const { colorScheme, resolvedColorScheme, setColorScheme } = useColorScheme();
  return (
    <Stack gap="sm" align="start">
      <ToggleGroup
        aria-label="Colour scheme"
        value={[colorScheme]}
        onValueChange={(value) => {
          const next = value[0] as ColorScheme | undefined;
          if (next) setColorScheme(next);
        }}
      >
        <Toggle value="light">Light</Toggle>
        <Toggle value="dark">Dark</Toggle>
        <Toggle value="system">System</Toggle>
      </ToggleGroup>
      <Label>Showing: {resolvedColorScheme}</Label>
    </Stack>
  );
}

export const ColourScheme: Story = {
  name: "Colour scheme",
  parameters: {
    // It writes data-qx-color-scheme on <html>: give it a frame of its own in the docs.
    docs: { story: { inline: false, iframeHeight: 280 } },
  },
  args: { defaultColorScheme: "light", onColorSchemeChange: fn() },
  render: (args) => (
    <QeetrixProvider {...args}>
      <div style={{ inlineSize: 480 }}>
        <Section>
          <SchemeSwitch />
          <Pagination offset={25} pageSize={25} total={1284} onOffsetChange={() => {}} />
        </Section>
      </div>
    </QeetrixProvider>
  ),
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const html = canvasElement.ownerDocument.documentElement;
    await waitFor(() => expect(html.dataset.qxColorScheme).toBe("light"));

    await userEvent.click(canvas.getByRole("button", { name: "Dark" }));
    await waitFor(() => expect(html.dataset.qxColorScheme).toBe("dark"));
    await expect(args.onColorSchemeChange).toHaveBeenLastCalledWith("dark");

    // Back to light: the provider doesn't restore <html> when it unmounts.
    await userEvent.click(canvas.getByRole("button", { name: "Light" }));
    await waitFor(() => expect(html.dataset.qxColorScheme).toBe("light"));
  },
};

export const Nesting: Story = {
  parameters: {
    docs: { description: { story: "An inner provider inherits whatever it doesn't set." } },
  },
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 560 }}>
      <Section>
        <LocaleReadout />
        <Pagination offset={0} pageSize={25} total={1284} onOffsetChange={() => {}} />
      </Section>
      <QeetrixProvider locale="hi-IN" messages={hi}>
        <div lang="hi">
          <Section>
            <LocaleReadout />
            <Pagination offset={0} pageSize={25} total={1284} onOffsetChange={() => {}} />
            <QeetrixProvider messages={{ pagination: { label: "सदस्यों के पेज" } }}>
              <Box border="subtle" radius="control" padding="md">
                <Stack gap="sm">
                  <LocaleReadout />
                  <Pagination offset={0} pageSize={25} total={38} onOffsetChange={() => {}} />
                </Stack>
              </Box>
            </QeetrixProvider>
          </Section>
        </div>
      </QeetrixProvider>
    </Stack>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation", { name: "Pagination" })).toBeVisible();
    await expect(canvas.getByRole("navigation", { name: "पेज नेविगेशन" })).toBeVisible();
    // The innermost provider changed only the name: the buttons are still Hindi, the locale hi-IN.
    const inner = canvas.getByRole("navigation", { name: "सदस्यों के पेज" });
    await expect(within(inner).getByRole("button", { name: "अगला पेज" })).toBeVisible();
    await expect(canvas.getAllByText("useLocale(): hi-IN")).toHaveLength(2);
  },
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <div lang="hi" style={{ inlineSize: 480 }}>
        <Sample company="कंपनी" />
      </div>
    </QeetrixProvider>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("useLocale(): hi-IN")).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "कंपनी (वैकल्पिक)" })).toBeVisible();
    const nav = canvas.getByRole("navigation", { name: "पेज नेविगेशन" });
    await expect(within(nav).getByRole("status")).toHaveTextContent("1,28,400 में से 1–25");
  },
};
