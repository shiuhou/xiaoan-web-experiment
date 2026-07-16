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
const viewport = { width: 720, height: 900 };
const outputSize = { width: 1080, height: 1350 };
const browser = await chromium.launch({
  executablePath: resolveBrowserExecutable(),
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});
const context = await browser.newContext({
  viewport: outputSize,
  colorScheme: "dark",
  reducedMotion: "no-preference",
  recordVideo: { dir: outputDir, size: outputSize },
});
const page = await context.newPage();
const issues = attachIssueCollector(page);
await page.setContent(`
  <style>
    html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: #02070d; }
    iframe {
      display: block;
      width: ${viewport.width}px;
      height: ${viewport.height}px;
      border: 0;
      transform: scale(1.5);
      transform-origin: 0 0;
    }
  </style>
  <iframe src="${baseUrl}" title="Xiao-An social capture"></iframe>
`);
const iframe = await page.locator("iframe").elementHandle();
const appFrame = await iframe?.contentFrame();
if (!appFrame) throw new Error("The social capture iframe did not attach");
await waitForV2Page(appFrame, 300);
const acts = await getActGeometry(appFrame);
const video = page.video();
const socialActIds = new Set(["wake", "signal", "action", "presence"]);
const keyframes = acts.filter((act) => socialActIds.has(act.id)).map((act) => ({
  id: act.id,
  top: getActScrollTarget(
    act,
    viewport.height,
    V2_CAPTURE_PROGRESS[act.id] ?? 0.5,
  ),
}));

const durations = [0, 900, 3500, 2000];
let current = 0;
await page.waitForTimeout(200);
await page.mouse.move(outputSize.width / 2, outputSize.height / 2);
for (let index = 1; index < keyframes.length; index += 1) {
  const destination = keyframes[index].top;
  const duration = durations[index];
  await page.mouse.wheel(0, destination - current);
  await page.waitForTimeout(duration);
  current = destination;
  await page.waitForTimeout(
    index === keyframes.length - 1 ? 2300 : index === 2 ? 1500 : 100,
  );
}
await page.waitForTimeout(300);
const diagnostics = await collectRuntimeDiagnostics(appFrame);

await context.close();
if (!video) throw new Error("Playwright did not create the social video");
const generatedPath = await video.path();
const finalPath = path.join(outputDir, "xiaoan-v2-social-15s.webm");
await fs.rm(finalPath, { force: true });
await fs.rename(generatedPath, finalPath);
await browser.close();
const result = {
  viewport,
  outputSize,
  captureMode: "scaled-interactive-frame",
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
