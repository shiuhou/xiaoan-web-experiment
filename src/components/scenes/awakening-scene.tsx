import Image from "next/image";
import { ASSETS, SCENES } from "@/content/site-content";
import { SystemStatus } from "@/components/ui/system-status";

const scene = SCENES[0];

export function AwakeningScene() {
  const [firstLine, secondLine] = scene.title.split("\n");

  return (
    <section
      id={scene.id}
      className="scene hero-scene"
      data-scene={scene.id}
      aria-labelledby="awakening-title"
    >
      <div className="hero-scene__field" aria-hidden="true">
        <div className="hero-scene__aura" />
        <div className="hero-scene__scan" />
        <div className="hero-scene__horizon" />
      </div>

      <div className="hero-scene__copy">
        <div className="scene-kicker">
          <span>{scene.number}</span>
          <span>{scene.eyebrow}</span>
        </div>
        <h1 id="awakening-title" className="hero-title">
          <span>{firstLine}</span>
          {" "}
          <span className="hero-title__accent">{secondLine}</span>
        </h1>
        <p className="hero-scene__statement">{scene.body}</p>
        <p className="scene-zh">{scene.zh}</p>
      </div>

      <div className="product-stage" data-product-stage="">
        <div className="product-stage__shadow" aria-hidden="true" />
        <div className="product-layer product-layer--silhouette" data-product-layer="">
          <Image
            src={ASSETS.hero}
            alt=""
            fill
            loading="eager"
            sizes="(max-width: 768px) 88vw, 58vw"
            aria-hidden="true"
          />
        </div>
        <div className="product-layer product-layer--body" data-product-layer="">
          <Image
            src={ASSETS.hero}
            alt="Xiao-An robot and dock"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 768px) 88vw, 58vw"
          />
        </div>
        <div className="product-stage__face-glow" aria-hidden="true" />
        <div className="product-stage__orbit" aria-hidden="true">
          <span>PHYSICAL AGENT</span>
          <span>LOCAL FIRST</span>
        </div>
      </div>

      <SystemStatus />

      <div className="hero-scene__scroll" aria-hidden="true">
        <span>SCROLL TO WAKE</span>
        <i />
      </div>
    </section>
  );
}
