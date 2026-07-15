import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExperienceController } from "@/components/experience/experience-controller";
import { getBreakMotionProfile } from "@/components/motion/break-timeline";
import { BreakAct } from "./break-act";

describe("BreakAct", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  it("cuts one coherent interface into exactly two spatial halves", () => {
    const { container } = render(
      <ExperienceController reducedMotion>
        <BreakAct />
      </ExperienceController>,
    );

    expect(screen.getAllByTestId("screen-half")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "把智能，帶出屏幕。" }),
    ).toBeVisible();
    expect(container.querySelectorAll("[data-interface-canvas]")).toHaveLength(2);
    expect(container.querySelectorAll("[data-break-product]")).toHaveLength(1);
    expect(
      screen.getByRole("img", { name: /Xiao-An entering physical space/i }),
    ).toHaveAttribute("loading", "lazy");
  });

  it("uses independent desktop and mobile fracture axes", () => {
    expect(getBreakMotionProfile(false)).toMatchObject({
      axis: "x",
      rotationProperty: "rotationY",
      rotationDegrees: 18,
    });
    expect(getBreakMotionProfile(true)).toMatchObject({
      axis: "y",
      rotationProperty: "rotationX",
      rotationDegrees: 11,
    });
  });
});
