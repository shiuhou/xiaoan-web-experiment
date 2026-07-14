import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.join(process.cwd(), "artifacts", "screenshots");
await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: "dark",
  reducedMotion: "no-preference",
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

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(4300);
await page.screenshot({ path: path.join(outputDir, "hero-1440x900.png") });

const signatureTarget = await page.evaluate(() => {
  const scene = document.getElementById("breaking");
  return scene
    ? scene.offsetTop + Math.max(0, scene.offsetHeight - innerHeight) * 0.82
    : innerHeight;
});
await page.evaluate(
  (target) => window.scrollTo({ top: target, behavior: "instant" }),
  signatureTarget,
);
await page.waitForTimeout(1400);
await page.screenshot({ path: path.join(outputDir, "signature-moment-1440x900.png") });

const diagnostics = await page.evaluate(() => ({
  horizontalOverflow:
    document.documentElement.scrollWidth - document.documentElement.clientWidth,
  sceneCount: document.querySelectorAll("[data-scene]").length,
  webglCanvasCount: document.querySelectorAll("[data-edge-webgl] canvas").length,
  reducedMotion: document.documentElement.dataset.reducedMotion,
}));
await fs.writeFile(
  path.join(outputDir, "capture-diagnostics.json"),
  JSON.stringify({ diagnostics, consoleMessages, pageErrors }, null, 2),
  "utf8",
);

await context.close();
await browser.close();
