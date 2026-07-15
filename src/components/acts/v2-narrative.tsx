import { V2_ACTS } from "@/content/v2-content";
import { ActShell } from "./act-shell";
import { BreakAct } from "./break-act";
import { SignalAct } from "./signal-act";
import { WakeAct } from "./wake-act";

export function V2Narrative() {
  return (
    <>
      <WakeAct />
      <BreakAct />
      <SignalAct />
      {V2_ACTS.slice(3).map((act) => (
        <ActShell act={act} key={act.id} />
      ))}
    </>
  );
}
