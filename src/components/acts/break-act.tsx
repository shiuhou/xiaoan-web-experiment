import Image from "next/image";
import { getBreakMotionProfile } from "@/components/motion/break-timeline";
import { V2_ACTS, V2_ASSETS } from "@/content/v2-content";

function InterfaceCanvas() {
  return (
    <div className="break-interface" data-interface-canvas>
      <header className="break-interface__bar">
        <span>DIGITAL AGENT / SCREEN BOUND</span>
      </header>
      <div className="break-interface__session">
        <span className="break-interface__prompt">USER / DESKTOP SESSION</span>
        <strong>Agent 不應該永遠被困在屏幕裡。</strong>
        <div className="break-interface__messages">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

export function BreakAct() {
  const act = V2_ACTS[1];
  const [lead, tail] = act.zh.split("，");

  return (
    <section
      id="break"
      className="v2-act v2-act--break break-act"
      data-act="break"
      aria-labelledby="break-title"
    >
      <div className="break-act__stage">
        <div className="break-act__copy" data-break-copy>
          <span>02 / BREAKING THE SCREEN</span>
          <h2 id="break-title">
            <span>{lead}，</span>
            <span>{tail}</span>
          </h2>
          <p>Agent 不應該永遠被困在屏幕裡。</p>
        </div>

        <div className="break-act__product" data-break-product>
          <div className="break-act__product-light" aria-hidden="true" />
          <Image
            src={V2_ASSETS.productDock}
            alt="Xiao-An entering physical space"
            fill
            loading="lazy"
            sizes="(max-width: 767px) 88vw, 52vw"
          />
        </div>

        <div
          className="break-act__screen"
          aria-hidden="true"
          data-motion-axis={getBreakMotionProfile(false).axis}
        >
          <div
            className="break-act__half break-act__half--before"
            data-screen-half="before"
            data-testid="screen-half"
          >
            <InterfaceCanvas />
          </div>
          <div
            className="break-act__half break-act__half--after"
            data-screen-half="after"
            data-testid="screen-half"
          >
            <InterfaceCanvas />
          </div>
          <div className="break-act__seam" aria-hidden="true" />
        </div>

        <div
          className="break-act__chromatic"
          data-break-chromatic
          aria-hidden="true"
        />

        <div className="break-act__depth" aria-hidden="true">
          <span>INTERFACE / FLAT</span>
          <i data-depth-route />
          <span>PRESENCE / DEPTH</span>
        </div>
      </div>
    </section>
  );
}
