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
  "motion",
);
await fs.mkdir(outputDir, { recursive: true });

const profiles = {
  normal: { delta: 660, delay: 90 },
  fast: { delta: 2100, delay: 100 },
  slow: { delta: 210, delay: 55 },
};

async function wheelJourney(page, maxScroll, profile, direction = 1) {
  const steps = Math.ceil(maxScroll / profile.delta) + 1;
  for (let index = 0; index < steps; index += 1) {
    await page.mouse.wheel(0, profile.delta * direction);
    await page.waitForTimeout(profile.delay);
  }
}

const browser = await chromium.launch({
  executablePath: resolveBrowserExecutable(),
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});
const results = [];

try {
  for (const [mode, profile] of Object.entries(profiles)) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: "dark",
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    const issues = attachIssueCollector(page);
    await page.goto(baseUrl, { waitUntil: "load", timeout: 60_000 });
    await waitForV2Page(page, 2100);
    const maxScroll = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight,
    );

    await wheelJourney(page, maxScroll, profile, 1);
    await page.waitForTimeout(900);
    const bottom = await page.evaluate(() => ({
      y: Math.round(window.scrollY),
      max: document.documentElement.scrollHeight - window.innerHeight,
      active: document.querySelector(".scene-nav__toggle strong")?.textContent,
    }));
    await page.screenshot({ path: path.join(outputDir, `${mode}-bottom.png`) });

    await wheelJourney(page, maxScroll, profile, -1);
    await page.waitForTimeout(900);
    const replay = await page.evaluate(() => ({
      y: Math.round(window.scrollY),
      wakeTransform: getComputedStyle(
        document.querySelector("[data-wake-product]"),
      ).transform,
      breakOpacity: getComputedStyle(
        document.querySelector("[data-break-product]"),
      ).opacity,
    }));
    await page.screenshot({ path: path.join(outputDir, `${mode}-replay.png`) });

    const acts = await getActGeometry(page);
    const edge = acts.find((act) => act.id === "edge-intent");
    if (!edge) throw new Error("Edge act is missing");
    await page.evaluate(
      (top) => window.scrollTo(0, top),
      getActScrollTarget(edge, 900, 0.72),
    );
    await page.waitForTimeout(500);
    await page.reload({ waitUntil: "load" });
    await waitForV2Page(page, 900);
    const reload = await page.evaluate(() => ({
      y: Math.round(window.scrollY),
      edgeTop: document.getElementById("edge-intent")?.getBoundingClientRect().top,
      bodyTextLength: document.body.innerText.length,
    }));

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(650);
    const resize = await collectRuntimeDiagnostics(page);
    const diagnostics = await collectRuntimeDiagnostics(page);
    results.push({
      mode,
      profile,
      bottom,
      replay,
      reload,
      resize,
      diagnostics,
      issues,
    });
    await context.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(
  path.join(outputDir, "results.json"),
  `${JSON.stringify(results, null, 2)}\n`,
  "utf8",
);
const failed = results.some(
  (result) =>
    hasQaFailures(result) ||
    Math.abs(result.bottom.max - result.bottom.y) > 12 ||
    result.replay.y > 12,
);
if (failed) process.exitCode = 1;
