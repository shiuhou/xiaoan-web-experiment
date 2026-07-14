import Image from "next/image";
import { ASSETS, SCENES } from "@/content/site-content";

const scene = SCENES[5];
const outputs = ["EXPRESSION", "VOICE", "MOTION", "REMINDER", "PRESENCE"] as const;

export function PresenceScene() {
  const lines = scene.title.split("\n");

  return (
    <section
      id={scene.id}
      className="scene presence-scene"
      data-scene={scene.id}
      aria-labelledby="presence-title"
    >
      <div className="presence-scene__stage">
        <div className="presence-scene__copy">
          <div className="scene-kicker">
            <span>{scene.number}</span>
            <span>{scene.eyebrow}</span>
          </div>
          <h2
            id="presence-title"
            className="scene-title scene-title--presence"
            aria-label={scene.title.replaceAll("\n", " ")}
          >
            {lines.map((line) => <span key={line}>{line}</span>)}
          </h2>
          <p className="scene-zh">{scene.zh}</p>
        </div>

        <div className="presence-product" data-presence-product="">
          <div className="presence-product__echo" aria-hidden="true" />
          <Image
            src={ASSETS.hero}
            alt="Xiao-An returning from an abstract decision to physical presence"
            fill
            loading="eager"
            sizes="(max-width: 767px) 100vw, 58vw"
          />
          <div className="presence-product__screen" aria-hidden="true" />
          <div className="presence-product__motion" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="presence-loop" data-presence-loop="">
          <div className="presence-loop__decision">
            <small>AGENT DECISION</small>
            <strong>CARE</strong>
          </div>
          <i className="presence-loop__line" aria-hidden="true" />
          <div className="presence-loop__action">
            <small>ROBOT ACTION</small>
            <strong>MOVE CLOSER</strong>
          </div>
        </div>

        <ol className="embodied-outputs" aria-label="Embodied outputs">
          {outputs.map((output, index) => (
            <li
              key={output}
              data-embodied-output=""
              style={{ "--output-index": index } as React.CSSProperties}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {output}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
