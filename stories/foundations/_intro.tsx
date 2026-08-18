import { Badge, Button, Input, Label, Switch } from "@qeetrix/ui";
import { IconApiKey, IconPasskey, IconTenant, IconWebhook, QeetLogo } from "@qeetrix/ui/brand";

/**
 * The Foundations → Introduction landing, authored as a real React component
 * rather than raw MDX.
 *
 * Why a component and not markdown: Storybook's autodocs runs every bare
 * markdown block through its own themed <Typography>. With `docs.theme` pinned
 * to a light base, that paints <p>/<li> text a near-black colour and forces a
 * 14px size — which (a) makes prose invisible on the dark canvas and (b) shrinks
 * any heading text MDX wraps in a <p>. Rendering our own DOM with design-system
 * tokens (`var(--foreground)` / `var(--muted-foreground)` …) sidesteps that
 * entirely: every surface follows the active theme, in both light and dark.
 *
 * All layout + responsive rules live in the scoped <style> block below, keyed on
 * `.qx-intro`, using two-class selectors so they win against Storybook's chrome.
 */
export function IntroPage() {
  return (
    <div className="qx-intro">
      <style>{styles}</style>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="qx-intro__hero">
        <span className="qx-intro__glow qx-intro__glow--a" aria-hidden />
        <span className="qx-intro__glow qx-intro__glow--b" aria-hidden />

        <div className="qx-intro__hero-inner">
          {/* meta row */}
          <div className="qx-intro__meta">
            <QeetLogo size={30} />
            <span className="qx-intro__meta-rule" aria-hidden />
            <span className="qx-intro__eyebrow">v1.0.0 · @qeetrix/ui</span>
            <span className="qx-intro__meta-spacer" />
            <Badge variant="success">WCAG-AA</Badge>
          </div>

          {/* headline */}
          <h1 className="qx-intro__display">
            <span className="qx-intro__display-a">Qeetrix</span>
            <span className="qx-intro__display-b">Design System</span>
          </h1>

          <p className="qx-intro__lead">
            One accessible, token-driven package powering every{" "}
            <strong className="qx-intro__strong">Qeet Group</strong> product — from identity to
            payments, built to last.
          </p>

          {/* CTA row */}
          <div className="qx-intro__cta-row">
            <span className="qx-intro__install">bun add @qeetrix/ui</span>
            <a className="qx-intro__cta" href="?path=/docs/primitives-button--docs">
              Browse Components
              <span className="qx-intro__cta-icon" aria-hidden>
                ↗
              </span>
            </a>
          </div>

          {/* stats */}
          <div className="qx-intro__stats">
            {STATS.map((s) => (
              <div className="qx-intro__stat" key={s.label}>
                <div
                  className="qx-intro__stat-value"
                  style={s.accent ? { color: s.accent } : undefined}
                >
                  {s.value}
                </div>
                <div className="qx-intro__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE PREVIEW ──────────────────────────────────────────────── */}
      <SectionTitle
        eyebrow="Interactive"
        title="Live preview"
        desc="Primitives rendered directly from the package. Toggle the Theme selector in the toolbar to see light and dark — exactly what your app gets at runtime."
      />

      <div className="qx-intro__panel">
        <PreviewRow label="Actions">
          <Button>Authenticate with Qeet</Button>
          <Button variant="secondary">Invite member</Button>
          <Button variant="outline">View audit log</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="destructive">Revoke key</Button>
        </PreviewRow>
        <div className="qx-intro__divider" />
        <PreviewRow label="Status">
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending verification</Badge>
          <Badge variant="destructive">Revoked</Badge>
          <Badge variant="secondary">SCIM synced</Badge>
          <Badge variant="muted">Draft</Badge>
        </PreviewRow>
        <div className="qx-intro__divider" />
        <PreviewRow label="Fields">
          <div className="qx-intro__field">
            <Label htmlFor="intro-org">Organization slug</Label>
            <Input id="intro-org" placeholder="acme-corp" defaultValue="acme-corp" />
          </div>
          <div className="qx-intro__switch">
            <Switch id="intro-mfa" defaultChecked />
            <Label htmlFor="intro-mfa">Require passkeys</Label>
          </div>
        </PreviewRow>
      </div>

      {/* ── ONE PACKAGE ───────────────────────────────────────────────── */}
      <SectionTitle
        eyebrow="Install once"
        title="One package"
        desc="Everything ships in @qeetrix/ui — components, brand and tokens. Install it once; nothing else to wire up."
      />

      <div className="qx-intro__code-grid">
        <CodeCard label="Terminal" tone="shell">
          <span className="qx-tok-dim">$</span> bun add @qeetrix/ui
        </CodeCard>
        <CodeCard label="App.tsx" tone="tsx">
          <span className="qx-tok-kw">import</span> {"{ ThemeProvider, Button }"}{" "}
          <span className="qx-tok-kw">from</span> <span className="qx-tok-str">"@qeetrix/ui"</span>
          {";\n"}
          <span className="qx-tok-kw">import</span>{" "}
          <span className="qx-tok-str">"@qeetrix/ui/styles.css"</span>;{"\n\n"}
          <span className="qx-tok-kw">export function</span> <span className="qx-tok-fn">App</span>
          () {"{"}
          {"\n  "}
          <span className="qx-tok-kw">return</span> ({"\n    "}&lt;ThemeProvider defaultTheme=
          <span className="qx-tok-str">"system"</span>&gt;
          {"\n      "}&lt;Button&gt;Authenticate with Qeet&lt;/Button&gt;
          {"\n    "}&lt;/ThemeProvider&gt;
          {"\n  "});
          {"\n"}
          {"}"}
        </CodeCard>
      </div>

      <ul className="qx-intro__box-list">
        {BOX.map((b) => (
          <li className="qx-intro__box-item" key={b.title}>
            <span className="qx-intro__box-dot" aria-hidden />
            <span>
              <strong className="qx-intro__strong">{b.title}</strong>
              {" — "}
              {b.body}
            </span>
          </li>
        ))}
      </ul>

      {/* ── PRINCIPLES ────────────────────────────────────────────────── */}
      <SectionTitle eyebrow="Foundations" title="Principles" />

      <div className="qx-intro__cards">
        {PRINCIPLES.map(({ Icon, title, body }) => (
          <article className="qx-intro__card" key={title}>
            <span className="qx-intro__card-icon">
              <Icon style={{ width: "1.125rem", height: "1.125rem" }} />
            </span>
            <div className="qx-intro__card-title">{title}</div>
            <p className="qx-intro__card-body">{body}</p>
          </article>
        ))}
      </div>

      {/* ── THEMING ───────────────────────────────────────────────────── */}
      <SectionTitle eyebrow="Light + dark" title="Theming" />
      <p className="qx-intro__prose">
        Light and dark are first-class, driven by the{" "}
        <span className="qx-intro__code-inline">.dark</span> class on the root element — the same
        strategy the Qeetrix <span className="qx-intro__code-inline">ThemeProvider</span> uses in
        production, so this workshop renders identically to your app. Colours are currently a
        neutral / greyscale ramp; the Qeet brand palette is a documented open decision (
        <span className="qx-intro__code-inline">OD-DS-03</span>) and drops in by editing only the
        primitive ramps in the token source.
      </p>

      {/* ── EXPLORE ───────────────────────────────────────────────────── */}
      <SectionTitle eyebrow="Keep going" title="Explore" />

      <div className="qx-intro__explore">
        {EXPLORE.map((e) => (
          <a className="qx-intro__tile" href={e.href} key={e.label}>
            <span className="qx-intro__tile-icon" style={{ background: e.grad }}>
              {e.icon}
            </span>
            <div>
              <div className="qx-intro__tile-title">{e.label}</div>
              <div className="qx-intro__tile-desc">{e.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── small building blocks ─────────────────────────────────────────────── */

function SectionTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <header className="qx-intro__section">
      <div className="qx-intro__section-eyebrow">{eyebrow}</div>
      <h2 className="qx-intro__section-title">{title}</h2>
      {desc ? <p className="qx-intro__section-desc">{desc}</p> : null}
    </header>
  );
}

function PreviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="qx-intro__preview-row">
      <div className="qx-intro__preview-label">{label}</div>
      <div className="qx-intro__preview-content">{children}</div>
    </div>
  );
}

function CodeCard({
  label,
  tone,
  children,
}: {
  label: string;
  tone: "shell" | "tsx";
  children: React.ReactNode;
}) {
  return (
    <figure className="qx-intro__code" data-tone={tone}>
      <figcaption className="qx-intro__code-bar">
        <span className="qx-intro__code-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="qx-intro__code-label">{label}</span>
      </figcaption>
      <pre className="qx-intro__code-pre">
        <code>{children}</code>
      </pre>
    </figure>
  );
}

/* ── content ───────────────────────────────────────────────────────────── */

const STATS: { value: string; label: string; accent?: string }[] = [
  { value: "140", label: "Components" },
  { value: "6", label: "Block patterns" },
  { value: "AA", label: "WCAG contrast", accent: "#16a34a" },
  { value: "2", label: "Color schemes" },
];

const BOX = [
  {
    title: "Components",
    body: "the ~127 React primitives you're browsing in this workshop at @qeetrix/ui.",
  },
  {
    title: "Tokens",
    body: "W3C JSON authored tokens compiled by Style Dictionary into :root / .dark runtime variables baked into @qeetrix/ui/styles.css, plus raw --qx-* exports.",
  },
  {
    title: "Brand",
    body: "the theme-adaptive Qeet logo and product icons, at @qeetrix/ui/brand.",
  },
  {
    title: "Blocks",
    body: "6 composable multi-component page patterns at @qeetrix/ui/blocks.",
  },
] as const;

const PRINCIPLES = [
  {
    Icon: IconTenant,
    title: "Token-driven",
    body: "A single source of truth. Colour, type, spacing, radius and elevation all resolve from tokens, so a change ripples to every component and app at once.",
  },
  {
    Icon: IconPasskey,
    title: "Accessible by default",
    body: "Built on Base UI primitives with correct roles, focus management and keyboard support, verified against WCAG-AA contrast — accessibility you inherit rather than retrofit.",
  },
  {
    Icon: IconApiKey,
    title: "Composable",
    body: "Small, predictable parts that snap together. The six higher-level Blocks are assembled entirely from the same primitives you use directly.",
  },
  {
    Icon: IconWebhook,
    title: "Premium by default",
    body: "Layered elevation, considered motion and light/dark parity ship in the box, so products look polished without per-screen design work.",
  },
] as const;

const EXPLORE = [
  {
    href: "?path=/docs/foundations-colors--docs",
    label: "Colors",
    desc: "Semantic + primitive ramps, theme-reactive.",
    grad: "linear-gradient(135deg,#f59e0b,#f26d0e)",
    icon: "Aa",
  },
  {
    href: "?path=/docs/foundations-typography--docs",
    label: "Typography",
    desc: "The Cal Sans type scale and weights.",
    grad: "linear-gradient(135deg,#8b5cf6,#6366f1)",
    icon: "Tt",
  },
  {
    href: "?path=/docs/foundations-spacing-radius--docs",
    label: "Spacing & Radius",
    desc: "The spacing scale and corner radii.",
    grad: "linear-gradient(135deg,#06b6d4,#0ea5e9)",
    icon: "⊞",
  },
  {
    href: "?path=/docs/primitives-button--docs",
    label: "Primitives",
    desc: "~127 building-block components.",
    grad: "linear-gradient(135deg,#10b981,#059669)",
    icon: "UI",
  },
  {
    href: "?path=/docs/blocks-dashboardshell--docs",
    label: "Blocks",
    desc: "6 composed page-level patterns.",
    grad: "linear-gradient(135deg,#f43f5e,#e11d48)",
    icon: "⊟",
  },
  {
    href: "?path=/docs/brand-logo-icons--docs",
    label: "Brand",
    desc: "The Qeet logo and product icons.",
    grad: "linear-gradient(135deg,#F26D0E,#dc2626)",
    icon: "Q",
  },
] as const;

/* ── scoped styles ─────────────────────────────────────────────────────── */

const styles = `
.qx-intro {
  --qx-brand: #F26D0E;
  max-width: 72rem;
  margin: 0 auto;
  font-family: var(--font-sans, ui-sans-serif, system-ui, sans-serif);
  color: var(--foreground);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.qx-intro *, .qx-intro *::before, .qx-intro *::after { box-sizing: border-box; }

/* HERO */
.qx-intro__hero {
  position: relative;
  overflow: hidden;
  border-radius: 1.75rem;
  border: 1px solid var(--border);
  background: var(--card);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.05), 0 12px 40px rgb(0 0 0 / 0.05);
}
.qx-intro__glow {
  position: absolute;
  border-radius: 9999px;
  pointer-events: none;
  filter: blur(80px);
}
.qx-intro__glow--a {
  right: -8rem; top: -8rem; width: 26rem; height: 26rem;
  background: var(--qx-brand); opacity: 0.10;
}
.qx-intro__glow--b {
  left: -5rem; bottom: -6rem; width: 20rem; height: 20rem;
  background: var(--qx-brand); opacity: 0.05;
}
.qx-intro__hero-inner { position: relative; z-index: 1; padding: 3rem 3.5rem; }

.qx-intro__meta { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2.5rem; }
.qx-intro__meta-rule { width: 1px; height: 20px; background: var(--border); }
.qx-intro__meta-spacer { margin-left: auto; }
.qx-intro__eyebrow {
  display: inline-flex; align-items: center;
  border-radius: 9999px; border: 1px solid var(--border);
  background: var(--muted); color: var(--muted-foreground);
  padding: 0.25rem 0.75rem;
  font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
  font-family: var(--font-mono, "Fira Code", ui-monospace, monospace);
}

.qx-intro .qx-intro__display {
  margin: 0 0 1.25rem;
  font-family: var(--font-heading, var(--font-sans));
  font-weight: 600; line-height: 1.05; letter-spacing: -0.035em;
  font-size: clamp(2.75rem, 6vw, 4.25rem);
}
.qx-intro .qx-intro__display-a, .qx-intro .qx-intro__display-b {
  display: block;
  font-family: var(--font-heading, var(--font-sans));
  font-size: clamp(2.75rem, 6vw, 4.25rem);
  font-weight: 600; line-height: 1.05; letter-spacing: -0.035em;
}
.qx-intro .qx-intro__display-a { color: var(--foreground); }
.qx-intro .qx-intro__display-b { color: var(--muted-foreground); }

.qx-intro .qx-intro__lead {
  max-width: 34rem; margin: 0 0 2.5rem;
  font-size: 1.0625rem; line-height: 1.7; color: var(--muted-foreground);
}
.qx-intro__strong { font-weight: 600; color: var(--foreground); }

.qx-intro__cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; margin-bottom: 3rem; }
.qx-intro__install {
  display: inline-flex; align-items: center;
  border-radius: 0.75rem; border: 1px solid var(--border); background: var(--muted);
  padding: 0.7rem 1.25rem; color: var(--foreground);
  font-family: var(--font-mono, "Fira Code", ui-monospace, monospace); font-size: 0.875rem;
}
.qx-intro__cta {
  display: inline-flex; align-items: center; gap: 0.625rem;
  border-radius: 0.75rem; background: var(--qx-brand); color: #fff;
  padding: 0.7rem 1.5rem; font-size: 0.875rem; font-weight: 600; text-decoration: none;
  transition: transform 0.25s cubic-bezier(0.32,0.72,0,1), box-shadow 0.25s cubic-bezier(0.32,0.72,0,1);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.15);
}
.qx-intro__cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgb(242 109 14 / 0.35); }
.qx-intro__cta:active { transform: scale(0.985); }
.qx-intro__cta-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 1.375rem; height: 1.375rem; border-radius: 9999px;
  background: rgb(255 255 255 / 0.22); font-size: 11px;
  transition: transform 0.25s cubic-bezier(0.32,0.72,0,1);
}
.qx-intro__cta:hover .qx-intro__cta-icon { transform: translate(2px, -2px); }

.qx-intro__stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
.qx-intro__stat {
  border-radius: 1rem; border: 1px solid var(--border); background: var(--background);
  padding: 1rem 1.25rem; box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
}
.qx-intro__stat-value {
  font-family: var(--font-heading, var(--font-sans));
  font-size: 1.875rem; font-weight: 600; line-height: 1; letter-spacing: -0.02em;
  color: var(--foreground); margin-bottom: 0.4rem;
}
.qx-intro__stat-label {
  font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--muted-foreground);
}

/* SECTION HEADERS */
.qx-intro__section { margin: 3.5rem 0 1.25rem; }
.qx-intro__section-eyebrow {
  font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--qx-brand); margin-bottom: 0.5rem;
  font-family: var(--font-mono, "Fira Code", ui-monospace, monospace);
}
.qx-intro .qx-intro__section-title {
  margin: 0; padding: 0; border: 0;
  font-family: var(--font-heading, var(--font-sans));
  font-size: 1.625rem; font-weight: 600; letter-spacing: -0.025em; color: var(--foreground);
}
.qx-intro .qx-intro__section-desc {
  margin: 0.75rem 0 0; max-width: 42rem;
  font-size: 0.9375rem; line-height: 1.65; color: var(--muted-foreground);
}

/* LIVE PREVIEW PANEL */
.qx-intro__panel {
  border-radius: 1.5rem; border: 1px solid var(--border); background: var(--card);
  overflow: hidden; box-shadow: 0 1px 3px rgb(0 0 0 / 0.05), 0 8px 28px rgb(0 0 0 / 0.04);
}
.qx-intro__divider { height: 1px; background: var(--border); }
.qx-intro__preview-row { padding: 1.75rem 2rem; }
.qx-intro__preview-label {
  font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--muted-foreground); margin-bottom: 0.875rem;
}
.qx-intro__preview-content { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 0.625rem; }
.qx-intro__field { display: flex; flex-direction: column; gap: 0.5rem; width: 15rem; }
.qx-intro__switch { display: flex; align-items: center; gap: 0.75rem; margin-left: 1rem; }

/* CODE CARDS */
.qx-intro__code-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
.qx-intro .qx-intro__code {
  margin: 0; border-radius: 1rem; overflow: hidden;
  background: #14130F; border: 1px solid rgb(255 255 255 / 0.08);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.2), 0 12px 32px rgb(0 0 0 / 0.12);
}
.qx-intro__code-bar {
  display: flex; align-items: center; gap: 0.625rem;
  padding: 0.7rem 1rem; background: rgb(255 255 255 / 0.03);
  border-bottom: 1px solid rgb(255 255 255 / 0.06);
}
.qx-intro__code-dots { display: inline-flex; gap: 0.375rem; }
.qx-intro__code-dots i { width: 10px; height: 10px; border-radius: 9999px; background: rgb(255 255 255 / 0.14); }
.qx-intro__code-dots i:first-child { background: #ff5f57; opacity: 0.8; }
.qx-intro__code-dots i:nth-child(2) { background: #febc2e; opacity: 0.8; }
.qx-intro__code-dots i:nth-child(3) { background: #28c840; opacity: 0.8; }
.qx-intro__code-label {
  font-size: 11px; font-weight: 500; color: rgb(255 255 255 / 0.5);
  font-family: var(--font-mono, "Fira Code", ui-monospace, monospace); letter-spacing: 0.02em;
}
.qx-intro .qx-intro__code-pre {
  margin: 0; padding: 1.25rem 1.5rem; overflow-x: auto;
  font-family: var(--font-mono, "Fira Code", ui-monospace, monospace);
  font-size: 0.8125rem; line-height: 1.7; color: #E7E4DB;
  white-space: pre; background: transparent; border: 0;
}
.qx-intro .qx-intro__code-pre code {
  font-family: var(--font-mono, "Fira Code", ui-monospace, monospace);
  background: transparent; border: 0; padding: 0; font-size: inherit; color: inherit;
}
.qx-tok-dim { color: rgb(255 255 255 / 0.4); }
.qx-tok-kw { color: #F7A76C; }
.qx-tok-str { color: #8BD4A8; }
.qx-tok-fn { color: #7CC7F5; }

/* BOX LIST */
.qx-intro__box-list { list-style: none; margin: 1.5rem 0 0; padding: 0; display: grid; gap: 0.75rem; }
.qx-intro .qx-intro__box-item {
  display: flex; gap: 0.75rem; align-items: baseline;
  font-size: 0.9375rem; line-height: 1.6; color: var(--muted-foreground);
}
.qx-intro__box-dot {
  flex: none; width: 6px; height: 6px; margin-top: 0.5rem; border-radius: 9999px;
  background: var(--qx-brand);
}

/* PRINCIPLE CARDS */
.qx-intro__cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.qx-intro__card {
  display: flex; flex-direction: column; gap: 1.25rem;
  border-radius: 1.25rem; border: 1px solid var(--border); background: var(--card);
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.05), 0 4px 14px rgb(0 0 0 / 0.03);
  transition: transform 0.25s cubic-bezier(0.32,0.72,0,1), box-shadow 0.25s cubic-bezier(0.32,0.72,0,1);
}
.qx-intro__card:hover { transform: translateY(-2px); box-shadow: 0 1px 3px rgb(0 0 0 / 0.06), 0 12px 30px rgb(0 0 0 / 0.08); }
.qx-intro__card-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 2.5rem; height: 2.5rem; border-radius: 0.75rem;
  border: 1px solid var(--border); background: var(--muted); color: var(--muted-foreground);
}
.qx-intro__card-title {
  font-family: var(--font-heading, var(--font-sans));
  font-size: 0.9375rem; font-weight: 600; color: var(--foreground);
}
.qx-intro .qx-intro__card-body { margin: -0.75rem 0 0; font-size: 0.875rem; line-height: 1.65; color: var(--muted-foreground); }

/* PROSE */
.qx-intro .qx-intro__prose { margin: 0; max-width: 46rem; font-size: 0.9375rem; line-height: 1.75; color: var(--muted-foreground); }
.qx-intro__code-inline {
  background: var(--muted); border: 1px solid var(--border); border-radius: 0.375rem;
  padding: 0.1em 0.4em; font-size: 0.82em; color: var(--foreground);
  font-family: var(--font-mono, "Fira Code", ui-monospace, monospace);
}

/* EXPLORE */
.qx-intro__explore { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.qx-intro__tile {
  display: flex; flex-direction: column; gap: 0.875rem;
  border-radius: 1.25rem; border: 1px solid var(--border); background: var(--card);
  padding: 1.25rem; text-decoration: none;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.05), 0 4px 14px rgb(0 0 0 / 0.03);
  transition: transform 0.25s cubic-bezier(0.32,0.72,0,1), box-shadow 0.25s cubic-bezier(0.32,0.72,0,1);
}
.qx-intro__tile:hover { transform: translateY(-2px); box-shadow: 0 1px 3px rgb(0 0 0 / 0.06), 0 12px 30px rgb(0 0 0 / 0.08); }
.qx-intro__tile-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 2rem; height: 2rem; border-radius: 0.625rem;
  font-size: 11px; font-weight: 700; color: #fff;
}
.qx-intro__tile-title {
  font-family: var(--font-heading, var(--font-sans));
  font-size: 0.9375rem; font-weight: 600; color: var(--foreground); margin-bottom: 0.25rem;
}
.qx-intro__tile-desc { font-size: 0.8125rem; line-height: 1.5; color: var(--muted-foreground); }

/* RESPONSIVE */
@media (max-width: 900px) {
  .qx-intro__hero-inner { padding: 2rem 1.5rem; }
  .qx-intro__stats { grid-template-columns: repeat(2, 1fr); }
  .qx-intro__cards { grid-template-columns: 1fr; }
  .qx-intro__explore { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .qx-intro .qx-intro__display { font-size: clamp(2.25rem, 12vw, 3rem); }
  .qx-intro__stats { grid-template-columns: 1fr; }
  .qx-intro__preview-row { padding: 1.25rem; }
}
`;
