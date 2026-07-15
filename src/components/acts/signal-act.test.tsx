import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExperienceController } from "@/components/experience/experience-controller";
import {
  getSignalFieldPoint,
  SIGNAL_FIELD_BUDGET,
} from "@/components/experience/signal-field";
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
    expect(screen.queryByText(/accuracy|latency|\d+ms|%/i)).not.toBeInTheDocument();
  });

  it("keeps field points bounded while compressing toward ordered lanes", () => {
    expect(SIGNAL_FIELD_BUDGET.desktopPoints).toBeLessThanOrEqual(420);
    expect(SIGNAL_FIELD_BUDGET.mobilePoints).toBeLessThanOrEqual(180);
    const raw = getSignalFieldPoint(17, 0);
    const compressed = getSignalFieldPoint(17, 1);
    expect(Math.abs(compressed[0])).toBeLessThan(Math.abs(raw[0]));
    expect(Math.abs(compressed[1])).toBeLessThan(Math.abs(raw[1]));
  });
});
