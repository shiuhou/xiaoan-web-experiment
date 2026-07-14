import { CONCEPT_STATES, PERCEPTION_CHANNELS, SCENES } from "@/content/site-content";

const scene = SCENES[2];

export function PerceptionScene() {
  const lines = scene.title.split("\n");

  return (
    <section
      id={scene.id}
      className="scene perception-scene"
      data-scene={scene.id}
      aria-labelledby="perception-title"
    >
      <div className="perception-field" data-perception-field="">
        <div className="perception-scene__copy">
          <div className="scene-kicker">
            <span>{scene.number}</span>
            <span>{scene.eyebrow}</span>
          </div>
          <h2
            id="perception-title"
            className="scene-title scene-title--perception"
            aria-label={scene.title.replaceAll("\n", " ")}
          >
            {lines.map((line) => <span key={line}>{line}</span>)}
          </h2>
          <p className="scene-zh">{scene.zh}</p>
        </div>

        <div className="perception-field__core" aria-hidden="true">
          <span>SIGNAL</span>
          <strong>01</strong>
          <i />
        </div>

        <ol className="perception-channels" aria-label="Perception channels">
          {PERCEPTION_CHANNELS.map((channel, index) => (
            <li
              key={channel.label}
              data-signal-channel=""
              style={{ "--channel-index": index } as React.CSSProperties}
            >
              <span>{channel.label}</span>
              <small>{channel.mode}</small>
              <i aria-hidden="true" />
            </li>
          ))}
        </ol>

        <div className="perception-scan" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="concept-event" data-concept-event="">
          <header>
            <span>CONCEPT EVENT</span>
            <i />
            <span>STRUCTURED</span>
          </header>
          <ul>
            {CONCEPT_STATES.map((state, index) => (
              <li key={state}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {state}
              </li>
            ))}
          </ul>
          <p>Visual narrative only — not measured performance data.</p>
        </div>
      </div>
    </section>
  );
}
