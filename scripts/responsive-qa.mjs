import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const sizes = [
  { width: 1920, height: 1080 },
  { width: 1280, height: 720 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
];

const outputDir = path.join(process.cwd(), "artifacts", "qa", "responsive");
await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});

const results = [];

for (const viewport of sizes) {
  const mobile = viewport.width <= 767;
  const context = await browser.newContext({
    viewport,
    colorScheme: "dark",
    reducedMotion: "no-preference",
    hasTouch: mobile,
    isMobile: mobile,
  });
  const page = await context.newPage();
  const consoleMessages = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text() });
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("http://localhost:3000", {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.waitForTimeout(2300);

  const topState = await page.evaluate(() => {
    const hero = document.querySelector(".hero-scene");
    const title = document.querySelector(".hero-title");
    const product = document.querySelector("[data-product-stage]");
    const rect = (element) => {
      const bounds = element?.getBoundingClientRect();
      return bounds
        ? { top: bounds.top, right: bounds.right, bottom: bounds.bottom, left: bounds.left }
        : null;
    };
    return {
      sceneCount: document.querySelectorAll("[data-scene]").length,
      navigator: Boolean(document.querySelector(".scene-nav")),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      hero: rect(hero),
      title: rect(title),
      product: rect(product),
    };
  });

  const edgeTarget = await page.evaluate(() => {
    const edge = document.getElementById("edge");
    return edge
      ? edge.offsetTop + Math.max(0, edge.offsetHeight - innerHeight) * 0.68
      : innerHeight * 3;
  });
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: "instant" }), edgeTarget);
  await page.waitForTimeout(1100);

  const edgeState = await page.evaluate(() => ({
    webglCanvasCount: document.querySelectorAll("[data-edge-webgl] canvas").length,
    fallbackCount: document.querySelectorAll("[data-edge-fallback]").length,
    activeScene: document.querySelector(".scene-nav__toggle strong")?.textContent?.trim() ?? null,
  }));

  results.push({ viewport, topState, edgeState, consoleMessages, pageErrors });
  await context.close();
}

await browser.close();
await fs.writeFile(
  path.join(outputDir, "results.json"),
  JSON.stringify(results, null, 2),
  "utf8",
);

if (
  results.some(
    (result) =>
      result.topState.sceneCount !== 8 ||
      result.topState.overflow !== 0 ||
      !result.topState.navigator ||
      result.consoleMessages.length > 0 ||
      result.pageErrors.length > 0,
  )
) {
  process.exitCode = 1;
}
