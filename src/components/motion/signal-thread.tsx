export function SignalThread() {
  return (
    <div className="signal-thread" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="presentation">
        <path
          className="signal-thread__ghost"
          d="M 50 0 C 50 13 76 14 76 27 C 76 40 24 38 24 52 C 24 67 50 68 50 82 C 50 91 50 96 50 100"
          pathLength="1"
        />
        <path
          className="signal-thread__active"
          d="M 50 0 C 50 13 76 14 76 27 C 76 40 24 38 24 52 C 24 67 50 68 50 82 C 50 91 50 96 50 100"
          pathLength="1"
        />
        <circle className="signal-thread__pulse" cx="50" cy="0" r="0.58" />
      </svg>
    </div>
  );
}
