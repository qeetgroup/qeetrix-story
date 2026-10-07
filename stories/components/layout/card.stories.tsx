import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Card> = {
  title: "Components/Layout/Card",
  component: Card,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'Surface container with `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, and `CardFooter` slots. Available in `size="default"` (standard padding) and `size="sm"` (compact). Use for settings panels, confirmation dialogs, summary tiles, and detail drawers.\n\n`variant` sets the surface treatment: `default` (boundary plus the faintest shadow), `outline` (no shadow, for dense layouts and repeated tiles) and `elevated` (one step forward — for the one surface on a page that should stand out). A card is static by default. `interactive` adds the hover lift, pointer cursor and Qeet focus ring for a card that is itself the control — pair it with `render` (`render={<a href="…" />}` for navigation, `render={<button type="button" />}` for a short, phrasing-only card). `selected` paints the 2px brand boundary; it is visual only, so the state itself must be carried by the control (`aria-pressed`, or a radio or checkbox inside the card).',
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "elevated"],
    },
    size: {
      control: "select",
      options: ["default", "sm"],
    },
    interactive: { control: "boolean" },
    selected: { control: "boolean" },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Standard API-key creation card. The footer uses `justify-end` to right-align the Cancel / Create action pair — a common pattern for destructive or irreversible operations.",
      },
    },
  },
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Create API key</CardTitle>
        <CardDescription>Keys grant full access to your tenant.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Name this key so you can recognise it later in the audit log.
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button size="sm">Create</Button>
      </CardFooter>
    </Card>
  ),
};

export const SmallVariant: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`size="sm"` compact variant — ideal for dense lists such as org-member summary tiles in a sidebar or a grid of recent invites.',
      },
    },
  },
  render: () => (
    <Card size="sm" className="w-72">
      <CardHeader>
        <CardTitle>Ada Lovelace</CardTitle>
        <CardDescription>ada@acme.com · Owner</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Member since 12 Jan 2026 · Last active 2 hours ago
      </CardContent>
    </Card>
  ),
};

export const WithAction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`CardAction` renders in the top-right corner of the header, outside the title/description flow. Used here for a quick Disable toggle on a webhook endpoint — keeps the primary reading path uncluttered.",
      },
    },
  },
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Webhook endpoint</CardTitle>
        <CardDescription>https://api.acme.com/hooks/qeet</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Disable
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <p>
          Subscribed events:{" "}
          <span className="text-foreground font-medium">user.created, session.ended</span>
        </p>
        <p>
          Last delivery: <span className="text-foreground font-medium">200 OK · 3 min ago</span>
        </p>
        <p>
          Signing secret: <span className="font-mono text-foreground">whsec_••••••••6f3a</span>
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="ghost" size="sm">
          View delivery log
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The three surface treatments on the same qeet-pay summary tile. `default` is the resting card; `outline` drops the shadow for grids of repeated tiles; `elevated` stands one step forward and is meant for a single surface per page — here, the payout that needs attention.",
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
      {(
        [
          ["default", "Collected this month", "₹18,42,600", "1,284 payments · 6 Oct"],
          ["outline", "Refunded this month", "₹42,150", "37 refunds · 6 Oct"],
          ["elevated", "Next payout", "₹17,96,240", "Releases 8 Oct, 10:00 IST"],
        ] as const
      ).map(([variant, title, value, meta]) => (
        <Card key={variant} variant={variant}>
          <CardHeader>
            <CardDescription>{title}</CardDescription>
            <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{meta}</span>
            <span className="font-mono">{`variant="${variant}"`}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`interactive` with `render={<a href="…" />}` — the whole card is the link, so it gets one tab stop, the pointer lift on hover and the Qeet focus ring. Used for the product switcher on the Qeet console home. An anchor may contain the card\'s block content; the card must not also contain other links or buttons.',
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
      {(
        [
          ["Qeet ID", "/id", "Passkeys, SSO and SCIM for 24 members.", "3 connections"],
          ["qeet-pay", "/pay", "Payments, payouts and GST invoicing.", "Live mode"],
          ["qeet-logs", "/logs", "Logs, metrics and traces for every service.", "12 streams"],
        ] as const
      ).map(([product, href, description, status]) => (
        <Card key={product} interactive render={<a href={href} />}>
          <CardHeader>
            <CardTitle>{product}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="muted">{status}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

const PLANS = [
  { id: "starter", name: "Starter", price: "₹0", detail: "Up to 1,000 monthly active users" },
  { id: "growth", name: "Growth", price: "₹4,999 / mo", detail: "Up to 25,000 MAU · SAML SSO" },
  { id: "business", name: "Business", price: "₹14,999 / mo", detail: "Unlimited MAU · SCIM · SLA" },
] as const;

/**
 * Selectable cards rendered as toggle buttons. `selected` only paints the boundary; the state a
 * screen reader hears is `aria-pressed` on the element the card renders as.
 */
function PlanPicker() {
  const [plan, setPlan] = React.useState<(typeof PLANS)[number]["id"]>("growth");
  return (
    // biome-ignore lint/a11y/useSemanticElements: a set of toggle buttons; a fieldset would add form semantics.
    <div
      role="group"
      aria-label="Qeet ID plan"
      className="grid w-full max-w-2xl gap-3 sm:grid-cols-3"
    >
      {PLANS.map(({ id, name, price, detail }) => (
        <Card
          key={id}
          size="sm"
          variant="outline"
          interactive
          selected={plan === id}
          render={<button type="button" aria-pressed={plan === id} onClick={() => setPlan(id)} />}
        >
          <span className="flex flex-col gap-1 px-3">
            <span className="font-heading text-sm font-medium">{name}</span>
            <span className="text-base font-semibold tabular-nums">{price}</span>
            <span className="text-xs text-muted-foreground">{detail}</span>
          </span>
        </Card>
      ))}
    </div>
  );
}

export const Selected: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`selected` on an `interactive` card rendered as `<button type=\"button\" aria-pressed>` — the plan picker on a Qeet ID tenant's billing page. The 2px brand boundary is the visual signal; `aria-pressed` is the one assistive technology reads. A button may only hold phrasing content, so the card's children are spans rather than `CardHeader` / `CardContent`.",
      },
    },
  },
  render: () => <PlanPicker />,
};

export const SelectInteraction: Story = {
  name: "Interaction: keyboard selects a card",
  parameters: {
    docs: {
      description: {
        story:
          "An interactive card has to behave like the control it renders as. The test tabs onto a plan card, activates it with Space and asserts that `aria-pressed` — not just the painted boundary — moved from the old plan to the new one.",
      },
    },
  },
  render: () => <PlanPicker />,
  play: async ({ canvas, userEvent }) => {
    const growth = canvas.getByRole("button", { name: /Growth/ });
    const business = canvas.getByRole("button", { name: /Business/ });
    await expect(growth).toHaveAttribute("aria-pressed", "true");
    await expect(business).toHaveAttribute("aria-pressed", "false");

    // Starter → Growth → Business: each card is its own tab stop.
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(business).toHaveFocus();

    await userEvent.keyboard(" ");

    await expect(business).toHaveAttribute("aria-pressed", "true");
    await expect(growth).toHaveAttribute("aria-pressed", "false");
  },
};
