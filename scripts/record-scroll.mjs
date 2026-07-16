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
const outputDir = path.join(process.cwd(), "artifacts", "v2", "recordings");
await fs.mkdir(outputDir, { recursive: true });

const profiles = [
  {
    name: "desktop",
    viewport: { width: 1440, height: 900 },
    duration: 22_000,
    mobile: false,
  },
  {
    name: "mobile",
    viewport: { width: 390, height: 844 },
    duration: 18_000,
    mobile: true,
  },
];

async function recordProfile(browser, profile) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    recordVideo: { dir: outputDir, size: profile.viewport },
    colorScheme: "dark",
    reducedMotion: "no-preference",
    hasTouch: profile.mobile,
    isMobile: profile.mobile,
  });
  const page = await context.newPage();
  const issues = attachIssueCollector(page);
  await page.goto(baseUrl, { waitUntil: "load", timeout: 60_000 });
  await waitForV2Page(page, 2400);
  const video = page.video();

  await page.evaluate(async (duration) => {
    const destination = document.documentElement.scrollHeight - innerHeight;
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
  }, profile.duration);
  await page.waitForTimeout(1000);
  const diagnostics = await collectRuntimeDiagnostics(page);

  await context.close();
  if (!video) throw new Error(`Playwright did not create ${profile.name} video`);
  const generatedPath = await video.path();
  const finalPath = path.join(outputDir, `xiaoan-v2-${profile.name}.webm`);
  await fs.rm(finalPath, { force: true });
  await fs.rename(generatedPath, finalPath);

  return {
    profile: profile.name,
    viewport: profile.viewport,
    duration: profile.duration,
    diagnostics,
    issues,
    output: path.relative(process.cwd(), finalPath).replaceAll("\\", "/"),
  };
}

const browser = await chromium.launch({
  executablePath: resolveBrowserExecutable(),
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});
const results = [];
try {
  for (const profile of profiles) {
    results.push(await recordProfile(browser, profile));
  }
} finally {
  await browser.close();
}

await fs.writeFile(
  path.join(outputDir, "recording-diagnostics.json"),
  `${JSON.stringify(results, null, 2)}\n`,
  "utf8",
);
if (results.some((result) => hasQaFailures(result))) process.exitCode = 1;
