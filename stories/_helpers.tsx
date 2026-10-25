import { CheckIcon } from "@qeetrix/icons/icons/check";
import { type ReactNode, useState } from "react";

import "./_specimens.css";

/**
 * The specimen kit the Foundations pages are built from: swatches, ramps, labelled groups, specimen
 * rows and copyable token names. Workshop chrome, not product UI, styled in `_specimens.css` with
 * token values only. A swatch paints the CSS variable it documents, never a raw colour.
 */

/** The root of every Foundations story: full width, the body role's face and letter style. */
export function Specimen({ children }: { children: ReactNode }) {
  return <div className="qx-specimen">{children}</div>;
}

/** A labelled group inside a specimen, with an optional note on the right. */
export function Group({
  label,
  aside,
  children,
}: {
  label: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="qx-specimen-group">
      <div className="qx-specimen-group-head">
        <span className="qx-specimen-label">{label}</span>
        {aside && <span className="qx-specimen-aside">{aside}</span>}
      </div>
      {children}
    </div>
  );
}

/** Copy-to-clipboard with a short-lived "copied" flag for feedback. */
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

/** A token name that copies itself: the thing a developer came to the page for. */
export function CopyToken({ value, label }: { value: string; label?: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      className="qx-copy-token"
      data-copied={copied ? "" : undefined}
      onClick={() => copy(value)}
      title={`Copy ${value}`}
      aria-label={`Copy ${value}`}
    >
      <code>{label ?? value}</code>
      {copied && <CheckIcon size={12} aria-hidden />}
    </button>
  );
}

/**
 * One half of a tile, pinned to a colour scheme with `data-qx-color-scheme`, the attribute
 * @qeetrix/tokens scopes its colours to. A translucent token is layered over that scheme's default
 * surface, which is what it is drawn on in product.
 */
function SchemeHalf({ cssVar, scheme }: { cssVar: string; scheme?: "light" | "dark" }) {
  return (
    <span
      data-qx-color-scheme={scheme}
      className="qx-swatch-half"
      style={{
        background: `linear-gradient(var(${cssVar}), var(${cssVar})), var(--qx-color-surface-default)`,
      }}
    />
  );
}

/**
 * One colour token: the tile (split into light and dark when they differ), its name, its variable
 * and its values. Click the tile to copy the variable.
 */
export function Swatch({
  cssVar,
  name,
  light,
  dark,
}: {
  cssVar: string;
  name: string;
  /** The light value, for the label. */
  light?: string;
  /** The dark value; a different one splits the tile. */
  dark?: string;
}) {
  const { copied, copy } = useCopy();
  const split = dark !== undefined && dark !== light;
  return (
    <div className="qx-swatch">
      <button
        type="button"
        onClick={() => copy(cssVar)}
        title={`Copy ${cssVar}`}
        aria-label={`Copy ${cssVar}`}
        className="qx-swatch-tile"
      >
        {split ? (
          <>
            <SchemeHalf cssVar={cssVar} scheme="light" />
            <SchemeHalf cssVar={cssVar} scheme="dark" />
          </>
        ) : (
          <SchemeHalf cssVar={cssVar} />
        )}
      </button>
      <div className="qx-swatch-meta">
        <span className="qx-swatch-name">
          {copied ? (
            <span role="status" className="qx-swatch-copied">
              <CheckIcon size={12} aria-hidden /> Copied
            </span>
          ) : (
            name
          )}
        </span>
        <code className="qx-swatch-var">{cssVar}</code>
        {light ? (
          <code className="qx-swatch-value">{split ? `${light} · ${dark}` : light}</code>
        ) : null}
      </div>
    </div>
  );
}

/** Aligned swatch grid: as many columns as fit, each wide enough for a split tile. */
export function SwatchGrid({ children }: { children: ReactNode }) {
  return <div className="qx-swatch-grid">{children}</div>;
}

/**
 * A primitive ramp: one joined strip of steps, each with its step and hex. Primitives are absent
 * from the runtime stylesheet on purpose (they live in @qeetrix/tokens' DTCG files), so the tiles
 * paint the DTCG hex: domain data, shown as reference.
 */
export function Ramp({
  name,
  steps,
}: {
  name: string;
  steps: Array<{ step: string; hex: string }>;
}) {
  const { copy } = useCopy();
  return (
    <div
      className="qx-ramp"
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {steps.map(({ step, hex }) => (
        <div key={step} className="qx-ramp-step">
          <button
            type="button"
            onClick={() => copy(hex)}
            title={`Copy ${hex}`}
            aria-label={`Copy ${hex}, primitive.color.${name}.${step}`}
            className="qx-ramp-tile"
            style={{ background: hex }}
          />
          <span className="qx-ramp-label">{step}</span>
          <code className="qx-ramp-hex">{hex}</code>
        </div>
      ))}
    </div>
  );
}

/** Rows that pair a token with a live sample: the type scale, families, durations. */
export function SpecimenRows({ children }: { children: ReactNode }) {
  return <div className="qx-specimen-rows">{children}</div>;
}

/** One row: the token and its numbers on the left, the sample it draws on the right. */
export function SpecimenRow({
  token,
  meta,
  children,
}: {
  token: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="qx-specimen-row">
      <div className="qx-specimen-row-meta">
        <CopyToken value={token} />
        {meta && <span className="qx-specimen-row-numbers">{meta}</span>}
      </div>
      <div className="qx-specimen-row-sample">{children}</div>
    </div>
  );
}
