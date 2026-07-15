import assert from "node:assert/strict";
import test from "node:test";
import { getSignatureScrollRange } from "./record-v2-signatures.mjs";

test("derives the pinned signature scroll range from section geometry", () => {
  assert.deepEqual(
    getSignatureScrollRange({
      offsetTop: 1575,
      offsetHeight: 1665,
      viewportHeight: 900,
    }),
    { start: 1575, end: 2340 },
  );
});
