import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExperienceController } from "@/components/experience/experience-controller";
import { V2NarrativeMotion } from "./v2-narrative-motion";

const mocks = vi.hoisted(() => ({
  reducedMotion: true as boolean | null,
  mediaRevert: vi.fn(),
  contextRevert: vi.fn(),
  desktop: vi.fn(),
  mobile: vi.fn(),
}));

vi.mock("@/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => mocks.reducedMotion,
}));

vi.mock("./desktop-timeline", () => ({
  createDesktopTimeline: mocks.desktop,
}));

vi.mock("./mobile-timeline", () => ({
  createMobileTimeline: mocks.mobile,
}));

vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    context: (callback: () => void) => {
      callback();
      return { revert: mocks.contextRevert };
    },
    matchMedia: () => ({
      add: (query: string, callback: () => void | (() => void)) => {
        if (query.includes("min-width")) callback();
      },
      revert: mocks.mediaRevert,
    }),
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { refresh: vi.fn() },
}));

describe("V2NarrativeMotion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.reducedMotion = true;
  });

  it("exposes complete final compositions when motion is reduced", () => {
    render(
      <ExperienceController reducedMotion>
        <V2NarrativeMotion>
          <section data-act="wake">Wake</section>
          <section data-act="presence">Presence</section>
        </V2NarrativeMotion>
      </ExperienceController>,
    );

    expect(screen.getByTestId("v2-narrative-motion")).toHaveAttribute(
      "data-v2-motion-state",
      "final",
    );
    expect(screen.getByText("Wake")).toBeVisible();
    expect(screen.getByText("Presence")).toBeVisible();
    expect(mocks.desktop).not.toHaveBeenCalled();
    expect(mocks.mobile).not.toHaveBeenCalled();
  });

  it("uses one responsive cleanup boundary for registered timelines", () => {
    mocks.reducedMotion = false;
    const { unmount } = render(
      <ExperienceController reducedMotion={false}>
        <V2NarrativeMotion>
          <section data-act="wake">Wake</section>
        </V2NarrativeMotion>
      </ExperienceController>,
    );

    expect(mocks.desktop).toHaveBeenCalledTimes(1);
    expect(mocks.mobile).not.toHaveBeenCalled();
    unmount();
    expect(mocks.mediaRevert).toHaveBeenCalledTimes(1);
  });
});
