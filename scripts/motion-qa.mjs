import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.join(process.cwd(), "artifacts", "qa", "motion-review");
await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl"],
});

const modes = ["normal", "fast", "slow"];
const results = [];

for (const mode of modes) {
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
  await page.waitForTimeout(3200);
  const maxScroll = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );

  if (mode === "fast") {
    await page.evaluate((target) => window.scrollTo({ top: target, behavior: "instant" }), maxScroll);
    await page.waitForTimeout(1500);
  } else {
    const step = mode === "normal" ? 620 : 180;
    const delay = mode === "normal" ? 78 : 38;
    for (let target = step; target <= maxScroll + step; target += step) {
      await page.evaluate(
        (position) => window.scrollTo({ top: position, behavior: "instant" }),
        Math.min(target, maxScroll),
      );
      await page.waitForTimeout(delay);
    }
    await page.waitForTimeout(900);
  }

  const endState = await page.evaluate(() => ({
    scrollY: window.scrollY,
    maxScroll: document.documentElement.scrollHeight - window.innerHeight,
    closingVisible: document.getElementById("closing")?.getBoundingClientRect().top ?? null,
    activeIndex: document.querySelector(".scene-nav__toggle strong")?.textContent?.trim() ?? null,
    horizontalOverflow:
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  await page.screenshot({ path: path.join(outputDir, `${mode}-bottom.png`) });

  await page.evaluate(() => document.getElementById("awakening")?.scrollIntoView());
  await page.waitForTimeout(1800);
  const replayState = await page.evaluate(() => ({
    scrollY: window.scrollY,
    heroTop: document.getElementById("awakening")?.getBoundingClientRect().top ?? null,
    heroOpacity: getComputedStyle(
      document.querySelector(".product-layer--body"),
    ).opacity,
    activeIndex: document.querySelector(".scene-nav__toggle strong")?.textContent?.trim() ?? null,
  }));
  await page.screenshot({ path: path.join(outputDir, `${mode}-replay.png`) });

  const edgeTarget = await page.evaluate(() => {
    const edge = document.getElementById("edge");
    return edge ? edge.offsetTop + Math.max(0, (edge.offsetHeight - innerHeight) * 0.52) : 0;
  });
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: "instant" }), edgeTarget);
  await page.waitForTimeout(900);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  const reloadState = await page.evaluate(() => ({
    scrollY: window.scrollY,
    edgeTop: document.getElementById("edge")?.getBoundingClientRect().top ?? null,
    canvasCount: document.querySelectorAll("[data-edge-webgl] canvas").length,
    bodyTextLength: document.body.innerText.length,
  }));

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.waitForTimeout(700);
  const resizeState = await page.evaluate(() => ({
    width: innerWidth,
    height: innerHeight,
    horizontalOverflow:
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    sceneCount: document.querySelectorAll("[data-scene]").length,
  }));

  results.push({
    mode,
    endState,
    replayState,
    reloadState,
    resizeState,
    consoleMessages,
    pageErrors,
  });
  await context.close();
}

await fs.writeFile(
  path.join(outputDir, "results.json"),
  JSON.stringify(results, null, 2),
  "utf8",
);
await browser.close();
