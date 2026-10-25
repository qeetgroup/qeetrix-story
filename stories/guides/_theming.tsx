import { ArrowRightIcon } from "@qeetrix/icons/icons/arrow-right";
import { Badge, Button, Link, Switch, Text, TextField, Toggle, ToggleGroup } from "@qeetrix/react";
import { Breadcrumb, BreadcrumbItem, CodeBlock } from "@qeetrix/react/experimental";
import { brandTheme } from "@qeetrix/tokens";
import { type CSSProperties, type ReactElement, type ReactNode, useMemo, useState } from "react";

import { Demo, Guide, GuideHeader, Next, Section } from "./_guide";

type Scheme = "light" | "dark";
type Density = "compact" | "default" | "comfortable";

/** One small console form: enough parts to see what each setting changes. */
function InviteForm({ label }: { label?: string }) {
  return (
    <>
      {label && (
        <Text size="sm" weight="semibold" tone="subtle" className="qx-guide-pane-label">
          {label}
        </Text>
      )}
      <TextField label="Work email" defaultValue="rahul@acme.in" />
      <Switch label="Send a welcome email" defaultChecked />
      <div className="qx-guide-row">
        <Button>Send invite</Button>
        <Badge tone="brand">Admin</Badge>
      </div>
    </>
  );
}

/** A preview pane with its own scheme, density, direction or brand, as an app would set them. */
function Pane({
  scheme,
  density,
  dir,
  style,
  children,
}: {
  scheme?: Scheme;
  density?: Density;
  dir?: "ltr" | "rtl";
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className="qx-guide-pane"
      data-qx-color-scheme={scheme}
      data-qx-density={density}
      dir={dir}
      style={style}
    >
      {children}
    </div>
  );
}

const SCHEME_CODE = `import { QeetrixProvider, useColorScheme } from "@qeetrix/react";

<QeetrixProvider defaultColorScheme="system">{app}</QeetrixProvider>

// Anywhere below it:
const { resolvedColorScheme, setColorScheme } = useColorScheme();`;

const DIRECTION_CODE = `<html dir="rtl">
  <QeetrixProvider locale="ur-IN" direction="rtl">{app}</QeetrixProvider>
</html>`;

