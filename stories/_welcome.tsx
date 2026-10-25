import { ArrowRightIcon } from "@qeetrix/icons/icons/arrow-right";
import { ArrowUpRightIcon } from "@qeetrix/icons/icons/arrow-up-right";
import { CircleCheckIcon } from "@qeetrix/icons/icons/circle-check";
import { GaugeIcon } from "@qeetrix/icons/icons/gauge";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { LanguagesIcon } from "@qeetrix/icons/icons/languages";
import { LayoutDashboardIcon } from "@qeetrix/icons/icons/layout-dashboard";
import { PaletteIcon } from "@qeetrix/icons/icons/palette";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { ShieldCheckIcon } from "@qeetrix/icons/icons/shield-check";
import { UsersIcon } from "@qeetrix/icons/icons/users";
import {
  Avatar,
  Badge,
  type BadgeTone,
  Button,
  Checkbox,
  Heading,
  Input,
  Meter,
  Switch,
  Tab,
  Tabs,
  TabsList,
  Text,
} from "@qeetrix/react";
import { AvatarGroup, CodeBlock, CopyButton, Stat } from "@qeetrix/react/experimental";
import react from "@qeetrix/react/package.json";
import tokens from "@qeetrix/tokens/package.json";
import type { ComponentType, ReactElement, ReactNode } from "react";

import docgen from "../.storybook/docgen.json";
import "./_welcome.css";

/* ── Numbers, read from the packages rather than typed in ───────────────────────────────────── */

const COMPONENTS = docgen as Record<string, { family: string }>;
const FAMILIES = new Set(Object.values(COMPONENTS).map((c) => c.family)).size;
const EXPORTS = Object.keys(COMPONENTS).length;

/** Another page of the workshop, opened in the manager rather than inside the preview frame. */
const to = (path: string) => `/?path=${path}`;

const GITHUB = "https://github.com/qeetgroup/qeetrix-react";
const CHANGELOG = `${GITHUB}/blob/main/packages/react/CHANGELOG.md`;
const NPM = "https://www.npmjs.com/package/@qeetrix/react";
const INSTALL = "bun add @qeetrix/react @qeetrix/tokens";

/** Decorative previews are pictures, not controls: hidden from assistive technology, unreachable. */
function Picture({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={className} aria-hidden="true" inert>
      {children}
    </div>
  );
}

/* ── Hero: a Qeet ID console, drawn with the components themselves ──────────────────────────── */

const MEMBERS: { name: string; email: string; role: string; tone: BadgeTone; solid?: true }[] = [
  { name: "Priya Sharma", email: "priya@acme.in", role: "Owner", tone: "brand" },
  { name: "Rahul Verma", email: "rahul@acme.in", role: "Admin", tone: "info" },
  { name: "Ananya Iyer", email: "ananya@acme.in", role: "Member", tone: "neutral" },
  { name: "Vikram Singh", email: "vikram@acme.in", role: "Suspended", tone: "danger", solid: true },
];

