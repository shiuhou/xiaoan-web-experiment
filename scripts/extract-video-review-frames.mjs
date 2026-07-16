import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { resolveBrowserExecutable } from "./qa-runtime.mjs";

const root = process.cwd();
const outputDir = path.join(root, "artifacts", "v2", "recordings", "review-frames");
await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

const profiles = [
  ...(process.env.REVIEW_SOCIAL_SOURCE === "1"
    ? [
        {
          name: "social-source",
          file: "xiaoan-v2-social-source.webm",
          viewport: { width: 720, height: 900 },
          times: [2, 5, 8, 11, 14],
          sequential: true,
        },
      ]
    : []),
  {
    name: "social",
    file: "xiaoan-v2-social-15s.webm",
    viewport: { width: 1080, height: 1350 },
    times: [2, 5, 8, 11, 14],
    sequential: true,
  },
  {
    name: "desktop",
    file: "xiaoan-v2-desktop.webm",
    viewport: { width: 1440, height: 900 },
    times: [3, 9, 16, 22, 27],
  },
];

const browser = await chromium.launch({
  executablePath: resolveBrowserExecutable(),
  headless: true,
  args: ["--allow-file-access-from-files"],
});
try {
  for (const profile of profiles) {
    const context = await browser.newContext({ viewport: profile.viewport });
    const page = await context.newPage();
    const file = path.join(root, "artifacts", "v2", "recordings", profile.file);
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.addStyleTag({
      content:
        "html,body{margin:0;background:#000;overflow:hidden}video{width:100vw!important;height:100vh!important;object-fit:contain}",
    });
    await page.waitForFunction(() => {
      const video = document.querySelector("video");
      return video && Number.isFinite(video.duration) && video.duration > 0;
    });
    if (profile.sequential) {
      await page.evaluate(async () => {
        const video = document.querySelector("video");
        video.currentTime = 0;
        await video.play();
      });
    }
    for (const time of profile.times) {
      const captureTime = await page.evaluate(
        (requestedTime) => {
          const video = document.querySelector("video");
          return Math.min(requestedTime, Math.max(0, video.duration - 0.05));
        },
        time,
      );
      if (profile.sequential) {
        await page.waitForFunction(
          (targetTime) => document.querySelector("video").currentTime >= targetTime,
          captureTime,
          { timeout: 30_000 },
        );
        await page.evaluate(() => document.querySelector("video").pause());
      } else {
        await page.evaluate(async (seekTime) => {
          const video = document.querySelector("video");
          if (!video) throw new Error("Video element is missing");
          video.pause();
          await new Promise((resolve) => {
            video.addEventListener("seeked", resolve, { once: true });
            video.currentTime = Math.min(
              seekTime,
              Math.max(0, video.duration - 0.05),
            );
          });
        }, captureTime);
      }
      await page.screenshot({
        path: path.join(
          outputDir,
          `${profile.name}-${String(time).padStart(2, "0")}.png`,
        ),
      });
      if (profile.sequential) {
        await page.evaluate(() => document.querySelector("video").play());
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
