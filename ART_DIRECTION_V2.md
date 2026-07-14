# Xiao-An V2 Art Direction

## 選定方向

**A / 裂屏成形（Fracture into Form）**

V2 的核心不再是「一條訊號穿過八個技術場景」，而是讓觀眾看到一個冷、平、被界面壓住的智能，逐步取得深度、意圖和身體：

`SCREEN → SIGNAL → INTENT → BODY → PRESENCE`

一句話概念：

> **SIGNAL TAKES FORM / 訊號取得形體。**

## 為什麼推翻 V1

V1 已經完整，但 Hero、Perception、Edge、Understanding、Presence 與 System 反覆使用近黑背景、青色描邊、左上英文巨標、右側圓形核心和微型 HUD。這讓每幕容易被辨識為同一個 AI 網站模板，而不是一段有情緒起伏的作品。

V2 只保留真實產品、架構內容、靜態部署、Reduced Motion 和 fallback。Scene 數量、排版、色彩、Canvas 和 GSAP timeline 均重新設計。

V1 Hero 基線：[`artifacts/screenshots/hero-1440x900.png`](artifacts/screenshots/hero-1440x900.png)

## 三個概念比較

### A / 裂屏成形

- 中文巨字分成產品後景與前景，產品實際穿過文字，而不是固定在右側。
- 黑色數位平面由一條窄光切開；產品佔桌面約六成，保持唯一視覺焦點。
- 桌面與手機使用不同產品比例，但保留同一「前後遮擋」概念。
- 動態原型是 luma slit／clip reveal；正式 Hero 會升級為 shader reveal。
- 最符合「Signal Takes Form」，也是唯一能自然延伸到 Break、Signal Compression 和 Action 的方向。

截圖：

- [`a-desktop.png`](artifacts/v2/concepts/a-desktop.png)
- [`a-mobile.png`](artifacts/v2/concepts/a-mobile.png)

### B / 作業系統解體

- 明亮 editorial／brutalist 構圖最有即時衝擊，中文紅黑對比成立。
- 但界面、文字和 registration-like geometry 比產品更搶眼。
- 若作為全站主方向，容易變成 speculative OS；小安只是其中一張圖片。
- 不採用為主方向。可保留其硬切節奏作為 Break 的短暫語彙，但不保留紅色主色。

截圖：

- [`b-desktop.png`](artifacts/v2/concepts/b-desktop.png)
- [`b-mobile.png`](artifacts/v2/concepts/b-mobile.png)

### C / 溫柔機械劇場

- 暖瓷白、自然陰影和產品近景最完整，也最能表達「陪伴」。
- 但第一屏缺少數位到物理的張力，無法單獨支撐 Edge／OpenClaw 的轉化。
- 不採用為全站主方向。其暖光、靜止節奏和深色文字會移植到 Action／Presence，作為全站色彩終點。

截圖：

- [`c-desktop.png`](artifacts/v2/concepts/c-desktop.png)
- [`c-mobile.png`](artifacts/v2/concepts/c-mobile.png)

## 最終視覺系統

### 中文與英文

- 中文是主敘事和最大視覺形狀。
- 英文只作產品名稱、Act 標記和技術 annotation。
- 不再每幕使用英文全大寫窄體巨標。
- 中文可被產品遮擋，但核心句必須能透過前後文字層完整讀出。

### 色彩弧線

- Wake／Break：`#050607`、冷白、冰青，平面銳利。
- Signal／Edge：深青黑、結構化白、少量銅色，空間精密。
- Action：冷青逐步轉成瓷白與琥珀。
- Presence：暖瓷白、深墨文字、自然產品陰影；技術 UI 全部退出。

### 光與深度

- Hero 使用窄光、噪聲溶解和產品／中文前後遮擋。
- Break 使用同一裂縫切開完整界面，產品從 Z-space 穿出。
- Signal 使用不同媒介形態聚合，而不是標籤繞圓。
- Edge 使用資料隧道和 processing planes，不使用宇宙粒子或核心圓環。
- Action 將基站、機器人、表情與陰影分層，讓小安向觀眾靠近。

## 明確排除

- 全站固定 Signal Thread。
- Hero aura、Agent orbit、Perception／Edge 圓形核心。
- 全程 Bloom、青色 Glow、玻璃卡片和微型 HUD。
- 同一張產品圖以相同角度與比例重複五次。
- 用更多粒子掩飾構圖不足。

## 概念驗證

三個方向均使用 production Next.js server 和 Playwright 控制的本機 Chrome 實際渲染，尺寸為 `1440×900` 與 `390×844`。

- 6/6 畫面：水平 overflow `false`
- Console errors：0
- Page errors：0
- Failed responses：0
- 每頁真實產品圖：1

完整機器診斷：[`diagnostics.json`](artifacts/v2/concepts/diagnostics.json)

目前 Codex app browser control 在此執行環境未暴露可呼叫介面，因此本階段沒有宣稱使用 Computer Use。視覺判斷使用 production Chromium 截圖與原尺寸逐張檢視完成；後續 Motion 階段會再加入完整錄屏與逐幀檢查。
