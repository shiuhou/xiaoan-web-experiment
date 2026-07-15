import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useExperience } from "@/components/experience/experience-context";
import { MotionProvider } from "./motion-provider";
import { SignalThread } from "./signal-thread";

const mocks = vi.hoisted(() => ({
  destroy: vi.fn(),
  on: vi.fn(),
  raf: vi.fn(),
  refresh: vi.fn(),
  update: vi.fn(),
  kill: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
}));

vi.mock("lenis", () => ({
  default: class MockLenis {
    destroy = mocks.destroy;
    on = mocks.on;
    raf = mocks.raf;
    start = mocks.start;
    stop = mocks.stop;
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

function ExperienceProbe() {
  const { frame } = useExperience();
  return <output data-testid="experience-probe">{frame.current.wake}</output>;
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

  it("provides one experience controller to narrative descendants", () => {
    setReducedMotion(true);

    render(
      <MotionProvider>
        <ExperienceProbe />
      </MotionProvider>,
    );

    expect(screen.getByTestId("experience-probe")).toHaveTextContent("0");
  });

  it("initialises and cleans up the motion lifecycle when motion is allowed", () => {
    setReducedMotion(false);

    const { unmount } = render(
      <MotionProvider>
        <p>Animated scene</p>
      </MotionProvider>,
    );

    expect(mocks.on).toHaveBeenCalledWith("scroll", expect.any(Function));
    unmount();
    expect(mocks.destroy).toHaveBeenCalledTimes(1);
    expect(mocks.kill).toHaveBeenCalledTimes(1);
  });

  it("forwards Lenis velocity into the bounded experience response", () => {
    setReducedMotion(false);

    const { unmount } = render(
      <MotionProvider>
        <p>Velocity scene</p>
      </MotionProvider>,
    );
    const scrollCall = mocks.on.mock.calls.find(([event]) => event === "scroll");
    const scrollCallback = scrollCall?.[1] as
      | ((lenis: { velocity: number }) => void)
      | undefined;

    expect(scrollCallback).toBeTypeOf("function");
    act(() => scrollCallback?.({ velocity: 20 }));

    expect(mocks.update).toHaveBeenCalledTimes(1);
    expect(
      document.documentElement.style.getPropertyValue("--experience-velocity"),
    ).toBe("0.75");

    unmount();
    expect(
      document.documentElement.style.getPropertyValue("--experience-velocity"),
    ).toBe("");
  });

  it("pauses smooth scrolling while the scene index is open", () => {
    setReducedMotion(false);
    const { unmount } = render(
      <MotionProvider>
        <p>Indexed scene</p>
      </MotionProvider>,
    );

    act(() => {
      window.dispatchEvent(
        new CustomEvent("xiaoan:scene-index", { detail: { open: true } }),
      );
    });
    expect(mocks.stop).toHaveBeenCalledTimes(1);

    act(() => {
      window.dispatchEvent(
        new CustomEvent("xiaoan:scene-index", { detail: { open: false } }),
      );
    });
    expect(mocks.start).toHaveBeenCalledTimes(1);
    unmount();
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
