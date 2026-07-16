import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { V2_ACTS } from "@/content/v2-content";
import { SceneNavigator } from "./scene-navigator";

let jumpedSceneIndex = 0;

function mountActGeometry() {
  for (const [index, act] of V2_ACTS.entries()) {
    const section = document.createElement("section");
    section.id = act.id;
    section.getBoundingClientRect = () => {
      const top = (index - jumpedSceneIndex) * 1000;
      return {
        top,
        bottom: top + 1000,
        left: 0,
        right: 1000,
        width: 1000,
        height: 1000,
        x: 0,
        y: top,
        toJSON: () => ({}),
      };
    };
    document.body.append(section);
  }
}

afterEach(() => {
  jumpedSceneIndex = 0;
  for (const act of V2_ACTS) document.getElementById(act.id)?.remove();
});

describe("SceneNavigator", () => {
  it("exposes all six acts through a compact keyboard-operable index", async () => {
    const user = userEvent.setup();
    render(<SceneNavigator />);

    const toggle = screen.getByRole("button", { name: /open scene index/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("navigation", { name: /scene index/i })).toHaveAttribute(
      "data-scene",
      "wake",
    );

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(document.body).toHaveAttribute("data-scene-index-open", "true");
    expect(screen.getAllByRole("link")).toHaveLength(6);
    expect(screen.getByRole("link", { name: /01 wake/i })).toHaveAttribute(
      "href",
      "#wake",
    );

    await user.click(screen.getByRole("link", { name: /04 edge-intent/i }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.body).not.toHaveAttribute("data-scene-index-open");
  });

  it("locks the background but allows the open panel to scroll", async () => {
    const user = userEvent.setup();
    render(<SceneNavigator />);
    await user.click(screen.getByRole("button", { name: /open scene index/i }));

    const panel = document.getElementById("scene-index-panel");
    expect(panel).not.toBeNull();
    const panelWheel = new WheelEvent("wheel", { bubbles: true, cancelable: true });
    panel?.dispatchEvent(panelWheel);
    expect(panelWheel.defaultPrevented).toBe(false);

    const backgroundWheel = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(backgroundWheel);
    expect(backgroundWheel.defaultPrevented).toBe(true);
  });

  it("derives the active scene from scroll position after a large jump", async () => {
    mountActGeometry();
    render(<SceneNavigator />);

    expect(screen.getByRole("navigation", { name: /scene index/i })).toHaveAttribute(
      "data-scene",
      "wake",
    );

    jumpedSceneIndex = 5;
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() =>
      expect(
        screen.getByRole("navigation", { name: /scene index/i }),
      ).toHaveAttribute("data-scene", "presence"),
    );
  });
});
