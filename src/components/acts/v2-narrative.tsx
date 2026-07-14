import { V2_ACTS } from "@/content/v2-content";
import { ActShell } from "./act-shell";

export function V2Narrative() {
  return (
    <>
      {V2_ACTS.map((act, index) => (
        <ActShell act={act} hero={index === 0} key={act.id} />
      ))}
    </>
  );
}
