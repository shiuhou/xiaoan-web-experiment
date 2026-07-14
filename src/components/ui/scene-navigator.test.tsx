import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SceneNavigator } from "./scene-navigator";

describe("SceneNavigator", () => {
  it("exposes all eight scenes through a compact keyboard-operable index", async () => {
    const user = userEvent.setup();
    render(<SceneNavigator />);

    const toggle = screen.getByRole("button", { name: /open scene index/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("link")).toHaveLength(8);
    expect(screen.getByRole("link", { name: /01 awakening/i })).toHaveAttribute(
      "href",
      "#awakening",
    );

    await user.click(screen.getByRole("link", { name: /04 edge/i }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
