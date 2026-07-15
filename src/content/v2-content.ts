import { withSiteBasePath } from "./site-content";

export type ActId =
  | "wake"
  | "break"
  | "signal"
  | "edge-intent"
  | "action"
  | "presence";

export type ActContent = {
  id: ActId;
  index: string;
  zh: string;
  en: string;
  mode: "poster" | "cinematic" | "technical";
};

export const V2_ASSETS = {
  hero: withSiteBasePath("/assets/product/xiaoan-dock.png"),
  dk2500: withSiteBasePath("/assets/product/dk2500-exploded.png"),
  expressions: withSiteBasePath("/assets/product/xiaoan-expressions.png"),
  expressionCare: withSiteBasePath("/assets/v2/expression-care.png"),
  productForeground: withSiteBasePath("/assets/v2/product-foreground.png"),
  productDock: withSiteBasePath("/assets/v2/product-dock.png"),
} as const;

export const V2_LINKS = {
  github:
    "https://github.com/shiuhou/xiaoan-web-experiment/tree/feature/visual-overhaul-v2",
} as const;

export const V2_ACTS: readonly ActContent[] = [
  {
    id: "wake",
    index: "01",
    zh: "小安，不只存在於屏幕裡。",
    en: "XIAO-AN · EMBODIED DESKTOP AGENT",
    mode: "poster",
  },
  {
    id: "break",
    index: "02",
    zh: "把智能，帶出屏幕。",
    en: "BREAK THE INTERFACE · ENTER THE SPACE",
    mode: "cinematic",
  },
  {
    id: "signal",
    index: "03",
    zh: "訊號不是答案。理解，才是。",
    en: "SIGNAL TAKES FORM",
    mode: "technical",
  },
  {
    id: "edge-intent",
    index: "04",
    zh: "在邊緣，感知變成意圖。",
    en: "EDGE TO INTENT",
    mode: "technical",
  },
  {
    id: "action",
    index: "05",
    zh: "理解，最終成為動作。",
    en: "INTENT BECOMES ACTION",
    mode: "cinematic",
  },
  {
    id: "presence",
    index: "06",
    zh: "從虛擬中走出來，在現實中走近你。",
    en: "FROM VIRTUAL INTELLIGENCE TO PHYSICAL PRESENCE",
    mode: "poster",
  },
] as const;

export const AGENT_INPUTS = [
  { kind: "USER REQUEST", text: "30 秒後提醒我喝水。" },
  { kind: "COMPANION REQUEST", text: "小安，我有點累。" },
  { kind: "PASSIVE SIGNAL", text: "持續疲勞線索" },
] as const;

export const AGENT_OUTPUTS = ["REMINDER", "CARE", "WAIT"] as const;
