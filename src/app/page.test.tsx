import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home page shell", () => {
  it("renders the complete eight-scene narrative in order", () => {
    const { container } = render(<Home />);
    const main = container.querySelector("main#main-content");
    const scenes = [...(main?.querySelectorAll("[data-scene]") ?? [])];

    expect(main).toBeInTheDocument();
    expect(scenes.map((scene) => scene.id)).toEqual([
      "awakening",
      "breaking",
      "perception",
      "edge",
      "understanding",
      "presence",
      "system",
      "closing",
    ]);
    expect(main?.querySelectorAll("h1")).toHaveLength(1);
  });
});
