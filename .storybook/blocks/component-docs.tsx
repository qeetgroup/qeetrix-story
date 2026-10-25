import { ArrowUpRightIcon } from "@qeetrix/icons/icons/arrow-up-right";
import { CodeXmlIcon } from "@qeetrix/icons/icons/code-xml";
import { Badge, Heading, Text, Toggle } from "@qeetrix/react";
import { CopyButton } from "@qeetrix/react/experimental";
import pkg from "@qeetrix/react/package.json";
import {
  Controls,
  Description,
  DocsContext,
  Source,
  Story,
  Title,
  Unstyled,
  useOf,
} from "@storybook/addon-docs/blocks";
import { type ContextType, type ReactElement, useContext, useState } from "react";

import docgen from "../docgen.json";

/** The story contract a component story declares (stories/_contract.ts). */
interface Contract {
  category?: string;
  status?: "experimental" | "beta" | "stable" | "deprecated" | "internal";
}

const STATUS: Record<
  NonNullable<Contract["status"]>,
  { label: string; tone: "success" | "info" | "warning" | "danger" | "neutral"; note: string }
> = {
  stable: {
    label: "Stable",
    tone: "success",
    note: "From the root export. Its API changes only in a minor or major release.",
  },
  experimental: {
    label: "Experimental",
    tone: "warning",
    note: "From @qeetrix/react/experimental, in its first product. Its API may change in a patch release, with a changelog note.",
  },
  beta: { label: "Beta", tone: "info", note: "Close to stable." },
  deprecated: { label: "Deprecated", tone: "danger", note: "Don't use in new work." },
  internal: { label: "Internal", tone: "neutral", note: "Not part of the public API." },
};

const SOURCE = "https://github.com/qeetgroup/qeetrix-react/tree/main/packages/react/src";
const NPM = "https://www.npmjs.com/package/@qeetrix/react";
const CHANGELOG =
  "https://github.com/qeetgroup/qeetrix-react/blob/main/packages/react/CHANGELOG.md";

type DocsStory = ReturnType<ContextType<typeof DocsContext>["componentStories"]>[number];

/** The stories a docs page shows: Storybook's own rule, so test-only stories stay off it. */
function useDocsStories(): DocsStory[] {
  const context = useContext(DocsContext);
  const stories = context.componentStories();
  return stories.some((story) => story.tags?.includes("autodocs"))
    ? stories.filter((story) => story.tags?.includes("autodocs") && !story.usesMount)
    : stories;
}

/**
 * One live example: the story on the ruled stage, its name and line above, and its source a click
 * away. The source is Storybook's own snippet of the story, so it can't drift from what renders.
 */
function Example({ story, primary }: { story: DocsStory; primary?: boolean }) {
  const [code, setCode] = useState(false);
  const description = (story.parameters?.docs as { description?: { story?: string } } | undefined)
    ?.description?.story;
  return (
    <section className="qx-example" aria-label={primary ? undefined : story.name}>
      {!primary && (
        <div className="qx-example-head">
          <Heading level={3} size="title-md" id={`example-${story.id}`}>
            {story.name}
          </Heading>
          {description && (
            <Text size="sm" tone="subtle">
              {description}
            </Text>
          )}
        </div>
      )}
      <div className="qx-example-frame">
        <div
          className="qx-example-stage"
          data-primary={primary ? "" : undefined}
          data-layout={(story.parameters?.layout as string | undefined) ?? "centered"}
        >
          <Story of={story.moduleExport} __primary={primary} />
        </div>
        <div className="qx-example-bar">
          <Toggle
            size="sm"
            icon={CodeXmlIcon}
            pressed={code}
            onPressedChange={setCode}
            aria-expanded={code}
          >
            Code
          </Toggle>
        </div>
        {code && (
          <div className="qx-example-code">
            <Source of={story.moduleExport} />
          </div>
        )}
      </div>
    </section>
  );
}

/** One Foundations section: the story's name and line, then its specimen on a card. */
function FoundationSection({ story }: { story: DocsStory }) {
  const description = (story.parameters?.docs as { description?: { story?: string } } | undefined)
    ?.description?.story;
  return (
    <section className="qx-foundation-section" aria-labelledby={`section-${story.id}`}>
      <div className="qx-foundation-head">
        <Heading level={2} size="heading-sm" id={`section-${story.id}`}>
          {story.name}
        </Heading>
        {description && <Text tone="subtle">{description}</Text>}
      </div>
      <div className="qx-foundation-card">
        <Story of={story.moduleExport} />
      </div>
    </section>
  );
}

