import assert from "node:assert/strict";
import test from "node:test";
import {
  V2_ACT_IDS,
  hasQaFailures,
  resolveBrowserExecutable,
} from "./qa-runtime.mjs";

test("uses Playwright Chromium when CHROME_PATH is absent", () => {
  assert.equal(resolveBrowserExecutable({}), undefined);
});

test("uses an explicitly supplied CHROME_PATH without hard-coding a platform path", () => {
  assert.equal(
    resolveBrowserExecutable({ CHROME_PATH: "C:/browser/chrome.exe" }),
    "C:/browser/chrome.exe",
  );
});

test("defines the six-act V2 runtime contract", () => {
  assert.deepEqual(V2_ACT_IDS, [
    "wake",
    "break",
    "signal",
    "edge-intent",
    "action",
    "presence",
  ]);
});

test("fails QA for overflow, runtime errors, missing assets, or incomplete acts", () => {
  const clean = {
    diagnostics: {
      actIds: V2_ACT_IDS,
      horizontalOverflow: 0,
      missingImages: [],
      navigationLinks: 6,
    },
    issues: {
      consoleMessages: [],
      consoleErrors: [],
      pageErrors: [],
      failedResponses: [],
    },
  };
  assert.equal(hasQaFailures(clean), false);
  assert.equal(
    hasQaFailures({
      ...clean,
      diagnostics: { ...clean.diagnostics, horizontalOverflow: 1 },
    }),
    true,
  );
  assert.equal(
    hasQaFailures({
      ...clean,
      issues: { ...clean.issues, pageErrors: ["boom"] },
    }),
    true,
  );
  assert.equal(
    hasQaFailures({
      ...clean,
      issues: { ...clean.issues, consoleMessages: ["warning"] },
    }),
    true,
  );
});
