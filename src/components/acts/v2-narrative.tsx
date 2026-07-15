import { V2_ACTS } from "@/content/v2-content";
import { ActShell } from "./act-shell";
import { BreakAct } from "./break-act";
import { SignalAct } from "./signal-act";
import { EdgeIntentAct } from "./edge-intent-act";
import { WakeAct } from "./wake-act";

export function V2Narrative() {
  return (
    <>
      <WakeAct />
      <BreakAct />
      <SignalAct />
      <EdgeIntentAct />
      {V2_ACTS.slice(4).map((act) => (
        <ActShell act={act} key={act.id} />
      ))}
    </>
  );
}
