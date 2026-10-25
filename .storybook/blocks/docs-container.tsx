import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks";
import { type PropsWithChildren, type ReactElement, useEffect, useState } from "react";
import { addons } from "storybook/preview-api";

import { qeetrixThemeDark, qeetrixThemeLight } from "../theme";

type Scheme = "light" | "dark";
const toScheme = (theme?: unknown): Scheme => (theme === "dark" ? "dark" : "light");

/**
 * The docs pages' container, in the theme the toolbar asks for. Storybook gives its docs
 * one static theme, so its own widgets (controls, type labels, the table of contents,
 * "Show code") stayed light on the dark canvas. This follows the Theme global: the
 * initial value from the document, then every change from the preview channel.
 */
export function ThemedDocsContainer(props: PropsWithChildren<DocsContainerProps>): ReactElement {
  const [scheme, setScheme] = useState<Scheme>(() =>
    toScheme(
      typeof document === "undefined"
        ? undefined
        : document.documentElement.getAttribute("data-qx-color-scheme"),
    ),
  );
  useEffect(() => {
    const channel = addons.getChannel();
    const update = ({ globals }: { globals?: { theme?: string } }) =>
      setScheme(toScheme(globals?.theme));
    channel.on("globalsUpdated", update);
    channel.on("setGlobals", update);
    return () => {
      channel.off("globalsUpdated", update);
      channel.off("setGlobals", update);
    };
  }, []);
  return (
    <DocsContainer {...props} theme={scheme === "dark" ? qeetrixThemeDark : qeetrixThemeLight} />
  );
}
