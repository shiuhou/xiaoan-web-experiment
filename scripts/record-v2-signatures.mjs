import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  attachIssueCollector,
  collectRuntimeDiagnostics,
  hasQaFailures,
  resolveBrowserExecutable,
  waitForV2Page,
} from "./qa-runtime.mjs";

export function getSignatureScrollRange({
  offsetTop,
  offsetHeight,
  viewportHeight,
}) {
  return {
    start: Math.max(0, offsetTop),
    end: Math.max(offsetTop, offsetTop + offsetHeight - viewportHeight),
  };
}

const signatures = [
  { id: "break", start: 0.04, peak: 0.52, end: 0.92, duration: 4200, focal: "[data-break-product]" },
  { id: "signal", start: 0.04, peak: 0.7, end: 0.94, duration: 3800, focal: "[data-signal-aperture]" },
  { id: "action", start: 0.03, peak: 0.68, end: 0.9, duration: 4200, focal: "[data-action-product]" },
];

const profiles = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, mobile: false },
  { name: "mobile", viewport: { width: 390, height: 844 }, mobile: true },
];

async function recordSignature(browser, baseUrl, outputRoot, signature, profile) {
  const outputDir = path.join(outputRoot, signature.id);
  await fs.mkdir(outputDir, { recursive: true });
  const context = await browser.newContext({
    viewport: profile.viewport,
    colorScheme: "dark",
    reducedMotion: "no-preference",
    hasTouch: profile.mobile,
    isMobile: profile.mobile,
    recordVideo: { dir: outputDir, size: profile.viewport },
  });
  const page = await context.newPage();
  const issues = attachIssueCollector(page);
  await page.goto(baseUrl, { waitUntil: "load", timeout: 60_000 });
  await waitForV2Page(page, 1900);
  const geometry = await page.evaluate((actId) => {
    const section = document.getElementById(actId);
    if (!section) throw new Error(`${actId} section is missing`);
    const bounds = section.getBoundingClientRect();
    return {
      offsetTop: bounds.top + window.scrollY,
      offsetHeight: bounds.height,
      viewportHeight: window.innerHeight,
    };
  }, signature.id);
  const fullRange = getSignatureScrollRange(geometry);
  const span = fullRange.end - fullRange.start;
  const range = {
    start: fullRange.start + span * signature.start,
    end: fullRange.start + span * signature.end,
  };
  await page.evaluate((start) => window.scrollTo(0, start), range.start);
  await page.waitForTimeout(420);
  const video = page.video();
  const screenshot = async (phase) => {
    const screenshotPath = path.join(outputDir, `${profile.name}-${phase}.png`);
    await page.screenshot({ path: screenshotPath });
    return path.relative(process.cwd(), screenshotPath).replaceAll("\\", "/");
  };
  const screenshots = { start: await screenshot("start") };

  const animate = (start, end, duration) =>
    page.evaluate(async ({ start, end, duration }) => {
      const started = performance.now();
      await new Promise((resolve) => {
        const frame = (time) => {
          const linear = Math.min(1, (time - started) / duration);
          const eased = linear < 0.5
            ? 4 * linear * linear * linear
            : 1 - Math.pow(-2 * linear + 2, 3) / 2;
          window.scrollTo(0, start + (end - start) * eased);
          if (linear < 1) requestAnimationFrame(frame);
          else resolve();
        };
        requestAnimationFrame(frame);
      });
    }, { start, end, duration });

  const peak = fullRange.start + span * signature.peak;
  const duration = profile.mobile ? signature.duration - 500 : signature.duration;
  await animate(range.start, peak, duration * 0.64);
  await page.waitForTimeout(120);
  screenshots.peak = await screenshot("peak");
  await animate(peak, range.end, duration * 0.36);
  await page.waitForTimeout(120);
  screenshots.end = await screenshot("end");
  await page.waitForTimeout(520);

  const diagnostics = await collectRuntimeDiagnostics(page);
  const signatureState = await page.evaluate(({ actId, focal }) => {
    const focalElement = document.querySelector(focal);
    return {
      progress: getComputedStyle(document.documentElement)
        .getPropertyValue(`--experience-${actId}-progress`)
        .trim(),
      focalOpacity: focalElement ? getComputedStyle(focalElement).opacity : null,
    };
  }, { actId: signature.id, focal: signature.focal });

  await context.close();
  if (!video) throw new Error(`Playwright did not create ${signature.id}/${profile.name} video`);
  const generatedPath = await video.path();
  const finalPath = path.join(outputDir, `${profile.name}.webm`);
  await fs.rm(finalPath, { force: true });
  await fs.rename(generatedPath, finalPath);

  return {
    act: signature.id,
    profile: profile.name,
    viewport: profile.viewport,
    range,
    signatureState,
    screenshots,
    diagnostics,
    issues,
    output: path.relative(process.cwd(), finalPath).replaceAll("\\", "/"),
  };
}

async function main() {
  const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
  const outputRoot = path.join(process.cwd(), "artifacts", "v2", "signature-moments");
  await fs.mkdir(outputRoot, { recursive: true });
  const browser = await chromium.launch({
    executablePath: resolveBrowserExecutable(),
    headless: true,
    args: ["--use-angle=swiftshader", "--enable-webgl"],
  });
  const results = [];
  try {
    for (const signature of signatures) {
      for (const profile of profiles) {
        results.push(
          await recordSignature(browser, baseUrl, outputRoot, signature, profile),
        );
      }
    }
  } finally {
    await browser.close();
  }

  for (const signature of signatures) {
    const actResults = results.filter((result) => result.act === signature.id);
    await fs.writeFile(
      path.join(outputRoot, signature.id, "recording-diagnostics.json"),
      `${JSON.stringify(actResults, null, 2)}\n`,
      "utf8",
    );
  }
  await fs.writeFile(
    path.join(outputRoot, "recording-diagnostics.json"),
    `${JSON.stringify(results, null, 2)}\n`,
    "utf8",
  );
  if (results.some((result) => hasQaFailures(result))) process.exitCode = 1;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  await main();
}
