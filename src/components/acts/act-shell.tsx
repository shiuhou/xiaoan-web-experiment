import type { PropsWithChildren } from "react";
import type { ActContent } from "@/content/v2-content";

type ActShellProps = PropsWithChildren<{
  act: ActContent;
  hero?: boolean;
}>;

export function ActShell({ act, children, hero = false }: ActShellProps) {
  const Heading = hero ? "h1" : "h2";

  return (
    <section
      id={act.id}
      className={`v2-act v2-act--${act.id} v2-act--${act.mode}`}
      data-act={act.id}
      aria-labelledby={`${act.id}-title`}
    >
      <div className="v2-act__copy">
        <span className="v2-act__index">{act.index}</span>
        <Heading id={`${act.id}-title`}>{act.zh}</Heading>
        <p lang="en">{act.en}</p>
      </div>
      {children}
    </section>
  );
}