function SectionHead({ title, count }: { title: string; count?: number }) {
  return (
    <div className="qx-docs-section-head">
      <Heading level={2} size="heading-sm">
        {title}
      </Heading>
      {count !== undefined && (
        <Text size="sm" tone="subtle">
          {count}
        </Text>
      )}
    </div>
  );
}

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/**
 * The docs page of every component (preview.ts `parameters.docs.page`), the layout enterprise
 * design systems share, kept lean: what it is and its status, how to import it and where its
 * source is, a playground with every prop as a control, then the examples. Test-only stories
 * (interactions, Hindi) are tagged `!autodocs` and stay off it. Everything on it comes from the
 * story's meta and @qeetrix/react's own type declarations, so a page can't drift from the API.
 */
export function ComponentDocs(): ReactElement {
  const { preparedMeta } = useOf("meta", ["meta"]);
  const stories = useDocsStories();
  const contract = (preparedMeta.parameters?.qeetrix ?? {}) as Contract;
  const component = preparedMeta.component as { displayName?: string; name?: string } | undefined;
  const name = component?.displayName ?? component?.name;
  const entry = name ? (docgen as Record<string, { family?: string }>)[name] : undefined;
  const status = contract.status ? STATUS[contract.status] : undefined;
  const from =
    contract.status === "experimental" ? "@qeetrix/react/experimental" : "@qeetrix/react";
  const statement = name ? `import { ${name} } from "${from}";` : undefined;
  const parts = preparedMeta.title.split("/");
  const [section] = parts;
  const eyebrow = parts.slice(0, -1).join(" · ");

  // Foundations are galleries of specimens: each section a heading, its line, and the specimen
  // on a card, with no source to show.
  if (section === "Foundations") {
    return (
      <div className="qx-docs qx-docs-specimens">
        <header className="qx-docs-header">
          <p className="qx-docs-eyebrow">{section}</p>
          <Title />
          <Description />
        </header>
        <Unstyled>
          {stories.map((story) => (
            <FoundationSection key={story.id} story={story} />
          ))}
        </Unstyled>
      </div>
    );
  }

  // Patterns are whole screens: each one framed like an example, with no props to list.
  if (!contract.status) {
    return (
      <div className="qx-docs">
        <header className="qx-docs-header">
          <p className="qx-docs-eyebrow">{section}</p>
          <Title />
          <Description />
        </header>
        <Unstyled>
          <div className="qx-docs-examples">
            {stories.map((story) => (
              <Example key={story.id} story={story} />
            ))}
          </div>
        </Unstyled>
      </div>
    );
  }

  const [primary, ...examples] = stories;
  return (
    <div className="qx-docs">
      <header className="qx-docs-header">
        <p className="qx-docs-eyebrow">{eyebrow}</p>
        <div className="qx-docs-title-row">
          <Title />
          {/* Unstyled: the library's own components, untouched by the docs' markdown styles. */}
          {status && (
            <Unstyled>
              <Badge tone={status.tone} title={status.note}>
                {status.label}
              </Badge>
            </Unstyled>
          )}
        </div>
        <Description />
        <Unstyled>
          <div className="qx-docs-bar">
            {statement && (
              <div className="qx-docs-import">
                <code>{statement}</code>
                <CopyButton value={statement} label="Copy the import" />
              </div>
            )}
            <nav className="qx-docs-links" aria-label="Resources">
              {entry?.family && (
                <a href={`${SOURCE}/${entry.family}`} {...external}>
                  Source
                  <ArrowUpRightIcon size={12} aria-hidden />
                </a>
              )}
              <a href={NPM} {...external}>
                npm
                <ArrowUpRightIcon size={12} aria-hidden />
              </a>
              <a href={CHANGELOG} {...external}>
                v{pkg.version}
                <ArrowUpRightIcon size={12} aria-hidden />
              </a>
            </nav>
          </div>
        </Unstyled>
      </header>

      <Unstyled>
        {primary && (
          <div className="qx-docs-section">
            <SectionHead title="Playground" />
            <Example story={primary} primary />
          </div>
        )}
        <div className="qx-docs-section">
          <SectionHead title="Props" />
        </div>
      </Unstyled>
      <div className="qx-docs-props">
        <Controls />
      </div>
      {examples.length > 0 && (
        <Unstyled>
          <div className="qx-docs-section">
            <SectionHead title="Examples" count={examples.length} />
            <div className="qx-docs-examples">
              {examples.map((story) => (
                <Example key={story.id} story={story} />
              ))}
            </div>
          </div>
        </Unstyled>
      )}
    </div>
  );
}
