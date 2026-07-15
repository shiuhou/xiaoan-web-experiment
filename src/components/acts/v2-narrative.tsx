import { ActionAct } from "./action-act";
import { BreakAct } from "./break-act";
import { SignalAct } from "./signal-act";
import { EdgeIntentAct } from "./edge-intent-act";
import { PresenceAct } from "./presence-act";
import { WakeAct } from "./wake-act";
import { V2NarrativeMotion } from "@/components/motion/v2-narrative-motion";

export function V2Narrative() {
  return (
    <V2NarrativeMotion>
      <WakeAct />
      <BreakAct />
      <SignalAct />
      <EdgeIntentAct />
      <ActionAct />
      <PresenceAct />
    </V2NarrativeMotion>
  );
}
