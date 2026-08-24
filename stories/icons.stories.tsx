import * as Icons from "@qeetrix/icons";
import type { IconMetadata, QeetrixIconProps } from "@qeetrix/icons";
import { icons } from "@qeetrix/icons/metadata";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useState } from "react";

type Variant = "outline" | "solid";
type IconComponent = ComponentType<QeetrixIconProps & { variant?: Variant }>;

const meta: Meta = {
  title: "Icons/All Icons",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The complete Qeetrix icon library — 1 166 icons across 20 categories, each available in `outline` (default) and `solid` variants. Import any icon directly: `import { Add } from '@qeetrix/icons'`. Click a tile to copy its import statement.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

// ── helpers ──────────────────────────────────────────────────────────────────

function useCopy() {
  const [copiedName, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    void navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1400);
    });
  };
  return { copiedName, copy };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── IconTile ──────────────────────────────────────────────────────────────────

function IconTile({
  name,
  component,
  variant,
  size,
  onCopy,
  copied,
}: {
  name: string;
  component: string;
  variant: Variant;
  size: number;
  onCopy: (text: string, key: string) => void;
  copied: boolean;
}) {
  const Comp = (Icons as unknown as Record<string, IconComponent>)[component];
  if (!Comp) return null;

  const importStatement = `import { ${component} } from '@qeetrix/icons';`;

  return (
    <button
      type="button"
      title={`${component}\nClick to copy import`}
      aria-label={`Copy import for ${component}`}
      onClick={() => onCopy(importStatement, name)}
      className="group relative flex flex-col items-center gap-2 rounded-xl border border-transparent p-3 text-center transition-all duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-border hover:bg-muted/60 active:scale-[0.96]"
    >
      {/* copy flash overlay */}
      {copied && (
        <span className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-primary/10">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="text-primary"
          >
            <path
              d="M20 6 9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}

      <span className="flex h-10 w-10 items-center justify-center text-foreground">
        <Comp size={size} variant={variant} />
      </span>
      <span className="w-full truncate text-[10px] leading-tight text-muted-foreground">
        {name}
      </span>
    </button>
  );
}

// ── AllIcons render ───────────────────────────────────────────────────────────

function AllIconsPage() {
  const [query, setQuery] = useState("");
  const [variant, setVariant] = useState<Variant>("outline");
  const [size, setSize] = useState(24);
  const { copiedName, copy } = useCopy();

  const q = query.trim().toLowerCase();

  const filtered = q
    ? icons.filter(
        (ic) =>
          ic.name.includes(q) ||
          ic.component.toLowerCase().includes(q) ||
          ic.category.includes(q) ||
          ic.tags.some((t) => t.includes(q)) ||
          ic.aliases.some((a) => a.includes(q)),
      )
    : icons;

  // group by category
  const grouped = new Map<string, IconMetadata[]>();
  for (const ic of filtered) {
    const list = grouped.get(ic.category) ?? [];
    list.push(ic);
    grouped.set(ic.category, list);
  }
  const categories = [...grouped.keys()].sort();

  return (
    <div className="bg-background text-foreground min-h-screen w-full">
      {/* ── toolbar ── */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3 px-6 py-3">
          <div className="relative flex-1 min-w-50">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="m21 21-4.35-4.35"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              placeholder="Search icons…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 w-full rounded-lg border border-border bg-muted pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* variant toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden text-sm">
            {(["outline", "solid"] as Variant[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariant(v)}
                className={`px-3 py-1 capitalize transition-colors ${
                  variant === v
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* size selector */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Size</span>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="h-8 rounded-lg border border-border bg-muted px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[16, 20, 24, 32, 40, 48].map((s) => (
                <option key={s} value={s}>
                  {s}px
                </option>
              ))}
            </select>
          </div>

          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {filtered.length} of {icons.length}
          </span>
        </div>
      </div>

      {/* ── content ── */}
      <div className="flex flex-col gap-10 px-6 py-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-20 text-muted-foreground">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="opacity-40"
            >
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.4" />
              <path
                d="m21 21-4.35-4.35"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-sm">No icons match &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          categories.map((cat) => {
            const items = grouped.get(cat)!;
            return (
              <section key={cat} className="flex flex-col gap-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-heading text-base font-semibold tracking-tight">
                    {capitalize(cat)}
                  </h3>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {items.length}
                  </span>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-1">
                  {items.map((ic) => (
                    <IconTile
                      key={ic.name}
                      name={ic.name}
                      component={ic.component}
                      variant={variant}
                      size={size}
                      onCopy={copy}
                      copied={copiedName === ic.name}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

export const AllIcons: Story = {
  name: "All Icons",
  render: () => <AllIconsPage />,
};