function ConsolePreview() {
  return (
    <Picture className="qx-welcome-art">
      <div className="qx-welcome-window">
        <div className="qx-welcome-window-bar">
          <span className="qx-welcome-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="qx-welcome-url">console.qeet.in/users</span>
        </div>
        <div className="qx-welcome-window-body">
          <div className="qx-welcome-rail">
            <Avatar name="Acme Pvt Ltd" shape="square" size="sm" />
            <span data-active="">
              <UsersIcon size={16} />
            </span>
            <span>
              <KeyRoundIcon size={16} />
            </span>
            <span>
              <ShieldCheckIcon size={16} />
            </span>
            <span>
              <SettingsIcon size={16} />
            </span>
          </div>
          <div className="qx-welcome-main">
            <div className="qx-welcome-main-head">
              <div>
                <Text size="sm" tone="subtle">
                  Directory
                </Text>
                <Heading level={3} size="heading-sm">
                  Users
                </Heading>
              </div>
              <Button size="sm">Invite user</Button>
            </div>
            <div className="qx-welcome-main-stats">
              <Stat label="Active users" value={12480} note="+4.2% this week" tone="positive" />
              <Stat label="Passkey sign-ins" value="68%" note="+9 pts this month" tone="positive" />
            </div>
            <ul className="qx-welcome-members">
              {MEMBERS.map((member) => (
                <li key={member.email}>
                  <Avatar name={member.name} size="sm" />
                  <span className="qx-welcome-member">
                    <Text size="sm" weight="medium">
                      {member.name}
                    </Text>
                    <Text size="sm" tone="subtle">
                      {member.email}
                    </Text>
                  </span>
                  <Badge tone={member.tone} variant={member.solid ? "solid" : "subtle"}>
                    {member.role}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="qx-welcome-float qx-welcome-float-toast">
        <CircleCheckIcon size={20} className="qx-welcome-float-icon" />
        <span>
          <Text size="sm" weight="semibold">
            Passkey added
          </Text>
          <Text size="sm" tone="subtle">
            Priya's MacBook Pro
          </Text>
        </span>
      </div>

      <div className="qx-welcome-float qx-welcome-float-policy">
        <Switch label="Require passkeys" defaultChecked />
        <Meter label="Adoption" value={68} showValue tone="brand" />
      </div>
    </Picture>
  );
}

/* ── Sections ────────────────────────────────────────────────────────────────────────────────── */

const STATS = [
  [String(FAMILIES), "component families"],
  [String(EXPORTS), "exported components"],
  ["AA", "contrast, checked on every story"],
  ["2", "languages built in: English, Hindi"],
] as const;

interface Destination {
  title: string;
  text: string;
  path: string;
  art: ReactNode;
}

const EXPLORE: Destination[] = [
  {
    title: "Getting started",
    text: "Install, load the styles, wrap the app.",
    path: "/docs/guides-getting-started--docs",
    art: <CodeBlock language="tsx" code={`<QeetrixProvider>\n  <App />\n</QeetrixProvider>`} />,
  },
  {
    title: "Foundations",
    text: "Colour, type, spacing, elevation and motion.",
    path: "/docs/foundations-colour--docs",
    art: (
      <div className="qx-welcome-specimen">
        <span className="qx-welcome-specimen-type">Aa</span>
        <span className="qx-welcome-swatches">
          {["brand", "info", "success", "warning", "danger", "neutral"].map((tone) => (
            <i key={tone} data-tone={tone} />
          ))}
        </span>
      </div>
    ),
  },
  {
    title: "Components",
    text: `${FAMILIES} families, each with live examples and props.`,
    path: "/docs/components-overview--docs",
    art: (
      <div className="qx-welcome-cluster">
        <Button size="sm">Save changes</Button>
        <Switch label="Alerts" defaultChecked />
        <Checkbox label="Email" defaultChecked />
        <AvatarGroup
          size="sm"
          people={[{ name: "Priya Sharma" }, { name: "Rahul Verma" }, { name: "Ananya Iyer" }]}
          total={12}
          max={3}
        />
      </div>
    ),
  },
  {
    title: "Patterns",
    text: "Qeet ID console screens, composed end to end.",
    path: "/docs/patterns-sign-in--docs",
    art: (
      <div className="qx-welcome-signin">
        <Heading level={3} size="title-md">
          Sign in to Acme
        </Heading>
        <Input placeholder="priya@acme.in" aria-label="Email" />
        <Button size="sm" icon={KeyRoundIcon} fullWidth>
          Continue with passkey
        </Button>
      </div>
    ),
  },
];

const NEW_IN_RELEASE: Destination[] = [
  {
    title: "Square avatars",
    text: "Avatar",
    path: "/docs/components-media-avatar--docs",
    art: (
      <span className="qx-welcome-row">
        <Avatar name="Priya Sharma" size="lg" />
        <Avatar name="Acme Pvt Ltd" shape="square" size="lg" />
        <Avatar name="Qeet Pay" shape="square" size="lg" />
      </span>
    ),
  },
  {
    title: "Solid badges",
    text: "Badge",
    path: "/docs/components-data-display-badge--docs",
    art: (
      <span className="qx-welcome-row">
        <Badge variant="solid" tone="success">
          Active
        </Badge>
        <Badge variant="solid" tone="warning">
          Pending
        </Badge>
        <Badge variant="solid" tone="danger">
          Suspended
        </Badge>
      </span>
    ),
  },
  {
    title: "Contained tabs",
    text: "Tabs",
    path: "/docs/components-navigation-tabs--docs",
    art: (
      <Tabs defaultValue="members">
        <TabsList variant="contained">
          <Tab value="members" badge={24}>
            Members
          </Tab>
          <Tab value="groups">Groups</Tab>
        </TabsList>
      </Tabs>
    ),
  },
  {
    title: "Meter tones",
    text: "Meter",
    path: "/docs/components-data-display-meter--docs",
    art: (
      <span className="qx-welcome-meters">
        <Meter label="Seats" value={72} tone="info" showValue />
        <Meter label="Storage" value={41} tone="neutral" showValue />
      </span>
    ),
  },
];

const PRINCIPLES: [ComponentType<{ size?: number }>, string, string][] = [
  [
    ShieldCheckIcon,
    "Accessible by default",
    "WAI-ARIA patterns from Base UI. Every story passes axe.",
  ],
  [
    PaletteIcon,
    "Tokens, never raw values",
    "Light and dark, three densities, one source of truth.",
  ],
  [
    LanguagesIcon,
    "Made for India",
    "Hindi built in. ₹, lakh and dates format for en-IN and hi-IN.",
  ],
  [GaugeIcon, "Dense when it should be", "Consoles run compact; forms breathe at comfortable."],
];

/** A card that's one link: a picture of where it goes, its name and a line about it. */
function DestinationCard({ item, compact }: { item: Destination; compact?: boolean }) {
  return (
    <a
      className="qx-welcome-card"
      data-compact={compact ? "" : undefined}
      href={to(item.path)}
      target="_top"
    >
      <Picture className="qx-welcome-card-art">{item.art}</Picture>
      <span className="qx-welcome-card-copy">
        <span className="qx-welcome-card-title">
          <Text weight="semibold">{item.title}</Text>
          <ArrowRightIcon size={16} className="qx-welcome-card-arrow" aria-hidden />
        </span>
        <Text size="sm" tone="subtle">
          {item.text}
        </Text>
      </span>
    </a>
  );
}

function SectionHead({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="qx-welcome-section-head">
      <Heading level={2} size="heading-sm">
        {title}
      </Heading>
      {action}
    </div>
  );
}

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** The workshop's front page (welcome.mdx). */
export function Welcome(): ReactElement {
  return (
    <div className="qx-welcome">
      <section className="qx-welcome-hero">
        <div className="qx-welcome-hero-copy">
          <a className="qx-welcome-pill" href={CHANGELOG} {...external}>
            <Badge variant="solid" tone="brand" size="sm">
              New
            </Badge>
            <span>@qeetrix/react {react.version} is out</span>
            <ArrowRightIcon size={14} aria-hidden />
          </a>
          <Heading level={1} size="display-lg" className="qx-welcome-title">
            One system.
            <br />
            Every Qeet product.
          </Heading>
          <Text size="lg" tone="subtle" className="qx-welcome-lede">
            Accessible React components, design tokens and console patterns. Built for India, ready
            for the enterprise.
          </Text>
          <div className="qx-welcome-actions">
            <a
              className="qx-welcome-cta"
              href={to("/docs/guides-getting-started--docs")}
              target="_top"
            >
              Get started
              <ArrowRightIcon size={16} aria-hidden />
            </a>
            <a
              className="qx-welcome-cta"
              data-variant="soft"
              href={to("/docs/components-overview--docs")}
              target="_top"
            >
              <LayoutDashboardIcon size={16} aria-hidden />
              Browse components
            </a>
          </div>
          <div className="qx-welcome-install">
            <span className="qx-welcome-install-prompt" aria-hidden="true">
              $
            </span>
            <code>{INSTALL}</code>
            <CopyButton value={INSTALL} label="Copy install command" />
          </div>
        </div>
        <ConsolePreview />
      </section>

      <dl className="qx-welcome-stats">
        {STATS.map(([value, label]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <section className="qx-welcome-section">
        <SectionHead title="Explore" />
        <div className="qx-welcome-grid">
          {EXPLORE.map((item) => (
            <DestinationCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="qx-welcome-section">
        <SectionHead
          title={`New in ${react.version}`}
          action={
            <a className="qx-welcome-link" href={CHANGELOG} {...external}>
              Changelog
              <ArrowUpRightIcon size={14} aria-hidden />
            </a>
          }
        />
        <div className="qx-welcome-grid">
          {NEW_IN_RELEASE.map((item) => (
            <DestinationCard key={item.title} item={item} compact />
          ))}
        </div>
      </section>

      <section className="qx-welcome-section">
        <SectionHead title="Principles" />
        <ul className="qx-welcome-principles">
          {PRINCIPLES.map(([Icon, title, text]) => (
            <li key={title}>
              <span className="qx-welcome-principle-icon" aria-hidden="true">
                <Icon size={20} />
              </span>
              <Text weight="semibold">{title}</Text>
              <Text size="sm" tone="subtle">
                {text}
              </Text>
            </li>
          ))}
        </ul>
      </section>

      <footer className="qx-welcome-footer">
        <Text size="sm" tone="subtle">
          @qeetrix/react {react.version} · @qeetrix/tokens {tokens.version} · rendered from npm
        </Text>
        <nav aria-label="Qeetrix links">
          <a className="qx-welcome-link" href={GITHUB} {...external}>
            GitHub
          </a>
          <a className="qx-welcome-link" href={NPM} {...external}>
            npm
          </a>
          <a className="qx-welcome-link" href={CHANGELOG} {...external}>
            Changelog
          </a>
          <a className="qx-welcome-link" href="https://qeet.in" {...external}>
            qeet.in
          </a>
        </nav>
      </footer>
    </div>
  );
}
