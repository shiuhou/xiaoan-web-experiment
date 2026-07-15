import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import {
  attachIssueCollector,
  collectRuntimeDiagnostics,
  getActGeometry,
  getActScrollTarget,
  hasQaFailures,
  resolveBrowserExecutable,
  waitForV2Page,
} from "./qa-runtime.mjs";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = path.join(
  process.cwd(),
  "artifacts",
  "v2",
  "qa",
  "journey",
);
await fs.mkdir(outputDir, { recursive: true });

async function wheel(page, delta, count, delay) {
  for (let index = 0; index < count; index += 1) {
    await page.mouse.wheel(0, delta);
    await page.waitForTimeout(delay);
  }
}

async function touchSwipe(client, viewport, distance = 520) {
  const x = Math.round(viewport.width * 0.5);
  const startY = Math.round(viewport.height * 0.78);
  const endY = Math.max(80, startY - distance);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y: startY }],
  });
  for (let step = 1; step <= 8; step += 1) {
    const y = Math.round(startY + ((endY - startY) * step) / 8);
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y }],
    });
    await new Promise((resolve) => setTimeout(resolve, 18));
  }
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
}

const browser = await chromium.launch({
  executablePath: resolveBrowserExecutable(),
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});
const scenarios = [];

try {
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
    reducedMotion: "no-preference",
  });
  const desktop = await desktopContext.newPage();
  const desktopIssues = attachIssueCollector(desktop);
  await desktop.goto(baseUrl, { waitUntil: "load", timeout: 60_000 });
  await waitForV2Page(desktop, 2200);
  const desktopActs = await getActGeometry(desktop);
  const maxScroll = await desktop.evaluate(
    () => document.documentElement.scrollHeight - innerHeight,
  );

  await wheel(desktop, 680, Math.ceil(maxScroll / 680) + 1, 75);
  await desktop.waitForTimeout(650);
  const normalBottom = Math.round(await desktop.evaluate(() => scrollY));
  await wheel(desktop, -2300, Math.ceil(maxScroll / 2300) + 1, 95);
  await desktop.waitForTimeout(650);
  const fastReverse = Math.round(await desktop.evaluate(() => scrollY));
  await wheel(desktop, 2600, 2, 80);
  await wheel(desktop, -2200, 2, 80);
  await wheel(desktop, 1800, 1, 80);
  await desktop.waitForTimeout(500);
  const rapidState = Math.round(await desktop.evaluate(() => scrollY));

  const reloads = [];
  for (const id of ["wake", "break", "edge-intent", "action"]) {
    const act = desktopActs.find((entry) => entry.id === id);
    if (!act) throw new Error(`Missing reload act: ${id}`);
    const target = getActScrollTarget(act, 900, id === "wake" ? 0 : 0.58);
    await desktop.evaluate((top) => window.scrollTo(0, top), target);
    await desktop.waitForTimeout(420);
    await desktop.reload({ waitUntil: "load" });
    await waitForV2Page(desktop, 750);
    reloads.push(
      await desktop.evaluate((expectedId) => {
        const section = document.getElementById(expectedId);
        return {
          id: expectedId,
          y: Math.round(scrollY),
          sectionTop: section?.getBoundingClientRect().top ?? null,
          bodyTextLength: document.body.innerText.length,
          motionState:
            document.querySelector(".v2-narrative")?.dataset.v2MotionState,
        };
      }, id),
    );
  }

  await desktop.setViewportSize({ width: 390, height: 844 });
  await desktop.waitForTimeout(800);
  const resize = await collectRuntimeDiagnostics(desktop);
  await desktop.screenshot({ path: path.join(outputDir, "desktop-resized-mobile.png") });
  await desktop.setViewportSize({ width: 1440, height: 900 });
  await desktop.waitForTimeout(650);
  const diagnostics = await collectRuntimeDiagnostics(desktop);
  scenarios.push({
    name: "desktop-wheel-reverse-reload-resize",
    normalBottom,
    maxScroll,
    fastReverse,
    rapidState,
    reloads,
    resize,
    diagnostics,
    issues: desktopIssues,
  });
  await desktopContext.close();

  const mobileViewport = { width: 390, height: 844 };
  const mobileContext = await browser.newContext({
    viewport: mobileViewport,
    colorScheme: "dark",
    reducedMotion: "no-preference",
    hasTouch: true,
    isMobile: true,
  });
  const mobile = await mobileContext.newPage();
  const mobileIssues = attachIssueCollector(mobile);
  await mobile.goto(baseUrl, { waitUntil: "load", timeout: 60_000 });
  await waitForV2Page(mobile, 2100);
  const client = await mobileContext.newCDPSession(mobile);
  for (let index = 0; index < 15; index += 1) {
    await touchSwipe(client, mobileViewport);
    await mobile.waitForTimeout(70);
  }
  await mobile.waitForTimeout(700);
  const mobileScrollY = Math.round(await mobile.evaluate(() => scrollY));
  const mobileDiagnostics = await collectRuntimeDiagnostics(mobile);
  await mobile.screenshot({ path: path.join(outputDir, "mobile-touch-end.png") });
  scenarios.push({
    name: "mobile-touch",
    mobileScrollY,
    diagnostics: mobileDiagnostics,
    issues: mobileIssues,
  });
  await mobileContext.close();

  const reducedContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  const reduced = await reducedContext.newPage();
  const reducedIssues = attachIssueCollector(reduced);
  await reduced.goto(baseUrl, { waitUntil: "load", timeout: 60_000 });
  await waitForV2Page(reduced, 550);
  const reducedDiagnostics = await collectRuntimeDiagnostics(reduced);
  await reduced.screenshot({
    path: path.join(outputDir, "reduced-motion-full.png"),
    fullPage: true,
  });
  scenarios.push({
    name: "reduced-motion",
    diagnostics: reducedDiagnostics,
    issues: reducedIssues,
  });
  await reducedContext.close();
} finally {
  await browser.close();
}

const noWebglBrowser = await chromium.launch({
  executablePath: resolveBrowserExecutable(),
  headless: true,
  args: ["--disable-webgl", "--disable-gpu"],
});
try {
  const context = await noWebglBrowser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const issues = attachIssueCollector(page);
  await page.goto(baseUrl, { waitUntil: "load", timeout: 60_000 });
  await waitForV2Page(page, 900);
  const diagnostics = await collectRuntimeDiagnostics(page);
  await page.screenshot({ path: path.join(outputDir, "webgl-disabled.png") });
  scenarios.push({ name: "webgl-disabled", diagnostics, issues });
  await context.close();
} finally {
  await noWebglBrowser.close();
}

await fs.writeFile(
  path.join(outputDir, "results.json"),
  `${JSON.stringify(scenarios, null, 2)}\n`,
  "utf8",
);

const desktopResult = scenarios.find((scenario) => scenario.name.startsWith("desktop"));
const reducedResult = scenarios.find((scenario) => scenario.name === "reduced-motion");
const noWebglResult = scenarios.find((scenario) => scenario.name === "webgl-disabled");
const failed =
  scenarios.some(hasQaFailures) ||
  Math.abs(desktopResult.normalBottom - desktopResult.maxScroll) > 14 ||
  desktopResult.fastReverse > 14 ||
  desktopResult.reloads.some(
    (reload) => reload.bodyTextLength < 500 || reload.motionState !== "animated",
  ) ||
  reducedResult.diagnostics.motionState !== "final" ||
  reducedResult.diagnostics.canvas.some((canvas) => canvas.enabled === "true") ||
  noWebglResult.diagnostics.canvas.some((canvas) => canvas.enabled === "true");
if (failed) process.exitCode = 1;
