import {
  Button,
  Field,
  FieldControl,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Form,
  FormActions,
  Input,
  NativeSelect,
  Separator,
  Switch,
  Textarea,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect } from "storybook/test";
import { qx } from "../_contract";

/**
 * One form, three widths. The reflow is driven by container queries rather than
 * viewport media queries, so the same markup behaves correctly in a drawer, a
 * split pane and a full page.
 */
const meta: Meta = {
  title: "Recipes/ResponsiveForm",
  parameters: {
    qeetrix: qx({ category: "forms", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component: [
          "A Qeet Pay **GST invoice settings** form that survives the whole range from a 390 px phone",
          "to a 1440 px desktop — which mostly means resisting the temptation to use all 1440 px.",
          "",
          "Four decisions do all the work:",
          "",
          "1. **Cap the measure.** The form stops growing at ~48 rem and centres. A 1440 px-wide text",
          "   input is harder to use than a 400 px one, and a label 1,200 px from its control is worse",
          "   still.",
          "2. **Reflow on the container, not the viewport.** The grid uses `@container` + `@md:`, so the",
          "   same form is correct in a page, in a `Drawer`, and in a split pane — none of which know",
          "   the viewport width. This is the single most common responsive-form bug: a form that",
          "   reflows at 768 px of *screen* while sitting in a 380 px *panel*.",
          "3. **Group by field width, not by row.** Short, fixed-shape values (GSTIN, PAN, invoice",
          "   prefix) pair up at wider containers; long free text (legal name, address) always spans",
          "   the full width. Never split a 15-character code across two columns to fill a row.",
          "4. **Never reorder.** Columns change; tab order does not. If the visual order at 1440 px",
          "   differs from the DOM order, keyboard and screen-reader users get a different form from",
          "   everyone else.",
          "",
          "**Accessibility.** Every control is wired through `Field` + `FieldControl`, so labels,",
          "descriptions and `aria-describedby` are generated rather than hand-maintained, and the ids",
          "are unique per instance — which is why the side-by-side story below can render three copies",
          "of this form without colliding.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const STATES = [
  "Karnataka (29)",
  "Maharashtra (27)",
  "Tamil Nadu (33)",
  "Telangana (36)",
  "Delhi (07)",
];

/**
 * The recipe itself. `@container/form` + `@md/form:` variants mean the reflow point
 * is this component's own width — drop it in a drawer and it still does the right thing.
 */
function GstInvoiceSettings() {
  return (
    <div className="@container/form w-full">
      <Form className="mx-auto w-full max-w-3xl" onSubmit={(event) => event.preventDefault()}>
        <FieldSet>
          <FieldLegend variant="label">Registered business</FieldLegend>
          <FieldDescription>
            Printed on every GST invoice Qeet Pay issues for this workspace.
          </FieldDescription>
          <FieldGroup className="grid gap-4 @md/form:grid-cols-2">
            <Field className="@md/form:col-span-2">
              <FieldLabel>Registered legal name</FieldLabel>
              <FieldControl render={<Input defaultValue="Ravi Textiles Private Limited" />} />
              <FieldDescription>Exactly as printed on the GST certificate.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel>GSTIN</FieldLabel>
              <FieldControl
                render={
                  <Input
                    defaultValue="29AABCU9603R1ZJ"
                    autoComplete="off"
                    className="font-mono uppercase"
                  />
                }
              />
              <FieldDescription>15 characters.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel>PAN</FieldLabel>
              <FieldControl
                render={
                  <Input
                    defaultValue="AABCU9603R"
                    autoComplete="off"
                    className="font-mono uppercase"
                  />
                }
              />
              <FieldDescription>10 characters.</FieldDescription>
            </Field>

            <Field className="@md/form:col-span-2">
              <FieldLabel>Registered address</FieldLabel>
              <FieldControl
                render={
                  <Textarea
                    rows={3}
                    defaultValue={"14/2 Hosur Road\nElectronic City Phase 1\nBengaluru 560100"}
                  />
                }
              />
              <FieldDescription>
                Free text stays full width at every container size — two columns would only shorten
                the lines.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>

        <Separator />

        <FieldSet>
          <FieldLegend variant="label">Invoice numbering</FieldLegend>
          <FieldGroup className="grid gap-4 @md/form:grid-cols-2">
            <Field>
              <FieldLabel>Place of supply</FieldLabel>
              <FieldControl
                render={
                  <NativeSelect defaultValue="Karnataka (29)">
                    {STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </NativeSelect>
                }
              />
              <FieldDescription>Determines CGST/SGST vs. IGST.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Invoice prefix</FieldLabel>
              <FieldControl render={<Input defaultValue="QP-2026-" className="font-mono" />} />
              <FieldDescription>Short, fixed shape — pairs up at wider widths.</FieldDescription>
            </Field>

            <Field orientation="responsive" className="@md/form:col-span-2">
              <FieldLabel>Round invoice totals to the nearest rupee</FieldLabel>
              <FieldControl render={<Switch defaultChecked />} />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FormActions>
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Save settings</Button>
        </FormActions>
      </Form>
    </div>
  );
}

/** A labelled fixed-width viewport stand-in, so the reflow is visible without a device. */
function Frame({ width, label, children }: { width: number; label: string; children: ReactNode }) {
  return (
    <figure className="m-0 flex max-w-full flex-col gap-2">
      <figcaption className="text-xs font-medium text-muted-foreground">{label}</figcaption>
      <div
        style={{ width: `${width}px` }}
        className="max-w-full overflow-hidden rounded-xl border bg-background p-4"
      >
        {children}
      </div>
    </figure>
  );
}

function SettingsToggles() {
  return (
    <Form onSubmit={(event) => event.preventDefault()}>
      <FieldGroup>
        <Field orientation="responsive">
          <FieldLabel>Email a copy of every invoice</FieldLabel>
          <FieldControl render={<Switch defaultChecked />} />
        </Field>
        <Field orientation="responsive">
          <FieldLabel>Attach the GST summary PDF</FieldLabel>
          <FieldControl render={<Switch />} />
        </Field>
        <Field orientation="responsive">
          <FieldLabel>Reply-to address</FieldLabel>
          <FieldControl render={<Input type="email" defaultValue="billing@ravitextiles.in" />} />
        </Field>
      </FieldGroup>
    </Form>
  );
}

export const Narrow: Story = {
  name: "390 px — phone",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this layout when** the container is under ~28 rem (448 px). Everything is one",
          "column, every control is full width, and the labels sit above their controls — at this width",
          "a label beside a control leaves neither enough room.",
          "",
          "What is deliberately *not* happening here: no fields are hidden, no sections are collapsed",
          "behind an accordion, and no labels have been shortened to fit. A narrow form is a longer",
          "form, and that is fine — scrolling is cheap, hunting for a field you were told about is not.",
          "",
          "**Do not** shrink the controls to squeeze two per row. Touch targets stay at the full",
          "control height; a 44 px target that needs a scroll beats a 28 px one that does not.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <Frame width={390} label="390 px — iPhone-class viewport, single column">
      <GstInvoiceSettings />
    </Frame>
  ),
};

export const Tablet: Story = {
  name: "768 px — tablet",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this layout when** the container clears ~28 rem. The short, fixed-shape fields",
          "pair up — GSTIN beside PAN, place of supply beside invoice prefix — while the legal name and",
          "the address keep the full width because their content is long and variable.",
          "",
          "This is the width where the `@md/form:col-span-2` decisions pay off. Pairing is chosen per",
          "field from the *shape of the value*, not by filling rows in order. A two-column grid that",
          "puts a 10-character PAN next to a three-line address looks tidy in a mock-up and wrong in",
          "production, where the address is five lines for half your customers.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <Frame width={768} label="768 px — two columns for short fields">
      <GstInvoiceSettings />
    </Frame>
  ),
  // Proves the Field wiring rather than the layout: every control — including the
  // composite ones — is reachable by its visible label, which is the property that
  // silently breaks when someone swaps FieldControl for a bare component.
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: /Registered legal name/ })).toBeVisible();
    await expect(canvas.getByRole("combobox", { name: /Place of supply/ })).toBeVisible();
    await expect(
      canvas.getByRole("switch", { name: /Round invoice totals to the nearest rupee/ }),
    ).toBeVisible();
  },
};

