import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const passName = process.env.QA_PASS || "first-pass";
const outputDir = path.join(root, "artifacts", "qa", passName);
await fs.mkdir(outputDir, { recursive: true });

const mobile = process.env.QA_VIEWPORT === "mobile";
const reduced = process.env.QA_REDUCED === "1";
const viewport = mobile
  ? { width: 390, height: 844 }
  : { width: 1440, height: 900 };

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});

const context = await browser.newContext({
  viewport,
  deviceScaleFactor: 1,
  colorScheme: "dark",
  reducedMotion: reduced ? "reduce" : "no-preference",
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

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(2200);

const scenes = await page.locator("[data-scene]").evaluateAll((nodes) =>
  nodes.map((node) => ({
    id: node.id,
    top: node.getBoundingClientRect().top + window.scrollY,
    height: node.getBoundingClientRect().height,
  })),
);

const progressByScene = {
  awakening: 0,
  breaking: 0.82,
  perception: 0.78,
  edge: 0.68,
  understanding: 0.75,
  presence: 0.72,
  system: 0.86,
  closing: 0.2,
};

for (const scene of scenes) {
  const progress = progressByScene[scene.id] ?? 0.5;
  const scrollable = Math.max(0, scene.height - viewport.height);
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: "instant" }), scene.top + scrollable * progress);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(outputDir, `${scene.id}.png`) });
}

await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(outputDir, "full-page.png"), fullPage: true });

const diagnostics = await page.evaluate(() => ({
  viewport: { width: window.innerWidth, height: window.innerHeight },
  document: {
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
  },
  reducedMotion: document.documentElement.dataset.reducedMotion,
  webglCanvasCount: document.querySelectorAll("[data-edge-webgl] canvas").length,
  fallbackCount: document.querySelectorAll("[data-edge-fallback]").length,
  sceneCount: document.querySelectorAll("[data-scene]").length,
}));

await fs.writeFile(
  path.join(outputDir, "diagnostics.json"),
  JSON.stringify({ scenes, diagnostics, consoleMessages, pageErrors }, null, 2),
  "utf8",
);

await context.close();
await browser.close();
