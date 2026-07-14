type SystemStatusProps = {
  items?: readonly string[];
};

export function SystemStatus({
  items = ["SYSTEM / ONLINE", "EDGE / CONNECTED", "AGENT / AWAKE"],
}: SystemStatusProps) {
  return (
    <div className="system-status" aria-label="Concept system status">
      {items.map((item, index) => (
        <div className="system-status__item" key={item}>
          <span className="system-status__index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}
