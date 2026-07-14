import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EdgeScene } from "./edge-scene";
import { PresenceScene } from "./presence-scene";
import { SystemScene } from "./system-scene";
import { ClosingScene } from "./closing-scene";

describe("EdgeScene", () => {
  it("turns raw channels into a bounded concept event around DK-2500", () => {
    const { container } = render(<EdgeScene />);

    expect(screen.getByRole("heading", { name: /the edge is the bridge/i })).toBeVisible();
    expect(container.querySelectorAll("[data-edge-track]")).toHaveLength(4);
    expect(screen.getByText("RAW MEDIA")).toBeVisible();
    expect(screen.getByText("STRUCTURED EVENT")).toBeVisible();
    expect(screen.getByAltText(/intel dk-2500 edge hardware/i)).toBeVisible();
  });
});

describe("PresenceScene", () => {
  it("closes the Agent-to-robot loop with five embodied outputs", () => {
    const { container } = render(<PresenceScene />);

    expect(screen.getByRole("heading", { name: /it doesn't just reply\. it moves/i })).toBeVisible();
    expect(container.querySelectorAll("[data-embodied-output]")).toHaveLength(5);
    expect(screen.getByText("AGENT DECISION")).toBeVisible();
    expect(screen.getByText("ROBOT ACTION")).toBeVisible();
    expect(container.querySelector(".expression-film")).not.toBeInTheDocument();
  });
});

describe("SystemScene", () => {
  it("reveals the three real system layers and current transport contract", () => {
    const { container } = render(<SystemScene />);

    expect(container.querySelectorAll("[data-system-layer]")).toHaveLength(3);
    for (const label of ["ROBOT", "EDGE", "AGENT", "/VIDEO", "/AUDIO", "/CONTROL"]) {
      expect(screen.getByText(label)).toBeVisible();
    }
    expect(container.querySelector(".system-poster__source")).not.toBeInTheDocument();
  });
});

describe("ClosingScene", () => {
  it("ends quietly with an in-page replay action and no invented social links", () => {
    render(<ClosingScene />);

    expect(screen.getByRole("heading", { name: /from virtual intelligence to physical presence/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /explore again/i })).toHaveAttribute("href", "#awakening");
    expect(screen.queryByText(/instagram|twitter|linkedin/i)).not.toBeInTheDocument();
  });
});
