import Image from "next/image";
import {
  AGENT_INPUTS,
  AGENT_OUTPUTS,
  V2_ACTS,
  V2_ASSETS,
} from "@/content/v2-content";

const DECISION_STAGES = [
  ["INPUT", "SIGNAL EVENT"],
  ["CONTEXT", "CURRENT SESSION"],
  ["MEMORY", "RELEVANT TRACE"],
  ["SKILLS", "AVAILABLE ACTION"],
  ["DECISION", "CHOOSE RESPONSE"],
  ["OUTPUT", "RETURN TO BODY"],
] as const;

export function EdgeIntentAct() {
  const act = V2_ACTS[3];

  return (
    <section
      id="edge-intent"
      className="v2-act v2-act--edge-intent edge-intent-act"
      data-act="edge-intent"
      aria-labelledby="edge-intent-title"
    >
      <div className="edge-intent-act__stage">
        <header className="edge-intent-act__copy" data-edge-copy>
          <span>04 / EDGE TO INTENT</span>
          <h2 id="edge-intent-title">
            <span>在邊緣，</span>
            <strong>感知變成意圖。</strong>
          </h2>
          <p>Intel DK-2500 讓感知、Agent 與機器人共享同一條路徑。</p>
        </header>

        <figure
          className="edge-intent-act__hardware"
          data-edge-hardware
          data-edge-optical-frame
        >
          <div className="edge-intent-act__hardware-image" data-edge-hardware-image>
            <Image
              src={V2_ASSETS.dk2500}
              alt="Intel DK-2500 edge hardware"
              fill
              loading="lazy"
              sizes="(max-width: 767px) 92vw, 54vw"
            />
          </div>
          <figcaption>
            <span>PHYSICAL EDGE / SOURCE MATERIAL</span>
            <strong>INTEL® DK-2500</strong>
          </figcaption>
        </figure>

        <div className="edge-intent-act__requests" aria-label="Agent inputs">
          {AGENT_INPUTS.map((input, index) => (
            <div data-edge-request key={input.kind}>
              <span>{String(index + 1).padStart(2, "0")} / {input.kind}</span>
              <strong>{input.text}</strong>
            </div>
          ))}
        </div>

        <div className="edge-intent-act__planes" aria-hidden="true">
          {DECISION_STAGES.map(([stage], index) => (
            <i
              data-edge-plane
              key={stage}
              style={{ "--edge-plane-index": index } as React.CSSProperties}
            />
          ))}
        </div>

        <div className="edge-intent-act__route" data-edge-route>
          <i className="edge-intent-act__route-line" data-edge-route-line />
          <ol>
            {DECISION_STAGES.map(([stage, detail], index) => (
              <li
                data-decision-stage={stage}
                className={`edge-stage edge-stage--${stage.toLowerCase()}`}
                key={stage}
              >
                <i data-stage-mark>
                  {stage === "DECISION" ? <b data-decision-pulse /> : null}
                </i>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stage}</strong>
                <small>{detail}</small>
                {stage === "OUTPUT" ? (
                  <div className="edge-stage__outputs">
                    {AGENT_OUTPUTS.map((output) => (
                      <em data-agent-output key={output}>{output}</em>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <p className="edge-intent-act__note">
          {act.en} / DK-2500 → OPENCLAW
        </p>
      </div>
    </section>
  );
}
