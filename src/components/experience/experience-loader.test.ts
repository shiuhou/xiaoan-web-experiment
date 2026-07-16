import { describe, expect, it, vi } from "vitest";
import { createWebGLSupportReader } from "./experience-loader";

describe("WebGL support reader", () => {
  it("probes once, caches the result, and releases the temporary context", () => {
    const loseContext = vi.fn();
    const getExtension = vi.fn(() => ({ loseContext }));
    const getContext = vi.fn((kind: string) =>
      kind === "webgl2" ? { getExtension } : null,
    );
    const createCanvas = vi.fn(() => ({ getContext }));
    const readSupport = createWebGLSupportReader(createCanvas);

    expect(readSupport()).toBe(true);
    expect(readSupport()).toBe(true);
    expect(createCanvas).toHaveBeenCalledTimes(1);
    expect(getContext).toHaveBeenCalledTimes(1);
    expect(getExtension).toHaveBeenCalledWith("WEBGL_lose_context");
    expect(loseContext).toHaveBeenCalledTimes(1);
  });

  it("rejects WebGL1-only devices because the renderer requires WebGL2", () => {
    const webgl1 = { getExtension: vi.fn() };
    const getContext = vi.fn((kind: string) =>
      kind === "webgl" ? webgl1 : null,
    );
    const readSupport = createWebGLSupportReader(() => ({ getContext }));

    expect(readSupport()).toBe(false);
    expect(getContext).toHaveBeenCalledTimes(1);
    expect(getContext).toHaveBeenCalledWith("webgl2");
  });
});
