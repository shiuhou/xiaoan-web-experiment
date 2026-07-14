import { AwakeningScene } from "@/components/scenes/awakening-scene";
import { BreakingScene } from "@/components/scenes/breaking-scene";
import { PerceptionScene } from "@/components/scenes/perception-scene";
import { EdgeScene } from "@/components/scenes/edge-scene";
import { UnderstandingScene } from "@/components/scenes/understanding-scene";
import { PresenceScene } from "@/components/scenes/presence-scene";
import { SystemScene } from "@/components/scenes/system-scene";
import { ClosingScene } from "@/components/scenes/closing-scene";
import { NarrativeMotion } from "@/components/motion/narrative-motion";

export default function Home() {
  return (
    <main id="main-content">
      <NarrativeMotion />
      <AwakeningScene />
      <BreakingScene />
      <PerceptionScene />
      <EdgeScene />
      <UnderstandingScene />
      <PresenceScene />
      <SystemScene />
      <ClosingScene />
    </main>
  );
}
