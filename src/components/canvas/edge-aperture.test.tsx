import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EDGE_LABELS } from "@/content/site-content";
import { EdgeApertureFallback } from "./edge-aperture-fallback";
import { EDGE_RENDER_BUDGET, getEdgeSignalPosition } from "./edge-aperture";
import { PerceptionScene } from "@/components/scenes/perception-scene";
import { UnderstandingScene } from "@/components/scenes/understanding-scene";

describe("Edge aperture", () => {
  it("provides a designed, fully labelled non-WebGL fallback", () => {
    const { container } = render(<EdgeApertureFallback />);

    expect(container.querySelector("[data-edge-fallback]")).toBeInTheDocument();
    for (const label of EDGE_LABELS) {
      expect(screen.getByText(label)).toBeVisible();
    }
  });

  it("keeps rendering budgets bounded", () => {
    expect(EDGE_RENDER_BUDGET.desktopParticles).toBeLessThanOrEqual(900);
    expect(EDGE_RENDER_BUDGET.compactParticles).toBeLessThanOrEqual(360);
    expect(EDGE_RENDER_BUDGET.desktopDpr).toBeLessThanOrEqual(1.5);
    expect(EDGE_RENDER_BUDGET.compactDpr).toBeLessThanOrEqual(1);
  });

  it("turns scattered media into ordered signal lanes", () => {
    const raw = getEdgeSignalPosition(17, 0);
    const structured = getEdgeSignalPosition(17, 1);

    expect(Math.abs(structured[1])).toBeLessThan(Math.abs(raw[1]));
    expect(Math.abs(structured[2])).toBeLessThan(Math.abs(raw[2]));
    expect(structured[0]).toBeGreaterThan(-4.4);
    expect(structured[0]).toBeLessThan(4.4);
  });
});

describe("signal-to-intent scenes", () => {
  it("organises five perception channels into one concept event", () => {
    const { container } = render(<PerceptionScene />);

    expect(container.querySelectorAll("[data-signal-channel]")).toHaveLength(5);
    expect(screen.getByText("STATE / FATIGUE POSSIBLE")).toBeVisible();
    expect(screen.getByText("ACTION / WAIT")).toBeVisible();
  });

  it("converges three kinds of input on one Agent field", () => {
    const { container } = render(<UnderstandingScene />);

    expect(container.querySelectorAll("[data-agent-input]")).toHaveLength(3);
    for (const label of ["CONTEXT", "MEMORY", "SKILLS", "DECISION"]) {
      expect(screen.getByText(label)).toBeVisible();
    }
  });
});
