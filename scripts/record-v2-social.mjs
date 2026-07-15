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

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = path.join(
  process.cwd(),
  "artifacts",
  "v2",
  "recordings",
);
await fs.mkdir(outputDir, { recursive: true });
const viewport = { width: 1080, height: 1350 };
const browser = await chromium.launch({
  executablePath: resolveBrowserExecutable(),
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});
const context = await browser.newContext({
  viewport,
  colorScheme: "dark",
  reducedMotion: "no-preference",
  recordVideo: { dir: outputDir, size: viewport },
});
const page = await context.newPage();
const issues = attachIssueCollector(page);
await page.goto(baseUrl, { waitUntil: "load", timeout: 60_000 });
await waitForV2Page(page, 2200);
const acts = await getActGeometry(page);
const video = page.video();
const keyframes = acts.map((act) => ({
  id: act.id,
  top: getActScrollTarget(
    act,
    viewport.height,
    V2_CAPTURE_PROGRESS[act.id] ?? 0.5,
  ),
}));

await page.evaluate(async (frames) => {
  const durations = [900, 2500, 2200, 2800, 2500, 2400];
  const pause = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));
  const move = (from, to, duration) =>
    new Promise((resolve) => {
      const started = performance.now();
      const frame = (time) => {
        const linear = Math.min(1, (time - started) / duration);
        const eased = 1 - Math.pow(1 - linear, 3);
        window.scrollTo(0, from + (to - from) * eased);
        if (linear < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });

  let current = 0;
  await pause(700);
  for (let index = 1; index < frames.length; index += 1) {
    await move(current, frames[index].top, durations[index]);
    current = frames[index].top;
    await pause(index === frames.length - 1 ? 1200 : 420);
  }
}, keyframes);
await page.waitForTimeout(700);
const diagnostics = await collectRuntimeDiagnostics(page);

await context.close();
await browser.close();
if (!video) throw new Error("Playwright did not create the social video");
const generatedPath = await video.path();
const finalPath = path.join(outputDir, "xiaoan-v2-social-4x5.webm");
await fs.rm(finalPath, { force: true });
await fs.rename(generatedPath, finalPath);
const result = {
  viewport,
  keyframes,
  diagnostics,
  issues,
  output: path.relative(process.cwd(), finalPath).replaceAll("\\", "/"),
};
await fs.writeFile(
  path.join(outputDir, "social-recording-diagnostics.json"),
  `${JSON.stringify(result, null, 2)}\n`,
  "utf8",
);
if (hasQaFailures(result)) process.exitCode = 1;
