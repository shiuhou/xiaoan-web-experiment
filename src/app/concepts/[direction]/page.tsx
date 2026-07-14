import { notFound } from "next/navigation";
import {
  ConceptGallery,
  isConceptDirection,
} from "@/components/concepts/concept-gallery";

export function generateStaticParams() {
  return ["a", "b", "c"].map((direction) => ({ direction }));
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ direction: string }>;
}) {
  const { direction } = await params;
  if (!isConceptDirection(direction)) notFound();
  return <ConceptGallery direction={direction} />;
}