export const Wide: Story = {
  name: "1440 px — desktop",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this layout when** you have more width than the form needs — which, on a",
          "desktop console, is always. Note what does **not** happen: the form does not become three",
          "columns and does not stretch across the viewport. It caps at `max-w-3xl` and centres, so the",
          "line length stays readable and the eye does not travel from a label on the far left to a",
          "control on the far right.",
          "",
          "The extra width is better spent on the page around the form — a summary rail, a preview of",
          "the invoice this configures, contextual help — than on the form itself.",
          "",
          "**One caveat visible here.** `FormActions` reflows on the *viewport* (`sm:`), while the",
          "field grid reflows on the *container* (`@md:`). On a real page those agree; inside a narrow",
          "panel on a wide screen they do not, and the action row will sit in a row while the fields",
          "are stacked. If that matters for your surface, lay the actions out yourself with the same",
          "container-query variants the grid uses.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <Frame width={1440} label="1440 px — capped and centred, not stretched">
      <GstInvoiceSettings />
    </Frame>
  ),
};

export const AcrossWidths: Story = {
  name: "390 → 768 → 1440",
  parameters: {
    docs: {
      description: {
        story: [
          "The same component three times, at three widths, with nothing swapped out. Reading down the",
          "column, exactly three things change:",
          "",
          "1. one column becomes two, for the short fields only;",
          '2. the switch row moves its label beside the control (`Field orientation="responsive"`);',
          "3. the form stops growing at 48 rem and centres.",
          "",
          "Nothing is hidden, nothing is reordered, and the DOM is identical in all three — which is",
          "what makes the keyboard path identical too. If you cannot describe your responsive form's",
          "changes in a list this short, it is probably three forms wearing a trench coat.",
          "",
          "Each frame renders its own instance, and every id in the form is generated by `Field`, so",
          "three copies on one page produce zero duplicate ids — worth knowing before you hand-write",
          '`id="gstin"` on a component that might render twice.',
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Frame width={390} label="390 px — single column, labels above">
        <GstInvoiceSettings />
      </Frame>
      <Frame width={768} label="768 px — short fields pair up">
        <GstInvoiceSettings />
      </Frame>
      <Frame width={1440} label="1440 px — capped at 48 rem and centred">
        <GstInvoiceSettings />
      </Frame>
    </div>
  ),
};

export const LabelPlacement: Story = {
  name: 'Label placement — orientation="responsive"',
  parameters: {
    docs: {
      description: {
        story: [
          "`Field` ships three orientations, and the choice is a real one rather than a style",
          "preference:",
          "",
          "- **`vertical`** (default) — label above control. Correct for anything the user types.",
          "  Longest label and longest control both get the full width.",
          "- **`horizontal`** — label beside control. Correct for switches and checkboxes, where the",
          "  control is small and fixed and a full-width row above it wastes a line.",
          "- **`responsive`** — vertical until the containing `FieldGroup` clears ~28 rem, then",
          "  horizontal. This is the one to reach for in settings forms.",
          "",
          "**Do not use horizontal for text inputs with long labels.** “Registered legal name as",
          "printed on the GST certificate” beside a text field either wraps to three lines or forces",
          "the control into a strip too narrow to read what you typed.",
          "",
          "Both frames below render the same three fields; only the container width differs.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Frame width={390} label="390 px — responsive orientation stays vertical">
        <SettingsToggles />
      </Frame>
      <Frame width={768} label="768 px — the same markup goes horizontal">
        <SettingsToggles />
      </Frame>
    </div>
  ),
};
