import Image from "next/image";
import { V2_ACTS, V2_ASSETS } from "@/content/v2-content";

export type ExperienceFallbackProps = {
  mode: "wake" | "signal" | "edge";
  showCopy?: boolean;
};

export function ExperienceFallback({
  mode,
  showCopy = true,
}: ExperienceFallbackProps) {
  const wake = V2_ACTS[0];

  if (mode === "edge") {
    return (
      <div
        className="experience-fallback experience-fallback--edge"
        data-experience-fallback={mode}
        data-edge-tunnel-fallback
        aria-hidden="true"
      >
        <div className="experience-fallback__edge-lanes">
          {Array.from({ length: 3 }, (_, index) => (
            <span data-fallback-lane key={index} />
          ))}
        </div>
        <div className="experience-fallback__edge-gates">
          {Array.from({ length: 6 }, (_, index) => (
            <i key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (mode === "signal") {
    return (
      <div
        className="experience-fallback experience-fallback--signal"
        data-experience-fallback={mode}
        aria-hidden="true"
      >
        <div className="experience-fallback__signal-lines">
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="experience-fallback__signal-points">
          {Array.from({ length: 18 }, (_, index) => (
            <i key={index} />
          ))}
        </div>
      </div>
    );
  }

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
