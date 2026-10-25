import { FlaskConicalIcon } from "@qeetrix/icons/icons/flask-conical";
import { LanguagesIcon } from "@qeetrix/icons/icons/languages";
import { PaletteIcon } from "@qeetrix/icons/icons/palette";
import { PlusIcon } from "@qeetrix/icons/icons/plus";
import { Button, Tab, Tabs, TabsList, TabsPanel } from "@qeetrix/react";
import { CodeBlock } from "@qeetrix/react/experimental";
import type { ReactElement } from "react";

import { Demo, Guide, GuideHeader, Next, Notes, Step } from "./_guide";

const PACKAGES = "@qeetrix/react @qeetrix/tokens @base-ui/react @qeetrix/icons";
const INSTALL = [
  { manager: "bun", code: `bun add ${PACKAGES}` },
  { manager: "npm", code: `npm install ${PACKAGES}` },
  { manager: "pnpm", code: `pnpm add ${PACKAGES}` },
];

const STYLES = `@import "@qeetrix/tokens";
@import "@qeetrix/react/styles.css" layer(components);`;

const PROVIDER = `import { QeetrixProvider, ToastProvider } from "@qeetrix/react";

export function Root({ children }) {
  return (
    <QeetrixProvider locale="en-IN" defaultColorScheme="system">
      <ToastProvider>{children}</ToastProvider>
    </QeetrixProvider>
  );
}`;

const FIRST = `import { PlusIcon } from "@qeetrix/icons/icons/plus";
import { Button } from "@qeetrix/react";

<Button icon={PlusIcon}>Invite users</Button>`;

/** Guides/Getting started: from nothing to a first component, in four steps. */
export function GettingStarted(): ReactElement {
  return (
    <Guide>
      <GuideHeader
        title="Getting started"
        lede="Add the components, the tokens and the icons to a React 19 app, and render your first component."
        meta="4 steps · about 5 minutes"
      />

      <div className="qx-guide-steps">
        <Step n={1} title="Install" text="Components, tokens, Base UI (a peer) and the icons.">
          <Tabs defaultValue="bun">
            <TabsList variant="contained" aria-label="Package manager">
              {INSTALL.map(({ manager }) => (
                <Tab key={manager} value={manager}>
                  {manager}
                </Tab>
              ))}
            </TabsList>
            {INSTALL.map(({ manager, code }) => (
              <TabsPanel key={manager} value={manager} className="qx-guide-panel">
                <CodeBlock language="shell" code={code} />
              </TabsPanel>
            ))}
          </Tabs>
        </Step>

        <Step
          n={2}
          title="Load the styles"
          text="Once, in your root stylesheet, tokens first. The CSS is precompiled, so Tailwind never scans the package."
        >
          <CodeBlock language="text" title="app.css" code={STYLES} />
        </Step>

        <Step
          n={3}
          title="Wrap the app"
          text="The provider sets the language, the colour scheme and the strings every component reads."
        >
          <CodeBlock language="tsx" title="root.tsx" code={PROVIDER} />
        </Step>

        <Step n={4} title="Render a component" text="Import it, give it its props. That's all.">
          <Demo
            stage={<Button icon={PlusIcon}>Invite users</Button>}
            code={<CodeBlock language="tsx" code={FIRST} />}
          />
        </Step>
      </div>

      <Notes
        items={[
          {
            icon: PaletteIcon,
            title: "Style through props",
            text: (
              <>
                Looks change with <code>variant</code>, <code>tone</code> and <code>size</code>; use{" "}
                <code>className</code> for placement only.
              </>
            ),
          },
          {
            icon: FlaskConicalIcon,
            title: "Experimental parts",
            text: (
              <>
                Components in their first product come from <code>@qeetrix/react/experimental</code>{" "}
                and may change in a patch.
              </>
            ),
          },
          {
            icon: LanguagesIcon,
            title: "Hindi built in",
            text: (
              <>
                Pass <code>locale="hi-IN"</code> and <code>messages={"{hi}"}</code> from{" "}
                <code>@qeetrix/react/locales/hi</code>.
              </>
            ),
          },
        ]}
      />

      <Next
        items={[
          { eyebrow: "Next guide", title: "Theming", path: "/docs/guides-theming--docs" },
          {
            eyebrow: "Explore",
            title: "Browse components",
            path: "/docs/components-overview--docs",
          },
        ]}
      />
    </Guide>
  );
}
