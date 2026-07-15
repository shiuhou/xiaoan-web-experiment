import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExperienceController } from "@/components/experience/experience-controller";
import { ActionAct } from "./action-act";
import { PresenceAct } from "./presence-act";

describe("Action climax and Presence ending", () => {
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

  it("keeps the physical outputs focused on embodiment", () => {
    const { container } = render(
      <ExperienceController reducedMotion>
        <ActionAct />
        <PresenceAct />
      </ExperienceController>,
    );

    expect(screen.getAllByRole("listitem").map((node) => node.textContent)).toEqual(
      expect.arrayContaining(["EXPRESSION", "VOICE", "MOTION"]),
    );
    expect(screen.queryByText("REMINDER")).not.toBeInTheDocument();
    expect(container.querySelector("[data-action-product]")).toBeVisible();
    expect(container.querySelector("[data-expression-mask]")).toBeVisible();
    expect(container.querySelector("[data-physical-light]")).toBeVisible();
  });

  it("uses the authentic care expression without stretching its source ratio", () => {
    render(
      <ExperienceController reducedMotion>
        <ActionAct />
      </ExperienceController>,
    );

    expect(screen.getByRole("img", { name: /authentic Xiao-An care expression/i }))
      .toHaveAttribute("width", "140");
    expect(screen.getByRole("img", { name: /authentic Xiao-An care expression/i }))
      .toHaveAttribute("height", "78");
  });

  it("ends with real Explore Again and feature-branch links", () => {
    render(<PresenceAct />);

    expect(screen.getByRole("link", { name: /Explore Again/i })).toHaveAttribute(
      "href",
      "#wake",
    );
    expect(screen.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "href",
      expect.stringContaining("feature/visual-overhaul-v2"),
    );
  });
});
