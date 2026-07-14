import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home page shell", () => {
  it("renders the complete six-act V2 narrative in order", () => {
    const { container } = render(<Home />);
    const main = container.querySelector("main#main-content");
    const acts = [...(main?.querySelectorAll("[data-act]") ?? [])];

    expect(main).toBeInTheDocument();
    expect(acts.map((act) => act.id)).toEqual([
      "wake",
      "break",
      "signal",
      "edge-intent",
      "action",
      "presence",
    ]);
    expect(main?.querySelectorAll("h1")).toHaveLength(1);
  });
});
