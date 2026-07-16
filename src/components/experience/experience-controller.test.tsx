import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ExperienceController } from "./experience-controller";
import {
  type ExperienceControllerValue,
  useExperience,
} from "./experience-context";

const ROOT_PROPERTY = "--experience-edge-intent-progress";

function captureController(): {
  get: () => ExperienceControllerValue;
  Probe: () => null;
} {
  let controller: ExperienceControllerValue | undefined;

  return {
    get: () => {
      if (!controller) throw new Error("Experience controller was not captured");
      return controller;
    },
    Probe: () => {
      controller = useExperience();
      return null;
    },
  };
}

afterEach(() => document.documentElement.style.removeProperty(ROOT_PROPERTY));

describe("ExperienceController", () => {
  it("mutates one stable frame and mirrors bounded act progress to CSS", () => {
    const capture = captureController();
    const { unmount } = render(
      <ExperienceController reducedMotion={false}>
        <capture.Probe />
      </ExperienceController>,
    );
    const controller = capture.get();
    const originalFrame = controller.frame;

    act(() => controller.setActProgress("edge-intent", 1.4));

    expect(controller.frame).toBe(originalFrame);
    expect(controller.frame.current.edgeIntent).toBe(1);
    expect(document.documentElement.style.getPropertyValue(ROOT_PROPERTY)).toBe(
      "1",
    );

    unmount();
    expect(document.documentElement.style.getPropertyValue(ROOT_PROPERTY)).toBe(
      "",
    );
  });
});
