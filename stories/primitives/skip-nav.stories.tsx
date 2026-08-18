import { Badge, SkipNav, SkipNavContent } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof SkipNav> = {
  title: "Primitives/SkipNav",
  component: SkipNav,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A keyboard-only bypass link that satisfies **WCAG 2.4.1 (bypass blocks)**. It is the first focusable element on the page — visually hidden until a keyboard user presses Tab, at which point it appears in the top-left corner. Activating it moves focus directly to `SkipNavContent`, skipping any repeated navigation chrome. Pair `<SkipNav />` at the very top of your layout with `<SkipNavContent>` wrapping the primary content region. See the WAI-ARIA [landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) guidance.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SkipNav>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The canonical placement: `<SkipNav />` immediately before the header, `<SkipNavContent>` wrapping main. Press **Tab** while the preview is focused to reveal the skip link. The link is `sr-only` at rest and becomes fully visible on `:focus-visible`.",
      },
    },
  },
  render: () => (
    <div className="min-h-[400px] flex flex-col">
      <SkipNav />
      <header className="border-b bg-background px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-foreground">Qeet ID Console</span>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <a href="/users" className="hover:text-foreground">
            Users
          </a>
          <a href="/organizations" className="hover:text-foreground">
            Organizations
          </a>
          <a href="/api-keys" className="hover:text-foreground">
            API Keys
          </a>
          <a href="/audit-log" className="hover:text-foreground">
            Audit log
          </a>
        </nav>
      </header>
      <SkipNavContent className="flex-1 p-6">
        <h1 className="text-lg font-semibold mb-2">Main content area</h1>
        <p className="text-sm text-muted-foreground">
          Focus arrived here via the skip link — keyboard users bypassed the entire navigation bar
          above.
        </p>
      </SkipNavContent>
    </div>
  ),
};

export const CustomTarget: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Override `to` and the matching `id` when a layout uses a custom landmark id rather than the default `#main-content` — common in multi-panel dashboards.",
      },
    },
  },
  render: () => (
    <div className="min-h-[360px] flex flex-col">
      <SkipNav to="#dashboard-feed">Skip to dashboard feed</SkipNav>
      <header className="border-b bg-background px-6 py-3 text-sm font-medium">
        Qeet Notify — Console
      </header>
      <SkipNavContent id="dashboard-feed" className="flex-1 p-6">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-base font-semibold">Notification feed</h1>
          <Badge variant="success">Live</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Custom target id — the skip link jumps to{" "}
          <code className="text-xs bg-muted px-1 rounded">#dashboard-feed</code> instead of the
          default <code className="text-xs bg-muted px-1 rounded">#main-content</code>.
        </p>
      </SkipNavContent>
    </div>
  ),
};
