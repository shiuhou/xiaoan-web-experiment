import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExperienceController } from "@/components/experience/experience-controller";
import { SignalAct } from "./signal-act";

describe("SignalAct", () => {
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

  it("uses five distinct inputs and four assembled event tokens", () => {
    const { container } = render(
      <ExperienceController reducedMotion>
        <SignalAct />
      </ExperienceController>,
    );

    expect(container.querySelectorAll("[data-signal-kind]")).toHaveLength(5);
    expect(
      [...container.querySelectorAll("[data-signal-kind]")].map((node) =>
        node.getAttribute("data-signal-kind"),
      ),
    ).toEqual(["camera", "voice", "expression", "time", "context"]);
    expect(container.querySelectorAll("[data-event-token]")).toHaveLength(4);
    expect(container.querySelector("[data-signal-chamber]")).toBeInTheDocument();
    expect(container.querySelector("[data-signal-flash]")).toBeInTheDocument();
    expect(screen.queryByText(/accuracy|latency|\d+ms|%/i)).not.toBeInTheDocument();
    expect(container.querySelector(".experience-loader")).not.toBeInTheDocument();
  });
});
