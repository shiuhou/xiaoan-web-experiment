import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { resolveBrowserExecutable } from "./qa-runtime.mjs";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = path.join(process.cwd(), "artifacts", "v2", "concepts");
const directions = ["a", "b", "c"];
const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: resolveBrowserExecutable(),
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});
const results = [];

for (const [viewportName, viewport] of Object.entries(viewports)) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    colorScheme: "dark",
    reducedMotion: "no-preference",
    hasTouch: viewportName === "mobile",
    isMobile: viewportName === "mobile",
  });

  for (const direction of directions) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const failedResponses = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400) {
        failedResponses.push({ status: response.status(), url: response.url() });
      }
    });

    await page.goto(`${baseUrl}/concepts/${direction}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2100);
    await page.screenshot({
      path: path.join(outputDir, `${direction}-${viewportName}.png`),
      animations: "disabled",
    });

    const diagnostics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      productImages: document.querySelectorAll('img[alt*="Xiao-An"]').length,
    }));

    results.push({
      direction,
      viewport: viewportName,
      diagnostics,
      consoleErrors,
      pageErrors,
      failedResponses,
    });
    await page.close();
  }

  await context.close();
}

await browser.close();
await fs.writeFile(
  path.join(outputDir, "diagnostics.json"),
  JSON.stringify(results, null, 2),
  "utf8",
);

const failed = results.some(
  (result) =>
    result.diagnostics.overflow ||
    result.diagnostics.productImages !== 1 ||
    result.consoleErrors.length > 0 ||
    result.pageErrors.length > 0 ||
    result.failedResponses.length > 0,
);

if (failed) {
  throw new Error("V2 concept capture diagnostics failed");
}
