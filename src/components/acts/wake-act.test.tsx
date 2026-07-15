import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExperienceController } from "@/components/experience/experience-controller";
import { WakeAct } from "./wake-act";

describe("WakeAct", () => {
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

  it("uses the real Xiao-An product as the sole Hero focal point", () => {
    const { container } = render(
      <ExperienceController reducedMotion>
        <WakeAct />
      </ExperienceController>,
    );

    expect(container.querySelector("section#wake[data-act='wake']")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "小安，不只存在於屏幕裡。",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("img", { name: /Xiao-An robot and dock/i }),
    ).toHaveAttribute("fetchpriority", "high");
    expect(container.querySelectorAll("[data-wake-product]")).toHaveLength(1);
    expect(container.querySelectorAll("[data-wake-type-layer]")).toHaveLength(2);
  });

  it("keeps system labels conceptual and free from fabricated metrics", () => {
    render(
      <ExperienceController reducedMotion>
        <WakeAct />
      </ExperienceController>,
    );

    for (const label of [
      "SYSTEM / ONLINE",
      "EDGE / CONNECTED",
      "AGENT / AWAKE",
    ]) {
      expect(screen.getByText(label)).toBeVisible();
    }
    expect(screen.queryByText(/accuracy|latency|%|ms/i)).not.toBeInTheDocument();
  });
});
