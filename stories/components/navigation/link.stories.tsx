import { ExternalLinkIcon } from "@qeetrix/icons";
import { Icon, Link } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Link> = {
  title: "Components/Navigation/Link",
  component: Link,
  parameters: {
    qeetrix: qx({ category: "navigation", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'A styled anchor element built on CVA with three variants (`default`, `muted`, `destructive`), three underline modes (`hover`, `always`, `none`), and three sizes (`sm`, `md`, `lg`). Use it for inline navigation inside body copy, data-table cell links, destructive confirmation links, and secondary UI anchors. Renders a native `<a>` — all standard anchor attributes (including `href`, `target`, `rel`) pass through, and `render` composes a router link while keeping Qeet link styling. Satisfies WCAG 1.4.1 (use of color) when paired with underline — never rely on colour alone to convey link affordance.\n\nTwo layouts: **standalone** (the default) is `inline-flex` so a leading or trailing icon aligns, and underlines on hover; **`inline`** is for a link inside running text — real inline layout so a long label wraps with the sentence, the surrounding font size is inherited unless `size` is given, and it is underlined at rest unless `underline` is given. `external` opens in a new tab with `rel="noopener noreferrer"`, adds a trailing ↗ glyph and announces "(opens in a new tab)". `disabled` removes the destination and the tab stop but keeps the text discoverable as an unavailable link (`role="link"` + `aria-disabled`).',
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "muted", "destructive"],
    },
    underline: {
      control: "select",
      options: ["hover", "always", "none"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    inline: { control: "boolean" },
    external: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    href: "#",
    children: "View details",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Primary brand-coloured link — `variant='default'`, `underline='hover'`, `size='md'`. The most common pattern for inline navigation in body copy and data-table cells across Qeet products.",
      },
    },
  },
  args: {
    children: "View API key details",
    href: "#",
  },
};

export const VariantMuted: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`variant='muted'` renders in `text-muted-foreground` and transitions to `text-foreground` on hover. Use for secondary or supplementary links that should recede behind primary content — breadcrumb segments, timestamp links, and 'learn more' anchors.",
      },
    },
  },
  args: {
    variant: "muted",
    children: "Learn about passkey security",
    href: "#",
  },
};

export const VariantDestructive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`variant='destructive'` signals an irreversible action inline with text — e.g. 'revoke all sessions' inside an alert, or a 'delete organisation' link in a confirmation paragraph. Prefer `AlertDialog` for standalone CTAs; use this when the link is embedded in prose.",
      },
    },
  },
  args: {
    variant: "destructive",
    children: "Revoke all active sessions",
    href: "#",
  },
};

export const UnderlineAlways: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`underline='always'` provides a persistent underline — required by WCAG 1.4.1 when the link colour alone cannot be reliably distinguished from surrounding text (e.g. on coloured backgrounds or for users with colour-vision deficiency).",
      },
    },
  },
  args: {
    underline: "always",
    children: "Privacy policy",
    href: "#",
  },
};

export const UnderlineNone: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`underline='none'` for navigation-list items and card-level links where the interactive context makes the link affordance obvious without an underline. Only use this when the link role is unambiguous — e.g. a product name in a sidebar nav.",
      },
    },
  },
  args: {
    underline: "none",
    children: "Qeet Notify console",
    href: "#",
  },
};

export const SizeSm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`size='sm'` (`text-sm`) for links inside compact rows, table cells, metadata lines, and helper text beneath form fields.",
      },
    },
  },
  args: {
    size: "sm",
    children: "View audit log",
    href: "#",
  },
};

export const SizeLg: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`size='lg'` (`text-lg`) for prominent inline links inside larger typography — hero copy, section headings, or onboarding instructions.",
      },
    },
  },
  args: {
    size: "lg",
    children: "Get started with Qeet ID",
    href: "#",
  },
};

