import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import {
  attachIssueCollector,
  collectRuntimeDiagnostics,
  hasQaFailures,
  resolveBrowserExecutable,
  waitForV2Page,
} from "./qa-runtime.mjs";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = path.join(
  process.cwd(),
  "artifacts",
  "v2",
  "recordings",
);
await fs.mkdir(outputDir, { recursive: true });
const viewport = { width: 1440, height: 900 };
const browser = await chromium.launch({
  executablePath: resolveBrowserExecutable(),
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});
const context = await browser.newContext({
  viewport,
  recordVideo: { dir: outputDir, size: viewport },
  colorScheme: "dark",
  reducedMotion: "no-preference",
});
const page = await context.newPage();
const issues = attachIssueCollector(page);
await page.goto(baseUrl, { waitUntil: "load", timeout: 60_000 });
await waitForV2Page(page, 2600);
const video = page.video();

await page.evaluate(async () => {
  const destination = document.documentElement.scrollHeight - innerHeight;
  const duration = 22_000;
  const started = performance.now();
  await new Promise((resolve) => {
    const frame = (time) => {
      const progress = Math.min(1, (time - started) / duration);
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      window.scrollTo(0, destination * eased);
      if (progress < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
});
await page.waitForTimeout(1800);
const diagnostics = await collectRuntimeDiagnostics(page);

await context.close();
await browser.close();
if (!video) throw new Error("Playwright did not create a video handle");
const generatedPath = await video.path();
const finalPath = path.join(outputDir, "xiaoan-v2-scroll-desktop.webm");
await fs.rm(finalPath, { force: true });
await fs.rename(generatedPath, finalPath);
const result = {
  diagnostics,
  issues,
  output: path.relative(process.cwd(), finalPath).replaceAll("\\", "/"),
};
await fs.writeFile(
  path.join(outputDir, "recording-diagnostics.json"),
  `${JSON.stringify(result, null, 2)}\n`,
  "utf8",
);
if (hasQaFailures(result)) process.exitCode = 1;
