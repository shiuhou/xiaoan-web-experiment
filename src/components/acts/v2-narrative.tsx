import { V2_ACTS } from "@/content/v2-content";
import { ActShell } from "./act-shell";
import { WakeAct } from "./wake-act";

export function V2Narrative() {
  return (
    <>
      <WakeAct />
      {V2_ACTS.slice(1).map((act) => (
        <ActShell act={act} key={act.id} />
      ))}
    </>
  );
}
