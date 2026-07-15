import { V2_ACTS } from "@/content/v2-content";
import { ActShell } from "./act-shell";
import { BreakAct } from "./break-act";
import { WakeAct } from "./wake-act";

export function V2Narrative() {
  return (
    <>
      <WakeAct />
      <BreakAct />
      {V2_ACTS.slice(2).map((act) => (
        <ActShell act={act} key={act.id} />
      ))}
    </>
  );
}
