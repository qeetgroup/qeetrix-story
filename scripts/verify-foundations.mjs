import assert from "node:assert/strict";
import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATIC = join(ROOT, "storybook-static");
const PORT = Number(process.env.FOUNDATIONS_PORT ?? 6179);
const BASE_URL = `http://127.0.0.1:${PORT}`;

const TYPES = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".map": "application/json",
  ".mjs": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

if (!existsSync(STATIC)) {
  console.error("Storybook output is missing. Run `bun run story:build` first.");
  process.exit(1);
}

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(request.url?.split("?")[0] ?? "/");
  const safePath = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
  let file = join(STATIC, safePath === "/" ? "index.html" : safePath);
  if (!existsSync(file)) file = join(STATIC, "iframe.html");
  response.setHeader("Content-Type", TYPES[extname(file)] ?? "application/octet-stream");
  createReadStream(file).pipe(response);
});

await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

async function openStory(id, globals = "theme:light;density:legacy") {
  await page.goto(`${BASE_URL}/iframe.html?id=${id}&viewMode=story&globals=${globals}`, {
    waitUntil: "networkidle",
    timeout: 20_000,
  });
}

function normalizeOklch(value) {
  return value.replace(
    /^oklch\(([\d.]+)%/,
    (_, lightness) => `oklch(${(Number(lightness) / 100).toFixed(3)}`,
  );
}

try {
  await openStory("foundations-density--comparison");
  const density = await page.evaluate(() =>
    [...document.querySelectorAll("[data-qx-density]")].map((scope) => {
      const button = scope.querySelector('[data-slot="button"]');
      const head = scope.querySelector('[data-slot="table-head"]');
      const cell = scope.querySelector('[data-slot="table-cell"]');
      const style = getComputedStyle(scope);
      return {
        mode: scope.getAttribute("data-qx-density"),
        control: style.getPropertyValue("--qx-density-control-height").trim(),
        row: style.getPropertyValue("--qx-density-row-height").trim(),
        cell: style.getPropertyValue("--qx-density-cell-padding-y").trim(),
        gap: style.getPropertyValue("--qx-density-field-gap").trim(),
        buttonHeight: button?.getBoundingClientRect().height,
        headHeight: head?.getBoundingClientRect().height,
        cellPadding: getComputedStyle(cell).paddingTop,
      };
    }),
  );
  assert.deepEqual(
    density.map(({ mode, control, row, cell, gap }) => ({ mode, control, row, cell, gap })),
    [
      { mode: "comfortable", control: "36px", row: "52px", cell: "12px", gap: "16px" },
      { mode: "compact", control: "28px", row: "40px", cell: "6px", gap: "8px" },
    ],
  );
  assert.ok(Math.abs(density[0].buttonHeight - 36) < 0.5);
  assert.ok(Math.abs(density[1].buttonHeight - 28) < 0.5);
  assert.ok(Math.abs(density[0].headHeight - 52) < 0.5);
  assert.ok(Math.abs(density[1].headHeight - 40) < 0.5);
  assert.equal(density[0].cellPadding, "12px");
  assert.equal(density[1].cellPadding, "6px");
  console.log("PASS density variables and component geometry");

  await page.setViewportSize({ width: 375, height: 812 });
  await openStory("components-layout-container--default");
  const container = await page.evaluate(() => {
    const element = document.querySelector('[data-slot="container"]');
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      width: rect.width,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    };
  });
  assert.equal(container.width, 375);
  assert.equal(container.paddingLeft, "16px");
  assert.equal(container.paddingRight, "16px");
  assert.equal(container.documentWidth, container.viewportWidth);
  console.log("PASS mobile Container gutters and reflow");

  await page.setViewportSize({ width: 1200, height: 800 });
  await openStory("blocks-dashboardshell--reference-dashboard", "theme:dark;density:legacy");
  const dark = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      background: style.getPropertyValue("--background").trim(),
      sidebar: style.getPropertyValue("--sidebar").trim(),
      card: style.getPropertyValue("--card").trim(),
      popover: style.getPropertyValue("--popover").trim(),
      border: style.getPropertyValue("--border").trim(),
    };
  });
  assert.deepEqual(
    Object.fromEntries(Object.entries(dark).map(([key, value]) => [key, normalizeOklch(value)])),
    {
      background: "oklch(0.106 0 0)",
      sidebar: "oklch(0.145 0 0)",
      card: "oklch(0.205 0 0)",
      popover: "oklch(0.269 0 0)",
      border: "oklch(0.371 0 0)",
    },
  );
  console.log("PASS dark surface hierarchy");

  await openStory("foundations-token-layers--overview");
  const tokenLayers = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const series = [...document.querySelectorAll("[data-chart-series]")].map(
      (element) => getComputedStyle(element).backgroundColor,
    );
    const disabledButton = document.querySelector('[data-slot="button"]:disabled');
    return {
      series,
      disabledOpacity: getComputedStyle(disabledButton).opacity,
      stateOpacity: root.getPropertyValue("--qx-state-opacity-disabled").trim(),
      sidebarWidth: root.getPropertyValue("--qx-component-sidebar-width-default").trim(),
      toastLayer: root.getPropertyValue("--qx-z-toast").trim(),
      tourLayer: root.getPropertyValue("--qx-z-tour").trim(),
    };
  });
  assert.equal(tokenLayers.series.length, 8);
  assert.equal(new Set(tokenLayers.series).size, 8);
  assert.ok(tokenLayers.series.every((color) => color !== "rgba(0, 0, 0, 0)"));
  assert.equal(Number.parseFloat(tokenLayers.disabledOpacity), 0.5);
  assert.equal(Number.parseFloat(tokenLayers.stateOpacity), 0.5);
  assert.equal(tokenLayers.sidebarWidth, "16rem");
  assert.equal(tokenLayers.toastLayer, "1800");
  assert.equal(tokenLayers.tourLayer, "2010");
  console.log("PASS semantic token layers and generated runtime parity");

  await page.emulateMedia({ colorScheme: "dark", forcedColors: "active" });
  await openStory("components-actions-button--default", "theme:dark;density:comfortable");
  await page.keyboard.press("Tab");
  const forcedColors = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const button = document.querySelector('[data-slot="button"]');
    const style = getComputedStyle(button);
    return {
      active: matchMedia("(forced-colors: active)").matches,
      background: root.getPropertyValue("--background").trim(),
      primary: root.getPropertyValue("--primary").trim(),
      ring: root.getPropertyValue("--ring").trim(),
      focusVisible: button.matches(":focus-visible"),
      outlineStyle: style.outlineStyle,
      boxShadow: style.boxShadow,
      color: style.color,
      buttonBackground: style.backgroundColor,
    };
  });
  assert.equal(forcedColors.active, true);
  assert.equal(forcedColors.background, "Canvas");
  assert.equal(forcedColors.primary, "ButtonFace");
  assert.equal(forcedColors.ring, "Highlight");
  assert.equal(forcedColors.focusVisible, true);
  assert.equal(forcedColors.outlineStyle, "solid");
  assert.equal(forcedColors.boxShadow, "none");
  assert.notEqual(forcedColors.color, forcedColors.buttonBackground);
  console.log("PASS forced-colors semantics and keyboard focus");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
