import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExperienceController } from "@/components/experience/experience-controller";
import Home from "./page";

describe("Home page shell", () => {
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

  it("renders the complete six-act V2 narrative in order", () => {
    const { container } = render(
      <ExperienceController reducedMotion>
        <Home />
      </ExperienceController>,
    );
    const main = container.querySelector("main#main-content");
    const acts = [...(main?.querySelectorAll("[data-act]") ?? [])];

    expect(main).toBeInTheDocument();
    expect(acts.map((act) => act.id)).toEqual([
      "wake",
      "break",
      "signal",
      "edge-intent",
      "action",
      "presence",
    ]);
    expect(main?.querySelectorAll("h1")).toHaveLength(1);
  });
});
