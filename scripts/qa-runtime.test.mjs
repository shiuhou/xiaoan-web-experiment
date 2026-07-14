import assert from "node:assert/strict";
import test from "node:test";
import { resolveBrowserExecutable } from "./qa-runtime.mjs";

test("uses Playwright Chromium when CHROME_PATH is absent", () => {
  assert.equal(resolveBrowserExecutable({}), undefined);
});

test("uses an explicitly supplied CHROME_PATH without hard-coding a platform path", () => {
  assert.equal(
    resolveBrowserExecutable({ CHROME_PATH: "C:/browser/chrome.exe" }),
    "C:/browser/chrome.exe",
  );
});
