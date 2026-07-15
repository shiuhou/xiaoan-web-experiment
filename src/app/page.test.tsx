import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExperienceController } from "@/components/experience/experience-controller";
import RootLayout from "./layout";
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
    expect(main?.querySelector("[data-scene]")).not.toBeInTheDocument();
    for (const legacyId of [
      "awakening",
      "breaking",
      "perception",
      "edge",
      "understanding",
      "system",
      "closing",
    ]) {
      expect(main?.querySelector(`#${legacyId}`)).not.toBeInTheDocument();
    }
  });

  it("ships only the V2 chrome without the legacy fixed signal thread", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <Home />
      </RootLayout>,
    );

    expect(markup).not.toContain("signal-thread");
    const document = new DOMParser().parseFromString(markup, "text/html");
    expect(
      document.querySelectorAll('nav[aria-label="Scene index"] a'),
    ).toHaveLength(6);
  });
});
