import { AGENT_INPUTS, SCENES } from "@/content/site-content";

const scene = SCENES[4];

export function UnderstandingScene() {
  const lines = scene.title.split("\n");

  return (
    <section
      id={scene.id}
      className="scene understanding-scene"
      data-scene={scene.id}
      aria-labelledby="understanding-title"
    >
      <div className="agent-field" data-agent-field="">
        <div className="understanding-scene__copy">
          <div className="scene-kicker">
            <span>{scene.number}</span>
            <span>{scene.eyebrow}</span>
          </div>
          <h2
            id="understanding-title"
            className="scene-title scene-title--understanding"
            aria-label={scene.title.replaceAll("\n", " ")}
          >
            {lines.map((line) => <span key={line}>{line}</span>)}
          </h2>
          <p className="scene-zh">{scene.zh}</p>
        </div>

        <ol className="agent-inputs">
          {AGENT_INPUTS.map((input, index) => (
            <li
              key={input.kind}
              data-agent-input=""
              style={{ "--input-index": index } as React.CSSProperties}
            >
              <small>{input.kind}</small>
              <blockquote>{input.text}</blockquote>
              <span>{input.output}</span>
              <i aria-hidden="true" />
            </li>
          ))}
        </ol>

        <div className="agent-core" aria-label="OpenClaw decision field">
          <div className="agent-core__rings" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <span>OPENCLAW</span>
          <strong>AGENT</strong>
          <small>ORDERED DECISION FIELD</small>
        </div>

        <ul className="agent-orbit" aria-label="Agent capabilities">
          {scene.tags.map((tag, index) => (
            <li key={tag} style={{ "--orbit-index": index } as React.CSSProperties}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
