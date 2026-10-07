import { type ReactNode, useState } from "react";

/** Copy-to-clipboard helper with a short-lived "copied" flag for UI feedback. */
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    void navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    });
  };
  return { copied, copy };
}

function CopyGlyph({ copied }: { copied: boolean }) {
  return copied ? (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M5 15V5a2 2 0 0 1 2-2h10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * A labelled colour swatch driven by a CSS variable (so it reacts to theme).
 * Hovering the tile reveals a Copy button; clicking copies the token name.
 */
export function Swatch({ varName, name }: { varName: string; name: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="group flex flex-col gap-2">
      <button
        type="button"
        onClick={() => copy(varName)}
        title={`Copy ${varName}`}
        aria-label={`Copy ${varName}`}
        className="relative h-16 w-full cursor-pointer overflow-hidden rounded-lg border border-border shadow-rest transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
        style={{ background: `var(${varName})` }}
      >
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 backdrop-blur-[1px] transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-black/25 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-neutral-900 shadow-sm">
            <CopyGlyph copied={copied} />
            {copied ? "Copied" : "Copy"}
          </span>
        </span>
      </button>
      <div className="flex flex-col gap-0.5">
        <div className="text-xs font-medium leading-none">{name}</div>
        <code className="block truncate text-[10px] leading-tight text-muted-foreground">
          {varName}
        </code>
      </div>
    </div>
  );
}

/**
 * Aligned swatch grid — a fixed-column CSS grid (not flex-wrap) so every row lines
 * up cleanly, scaling to the same 11-column rhythm as the Tailwind `Ramp` rows.
 */
export function Grid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11">
      {children}
    </div>
  );
}

/**
 * A Tailwind-style colour ramp: a labelled row of swatches for one palette,
 * each driven by `var(--qx-color-<name>-<step>)` (theme-reactive) and annotated
 * with its shade number and resolved value. Each tile is copy-on-hover.
 */
export function Ramp({
  name,
  steps,
  values,
  columns,
}: {
  name: string;
  steps: Array<number | string>;
  values?: Record<string, string>;
  /**
   * Tiles per row. Defaults to 11, the Tailwind palette's step count. A ramp with a different
   * number of steps (Qeet has 13) passes its own, otherwise the last steps wrap into an orphan row
   * that reads as a second, unrelated ramp.
   */
  columns?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-sm font-medium capitalize">{name}</div>
      <div
        className="grid grid-cols-11 gap-1.5"
        style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
      >
        {steps.map((s) => {
          const value = values?.[String(s)];
          const token = `--qx-color-${name}-${s}`;
          return <RampTile key={s} token={token} step={s} value={value} />;
        })}
      </div>
    </div>
  );
}

function RampTile({
  token,
  step,
  value,
}: {
  token: string;
  step: number | string;
  value?: string;
}) {
  const { copied, copy } = useCopy();
  return (
    <div className="group/tile flex flex-col gap-1">
      <button
        type="button"
        onClick={() => copy(value ?? token)}
        title={value ? `Copy ${value}` : `Copy ${token}`}
        aria-label={value ? `Copy ${value}` : `Copy ${token}`}
        className="relative h-12 w-full cursor-pointer overflow-hidden rounded-md border border-border shadow-rest transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.94]"
        style={{ background: `var(${token})` }}
      >
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/tile:bg-black/30 group-hover/tile:opacity-100">
          <CopyGlyph copied={copied} />
        </span>
      </button>
      <div className="text-[10px] leading-tight">
        <div className="font-medium">{step}</div>
        {value ? <code className="block truncate text-muted-foreground">{value}</code> : null}
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="font-heading text-lg tracking-tight">{title}</h3>
      {children}
    </section>
  );
}

/** Page wrapper that paints the canvas + applies the DS body font. Fills the full
 * available docs width (the .sbdocs-content max-width is the real cap) so the
 * foundations pages read consistently with the rest of the docs. */
export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground flex w-full flex-col gap-10 p-8">{children}</div>
  );
}
