import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExperienceController } from "@/components/experience/experience-controller";
import { EdgeIntentAct } from "./edge-intent-act";

describe("EdgeIntentAct", () => {
  it("keeps the causal path and real hardware without a second WebGL context", () => {
    const { container } = render(
      <ExperienceController reducedMotion>
        <EdgeIntentAct />
      </ExperienceController>,
    );

    const labels = [...container.querySelectorAll("[data-decision-stage]")].map(
      (node) => node.getAttribute("data-decision-stage"),
    );
    expect(labels).toEqual([
      "INPUT",
      "CONTEXT",
      "MEMORY",
      "SKILLS",
      "DECISION",
      "OUTPUT",
    ]);
    expect(container.querySelectorAll("[data-agent-output]")).toHaveLength(3);
    expect(container.querySelector(".experience-loader")).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Intel DK-2500 edge hardware/i }),
    ).toHaveAttribute("loading", "lazy");
    expect(screen.getAllByText(/OpenClaw/i).length).toBeGreaterThan(0);
  });
});