export const ExternalLinkExample: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "External links add `target='_blank'` and `rel='noopener noreferrer'` to prevent tab-napping. The trailing `ExternalLink` icon signals to sighted users that the link opens a new tab. This is the hand-composed form; the `external` prop (see External) does all of it, plus the screen-reader announcement, in one flag.",
      },
    },
  },
  render: () => (
    <Link href="https://docs.qeet.in" target="_blank" rel="noopener noreferrer">
      Qeetrix documentation
      <Icon icon={ExternalLinkIcon} size="sm" aria-hidden />
    </Link>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All three size tokens side by side — `sm`, `md`, and `lg`. Size scales with `text-sm` / `text-base` / `text-lg`.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Link href="#" size="sm">
        Small — View audit log
      </Link>
      <Link href="#" size="md">
        Medium — View API key details
      </Link>
      <Link href="#" size="lg">
        Large — Get started with Qeet ID
      </Link>
    </div>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All three variants — `default` (primary colour), `muted` (secondary), `destructive` (danger).",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Link href="#" variant="default">
        Default — View API key details
      </Link>
      <Link href="#" variant="muted">
        Muted — Learn about passkey security
      </Link>
      <Link href="#" variant="destructive">
        Destructive — Revoke all sessions
      </Link>
    </div>
  ),
};

export const Inline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`inline` for links inside running text — here a Qeet ID webhook notice in a narrow panel. The long label wraps with the sentence instead of overflowing, the link inherits the paragraph's `text-sm` rather than forcing `md`, and it is underlined at rest: in dark mode the link colour is only 1.9:1 against body text, so colour alone would fail WCAG 1.4.1.",
      },
    },
  },
  render: () => (
    <p className="w-72 text-sm text-muted-foreground">
      Rotate your signing secret before 30 June 2026. Deliveries signed with the old secret fail
      verification after that — see the{" "}
      <Link inline href="#">
        webhook signature verification guide for Qeet ID
      </Link>{" "}
      or{" "}
      <Link inline external href="https://status.qeet.in">
        check the status page
      </Link>
      .
    </p>
  ),
};

export const External: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`external` for links that leave the application: opens in a new tab with `rel="noopener noreferrer"` (a `rel` you pass is merged, a `target` you pass wins), shows a trailing ↗ glyph that mirrors under RTL, and appends a visually hidden "(opens in a new tab)" — override it with `externalLabel` to translate.',
      },
    },
  },
  args: {
    external: true,
    href: "https://status.qeet.in",
    children: "Qeet status page",
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`disabled` — links cannot be disabled natively, so this removes the `href` and the tab stop, dims the text, and keeps it announced as an unavailable link (`role="link"` + `aria-disabled`). Prefer removing a link the user can never follow; use this when its absence would be more confusing — an invoice PDF that is still being generated in qeet-pay.',
      },
    },
  },
  args: {
    disabled: true,
    href: "#",
    children: "Download invoice PDF",
  },
};

export const KeyboardInteraction: Story = {
  name: "Interaction: external and disabled links",
  parameters: {
    docs: {
      description: {
        story:
          "What breaks silently on a link is what only assistive technology and the keyboard notice. The test checks that an `external` link carries `target`, `rel` and the new-tab announcement in its accessible name, and that Tab skips a `disabled` link while it stays exposed as `aria-disabled`.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Link external href="https://status.qeet.in">
        Qeet status page
      </Link>
      <Link disabled href="#">
        Download invoice PDF
      </Link>
      <Link href="#">View API key details</Link>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const external = canvas.getByRole("link", { name: "Qeet status page (opens in a new tab)" });
    await expect(external).toHaveAttribute("target", "_blank");
    await expect(external).toHaveAttribute("rel", "noopener noreferrer");

    const disabled = canvas.getByRole("link", { name: "Download invoice PDF" });
    await expect(disabled).toHaveAttribute("aria-disabled", "true");
    await expect(disabled).not.toHaveAttribute("href");

    await userEvent.tab();
    await expect(external).toHaveFocus();
    // The disabled link is not a tab stop.
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "View API key details" })).toHaveFocus();
  },
};
