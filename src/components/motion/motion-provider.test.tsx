import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MotionProvider } from "./motion-provider";
import { SignalThread } from "./signal-thread";

const mocks = vi.hoisted(() => ({
  destroy: vi.fn(),
  on: vi.fn(),
  raf: vi.fn(),
  refresh: vi.fn(),
  update: vi.fn(),
  kill: vi.fn(),
}));

vi.mock("lenis", () => ({
  default: class MockLenis {
    destroy = mocks.destroy;
    on = mocks.on;
    raf = mocks.raf;
  },
}));

vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    context: (callback: () => void) => {
      callback();
      return { revert: mocks.kill };
    },
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { refresh: mocks.refresh, update: mocks.update },
}));

function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("MotionProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  it("keeps content complete and skips Lenis in reduced-motion mode", () => {
    setReducedMotion(true);

    render(
      <MotionProvider>
        <p>Readable scene</p>
      </MotionProvider>,
    );

    expect(screen.getByText("Readable scene")).toBeVisible();
    expect(screen.getByTestId("motion-root")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(mocks.on).not.toHaveBeenCalled();
  });

  it("initialises and cleans up the motion lifecycle when motion is allowed", () => {
    setReducedMotion(false);

    const { unmount } = render(
      <MotionProvider>
        <p>Animated scene</p>
      </MotionProvider>,
    );

    expect(mocks.on).toHaveBeenCalledWith("scroll", mocks.update);
    unmount();
    expect(mocks.destroy).toHaveBeenCalledTimes(1);
    expect(mocks.kill).toHaveBeenCalledTimes(1);
  });
});

describe("SignalThread", () => {
  it("is decorative and unavailable to assistive focus", () => {
    const { container } = render(<SignalThread />);

    const thread = container.firstElementChild;
    expect(thread).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll("a,button,[tabindex='0']")).toHaveLength(0);
  });
});
