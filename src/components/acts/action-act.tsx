import Image from "next/image";
import { V2_ACTS, V2_ASSETS } from "@/content/v2-content";

const PHYSICAL_OUTPUTS = ["EXPRESSION", "VOICE", "MOTION"] as const;

export function ActionAct() {
  const act = V2_ACTS[4];

  return (
    <section
      id="action"
      className="v2-act v2-act--action action-act"
      data-act="action"
      aria-labelledby="action-title"
    >
      <div className="action-act__stage">
        <div className="action-act__warm-world" aria-hidden="true" />
        <div
          className="action-act__physical-light"
          data-physical-light
          aria-hidden="true"
        />
        <div className="action-act__cold-world" data-cold-world aria-hidden="true">
          <i />
          <i />
          <i />
        </div>

        <header className="action-act__copy" data-action-copy>
          <span>05 / EMBODIED RESPONSE</span>
          <h2 id="action-title">
            <span>理解，</span>
            <strong>最終成為動作。</strong>
          </h2>
          <p>決策沿控制路徑回到身體，成為表情、聲音與靠近。</p>
        </header>

        <svg
          className="action-act__control-route"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
          data-action-technical
        >
          <path
            data-action-route
            pathLength="1"
            d="M-30 520 C210 520 280 446 472 446 S770 528 940 468 1160 374 1470 374"
          />
        </svg>
        <i className="action-act__pulse" data-action-pulse aria-hidden="true" />

        <div className="action-act__decision" data-action-decision>
          <span>AGENT DECISION</span>
          <strong>CARE</strong>
          <i />
          <span>ROBOT ACTION</span>
          <strong>MOVE CLOSER</strong>
        </div>

        <ol className="action-act__outputs" aria-label="Embodied outputs">
          {PHYSICAL_OUTPUTS.map((output, index) => (
            <li
              data-action-output
              data-number={String(index + 1).padStart(2, "0")}
              key={output}
            >
              {output}
            </li>
          ))}
        </ol>

        <div className="action-act__product" data-action-product>
          <div className="action-product__shadow" aria-hidden="true" />
          <div className="action-product__dock" data-product-dock-layer>
            <Image
              src={V2_ASSETS.productDock}
              alt="Xiao-An returning from intent to physical action"
              fill
              loading="lazy"
              sizes="(max-width: 767px) 108vw, 58vw"
            />
          </div>
          <div
            className="action-product__foreground"
            data-product-foreground-layer
          >
            <Image
              src={V2_ASSETS.productForeground}
              alt=""
              fill
              loading="lazy"
              sizes="(max-width: 767px) 108vw, 58vw"
            />
            <div className="action-product__expression" data-expression-mask>
              <Image
                src={V2_ASSETS.expressionCare}
                alt="Authentic Xiao-An care expression"
                width={140}
                height={78}
              />
            </div>
          </div>

          <svg
            className="action-product__voice"
            viewBox="0 0 260 180"
            aria-hidden="true"
          >
            <path data-voice-wave pathLength="1" d="M245 18 Q112 90 245 162" />
            <path data-voice-wave pathLength="1" d="M213 42 Q129 90 213 138" />
            <path data-voice-wave pathLength="1" d="M181 65 Q145 90 181 115" />
          </svg>

          <svg
            className="action-product__motion"
            viewBox="0 0 420 130"
            aria-hidden="true"
          >
            <path
              data-motion-track
              pathLength="1"
              d="M16 109 C94 62 190 43 404 35"
            />
          </svg>
        </div>

        <p className="action-act__descriptor" lang="en">
          {act.en} / COLD SIGNAL → WARM PRESENCE
        </p>
      </div>
    </section>
  );
}
