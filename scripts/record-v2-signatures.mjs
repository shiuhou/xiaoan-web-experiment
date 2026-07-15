import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { resolveBrowserExecutable } from "./qa-runtime.mjs";

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

async function recordBreakSignature(browser, baseUrl, outputDir, profile) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    colorScheme: "dark",
    reducedMotion: "no-preference",
    recordVideo: { dir: outputDir, size: profile.viewport },
  });
  const page = await context.newPage();
  const consoleMessages = [];
  const pageErrors = [];
  const failedResponses = [];

  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text() });
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failedResponses.push({ status: response.status(), url: response.url() });
    }
  });

  await page.goto(baseUrl, { waitUntil: "load" });
  await page.waitForTimeout(1900);
  const geometry = await page.evaluate(() => {
    const section = document.getElementById("break");
    if (!section) {
      throw new Error("Break section is missing");
    }
    const bounds = section.getBoundingClientRect();
    return {
      offsetTop: bounds.top + window.scrollY,
      offsetHeight: bounds.height,
      viewportHeight: window.innerHeight,
    };
  });
  const range = getSignatureScrollRange(geometry);
  await page.evaluate((start) => window.scrollTo(0, start), range.start);
  await page.waitForTimeout(550);
  const video = page.video();

  await page.evaluate(async ({ start, end, duration }) => {
    const started = performance.now();
    await new Promise((resolve) => {
      const frame = (time) => {
        const linear = Math.min(1, (time - started) / duration);
        const eased = linear < 0.5
          ? 4 * linear * linear * linear
          : 1 - Math.pow(-2 * linear + 2, 3) / 2;
        window.scrollTo(0, start + (end - start) * eased);
        if (linear < 1) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(frame);
    });
  }, { ...range, duration: 4200 });
  await page.waitForTimeout(650);

  const diagnostics = await page.evaluate(() => ({
    scrollY: window.scrollY,
    progress: getComputedStyle(document.documentElement)
      .getPropertyValue("--experience-break-progress")
      .trim(),
    horizontalOverflow:
      document.documentElement.scrollWidth > document.documentElement.clientWidth,
    productOpacity: getComputedStyle(
      document.querySelector("[data-break-product]"),
    ).opacity,
  }));

  await context.close();
  if (!video) {
    throw new Error(`Playwright did not create ${profile.name} video`);
  }
  const generatedPath = await video.path();
  const finalPath = path.join(outputDir, `${profile.name}.webm`);
  await fs.rm(finalPath, { force: true });
  await fs.rename(generatedPath, finalPath);

  return {
    profile: profile.name,
    viewport: profile.viewport,
    range,
    diagnostics,
    consoleMessages,
    pageErrors,
    failedResponses,
    output: path.relative(process.cwd(), finalPath).replaceAll("\\", "/"),
  };
}

async function main() {
  const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
  const outputDir = path.join(
    process.cwd(),
    "artifacts",
    "v2",
    "signature-moments",
    "break",
  );
  await fs.mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch({
    executablePath: resolveBrowserExecutable(),
    headless: true,
    args: ["--use-angle=swiftshader", "--enable-webgl"],
  });

  const profiles = [
    { name: "desktop", viewport: { width: 1440, height: 900 } },
    { name: "mobile", viewport: { width: 390, height: 844 } },
  ];
  const results = [];
  try {
    for (const profile of profiles) {
      results.push(
        await recordBreakSignature(browser, baseUrl, outputDir, profile),
      );
    }
  } finally {
    await browser.close();
  }

  await fs.writeFile(
    path.join(outputDir, "recording-diagnostics.json"),
    `${JSON.stringify(results, null, 2)}\n`,
    "utf8",
  );

  const failed = results.some(
    (result) =>
      result.diagnostics.horizontalOverflow ||
      result.consoleMessages.length > 0 ||
      result.pageErrors.length > 0 ||
      result.failedResponses.length > 0,
  );
  if (failed) {
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  await main();
}
