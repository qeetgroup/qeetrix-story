/**
 * The Qeetrix story contract.
 *
 * Every component story declares this block so that tooling — not a human reading
 * 147 files — can answer questions about the library:
 *
 *     parameters: {
 *       qeetrix: qx({ category: "actions", status: "stable" }),
 *     }
 *
 * `bun run verify:stories` validates it statically and fails the build if a story
 * is missing the block or uses a value outside the vocabularies below.
 *
 * ## Why a helper function instead of a type on `parameters`
 *
 * Storybook types `parameters` as `{ [name: string]: any }`, so annotating it buys
 * no checking at all — a typo like `catgory` would compile fine. Passing the object
 * through `qx()` is what makes TypeScript check it at the point of authorship.
 *
 * ## Declared vs measured — the rule that keeps this honest
 *
 * This block holds only what a human *decides*. It never holds what a tool can
 * *measure*: whether a story has an interaction test, whether it passes axe, whether
 * it has a visual baseline. Those are derived at verify time, so they cannot drift
 * out of date the moment someone fixes a component.
 *
 * ## Extending this contract
 *
 * Fields are added by the item that makes them true, never speculatively. Reserved
 * for later work, deliberately absent until something actually verifies them:
 *
 *   - `rtl`, `darkMode`, `responsive` — added once those test matrices exist.
 *   - `accessibility` — an audited grade (e.g. "AA"). Note this is NOT "axe passes";
 *     axe catches a minority of WCAG failures, so a clean run is not a grade.
 *   - `visualCriticality` — "critical" | "standard" | "low", added by the visual
 *     regression tiering work, which uses it to decide snapshot coverage.
 *   - `since` / `deprecatedSince` — added with per-component release metadata.
 *
 * If you need one of these before its item lands, add it here first so there is one
 * contract rather than two competing conventions.
 */

/**
 * Where a component belongs in the library. Mirrors the target sidebar taxonomy, so
 * these values can later drive the folder structure rather than being re-derived.
 *
 * `data-entry` is for controls that take user input; `data-display` is for
 * presenting values back. `advanced` is for composed, application-level components
 * (rich text editors, schedulers, org charts) that are not primitives in any real
 * sense — keeping them out of the other buckets stops those buckets becoming
 * meaningless.
 */
export type QeetrixCategory =
  | "actions"
  | "forms"
  | "data-entry"
  | "data-display"
  | "navigation"
  | "feedback"
  | "overlays"
  | "layout"
  | "typography"
  | "media"
  | "advanced"
  | "utilities";

/**
 * Lifecycle stage. The intended progression is:
 *
 *     experimental → beta → stable → deprecated → (removed)
 *
 * `internal` sits outside that flow: shipped, supported, but not part of the public
 * API contract — consumers should not reach for it directly.
 */
export type QeetrixStatus = "experimental" | "beta" | "stable" | "deprecated" | "internal";

export interface QeetrixMeta {
  category: QeetrixCategory;
  status: QeetrixStatus;
}

/**
 * Identity function. Exists purely so TypeScript type-checks the contract block at
 * the call site — see the note above about `parameters` being untyped.
 */
export const qx = (meta: QeetrixMeta): QeetrixMeta => meta;
