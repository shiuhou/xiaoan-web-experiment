# Xiao-An Web Experiment — Design Notes

## 最終藝術方向

選定方向：**Signal Chapel / 訊號聖殿**。

網站把小安理解為「正在取得身體的訊號」。畫面從不穩定、平面的數位資訊開始，逐步形成有秩序的空間深度，最後回到安靜的物理存在。視覺以近黑靛藍、瓷白、冰青與少量銅色構成；它是 Futuristic，但不是 Cyberpunk；有技術感，但不是 Dashboard。

另外兩個未採用方向：

- **Porcelain Circuit / 瓷白電路**：偏明亮的工業編輯系統，適合 DK-2500，但不夠支撐本次強滾動敘事。
- **Soft Machine / 柔性機器**：以呼吸與表情為中心，更溫暖，但容易讓小安偏向兒童桌寵。

## 核心視覺隱喻

一條共用的 **Signal Thread** 穿越八幕：

`SIGNAL → PERCEPTION → EDGE → INTENT → ACTION → PRESENCE`

它不是性能資料，也不代表即時連線；它是敘事上的連續裝置。訊號由小安的臉部附近出發，在 Scene 02 打開平面界面，在 Perception 分化為不同訊號形態，在 Edge 被整理，在 Agent 收斂為意圖，最後回到表情、聲音與運動。

## 顏色與字體系統

- Void：`#020507`
- Deep indigo：`#07121b`
- Structural blue：`#102b3a`
- Signal cyan：`#5ee7ff`
- Cold white：`#edf8f7`
- Porcelain：`#dce5e2`
- Copper accent：`#d79a56`
- Muted technical text：`#7f9aa5`

不下載網路字體。Display 使用 `Bahnschrift Condensed`、`Arial Narrow` 等系統字體；中文使用 `Microsoft JhengHei`、`PingFang TC` fallback；技術標記使用 `Cascadia Code`、`SFMono-Regular` fallback。

## 共用 Motion Language

- **SIGNAL**：細線、光點、波形、窄資料帶。
- **PROCESS**：訊號對齊、壓縮、分流與穿越處理平面。
- **DECISION**：多條輸入路徑收斂到同一核心，再分岔成不同輸出。
- **ACTION**：能量由內向外釋放，產品向觀看者靠近。
- **QUIET**：技術圖層逐步消失，只保留產品與標語。

所有主要滾動 timeline 都使用 GSAP context 並在 unmount 時 cleanup。桌面使用 scrub 與 pinned stage；手機只在 Breaking、Edge、Presence 保留短距離 sticky composition，不複製桌面的長 pin。

## 八幕動畫邏輯

### 01 — Awakening

使用 PPT 中的真實透明產品圖作為唯一產品本體。畫面由主產品、低透明輪廓層與 CSS 面部呼吸光建立克制的 2.5D 深度。Pointer 只影響前景位移與光暈，載入 reveal 約兩秒，最終可獨立作為 1440×900 海報。

### 02 — Breaking the Screen

聊天、待辦、日曆與提醒先處於同一平面。桌面滾動約進入本幕 35% 後，四層 UI 沿 X/Y/Z 分離並讓小安穿過原本的螢幕邊界；約 82% 停在可截圖的完整構圖。這是全站的 Signature Moment。

### 03 — Perception

Camera、Voice、Expression、Time、Context 以掃描、波形、軌跡、時間刻度與資料帶圍繞同一核心，不做成五張卡片。訊號最後整理為明確標示的 Concept Event。

### 04 — The Edge

Intel DK-2500 被轉化為「Data Aperture」。WebGL 粒子不是背景宇宙：它會依該幕滾動進度，從散亂的三維媒體訊號收斂成三條結構化資料軌道，穿越三個處理平面後離開。DOM 只保留四個必要階段：`LOCAL PERCEPTION`、`EVENT PROCESSING`、`AGENT GATEWAY`、`ROBOT COMMUNICATION`。

### 05 — Understanding

使用者請求、陪伴請求與被動訊號從左側依次進入 Agent decision field。`CONTEXT / MEMORY / SKILLS / DECISION` 是一個有秩序的理解空間，不使用 AI 大腦圖。

### 06 — Presence

訊號回到真實產品圖。螢幕亮起、運動線釋放，`AGENT DECISION → CARE` 與 `ROBOT ACTION → MOVE CLOSER` 形成具身閉環。Reviewer 後已移除底部低價值 expression film，讓產品重新成為唯一主角。

### 07 — System Reveal

畫面整理成 Robot、Edge、Agent 三層空間海報。桌面使用水平深度，手機改為垂直堆疊；保留目前工程契約 `/video`、`/audio`、`/control`，Agent 只標示為 layer，不虛構不存在的 `/agent` route。原始 PPT 架構圖僅作內容核對，不再作為不可讀的幽靈底圖。

### 08 — Closing

所有技術介面退出，只保留小安、柔和光線與最後標語。`EXPLORE AGAIN` 是有效的頁內連結；未加入假的 Demo、社交媒體、聯絡表單或 GitHub URL。

## Signature Moment

Scene 02 的平面 UI 在滾動中打開空間深度，小安同時由後方穿越界面。這個瞬間直接對應「Agent 不應永遠被困在螢幕裡」，而不是單純 fade-in；快速滾動、回到頂部與中段 reload 均已納入 QA。

## 為什麼只在 Edge 使用 WebGL

Edge 的敘事需要真實深度、粒子視差與由散亂到有序的空間重排；其他場景以 DOM、CSS、SVG、GSAP 表現可取得更清晰的字體、更精確的響應式控制與較低渲染成本。WebGL 動態載入、限制 DPR/粒子量、接近 viewport 才載入，離屏或頁面不可見時停止 frameloop；不可用時顯示完整設計的靜態 aperture。

## 手機與 Reduced Motion

- 手機標題與產品圖重新構圖，不是桌面等比例縮小。
- Breaking、Edge、Presence 只使用短距離 sticky composition；其他場景回到 document flow。
- Robot–Edge–Agent 架構改為垂直閱讀。
- Pointer effects 停用，WebGL 降低粒子數與 DPR。
- `prefers-reduced-motion` 停用 Lenis、scrub、長 pin、粒子動畫與 cursor effects，所有內容直接顯示可讀 final state。
- 可用 `NEXT_PUBLIC_DISABLE_WEBGL=1` 強制使用靜態 fallback。

## Concept UI 邊界

所有 status、event trace、signal band、decision state 都是視覺概念，用來說明架構與可能事件流，不是即時 Dashboard。網站沒有呈現任何虛構的準確率、延遲、吞吐量、使用者數或部署成果。

## 下一版素材替換

產品路徑集中在 `src/content/site-content.ts` 與 `public/assets/product/`。可在維持相近長寬比的前提下替換 `xiaoan-dock.png`、`dk2500-exploded.png` 與 `xiaoan-expressions.png`；若取得更高解析透明產品照，Hero、Breaking、Presence、Closing 不需改寫 scene component。下一版最值得補充的是：乾淨的正面/側面產品照、DK-2500 實拍、表情螢幕原始輸出，以及不帶簡報文字的硬件細節圖。
