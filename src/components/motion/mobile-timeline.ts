import type { ExperienceControllerValue } from "@/components/experience/experience-context";
import { createActionTimeline } from "./action-timeline";
import { createBreakTimeline } from "./break-timeline";
import { createEdgeIntentTimeline } from "./edge-intent-timeline";
import { createSignalTimeline } from "./signal-timeline";
import { createWakeTimeline } from "./wake-timeline";

type TimelineController = Pick<ExperienceControllerValue, "setActProgress">;

function act(root: HTMLElement, id: string): HTMLElement {
  const section = root.querySelector<HTMLElement>(`#${id}`);
  if (!section) throw new Error(`Missing V2 act: ${id}`);
  return section;
}

export function createMobileTimeline(
  root: HTMLElement,
  controller: TimelineController,
) {
  root.dataset.v2Layout = "mobile";
  const nearTop = window.scrollY < window.innerHeight * 0.2;

  createWakeTimeline(
    act(root, "wake"),
    true,
    (progress) => controller.setActProgress("wake", progress),
    nearTop,
  );
  createBreakTimeline(act(root, "break"), true, (progress) =>
    controller.setActProgress("break", progress),
  );
  createSignalTimeline(act(root, "signal"), true, (progress) =>
    controller.setActProgress("signal", progress),
  );
  createEdgeIntentTimeline(act(root, "edge-intent"), true, (progress) =>
    controller.setActProgress("edge-intent", progress),
  );
  createActionTimeline(act(root, "action"), true, (progress) =>
    controller.setActProgress("action", progress),
  );
  controller.setActProgress("presence", 1);

  return () => delete root.dataset.v2Layout;
}
