export type SceneId =
  | "awakening"
  | "breaking"
  | "perception"
  | "edge"
  | "understanding"
  | "presence"
  | "system"
  | "closing";

export type SceneContent = {
  id: SceneId;
  number: string;
  eyebrow: string;
  title: string;
  zh: string;
  body: string;
  tags: readonly string[];
};

export const ASSETS = {
  hero: "/assets/product/xiaoan-dock.png",
  dockExploded: "/assets/product/dk2500-exploded.png",
  architecture: "/assets/product/system-architecture.png",
  edgeHardware: "/assets/product/edge-hardware.png",
  internalsFront: "/assets/product/robot-internals-front.png",
  internalsTop: "/assets/product/robot-internals-top.jpeg",
  expressions: "/assets/product/xiaoan-expressions.png",
} as const;

export const CONCEPT_STATES = [
  "STATE / FATIGUE POSSIBLE",
  "QUALITY / VALID",
  "CONTEXT / WORK SESSION",
  "ACTION / WAIT",
] as const;

export const PERCEPTION_CHANNELS = [
  { label: "CAMERA", mode: "SCAN" },
  { label: "VOICE", mode: "WAVE" },
  { label: "EXPRESSION", mode: "TRACE" },
  { label: "TIME", mode: "MARK" },
  { label: "CONTEXT", mode: "FLOW" },
] as const;

export const EDGE_LABELS = [
  "LOCAL PERCEPTION",
  "EVENT PROCESSING",
  "AGENT GATEWAY",
  "ROBOT COMMUNICATION",
] as const;

export const AGENT_INPUTS = [
  { kind: "A / USER REQUEST", text: "30 秒後提醒我喝水。", output: "REMINDER" },
  { kind: "B / COMPANION REQUEST", text: "小安，我有點累。", output: "CARE RESPONSE" },
  { kind: "C / PASSIVE SIGNAL", text: "持續疲勞線索", output: "WAIT" },
] as const;

export const SCENES: readonly SceneContent[] = [
  {
    id: "awakening",
    number: "01",
    eyebrow: "AWAKENING / SYSTEM ONLINE",
    title: "MEET\nXIAO-AN",
    zh: "一個會關注你，也能幫你做事的桌面具身 Agent。",
    body: "A PHYSICAL AGENT FOR THE MOMENTS BETWEEN TASKS.",
    tags: ["EDGE / CONNECTED", "AGENT / AWAKE"],
  },
  {
    id: "breaking",
    number: "02",
    eyebrow: "BREAKING THE SCREEN",
    title: "NOT ANOTHER SCREEN.\nA PRESENCE.",
    zh: "Agent 不應該永遠被困在屏幕裡。",
    body: "Intelligence leaves the interface and enters the space beside you.",
    tags: ["SOFTWARE → SPACE", "SIGNATURE MOMENT"],
  },
  {
    id: "perception",
    number: "03",
    eyebrow: "PERCEPTION / RAW SIGNAL",
    title: "IT SEES.\nIT LISTENS.\nIT NOTICES.",
    zh: "在你開口之前，訊號已經開始流動。",
    body: "Camera, voice, expression, time and context gather without becoming a wall of data.",
    tags: ["CONCEPT EVENT", "LOCAL FIRST"],
  },
  {
    id: "edge",
    number: "04",
    eyebrow: "INTEL DK-2500 / EDGE",
    title: "THE EDGE\nIS THE BRIDGE.",
    zh: "機器人負責感知與行動，Intel DK-2500 讓一切連接起來。",
    body: "Raw media becomes a smaller, structured event before it reaches the Agent layer.",
    tags: ["CPU", "GPU", "NPU", "OPENVINO"],
  },
  {
    id: "understanding",
    number: "05",
    eyebrow: "OPENCLAW / UNDERSTANDING",
    title: "PERCEPTION\nBECOMES INTENT.",
    zh: "OpenClaw 讀取上下文，把訊號轉化為決策。",
    body: "Different inputs enter one ordered system, then leave as different forms of action.",
    tags: ["CONTEXT", "MEMORY", "SKILLS", "DECISION"],
  },
  {
    id: "presence",
    number: "06",
    eyebrow: "EMBODIED RESPONSE",
    title: "IT DOESN'T JUST REPLY.\nIT MOVES.",
    zh: "理解最終回到現實世界。",
    body: "Expression, soft voice and motion close the loop between an Agent decision and a physical response.",
    tags: ["EXPRESSION", "VOICE", "MOTION", "PRESENCE"],
  },
  {
    id: "system",
    number: "07",
    eyebrow: "SYSTEM REVEAL",
    title: "ROBOT.\nEDGE.\nAGENT.",
    zh: "三層協同，把感知、理解與行動連成一個閉環。",
    body: "The body gathers and responds. The edge organises. The Agent understands and decides.",
    tags: ["/VIDEO", "/AUDIO", "/CONTROL", "AGENT LAYER"],
  },
  {
    id: "closing",
    number: "08",
    eyebrow: "XIAO-AN / 小安",
    title: "FROM VIRTUAL INTELLIGENCE\nTO PHYSICAL PRESENCE.",
    zh: "從虛擬中走出來，在現實中走近你。",
    body: "INTELLIGENT DESKTOP COMPANION · HKUST(GZ) · 2026",
    tags: ["NOT ANOTHER SCREEN", "A PRESENCE"],
  },
] as const;
