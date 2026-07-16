import Image from "next/image";
import { V2_ACTS, V2_ASSETS } from "@/content/v2-content";

export function ExperienceFallback({ showCopy = true }: { showCopy?: boolean }) {
  const wake = V2_ACTS[0];

  return (
    <div
      className="experience-fallback experience-fallback--wake"
      data-experience-fallback="wake"
    >
      {showCopy ? (
        <div className="experience-fallback__copy">
          <p>{wake.zh}</p>
          <span lang="en">{wake.en}</span>
        </div>
      ) : null}
      <div className="experience-fallback__product">
        <Image
          src={V2_ASSETS.hero}
          alt="Xiao-An robot and dock"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 700px) 112vw, 64vw"
        />
      </div>
    </div>
  );
}
