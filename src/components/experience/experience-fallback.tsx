import Image from "next/image";
import { V2_ACTS, V2_ASSETS } from "@/content/v2-content";

export type ExperienceFallbackProps = {
  mode: "wake";
  showCopy?: boolean;
};

export function ExperienceFallback({
  mode,
  showCopy = true,
}: ExperienceFallbackProps) {
  const wake = V2_ACTS[0];

  return (
    <div
      className={`experience-fallback experience-fallback--${mode}`}
      data-experience-fallback={mode}
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
