import { Prose, proseVariants, Typography } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Typography> = {
  title: "Components/Typography/Typography",
  component: Typography,
  parameters: {
    qeetrix: qx({ category: "typography", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Consistent text styling for discrete pieces of copy — headings, lead paragraphs, blockquotes, inline code, and muted captions. Use `variant` to pick the right semantic element and visual weight; switch to `Prose` when rendering long-form MDX or rich-text output (e.g. qeet-docs articles).\n\nNo variant carries outer margins — the parent's gap owns spacing. `as` changes the element without changing the look, so keep the heading level right for the outline and pick the variant for its size. `truncate` clips with an ellipsis: `true` for one line, a number to clamp to that many lines; the full text stays in the DOM for assistive technology.\n\n`Prose` owns reading rhythm and has a `size` axis, from `proseVariants`: `md` (the default) for articles, help pages and release notes, and `sm` for compact prose in editing surfaces and dense console panels — a fixed 24px line and a heading ladder one step down. `proseVariants({ size })` returns the full class string, so it can style an element that is not a `Prose`.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "p",
        "blockquote",
        "lead",
        "large",
        "small",
        "muted",
        "inlineCode",
        "list",
      ],
    },
    truncate: { control: "number" },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Typography>;

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All `variant` values rendered together — a quick visual reference for the Qeet type scale.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-2xl flex-col gap-4">
      <Typography variant="h1">Qeet ID — passkeys-first identity</Typography>
      <Typography variant="h2">Authenticate without passwords</Typography>
      <Typography variant="h3">Developer quick-start</Typography>
      <Typography variant="h4">Environment variables</Typography>
      <Typography variant="lead">
        Qeet ID ships a hosted login UI, passkey registration, and a full OIDC/OAuth 2.0 server —
        ready to drop into any stack in under 15 minutes.
      </Typography>
      <Typography variant="p">
        Every Qeet product — from qeet-logs real-time log streams to qeet-pay India-first checkout —
        uses Qeet ID tokens for authentication. A single JWT carries org membership, roles, and
        custom claims.
      </Typography>
      <Typography variant="blockquote">
        Passkeys eliminate the password as an attack surface — and Qeet ID makes them the default,
        not an afterthought.
      </Typography>
      <Typography variant="large">99.97% uptime · 42 ms median token issuance</Typography>
      <Typography variant="small">Last rotated: 14 Jun 2026</Typography>
      <Typography variant="muted">Token expires in 3,600 seconds · issued by id.qeet.in</Typography>
      <Typography variant="p">
        Install with{" "}
        <Typography as="code" variant="inlineCode">
          bun add @qeetrix/ui
        </Typography>{" "}
        and import the stylesheet.
      </Typography>
    </div>
  ),
};

export const ProseBlock: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`Prose` styles raw HTML or MDX output — used by qeet-docs to render product documentation without a `@tailwindcss/typography` dependency.",
      },
    },
  },
  render: () => (
    <Prose className="max-w-2xl">
      <h1>Getting started with Qeet ID</h1>
      <p>
        Qeet ID is the identity platform for the Qeet suite. It provides passkey-first
        authentication, OIDC/OAuth 2.0 token issuance, and a hosted login UI — all under the{" "}
        <code>id.qeet.in</code> domain.
      </p>
      <h2>Installation</h2>
      <p>Add the SDK and import styles in your entry file:</p>
      <pre>
        <code>bun add @qeetrix/ui</code>
      </pre>
      <h3>What you get</h3>
      <ul>
        <li>Passkey registration and assertion — no passwords stored</li>
        <li>
          Org-scoped JWTs with <strong>custom claims</strong> and <em>refresh token rotation</em>
        </li>
        <li>Magic-link and OTP fallback for devices without passkey support</li>
      </ul>
      <blockquote>
        Passkeys are phishing-resistant by design — the private key never leaves the device.
      </blockquote>
      <hr />
      <h3>Supported grant types</h3>
      <ol>
        <li>Authorization Code + PKCE</li>
        <li>Client Credentials (machine-to-machine)</li>
      </ol>
    </Prose>
  ),
};

function ReleaseNote() {
  return (
    <>
      <h2>Passkey autofill on the hosted login</h2>
      <p>
        The Qeet ID hosted login now offers saved passkeys in the browser's autofill menu, so a
        returning member signs in without typing an email first.
      </p>
      <h3>What changes for your tenant</h3>
      <ul>
        <li>
          Autofill is on by default for new tenants on <code>id.qeet.in</code>.
        </li>
        <li>Existing tenants can enable it under Settings → Sign-in methods.</li>
      </ul>
      <p>
        Read the <a href="#passkey-autofill">migration guide</a> before enabling it for SSO-only
        organisations.
      </p>
    </>
  );
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`Prose` at both `size` values with the same Qeet ID release note. `md` (left) is the reading size for articles and help pages; `sm` (right) keeps a 24px line and steps every heading down one rung, for a rich-text editor, a policy preview or a comment, where content should not dwarf the controls around it.",
      },
    },
  },
  render: () => (
    <div className="grid max-w-5xl grid-cols-2 gap-8">
      <section aria-label="Prose size md" className="flex flex-col gap-2">
        <Typography variant="small" className="text-muted-foreground">
          size="md"
        </Typography>
        <Prose size="md">
          <ReleaseNote />
        </Prose>
      </section>
      <section aria-label="Prose size sm" className="flex flex-col gap-2">
        <Typography variant="small" className="text-muted-foreground">
          size="sm"
        </Typography>
        <Prose size="sm" className="text-sm">
          <ReleaseNote />
        </Prose>
      </section>
    </div>
  ),
};

export const ProseVariantsHelper: Story = {
  name: "proseVariants helper",
  parameters: {
    docs: {
      description: {
        story:
          "`proseVariants({ size: \"sm\" })` on an `<article>` — a Qeet People leave-policy preview inside a settings panel. Each size's string is already merged, so it can be applied on its own to an element that cannot be a `Prose` (a sanitised HTML container, a third-party editor's content node) without restating overrides.",
      },
    },
  },
  render: () => (
    <div className="max-w-md rounded-(--qx-corner-surface) border border-border p-4">
      <article className={proseVariants({ size: "sm" })}>
        <h3>Earned leave</h3>
        <p>
          Employees accrue <strong>1.5 days</strong> of earned leave for every month worked, up to a
          carry-forward limit of 45 days.
        </p>
        <ul>
          <li>Accrual starts after the 90-day probation period.</li>
          <li>Unused leave above the limit lapses on 31 March.</li>
        </ul>
      </article>
    </div>
  ),
};

export const Truncate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`truncate` on a fixed-width column. `true` keeps a heading or a small label to one line; `truncate={2}` clamps a description to two. The clipped text is still in the DOM, so a screen reader reads all of it — pair a visual truncation with a way to see the full value when it matters.",
      },
    },
  },
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Typography variant="h4" truncate>
        Acme Retail Private Limited — Bengaluru South warehouse
      </Typography>
      <Typography variant="muted" truncate={2}>
        Webhook endpoint https://hooks.acme-retail.example/qeet/payments/v2/settlements failed three
        consecutive deliveries and was paused by qeet-pay.
      </Typography>
      <Typography variant="small" truncate>
        ses_9f3c2a71e04b4d8a7c11e0d2b5f6a903
      </Typography>
    </div>
  ),
};
