export const V2_ACT_IDS = Object.freeze([
  "wake",
  "break",
  "signal",
  "edge-intent",
  "action",
  "presence",
]);

export const V2_CAPTURE_PROGRESS = Object.freeze({
  wake: 0,
  break: 0.44,
  signal: 0.78,
  "edge-intent": 0.84,
  action: 0.68,
  presence: 0,
});

export function resolveBrowserExecutable(environment = process.env) {
  const executablePath = environment.CHROME_PATH?.trim();
  return executablePath || undefined;
}

export function attachIssueCollector(page) {
  const issues = {
    consoleMessages: [],
    consoleErrors: [],
    pageErrors: [],
    failedResponses: [],
    requestFailures: [],
  };

  page.on("console", (message) => {
    if (!["warning", "error"].includes(message.type())) return;
    const entry = { type: message.type(), text: message.text() };
    issues.consoleMessages.push(entry);
    if (message.type() === "error") issues.consoleErrors.push(entry);
  });
  page.on("pageerror", (error) => issues.pageErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) {
      issues.failedResponses.push({
        status: response.status(),
        url: response.url(),
      });
    }
  });
  page.on("requestfailed", (request) => {
    issues.requestFailures.push({
      url: request.url(),
      error: request.failure()?.errorText ?? "unknown request failure",
    });
  });

  return issues;
}

export async function waitForV2Page(page, settleMs = 1900) {
  await page.waitForLoadState("load");
  await page.locator(".v2-narrative[data-v2-motion-state]").waitFor({
    state: "attached",
    timeout: 30_000,
  });
  await page.waitForTimeout(settleMs);
}

export async function getActGeometry(page) {
  return page.locator("[data-act]").evaluateAll((nodes) =>
    nodes.map((node) => {
      const bounds = node.getBoundingClientRect();
      return {
        id: node.id,
        top: bounds.top + window.scrollY,
        height: bounds.height,
      };
    }),
  );
}

export function getActScrollTarget(act, viewportHeight, progress = 0.5) {
  const scrollable = Math.max(0, act.height - viewportHeight);
  return Math.max(0, act.top + scrollable * progress);
}

export async function collectRuntimeDiagnostics(page) {
  return page.evaluate(() => ({
    viewport: { width: window.innerWidth, height: window.innerHeight },
    actIds: [...document.querySelectorAll("[data-act]")].map(
      (node) => node.id,
    ),
    navigationLinks: document.querySelectorAll(
      'nav[aria-label="Scene index"] a',
    ).length,
    horizontalOverflow: Math.max(
      0,
      document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
    scrollHeight: document.documentElement.scrollHeight,
    reducedMotion: document.documentElement.dataset.reducedMotion ?? null,
    motionState:
      document.querySelector(".v2-narrative")?.dataset.v2MotionState ?? null,
    layout: document.querySelector(".v2-narrative")?.dataset.v2Layout ?? null,
    canvas: [...document.querySelectorAll(".experience-loader")].map(
      (loader) => ({
        ready: loader.dataset.canvasReady,
        active: loader.dataset.canvasActive,
        enabled: loader.dataset.webglEnabled,
        hasCanvas: Boolean(loader.querySelector("canvas")),
      }),
    ),
    missingImages: [...document.images]
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
  }));
}

export function hasQaFailures(result) {
  const diagnostics = result.diagnostics ?? {};
  const issues = result.issues ?? {};
  const actIds = diagnostics.actIds ?? [];
  const incompleteActs =
    actIds.length !== V2_ACT_IDS.length ||
    actIds.some((id, index) => id !== V2_ACT_IDS[index]);

  return Boolean(
    incompleteActs ||
      diagnostics.navigationLinks !== V2_ACT_IDS.length ||
      diagnostics.horizontalOverflow > 0 ||
      (diagnostics.missingImages?.length ?? 0) > 0 ||
      (issues.consoleErrors?.length ?? 0) > 0 ||
      (issues.pageErrors?.length ?? 0) > 0 ||
      (issues.failedResponses?.length ?? 0) > 0 ||
      (issues.requestFailures?.length ?? 0) > 0
  );
}
