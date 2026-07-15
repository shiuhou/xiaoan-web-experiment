import { ExperienceLoader } from "@/components/experience/experience-loader";
import { V2_ACTS } from "@/content/v2-content";

const WAKE_STATUS = [
  "SYSTEM / ONLINE",
  "EDGE / CONNECTED",
  "AGENT / AWAKE",
] as const;

export function WakeAct() {
  const wake = V2_ACTS[0];

  return (
    <section
      id="wake"
      className="v2-act v2-act--wake wake-act"
      data-act="wake"
      aria-labelledby="wake-title"
    >
      <div className="wake-act__sticky">
        <div className="wake-act__field" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="wake-act__fracture" aria-hidden="true" />

        <header className="wake-act__meta" data-wake-meta>
          <span>
            <b>01 /</b> AWAKENING
          </span>
          <span>SIGNAL TAKES FORM</span>
        </header>

        <div
          className="wake-act__type wake-act__type--back"
          data-wake-type-layer="back"
          aria-hidden="true"
        >
          <span>小安，</span>
          <span>不只存在於</span>
        </div>

        <div className="wake-act__product" data-wake-product>
          <ExperienceLoader />
        </div>

        <div
          className="wake-act__type wake-act__type--front"
          data-wake-type-layer="front"
          aria-hidden="true"
        >
          <span>屏幕裡。</span>
        </div>

        <div className="wake-act__semantic" data-wake-semantic>
          <h1 id="wake-title">{wake.zh}</h1>
          <p>一個會關注你，也能幫你做事的桌面具身 Agent。</p>
        </div>

        <ul className="wake-act__status" data-wake-status aria-label="概念系統狀態">
          {WAKE_STATUS.map((status) => (
            <li key={status}>{status}</li>
          ))}
        </ul>

        <p className="wake-act__descriptor" lang="en">
          {wake.en}
        </p>
        <div className="wake-act__scroll" aria-hidden="true">
          <span>SCROLL TO RELEASE SIGNAL</span>
          <i />
        </div>
      </div>
    </section>
  );
}
