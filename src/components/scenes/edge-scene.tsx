import Image from "next/image";
import { EdgeApertureLoader } from "@/components/canvas/edge-aperture-loader";
import { ASSETS, EDGE_LABELS, SCENES } from "@/content/site-content";

const scene = SCENES[3];

export function EdgeScene() {
  const lines = scene.title.split("\n");

  return (
    <section
      id={scene.id}
      className="scene edge-scene"
      data-scene={scene.id}
      aria-labelledby="edge-title"
    >
      <div className="edge-scene__stage">
        <div className="edge-scene__copy">
          <div className="scene-kicker">
            <span>{scene.number}</span>
            <span>{scene.eyebrow}</span>
          </div>
          <h2
            id="edge-title"
            className="scene-title scene-title--edge"
            aria-label={scene.title.replaceAll("\n", " ")}
          >
            {lines.map((line) => <span key={line}>{line}</span>)}
          </h2>
          <p className="scene-zh">{scene.zh}</p>
        </div>

        <div className="edge-scene__canvas">
          <EdgeApertureLoader />
        </div>

        <div className="edge-scene__hardware" data-edge-hardware="">
          <Image
            src={ASSETS.dockExploded}
            alt="Intel DK-2500 edge hardware"
            fill
            loading="eager"
            sizes="(max-width: 767px) 70vw, 25vw"
          />
          <span>PHYSICAL EDGE / SOURCE ASSET</span>
        </div>

        <div className="edge-flow" aria-label="Edge processing flow">
          <span className="edge-flow__origin">RAW MEDIA</span>
          <ol>
            {EDGE_LABELS.map((label, index) => (
              <li
                key={label}
                data-edge-track=""
                style={{ "--track-index": index } as React.CSSProperties}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{label}</strong>
                <i aria-hidden="true" />
              </li>
            ))}
          </ol>
          <span className="edge-flow__result">STRUCTURED EVENT</span>
        </div>

        <p className="edge-scene__disclaimer">
          CONCEPT FLOW · NO PERFORMANCE METRICS
        </p>
      </div>
    </section>
  );
}
