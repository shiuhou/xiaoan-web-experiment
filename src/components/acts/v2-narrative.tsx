import { ActionAct } from "./action-act";
import { BreakAct } from "./break-act";
import { SignalAct } from "./signal-act";
import { EdgeIntentAct } from "./edge-intent-act";
import { PresenceAct } from "./presence-act";
import { WakeAct } from "./wake-act";

export function V2Narrative() {
  return (
    <>
      <WakeAct />
      <BreakAct />
      <SignalAct />
      <EdgeIntentAct />
      <ActionAct />
      <PresenceAct />
    </>
  );
}
