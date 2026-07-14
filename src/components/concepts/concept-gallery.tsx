import { ConceptA } from "./concept-a";
import { ConceptB } from "./concept-b";
import { ConceptC } from "./concept-c";

export type ConceptDirection = "a" | "b" | "c";

export function isConceptDirection(value: string): value is ConceptDirection {
  return value === "a" || value === "b" || value === "c";
}

export function ConceptGallery({ direction }: { direction: ConceptDirection }) {
  if (direction === "a") return <ConceptA />;
  if (direction === "b") return <ConceptB />;
  return <ConceptC />;
}
