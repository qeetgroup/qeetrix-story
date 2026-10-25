import { ArrowRightIcon } from "@qeetrix/icons/icons/arrow-right";
import { Heading, Text } from "@qeetrix/react";
import type { ComponentType, ReactElement, ReactNode } from "react";

import "./_guide.css";

/** Another page of the workshop, opened in the manager rather than inside the preview frame. */
export const to = (path: string) => `/?path=${path}`;

/** The parts every guide shares: header, numbered steps, live demos and where to go next. */
export function Guide({ children }: { children: ReactNode }): ReactElement {
  return <div className="qx-guide">{children}</div>;
}

export function GuideHeader({
  title,
  lede,
  meta,
}: {
  title: string;
  lede: string;
  meta: string;
}): ReactElement {
  return (
    <header className="qx-guide-header">
      <Text size="sm" weight="semibold" tone="subtle" className="qx-guide-eyebrow">
        Guides
      </Text>
      <Heading level={1} size="display-sm">
        {title}
      </Heading>
      <Text size="lg" tone="subtle" className="qx-guide-lede">
        {lede}
      </Text>
      <Text size="sm" tone="subtlest">
        {meta}
      </Text>
    </header>
  );
}

/** A numbered step on the rail: what to do, one line on why, then the code or the demo. */
export function Step({
  n,
  title,
  text,
  children,
}: {
  n: number;
  title: string;
  text?: ReactNode;
  children: ReactNode;
}): ReactElement {
  return (
    <section className="qx-guide-step" aria-labelledby={`step-${n}`}>
      <span className="qx-guide-step-n" aria-hidden="true">
        {n}
      </span>
      <div className="qx-guide-step-body">
        <div className="qx-guide-step-head">
          <Heading level={2} size="title-lg" id={`step-${n}`}>
            {title}
          </Heading>
          {text && (
            <Text tone="subtle" className="qx-guide-text">
              {text}
            </Text>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

/** A guide section without a number: a heading, a line, then the demo. */
export function Section({
  id,
  title,
  text,
  children,
}: {
  id: string;
  title: string;
  text?: ReactNode;
  children: ReactNode;
}): ReactElement {
  return (
    <section className="qx-guide-section" aria-labelledby={id}>
      <div className="qx-guide-step-head">
        <Heading level={2} size="heading-sm" id={id}>
          {title}
        </Heading>
        {text && (
          <Text tone="subtle" className="qx-guide-text">
            {text}
          </Text>
        )}
      </div>
      {children}
    </section>
  );
}

/** A live demo, framed like the component pages' examples: a toolbar, the ruled stage, the code. */
export function Demo({
  toolbar,
  stage,
  code,
}: {
  toolbar?: ReactNode;
  stage: ReactNode;
  code?: ReactNode;
}): ReactElement {
  return (
    <div className="qx-guide-demo">
      {toolbar && <div className="qx-guide-demo-bar">{toolbar}</div>}
      <div className="qx-guide-demo-stage">{stage}</div>
      {code && <div className="qx-guide-demo-code">{code}</div>}
    </div>
  );
}

/** Small cards for the things worth knowing once the steps are done. */
export function Notes({
  items,
}: {
  items: { icon: ComponentType<{ size?: number }>; title: string; text: ReactNode }[];
}): ReactElement {
  return (
    <ul className="qx-guide-notes">
      {items.map(({ icon: Icon, title, text }) => (
        <li key={title}>
          <span className="qx-guide-note-icon" aria-hidden="true">
            <Icon size={18} />
          </span>
          <Text weight="semibold">{title}</Text>
          <Text size="sm" tone="subtle">
            {text}
          </Text>
        </li>
      ))}
    </ul>
  );
}

/** Where to go next: whole-card links, like the Welcome page's. */
export function Next({
  items,
}: {
  items: { eyebrow: string; title: string; path: string }[];
}): ReactElement {
  return (
    <nav className="qx-guide-next" aria-label="Next">
      {items.map((item) => (
        <a key={item.title} href={to(item.path)} target="_top" className="qx-guide-next-card">
          <span>
            <Text size="sm" tone="subtle">
              {item.eyebrow}
            </Text>
            <Text weight="semibold">{item.title}</Text>
          </span>
          <ArrowRightIcon size={18} className="qx-guide-next-arrow" aria-hidden />
        </a>
      ))}
    </nav>
  );
}
