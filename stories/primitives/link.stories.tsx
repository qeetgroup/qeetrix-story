import { Icon, Link } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LinkSquare } from "@qeetrix/icons";

const meta: Meta<typeof Link> = {
  title: "Primitives/Link",
  component: Link,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A styled anchor element built on CVA with three variants (`default`, `muted`, `destructive`), three underline modes (`hover`, `always`, `none`), and three sizes (`sm`, `md`, `lg`). Use it for inline navigation inside body copy, data-table cell links, destructive confirmation links, and secondary UI anchors. Renders a native `<a>` — all standard anchor attributes (including `href`, `target`, `rel`) pass through. Satisfies WCAG 1.4.1 (use of color) when paired with underline — never rely on colour alone to convey link affordance.",
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
          "External links add `target='_blank'` and `rel='noopener noreferrer'` to prevent tab-napping. The trailing `ExternalLink` icon signals to sighted users that the link opens a new tab.",
      },
    },
  },
  render: () => (
    <Link href="https://docs.qeet.in" target="_blank" rel="noopener noreferrer">
      Qeetrix documentation
      <Icon icon={LinkSquare} size="sm" aria-hidden />
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
