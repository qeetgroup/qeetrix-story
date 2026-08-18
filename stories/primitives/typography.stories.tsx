import { Prose, Typography } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Typography> = {
  title: "Primitives/Typography",
  component: Typography,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Consistent text styling for discrete pieces of copy — headings, lead paragraphs, blockquotes, inline code, and muted captions. Use `variant` to pick the right semantic element and visual weight; switch to `Prose` when rendering long-form MDX or rich-text output (e.g. qeet-docs articles).",
      },
    },
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
