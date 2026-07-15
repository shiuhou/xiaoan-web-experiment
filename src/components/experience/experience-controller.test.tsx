import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ExperienceController } from "./experience-controller";
import {
  type ExperienceControllerValue,
  useExperience,
} from "./experience-context";

const ROOT_PROPERTIES = [
  "--experience-edge-intent-progress",
  "--experience-velocity",
  "--experience-skew",
  "--experience-ribbon-stretch",
  "--experience-chromatic-offset",
] as const;

function captureController(): {
  get: () => ExperienceControllerValue;
  Probe: () => null;
} {
  let controller: ExperienceControllerValue | undefined;

  return {
    get: () => {
      if (!controller) {
        throw new Error("Experience controller was not captured");
      }
      return controller;
    },
    Probe: () => {
      controller = useExperience();
      return null;
    },
  };
}

afterEach(() => {
  for (const property of ROOT_PROPERTIES) {
    document.documentElement.style.removeProperty(property);
  }
});

describe("ExperienceController", () => {
  it("mutates one stable frame and mirrors bounded values to CSS", () => {
    const capture = captureController();
    const { unmount } = render(
      <ExperienceController reducedMotion={false}>
        <capture.Probe />
      </ExperienceController>,
    );
    const controller = capture.get();
    const originalFrame = controller.frame;

    act(() => controller.setActProgress("edge-intent", 1.4));
    act(() => controller.setVelocity(800));

    expect(controller.frame).toBe(originalFrame);
    expect(controller.frame.current.edgeIntent).toBe(1);
    expect(controller.frame.current.velocity).toBe(0.5);
    expect(
      document.documentElement.style.getPropertyValue(
        "--experience-edge-intent-progress",
      ),
    ).toBe("1");
    expect(
      document.documentElement.style.getPropertyValue("--experience-skew"),
    ).toBe("0.9deg");
    expect(
      document.documentElement.style.getPropertyValue(
        "--experience-ribbon-stretch",
      ),
    ).toBe("1.06");
    expect(
      document.documentElement.style.getPropertyValue(
        "--experience-chromatic-offset",
      ),
    ).toBe("2px");

    unmount();
    for (const property of ROOT_PROPERTIES) {
      expect(document.documentElement.style.getPropertyValue(property)).toBe("");
    }
  });

  it("forces velocity response to zero for Reduced Motion", () => {
    const capture = captureController();
    render(
      <ExperienceController reducedMotion>
        <capture.Probe />
      </ExperienceController>,
    );
    const controller = capture.get();

    act(() => controller.setVelocity(5000));

    expect(controller.frame.current.velocity).toBe(0);
    expect(
      document.documentElement.style.getPropertyValue("--experience-velocity"),
    ).toBe("0");
  });

  it("clears existing velocity when Reduced Motion becomes active", () => {
    const capture = captureController();
    const { rerender } = render(
      <ExperienceController reducedMotion={false}>
        <capture.Probe />
      </ExperienceController>,
    );

    act(() => capture.get().setVelocity(1600));
    expect(capture.get().frame.current.velocity).toBe(1);

    rerender(
      <ExperienceController reducedMotion>
        <capture.Probe />
      </ExperienceController>,
    );

    expect(capture.get().frame.current.velocity).toBe(0);
    expect(
      document.documentElement.style.getPropertyValue("--experience-velocity"),
    ).toBe("0");
  });
});
