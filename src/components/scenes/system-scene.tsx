import { SCENES } from "@/content/site-content";

const scene = SCENES[6];
const layers = [
  {
    index: "01",
    name: "ROBOT",
    zh: "感知與具身輸出",
    detail: "CAMERA · VOICE · EXPRESSION · MOTION",
    className: "system-layer--robot",
  },
  {
    index: "02",
    name: "EDGE",
    zh: "Intel DK-2500 本地處理與通信中樞",
    detail: "LOCAL EVENT PROCESSING · GATEWAY",
    className: "system-layer--edge",
  },
  {
    index: "03",
    name: "AGENT",
    zh: "OpenClaw 理解、記憶與決策",
    detail: "CONTEXT · MEMORY · SKILLS · DECISION",
    className: "system-layer--agent",
  },
] as const;

export function SystemScene() {
  const lines = scene.title.split("\n");

  return (
    <section
      id={scene.id}
      className="scene system-scene"
      data-scene={scene.id}
      aria-labelledby="system-title"
    >
      <div className="system-scene__stage">
        <div className="system-scene__copy">
          <div className="scene-kicker">
            <span>{scene.number}</span>
            <span>{scene.eyebrow}</span>
          </div>
          <h2
            id="system-title"
            className="scene-title scene-title--system"
            aria-label={scene.title.replaceAll("\n", " ")}
          >
            {lines.map((line) => <span key={line}>{line}</span>)}
          </h2>
          <p className="scene-zh">{scene.zh}</p>
        </div>

        <div className="system-poster" data-system-poster="">
          <ol className="system-layers">
            {layers.map((layer) => (
              <li
                className={`system-layer ${layer.className}`}
                data-system-layer=""
                key={layer.name}
              >
                <span>{layer.index}</span>
                <div>
                  <strong>{layer.name}</strong>
                  <p>{layer.zh}</p>
                </div>
                <small>{layer.detail}</small>
                <i aria-hidden="true" />
              </li>
            ))}
          </ol>

          <div className="system-routes" aria-label="Current media and command routes">
            <span>/VIDEO</span>
            <span>/AUDIO</span>
            <span>/CONTROL</span>
            <span>AGENT LAYER</span>
          </div>
          <div className="system-poster__closed-loop" aria-hidden="true">
            <span>SIGNAL</span>
            <i />
            <span>PRESENCE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
