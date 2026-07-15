import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExperienceController } from "@/components/experience/experience-controller";
import { EdgeIntentAct } from "@/components/acts/edge-intent-act";
import { ExperienceFallback } from "./experience-fallback";
import { getTunnelPoint, TUNNEL_BUDGET } from "./edge-tunnel";

describe("Edge tunnel and causal decision path", () => {
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

  it("moves raw tunnel points into bounded lanes", () => {
    const raw = getTunnelPoint(17, 0);
    const ordered = getTunnelPoint(17, 1);

    expect(Math.abs(ordered[1])).toBeLessThan(Math.abs(raw[1]));
    expect(Math.abs(ordered[2])).toBeLessThan(Math.abs(raw[2]));
    expect(TUNNEL_BUDGET.desktopPoints).toBeLessThanOrEqual(900);
    expect(TUNNEL_BUDGET.mobilePoints).toBeLessThanOrEqual(360);
  });

  it("keeps outputs after decision in DOM order", () => {
    const { container } = render(
      <ExperienceController reducedMotion>
        <EdgeIntentAct />
      </ExperienceController>,
    );

    const labels = [
      ...container.querySelectorAll("[data-decision-stage]"),
    ].map((node) => node.getAttribute("data-decision-stage"));
    expect(labels).toEqual([
      "INPUT",
      "CONTEXT",
      "MEMORY",
      "SKILLS",
      "DECISION",
      "OUTPUT",
    ]);
    expect(container.querySelectorAll("[data-agent-output]")).toHaveLength(3);
  });

  it("keeps the real DK-2500 recognisable and the fallback complete", () => {
    const { container } = render(
      <ExperienceController reducedMotion>
        <EdgeIntentAct />
      </ExperienceController>,
    );

    expect(
      screen.getByRole("img", { name: /Intel DK-2500 edge hardware/i }),
    ).toHaveAttribute("loading", "lazy");
    expect(container.querySelector("[data-edge-tunnel-fallback]")).toBeVisible();
    expect(screen.getAllByText(/OpenClaw/i).length).toBeGreaterThan(0);
  });

  it("renders a non-empty edge fallback without WebGL", () => {
    const { container } = render(<ExperienceFallback mode="edge" />);

    expect(container.querySelector("[data-edge-tunnel-fallback]")).toBeVisible();
    expect(container.querySelectorAll("[data-fallback-lane]")).toHaveLength(3);
  });
});