/** Brand colours a tenant might bring: domain data, shown as they are. */
const PRESETS = [
  { name: "Qeet Ember", hex: "#e8590c" },
  { name: "Blue", hex: "#1a73e8" },
  { name: "Teal", hex: "#0f766e" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Rose", hex: "#be123c" },
];

const brandCode = (hex: string) => `import { brandTheme } from "@qeetrix/tokens";

const { light, dark } = brandTheme("${hex}");
const css = (vars: Record<string, string>) =>
  Object.entries(vars).map(([name, value]) => \`\${name}: \${value};\`).join(" ");

const style = \`
  :root, [data-qx-color-scheme="light"] { \${css(light)} }
  [data-qx-color-scheme="dark"] { \${css(dark)} }
\`;`;

function DensityDemo() {
  const [density, setDensity] = useState<Density>("compact");
  return (
    <Demo
      toolbar={
        <ToggleGroup
          aria-label="Density"
          size="sm"
          value={[density]}
          onValueChange={(next) => next[0] && setDensity(next[0] as Density)}
        >
          <Toggle value="compact">Compact</Toggle>
          <Toggle value="default">Default</Toggle>
          <Toggle value="comfortable">Comfortable</Toggle>
        </ToggleGroup>
      }
      stage={
        <Pane density={density}>
          <InviteForm />
        </Pane>
      }
      code={<CodeBlock language="html" code={`<main data-qx-density="${density}">…</main>`} />}
    />
  );
}

function BrandDemo() {
  const [hex, setHex] = useState(PRESETS[1]?.hex ?? "#1a73e8");
  const theme = useMemo(() => brandTheme(hex), [hex]);
  return (
    <Demo
      toolbar={
        <div className="qx-guide-swatches">
          {PRESETS.map((preset) => (
            <button
              key={preset.hex}
              type="button"
              className="qx-guide-swatch"
              // A tenant's colour, shown as it is: the swatch is the data.
              style={{ background: preset.hex }}
              aria-label={preset.name}
              aria-pressed={hex === preset.hex}
              onClick={() => setHex(preset.hex)}
            />
          ))}
          <input
            type="color"
            className="qx-guide-swatch"
            value={hex}
            aria-label="Any colour"
            onChange={(event) => setHex(event.target.value)}
          />
          <span className="qx-guide-hex">{hex}</span>
        </div>
      }
      stage={
        <div className="qx-guide-panes">
          {(["light", "dark"] as const).map((scheme) => (
            <Pane key={scheme} scheme={scheme} style={theme[scheme] as CSSProperties}>
              <InviteForm label={scheme === "light" ? "Light" : "Dark"} />
              <Link href="#brand" onClick={(event) => event.preventDefault()}>
                Manage the brand
              </Link>
            </Pane>
          ))}
        </div>
      }
      code={<CodeBlock language="typescript" code={brandCode(hex)} />}
    />
  );
}

/** Guides/Theming: colour scheme, density, direction and a tenant's brand, each live. */
export function Theming(): ReactElement {
  return (
    <Guide>
      <GuideHeader
        title="Theming"
        lede="Colour scheme, density, direction and a tenant's brand. Two attributes and one provider set them, on the whole app or on one region."
        meta="4 settings · each one live below"
      />

      <Section
        id="scheme"
        title="Colour scheme"
        text={
          <>
            The provider sets <code>data-qx-color-scheme</code>; <code>system</code> follows the
            operating system. Every token has a light and a dark value.
          </>
        }
      >
        <Demo
          stage={
            <div className="qx-guide-panes">
              <Pane scheme="light">
                <InviteForm label="Light" />
              </Pane>
              <Pane scheme="dark">
                <InviteForm label="Dark" />
              </Pane>
            </div>
          }
          code={<CodeBlock language="tsx" code={SCHEME_CODE} />}
        />
      </Section>

      <Section
        id="density"
        title="Density"
        text={
          <>
            <code>compact</code> for consoles, <code>default</code> for most screens,{" "}
            <code>comfortable</code> for sign-in and checkout. Set it once per region, never per
            component.
          </>
        }
      >
        <DensityDemo />
      </Section>

      <Section
        id="direction"
        title="Right to left"
        text={
          <>
            Set both: <code>dir</code> steers the layout, the provider's <code>direction</code>{" "}
            steers the keys. Every component uses logical properties, so it mirrors by itself.
          </>
        }
      >
        <Demo
          stage={
            <div className="qx-guide-panes" inert aria-hidden="true">
              {(["ltr", "rtl"] as const).map((dir) => (
                <Pane key={dir} dir={dir}>
                  <Text size="sm" weight="semibold" tone="subtle" className="qx-guide-pane-label">
                    {dir === "ltr" ? "Left to right" : "Right to left"}
                  </Text>
                  <Breadcrumb>
                    <BreadcrumbItem href="#directory">Directory</BreadcrumbItem>
                    <BreadcrumbItem current>Users</BreadcrumbItem>
                  </Breadcrumb>
                  <TextField label="Work email" defaultValue="rahul@acme.in" />
                  <div className="qx-guide-row">
                    <Button icon={ArrowRightIcon}>Continue</Button>
                  </div>
                </Pane>
              ))}
            </div>
          }
          code={<CodeBlock language="tsx" code={DIRECTION_CODE} />}
        />
      </Section>

      <Section
        id="brand"
        title="A tenant's brand colour"
        text={
          <>
            On a customer's own surface, such as hosted sign-in, <code>brandTheme()</code> turns one
            colour into the 18 brand tokens for both schemes, each pair checked for contrast. Pick
            one.
          </>
        }
      >
        <BrandDemo />
      </Section>

      <Next
        items={[
          { eyebrow: "Foundations", title: "Colour", path: "/docs/foundations-colour--docs" },
          { eyebrow: "Foundations", title: "Brand", path: "/docs/foundations-brand--docs" },
        ]}
      />
    </Guide>
  );
}
