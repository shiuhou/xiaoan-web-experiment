import Image from "next/image";
import { ASSETS, SCENES } from "@/content/site-content";

const scene = SCENES[7];

export function ClosingScene() {
  const lines = scene.title.split("\n");

  return (
    <section
      id={scene.id}
      className="scene closing-scene"
      data-scene={scene.id}
      aria-labelledby="closing-title"
    >
      <div className="closing-scene__light" aria-hidden="true" />
      <div className="closing-scene__product">
        <Image
          src={ASSETS.hero}
          alt="Xiao-An intelligent desktop companion"
          fill
          loading="eager"
          sizes="(max-width: 767px) 108vw, 54vw"
        />
      </div>
      <div className="closing-scene__copy">
        <div className="scene-kicker">
          <span>{scene.number}</span>
          <span>{scene.eyebrow}</span>
        </div>
        <h2
          id="closing-title"
          className="scene-title scene-title--closing"
          aria-label={scene.title.replaceAll("\n", " ")}
        >
          {lines.map((line) => <span key={line}>{line}</span>)}
        </h2>
        <p className="scene-zh">{scene.zh}</p>
      </div>
      <footer className="closing-footer">
        <div>
          <strong>XIAO-AN / 小安</strong>
          <span>{scene.body}</span>
        </div>
        <a href="#awakening">
          <span>EXPLORE AGAIN</span>
          <i aria-hidden="true">↗</i>
        </a>
      </footer>
    </section>
  );
}
