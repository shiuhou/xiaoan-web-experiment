import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConceptGallery } from "./concept-gallery";

describe("V2 Hero concepts", () => {
  it.each([
    ["a", "裂屏成形"],
    ["b", "作業系統解體"],
    ["c", "溫柔機械劇場"],
  ] as const)("renders concept %s with the real Xiao-An product", (direction, name) => {
    render(<ConceptGallery direction={direction} />);

    expect(screen.getByRole("img", { name: /Xiao-An/i })).toBeVisible();
    expect(screen.getByText(name)).toBeVisible();
  });
});
