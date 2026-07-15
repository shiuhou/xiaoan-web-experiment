import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExperienceFallback } from "./experience-fallback";
import { EXPERIENCE_BUDGET } from "./experience-canvas";
import { PRODUCT_REVEAL_FRAGMENT_SHADER } from "@/shaders/product-reveal";

describe("Wake product reveal", () => {
  it("keeps a complete Hero when WebGL is unavailable", () => {
    render(<ExperienceFallback mode="wake" />);

    expect(
      screen.getByRole("img", { name: /Xiao-An robot and dock/i }),
    ).toBeVisible();
    expect(screen.getByText("小安，不只存在於屏幕裡。")).toBeVisible();
  });

  it("keeps desktop and mobile rendering budgets bounded", () => {
    expect(EXPERIENCE_BUDGET.desktopDpr).toBeLessThanOrEqual(1.5);
    expect(EXPERIENCE_BUDGET.mobileDpr).toBeLessThanOrEqual(1);
    expect(EXPERIENCE_BUDGET.desktopRevealSubdivisions).toEqual([128, 128]);
    expect(EXPERIENCE_BUDGET.mobileRevealSubdivisions).toEqual([72, 72]);
  });

  it("uses deterministic reveal noise instead of perpetual shader time", () => {
    expect(PRODUCT_REVEAL_FRAGMENT_SHADER).not.toContain("uTime");
    expect(PRODUCT_REVEAL_FRAGMENT_SHADER).toContain("uRevealProgress");
    expect(PRODUCT_REVEAL_FRAGMENT_SHADER).toContain("0.012");
  });
});
