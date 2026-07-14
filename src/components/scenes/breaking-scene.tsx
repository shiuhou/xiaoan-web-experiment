import Image from "next/image";
import { ASSETS, SCENES } from "@/content/site-content";

const scene = SCENES[1];
const planes = [
  { label: "CHAT", detail: "ONE MORE WINDOW", className: "plane--chat" },
  { label: "TASK", detail: "OPEN / TYPE / SAVE", className: "plane--task" },
  { label: "CALENDAR", detail: "ANOTHER TAB", className: "plane--calendar" },
  { label: "REMINDER", detail: "WAITING TO INTERRUPT", className: "plane--reminder" },
] as const;

export function BreakingScene() {
  const [firstLine, secondLine] = scene.title.split("\n");

  return (
    <section
      id={scene.id}
      className="scene breaking-scene"
      data-scene={scene.id}
      aria-labelledby="breaking-title"
    >
      <div className="breaking-scene__stage" data-signature-frame="">
        <div className="breaking-scene__copy">
          <div className="scene-kicker">
            <span>{scene.number}</span>
            <span>{scene.eyebrow}</span>
          </div>
          <h2 id="breaking-title" className="scene-title scene-title--breaking">
            <span>{firstLine}</span>
            {" "}
            <span>{secondLine}</span>
          </h2>
          <p className="scene-zh">{scene.zh}</p>
        </div>

        <div className="interface-stack" aria-label="Abstract software interfaces">
          {planes.map((plane, index) => (
            <div
              className={`interface-plane ${plane.className}`}
              data-ui-plane=""
              data-plane-index={index}
              key={plane.label}
            >
              <span className="interface-plane__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{plane.label}</strong>
              <small>{plane.detail}</small>
              <i aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="breaking-scene__product" data-product-reveal="">
          <div className="breaking-scene__portal" aria-hidden="true" />
          <Image
            src={ASSETS.hero}
            alt="Xiao-An crossing from a digital interface into physical space"
            fill
            loading="eager"
            sizes="(max-width: 768px) 82vw, 44vw"
          />
        </div>

        <div className="depth-axis" aria-hidden="true">
          <span>SOFTWARE / FLAT</span>
          <i />
          <span>PRESENCE / DEPTH</span>
        </div>
      </div>
    </section>
  );
}
