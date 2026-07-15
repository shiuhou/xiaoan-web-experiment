import { ExperienceLoader } from "@/components/experience/experience-loader";
import { V2_ACTS } from "@/content/v2-content";

const EVENTS = [
  ["STATE", "FATIGUE POSSIBLE"],
  ["QUALITY", "VALID"],
  ["CONTEXT", "WORK SESSION"],
  ["ACTION", "WAIT"],
] as const;

const CONTEXT_FRAGMENTS = [
  "WORK / SESSION",
  "RECENT / ACTIVITY",
  "DESKTOP / CONTEXT",
] as const;

function CameraSignal() {
  return (
    <div className="signal-form signal-form--camera" data-signal-kind="camera">
      <span className="signal-form__label">CAMERA / FRAME</span>
      <div className="camera-slices" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <i key={index} data-camera-slice />
        ))}
        <b />
      </div>
    </div>
  );
}

function VoiceSignal() {
  return (
    <div className="signal-form signal-form--voice" data-signal-kind="voice">
      <span className="signal-form__label">VOICE / WAVEFORM</span>
      <svg viewBox="0 0 240 70" aria-hidden="true">
        <path
          data-voice-path
          pathLength="1"
          d="M0 38 C18 38 20 12 35 12 S52 57 69 57 86 24 101 24 118 46 135 46 151 8 168 8 188 61 204 61 222 35 240 35"
        />
        <path
          data-voice-path
          pathLength="1"
          d="M0 42 C26 42 28 31 46 31 S67 46 86 46 108 34 127 34 148 43 166 43 191 27 209 27 227 40 240 40"
        />
      </svg>
    </div>
  );
}

function ExpressionSignal() {
  return (
    <div
      className="signal-form signal-form--expression"
      data-signal-kind="expression"
    >
      <span className="signal-form__label">EXPRESSION / FEATURES</span>
      <svg viewBox="0 0 190 105" aria-hidden="true">
        <path data-expression-path pathLength="1" d="M15 43 Q42 21 69 43" />
        <path data-expression-path pathLength="1" d="M121 43 Q148 21 175 43" />
        <path data-expression-path pathLength="1" d="M69 78 Q95 94 121 78" />
      </svg>
    </div>
  );
}

function TimeSignal() {
  return (
    <div className="signal-form signal-form--time" data-signal-kind="time">
      <span className="signal-form__label">TIME / CONTINUITY</span>
      <div className="time-rail" aria-hidden="true">
        {Array.from({ length: 13 }, (_, index) => (
          <i key={index} data-time-tick>
            {index === 6 ? <b>NOW</b> : null}
          </i>
        ))}
      </div>
    </div>
  );
}

function ContextSignal() {
  return (
    <div className="signal-form signal-form--context" data-signal-kind="context">
      <span className="signal-form__label">CONTEXT / TRACE</span>
      <div className="context-trace" aria-hidden="true">
        {CONTEXT_FRAGMENTS.map((fragment) => (
          <i key={fragment} data-context-fragment>
            {fragment}
          </i>
        ))}
      </div>
    </div>
  );
}

export function SignalAct() {
  const act = V2_ACTS[2];

  return (
    <section
      id="signal"
      className="v2-act v2-act--signal signal-act"
      data-act="signal"
      aria-labelledby="signal-title"
    >
      <div className="signal-act__stage">
        <div className="signal-act__field" aria-hidden="true">
          <ExperienceLoader mode="signal" />
        </div>

        <header className="signal-act__copy" data-signal-copy>
          <span>03 / PERCEPTION</span>
          <h2 id="signal-title">
            <span>訊號不是答案。</span>
            <strong>理解，才是。</strong>
          </h2>
          <p>在你開口之前，感知已經開始整理世界。</p>
        </header>

        <div className="signal-act__forms">
          <CameraSignal />
          <VoiceSignal />
          <ExpressionSignal />
          <TimeSignal />
          <ContextSignal />
        </div>

        <div className="signal-act__aperture" data-signal-aperture aria-hidden="true">
          <i />
          <i />
          <b>PERCEPTION</b>
        </div>

        <div className="signal-act__events" aria-label="概念感知事件">
          <i
            className="signal-act__event-rail"
            data-event-rail
            aria-hidden="true"
          />
          <span className="signal-act__concept-label" data-event-concept>
            CONCEPT EVENT / NOT A METRIC
          </span>
          {EVENTS.map(([label, value]) => (
            <div className="signal-event" data-event-token key={label}>
              <span>{label}</span>
              <i />
              <strong>{value}</strong>
            </div>
          ))}
          <p data-compression-label>{act.en} / STRUCTURED STATE</p>
        </div>

        <div className="signal-act__phases" aria-hidden="true">
          <span>GATHER</span>
          <span>ALIGN</span>
          <span>COMPRESS</span>
          <i data-signal-phase-line />
          <b />
        </div>
      </div>
    </section>
  );
}
