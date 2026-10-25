import { ArrowRightIcon } from "@qeetrix/icons/icons/arrow-right";
import { SearchIcon } from "@qeetrix/icons/icons/search";
import { Badge, Heading, Text, Toggle, ToggleGroup } from "@qeetrix/react";
import { EmptyState, SearchField } from "@qeetrix/react/experimental";
import { type ReactElement, useMemo, useState } from "react";

import { FAMILIES, type Family, PREVIEWS, storyFor, storyHref } from "./catalog";
import "./_overview.css";

/** The sidebar's order (preview.ts `storySort`), so the page reads like the navigation. */
const CATEGORIES = [
  "Actions",
  "Forms",
  "Data Entry",
  "Data Display",
  "Feedback",
  "Overlays",
  "Navigation",
  "Layout",
  "Media",
  "Typography",
  "Utilities",
];

type Status = "all" | "stable" | "experimental";

/** A heading's id: "Data Entry" → "qx-overview-data-entry". */
const slug = (category: string) => `qx-overview-${category.toLowerCase().replace(/\s+/g, "-")}`;

interface Entry {
  family: Family;
  category: string;
  href?: string;
}

/** Every family with its category and docs link, read from the component stories' titles. */
const ENTRIES: Entry[] = FAMILIES.map((family) => {
  const story = storyFor(family);
  return {
    family,
    category: story?.title.split("/")[1] ?? "Other",
    href: story ? storyHref(story.title) : undefined,
  };
}).sort((a, b) => a.family.name.localeCompare(b.family.name));

const COUNT = {
  stable: ENTRIES.filter((e) => e.family.status === "stable").length,
  experimental: ENTRIES.filter((e) => e.family.status === "experimental").length,
};

/** One component: a picture of it, its name and, if it's still settling, its status. */
function Tile({ entry }: { entry: Entry }) {
  const { family, href } = entry;
  const preview = PREVIEWS[family.name];
  const body = (
    <>
      <div className="qx-overview-art">
        {preview && (
          // A picture, not a control: the component's own page is where it's used and tested.
          <div
            inert
            aria-hidden="true"
            data-preview=""
            style={{
              zoom: preview.zoom,
              inlineSize: preview.width,
              blockSize: preview.height,
              overflow: preview.height ? "hidden" : undefined,
            }}
          >
            {preview.render()}
          </div>
        )}
        {family.status === "experimental" && (
          <Badge tone="warning" size="sm" className="qx-overview-status">
            Experimental
          </Badge>
        )}
      </div>
      <div className="qx-overview-meta">
        <Heading level={3} size="title-sm" truncate>
          {family.name}
        </Heading>
        <ArrowRightIcon size={16} className="qx-overview-arrow" aria-hidden />
      </div>
    </>
  );
  return href ? (
    <a className="qx-overview-tile" href={href} target="_top" data-family={family.name}>
      {body}
    </a>
  ) : (
    <div className="qx-overview-tile" data-family={family.name}>
      {body}
    </div>
  );
}

/** Components/Overview: every component, searchable, grouped as the sidebar groups them. */
export function Overview(): ReactElement {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("all");

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const shown = ENTRIES.filter(
      ({ family }) =>
        (status === "all" || family.status === status) &&
        (!needle ||
          family.name.toLowerCase().includes(needle) ||
          family.parts.some((part) => part.toLowerCase().includes(needle))),
    );
    const order = [...CATEGORIES, "Other"];
    return order
      .map((category) => ({ category, entries: shown.filter((e) => e.category === category) }))
      .filter((group) => group.entries.length > 0);
  }, [query, status]);

  return (
    <div className="qx-overview">
      <header className="qx-overview-header">
        <Text size="sm" weight="semibold" tone="subtle" className="qx-overview-eyebrow">
          Components
        </Text>
        <Heading level={1} size="display-sm">
          Overview
        </Heading>
        <Text size="lg" tone="subtle">
          Every @qeetrix/react component, live. {COUNT.stable} stable, {COUNT.experimental}{" "}
          experimental.
        </Text>
      </header>

      <div className="qx-overview-toolbar">
        <SearchField
          aria-label="Find a component"
          placeholder={`Search ${ENTRIES.length} components`}
          value={query}
          onValueChange={setQuery}
          className="qx-overview-search"
        />
        <ToggleGroup
          aria-label="Status"
          value={[status]}
          onValueChange={(next) => setStatus((next[0] as Status | undefined) ?? "all")}
        >
          <Toggle value="all">All</Toggle>
          <Toggle value="stable">Stable</Toggle>
          <Toggle value="experimental">Experimental</Toggle>
        </ToggleGroup>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No components match"
          description={`Nothing is called "${query.trim()}". Try a shorter name.`}
          level={2}
        />
      ) : (
        groups.map(({ category, entries }) => (
          <section key={category} className="qx-overview-group" aria-labelledby={slug(category)}>
            <div className="qx-overview-group-head">
              <Heading level={2} size="heading-sm" id={slug(category)}>
                {category}
              </Heading>
              <Text size="sm" tone="subtle">
                {entries.length}
              </Text>
            </div>
            <div className="qx-overview-grid">
              {entries.map((entry) => (
                <Tile key={entry.family.name} entry={entry} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
