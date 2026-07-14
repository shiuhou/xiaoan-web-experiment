import { EDGE_LABELS } from "@/content/site-content";

export function EdgeApertureFallback() {
  return (
    <div
      className="edge-aperture-fallback"
      data-edge-fallback=""
      aria-label="Intel DK-2500 edge processing concept"
    >
      <div className="edge-aperture-fallback__halo" aria-hidden="true" />
      <div className="edge-aperture-fallback__core" aria-hidden="true">
        <span>DK</span>
        <strong>2500</strong>
      </div>
      <div className="edge-aperture-fallback__axis" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <ol className="edge-aperture-fallback__labels">
        {EDGE_LABELS.map((label, index) => (
          <li key={label} style={{ "--edge-index": index } as React.CSSProperties}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {label}
          </li>
        ))}
      </ol>
      <div className="edge-aperture-fallback__flow" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <i key={index} style={{ "--flow-index": index } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}
