/**
 * Shared building blocks for the Foundations pages.
 *
 * `stories/_helpers.tsx` owns the swatch/ramp/grid vocabulary the colour and spacing pages are
 * built from; this module adds the pieces the token-reference pages need — inline code inside
 * prose, and a table that renders a token family with its live value. Kept next to the pages
 * that use it (and underscore-prefixed, like `_intro.tsx`) so Storybook's `*.stories.@(ts|tsx)`
 * glob never picks it up as a story.
 */
import type { ReactNode } from "react";

/** Inline code inside JSX prose. Markdown backticks only work in `docs.description`. */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground">
      {children}
    </code>
  );
}

/** A paragraph of guidance, capped at a readable measure. */
export function Prose({ children }: { children: ReactNode }) {
  return <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{children}</p>;
}

/** A bordered aside for a rule that is easy to get wrong. */
export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="max-w-3xl rounded-lg border border-border bg-muted/40 p-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export interface TokenRow {
  /** The token or utility name — rendered as the row header. */
  token: string;
  /** One cell per column after the first. */
  cells: ReactNode[];
}

/**
 * A token family as a table: row header is the token, remaining columns are whatever the
 * page needs (value, variable, what it aliases). `caption` names the family for screen
 * readers, so every table on a page is distinguishable.
 */
export function TokenTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: TokenRow[];
}) {
  return (
    <table className="w-full border-collapse text-left align-top text-xs">
      <caption className="pb-2 text-left text-xs text-muted-foreground">{caption}</caption>
      <thead>
        <tr className="border-b border-border">
          {columns.map((column) => (
            <th key={column} scope="col" className="py-2 pe-4 font-medium text-muted-foreground">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.token} className="border-b border-border last:border-b-0">
            <th scope="row" className="py-2 pe-4 font-mono font-medium">
              {row.token}
            </th>
            {row.cells.map((cell, index) => (
              <td
                key={`${row.token}:${columns[index + 1] ?? index}`}
                className="py-2 pe-4 font-mono text-muted-foreground"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
