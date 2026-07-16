import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { resolveBrowserExecutable } from "./qa-runtime.mjs";

const root = process.cwd();
const recordingRoot = path.join(root, "artifacts", "v2", "recordings");
const signatureRoot = path.join(root, "artifacts", "v2", "signature-moments");

async function findVideos(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const videos = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) videos.push(...await findVideos(entryPath));
    else if (entry.name.endsWith(".webm")) videos.push(entryPath);
  }
  return videos;
}

const browser = await chromium.launch({
  executablePath: resolveBrowserExecutable(),
  headless: true,
  args: ["--allow-file-access-from-files"],
});
const page = await browser.newPage();
const results = [];
try {
  const videos = [
    ...await findVideos(recordingRoot),
    ...await findVideos(signatureRoot),
  ];
  for (const file of videos.sort()) {
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.waitForFunction(() => {
      const video = document.querySelector("video");
      return video && Number.isFinite(video.duration) && video.duration > 0;
    });
    const metadata = await page.evaluate(() => {
      const video = document.querySelector("video");
      if (!video) throw new Error("Video element is missing");
      return {
        durationSeconds: Number(video.duration.toFixed(3)),
        width: video.videoWidth,
        height: video.videoHeight,
      };
    });
    const stats = await fs.stat(file);
    results.push({
      file: path.relative(root, file).replaceAll("\\", "/"),
      bytes: stats.size,
      ...metadata,
    });
  }
} finally {
  await browser.close();
}

await fs.writeFile(
  path.join(recordingRoot, "video-metadata.json"),
  `${JSON.stringify(results, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(results, null, 2));
