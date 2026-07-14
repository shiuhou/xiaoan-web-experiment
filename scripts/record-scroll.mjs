import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.join(process.cwd(), "artifacts", "recordings");
await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: outputDir, size: { width: 1440, height: 900 } },
  colorScheme: "dark",
  reducedMotion: "no-preference",
});
const page = await context.newPage();
const warnings = [];
const errors = [];
page.on("console", (message) => {
  if (["warning", "error"].includes(message.type())) {
    warnings.push({ type: message.type(), text: message.text() });
  }
});
page.on("pageerror", (error) => errors.push(error.message));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(4300);
const video = page.video();

await page.evaluate(async () => {
  const destination = document.documentElement.scrollHeight - innerHeight;
  const duration = 22000;
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
await page.waitForTimeout(2400);

const diagnostics = await page.evaluate(() => ({
  scrollY: window.scrollY,
  maxScroll: document.documentElement.scrollHeight - innerHeight,
  activeIndex: document.querySelector(".scene-nav__toggle strong")?.textContent?.trim(),
  horizontalOverflow:
    document.documentElement.scrollWidth - document.documentElement.clientWidth,
  webglCanvasCount: document.querySelectorAll("[data-edge-webgl] canvas").length,
}));

await context.close();
await browser.close();

if (!video) throw new Error("Playwright did not create a video handle.");
const generatedPath = await video.path();
const finalPath = path.join(outputDir, "xiaoan-scroll-desktop.webm");
if (path.resolve(generatedPath) !== path.resolve(finalPath)) {
  await fs.rename(generatedPath, finalPath);
}
await fs.writeFile(
  path.join(outputDir, "recording-diagnostics.json"),
  JSON.stringify({ diagnostics, warnings, errors }, null, 2),
  "utf8",
);
