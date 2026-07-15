import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import {
  V2_CAPTURE_PROGRESS,
  attachIssueCollector,
  collectRuntimeDiagnostics,
  getActGeometry,
  getActScrollTarget,
  hasQaFailures,
  resolveBrowserExecutable,
  waitForV2Page,
} from "./qa-runtime.mjs";

const root = process.cwd();
const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const passName = process.env.QA_PASS ?? "final";
const mobile = process.env.QA_VIEWPORT === "mobile";
const reduced = process.env.QA_REDUCED === "1";
const viewport = mobile
  ? { width: 390, height: 844 }
  : { width: 1440, height: 900 };
const profile = `${mobile ? "mobile" : "desktop"}${reduced ? "-reduced" : ""}`;
const outputDir = path.join(
  root,
  "artifacts",
  "v2",
  "qa",
  "captures",
  `${passName}-${profile}`,
);
await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: resolveBrowserExecutable(),
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});
const context = await browser.newContext({
  viewport,
  deviceScaleFactor: 1,
  colorScheme: "dark",
  reducedMotion: reduced ? "reduce" : "no-preference",
  hasTouch: mobile,
  isMobile: mobile,
});
const page = await context.newPage();
const issues = attachIssueCollector(page);

await page.goto(baseUrl, { waitUntil: "load", timeout: 60_000 });
await waitForV2Page(page, reduced ? 500 : 2100);
const acts = await getActGeometry(page);

for (const act of acts) {
  const progress = reduced ? 0 : (V2_CAPTURE_PROGRESS[act.id] ?? 0.5);
  const target = getActScrollTarget(act, viewport.height, progress);
  await page.evaluate((top) => window.scrollTo(0, top), target);
  await page.waitForTimeout(reduced ? 180 : 750);
  await page.screenshot({ path: path.join(outputDir, `${act.id}.png`) });
}

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await page.screenshot({
  path: path.join(outputDir, "full-page.png"),
  fullPage: true,
});

const diagnostics = await collectRuntimeDiagnostics(page);
const result = { profile, viewport, reduced, acts, diagnostics, issues };
await fs.writeFile(
  path.join(outputDir, "diagnostics.json"),
  `${JSON.stringify(result, null, 2)}\n`,
  "utf8",
);

await context.close();
await browser.close();
if (hasQaFailures(result)) process.exitCode = 1;
