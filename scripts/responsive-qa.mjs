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
const sizes = [
  { width: 1920, height: 1080 },
  { width: 1280, height: 720 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
];
const outputDir = path.join(
  process.cwd(),
  "artifacts",
  "v2",
  "qa",
  "responsive",
);
await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: resolveBrowserExecutable(),
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});
const results = [];

try {
  for (const viewport of sizes) {
    const mobile = viewport.width <= 767;
    const name = `${viewport.width}x${viewport.height}`;
    const context = await browser.newContext({
      viewport,
      colorScheme: "dark",
      reducedMotion: "no-preference",
      hasTouch: mobile,
      isMobile: mobile,
    });
    const page = await context.newPage();
    const issues = attachIssueCollector(page);
    await page.goto(baseUrl, { waitUntil: "load", timeout: 60_000 });
    await waitForV2Page(page, 2100);
    await page.screenshot({ path: path.join(outputDir, `${name}-hero.png`) });

    const acts = await getActGeometry(page);
    const action = acts.find((act) => act.id === "action");
    if (!action) throw new Error("Action act is missing");
    await page.evaluate(
      (top) => window.scrollTo(0, top),
      getActScrollTarget(action, viewport.height, 0.68),
    );
    await page.waitForTimeout(850);
    await page.screenshot({ path: path.join(outputDir, `${name}-action.png`) });

    const diagnostics = await collectRuntimeDiagnostics(page);
    const geometry = await page.evaluate(() => {
      const rect = (selector) => {
        const bounds = document.querySelector(selector)?.getBoundingClientRect();
        return bounds
          ? {
              top: bounds.top,
              right: bounds.right,
              bottom: bounds.bottom,
              left: bounds.left,
              width: bounds.width,
              height: bounds.height,
            }
          : null;
      };
      return {
        actionProduct: rect("[data-action-product]"),
        actionTitle: rect("#action-title"),
      };
    });
    results.push({ viewport, geometry, diagnostics, issues });
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
if (results.some(hasQaFailures)) process.exitCode = 1;
