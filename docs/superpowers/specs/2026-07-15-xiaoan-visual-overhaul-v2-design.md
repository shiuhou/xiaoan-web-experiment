# Xiao-An Visual Overhaul V2 — Design Specification

日期：2026-07-15  
分支：`feature/visual-overhaul-v2`  
基線：`0703@338b077`  
狀態：Approved for autonomous implementation  
發布邊界：只保留在 feature branch 供審閱，不合併 `0703`，不覆蓋現有 GitHub Pages。

## 1. 任務定義

V2 不是 V1 的視覺精修，而是保留真實素材、內容邊界、靜態部署與無障礙底座後，重建敘事、構圖、排版和動態系統。

新的核心命題是：

> **SIGNAL TAKES FORM / 訊號取得形體。**

網站必須讓觀眾直接看見這條變化，而不是只讀到架構說明：

`SCREEN → SIGNAL → INTENT → BODY → PRESENCE`

成功標準不是「六幕都能顯示」，而是：三秒內辨識小安、至少三個有因果關係的 Signature Moment、Presence 成為最強高潮、中文成為情緒主敘事，以及 15 秒節選足以作為 IG 作品發佈。

## 2. 保留、重寫與刪除

### 保留

- 真實 `xiaoan-dock.png`、`dk2500-exploded.png`、`xiaoan-expressions.png` 與其他來源素材。
- Xiao-An、Intel DK-2500、OpenClaw 的真實關係。
- 本地感知、事件處理、理解、決策與具身回應的內容邊界。
- Next.js static export、GitHub Pages `basePath`／`assetPrefix`。
- Reduced Motion、WebGL fallback、page visibility、DPR 與渲染預算概念。
- Concept UI 標示；不顯示虛構準確率、延遲、用戶或部署數據。

### 重寫

- 八幕等權結構改為六個不等長 Act。
- `site-content.ts` 由通用 Scene template 改為 Act-specific content model。
- 所有主要 Scene component、主要 CSS 與 `NarrativeMotion`。
- 桌面與手機 timeline；手機不是桌面 selector 的簡化分支。
- Edge Canvas 改為統一 Experience Controller 驅動的視覺系統。
- 導航由 `01 / 08` 技術面板改為六段極簡 progress rail。
- QA 腳本增加真實 wheel、反向、刷新、resize、console/page error、WebGL off 與 mobile touch。

### 刪除

- 全站固定 Signal Thread。
- Hero aura／orbit、Perception 圓心、Agent 圓環、Edge aperture 圓環。
- 每幕共同的 kicker + 英文窄體巨標 + 中文附註模板。
- Understanding 輸入側提前顯示輸出結果。
- Presence 中的 REMINDER 與低價值 motion lines。
- 獨立 System Scene；架構關係改在 Edge-to-Intent 資料路徑中自然顯現。
- 大量 `loading="eager"`；只保留 Hero 高優先級。

## 3. 三個候選藝術方向

### A. 裂屏成形 / Fracture into Form — 選定

- Typography：中文巨字與產品前後穿插；英文只作標記。
- Product placement：Hero 佔 50–65%，Breaking 由裂口穿出，Presence 由遠到近。
- Color：黑／白／冰藍的銳利數位世界，逐步轉為瓷白／柔青／琥珀的物理世界。
- Motion：CUT、GATHER、COMPRESS、CHOOSE、RELEASE、SETTLE。
- 優點：最能把小安、滾動因果與冷暖轉變綁成同一作品。
- 風險：裂屏若只依賴 DOM 卡片會退回 V1；必須用實際遮罩、Z-space 與產品遮擋完成。

### B. 作業系統解體 / Operating System Collapse

- 高密度 editorial UI 和 kinetic type 解體。
- 優點：速度快、短片衝擊強。
- 風險：UI 會搶走產品主角位置，容易變成通用 speculative OS。

### C. 溫柔機械劇場 / Soft Machine Theatre

- 近距離產品特寫、慢光、低頻呼吸和暖色物理場。
- 優點：情緒與產品質感最好。
- 風險：Edge／OpenClaw 的技術轉化不足，敘事張力偏平。

選擇 A，並只吸收 C 在 Presence／Closing 的安靜光線，不混入 B 的高密度 UI。

## 4. 視覺系統

### 4.1 色彩弧線

| 階段 | 背景 | 前景 | 強調 | 情緒 |
|---|---|---|---|---|
| Wake | `#050607` | `#F3F0E8` | `#90E9F4` | 冷、銳利、被壓住 |
| Break | `#07090C` | `#F7F5EF` | 短暫 RGB separation | 斷裂、穿透 |
| Signal | `#081116` | `#DCEFF1` | `#54D9E9` | 流動、收斂 |
| Edge/Intent | `#07151A` | `#E9F4F1` | `#71D8D6`、少量銅 | 精密、有深度 |
| Action | 冷青轉 `#D8D2C5` | 深墨／瓷白 | `#E3A25D` | 釋放、靠近 |
| Presence | `#D8D2C5` | `#16191A` | 柔青／琥珀 | 安靜、實體 |

色彩轉換由 Act progress 控制 CSS custom properties 和 WebGL uniforms，不以六個互不相干的背景切換完成。

### 4.2 排版

- 中文主敘事：系統中文字体 stack，以字重、裁切、遮擋和不對稱構圖建立辨識度，不依賴遠端字體。
- 英文產品標記：Inter Tight／Archivo variable 的本地 npm package，打包進專案；不在建置下載。
- 技術標記：IBM Plex Mono 或現有 Cascadia fallback，桌面不低於 12px，手機不低於 11px。
- Mode A（海報）：Wake、Closing；中文 9–14vw，產品與文字分層。
- Mode B（電影句）：Break、Action；每行短句，文字會被場景切割或釋放。
- Mode C（技術編輯）：Signal、Edge-to-Intent；資料與文字同一流程，不使用 floating cards。

相鄰 Act 不得共享同一文字錨點、同一產品比例和同一資料構圖。

### 4.3 光與材質

- 數位世界：硬邊裁切、黑白高反差、短促色差、局部噪聲。
- 物理世界：大面積瓷白、柔軟環境光、實體陰影、少量琥珀反射。
- Bloom／chromatic aberration 只在 Break 和 Action 的 300–600ms 關鍵段落出現；不全程開啟。
- 不使用星空、宇宙粒子、矩陣雨、持續 orbit 或全站玻璃卡片。

## 5. 六個 Act

### Act 01 — WAKE / 甦醒

核心句：「小安，不只存在於屏幕裡。」

- 真實產品佔桌面 55–62%，位於中文前後兩個文字層之間。
- 初始只見窄光與局部輪廓；1.6 秒內完成 directional luma/noise reveal。
- Hero product reveal 使用 WebGL texture shader；Canvas 未就緒、WebGL off 或 Reduced Motion 時顯示設計完成的 CSS mask final composition。
- Pointer 只調整 shader refraction focus 和窄光位置，限制幅度，不平移整張產品。
- Hero 停住三秒仍是一張完整海報。

### Act 02 — BREAK THE SCREEN / 打破屏幕

核心句：「把智能，帶出屏幕。」

- 開始是單一完整界面，不是四張預先漂浮卡片。
- 中央裂縫先切中文字與 UI，兩側平面沿 Z 軸折開；產品由裂口後方穿出。
- 裂開瞬間短暫產生 2–4px chromatic separation，停止後立即回穩。
- 桌面平面向左右折；手機向上下分離，小安由中央升起。
- 第一個 Signature Moment：2D interface 明確變成有前中後景的產品空間。

### Act 03 — SIGNAL / 訊號形成

核心句：「訊號不是答案。理解，才是。」

- Camera 是掃描切片；Voice 是有厚度的波帶；Expression 是特徵曲線；Time 是長刻度；Context 是字句殘片。
- 五種訊號從不同入口進入，經過 GATHER → ALIGN → COMPRESS。
- Event 文字不是卡片滑入，而是由訊號 glyph／segments 重組為四行結果。
- 第二個 Signature Moment：雜亂媒介在中央壓縮成清晰 Event Object。
- 手機改為垂直資料流，輸入由頂部逐段落下並在中下區重組。

### Act 04 — EDGE TO INTENT / 邊緣到意圖

核心句：「在邊緣，感知變成意圖。」

- 以真實 DK-2500 圖為固定辨識錨點，不反色到失真。
- WebGL 資料隧道接收 Signal Event，穿過 processing planes；shader／GPU position interpolation 完成散亂到有序，不在每幀 query DOM 或重寫整個 BufferAttribute。
- 輸入只顯示三種原始請求；依序通過 CONTEXT、MEMORY、SKILLS、DECISION，完成後輸出 REMINDER、CARE、WAIT 才出現。
- ROBOT／EDGE／AGENT 三層關係在資料路徑中短暫展開，再收回主線；不另做 System 海報。
- 主要深度來自隧道、processing planes 與 data ribbon，不使用圓環核心。

### Act 05 — ACTION / 具身回應

核心句：「理解，最終成為動作。」

- 決策沿控制路徑反向回流，資料世界由冷色逐步被暖光取代。
- 真實小安從遠到近；基站、機器人和前景陰影以分層遮罩形成 2.5D 視差。
- 從 `xiaoan-expressions.png` 產生獨立、不覆寫原圖的關懷表情 crop，透過 screen mask 貼合產品臉部區域。
- 只保留 EXPRESSION、VOICE、MOTION；聲波從產品向外，動作不是三條裝飾線。
- 第三個 Signature Moment：冷色 UI 完整退出，暖色物理空間接管，小安向觀看者靠近並亮起表情。
- 這是全站最大高潮；完成後不再回到技術解釋。

### Act 06 — PRESENCE / 結尾

核心句：「從虛擬中走出來，在現實中走近你。」

- 使用不同裁切的產品特寫，而非第五次完整產品正面。
- 所有資料線、HUD、粒子與技術標記退出。
- 畫面暖、安靜，只有產品、自然光與少量品牌資訊。
- `Explore Again` 回到首幕；GitHub link 指向 `feature/visual-overhaul-v2`，不得指向不存在的 Demo。

## 6. Motion Language

- **CUT**：界面和文字被同一裂縫切割。
- **GATHER**：異質訊號沿不同路徑聚集。
- **COMPRESS**：散亂資料縮短、對齊並形成事件。
- **CHOOSE**：決策節點依因果順序點亮，未選路徑退場。
- **RELEASE**：輸出沿控制鏈返回產品，色溫與空間同步改變。
- **SETTLE**：技術層退出，產品和文字停止運動。

Scroll velocity 只影響 data ribbon stretch、裂縫 skew 和少量色差，經 clamp 後在停止滾動 180–260ms 內回穩。Reduced Motion 完全停用 velocity response。

## 7. 前端架構

```text
src/
├── app/
│   ├── page.tsx
│   └── concepts/[direction]/page.tsx
├── components/
│   ├── acts/
│   │   ├── wake-act.tsx
│   │   ├── break-act.tsx
│   │   ├── signal-act.tsx
│   │   ├── edge-intent-act.tsx
│   │   ├── action-act.tsx
│   │   └── presence-act.tsx
│   ├── experience/
│   │   ├── experience-canvas.tsx
│   │   ├── experience-controller.tsx
│   │   ├── product-reveal.tsx
│   │   ├── signal-field.tsx
│   │   ├── edge-tunnel.tsx
│   │   └── experience-fallback.tsx
│   ├── motion/
│   │   ├── motion-provider.tsx
│   │   ├── desktop-timeline.ts
│   │   ├── mobile-timeline.ts
│   │   └── velocity-response.ts
│   └── ui/
├── content/v2-content.ts
├── hooks/
├── lib/experience-state.ts
└── styles/v2/
```

### 7.1 Experience Controller

- 六個 Act 各自註冊 progress；ScrollTrigger 只更新 controller 中的 mutable progress refs／CSS variables。
- Canvas 的 `useFrame` 只讀 refs 和 uniforms，不呼叫 `querySelector`、`getBoundingClientRect` 或遍歷 DOM。
- Canvas 有明確 active range；Wake 到 Action 之外停止 frameloop，page hidden 時停止。
- Desktop DPR ≤ 1.5，mobile DPR ≤ 1；資料點數依 viewport 固定上限。
- DOM 負責所有可讀文字與 semantic content，Canvas 只負責 reveal、空間資料與轉場。

### 7.2 Error／Fallback

- WebGL 不可用、context lost 或 `NEXT_PUBLIC_DISABLE_WEBGL=1` 時，使用 CSS/SVG final compositions；不顯示空場景。
- 動態載入失敗時仍保留 Hero 真實圖片、Signal final event、Edge flow 與 Action final product。
- 圖片路徑由既有 `withSiteBasePath` 管理；所有新增 derived assets 本地化。
- 所有 asset preprocessing 只產生新檔，不覆寫來源。

### 7.3 Reduced Motion

- Lenis off、scrub off、長 sticky off、Canvas animation off。
- Act 高度為約 100svh 或自然內容高度，不保留 155–210svh 空白。
- 每個 Act 顯示最終構圖，訊息完整可讀。

## 8. Phase 1 Concepts

建立 `/concepts/a`、`/concepts/b`、`/concepts/c`：

- A：裂屏成形，黑到暖瓷白、中文遮擋產品、窄光 reveal。
- B：作業系統解體，高密度 editorial UI、硬切 kinetic type。
- C：溫柔機械劇場，暖光產品特寫、低頻呼吸。

三頁只服務方向比較，不進 production narrative。用 1440×900 和 390×844 截圖比較 Typography、Product Placement、Color、Depth、Light 和首個動態。選定 A 後，把選擇和截圖寫入 `ART_DIRECTION_V2.md`。

## 9. 測試與 QA

### 自動測試

- Content：六個 Act、中文主句、輸入不提前包含輸出、無虛構 metrics。
- Assets：所有路徑存在、GitHub Pages base path 正確、derived expression crop 不覆寫來源。
- Experience state：progress clamp、Act transition、DPR／particle budgets、Reduced Motion final state。
- Components：WebGL fallback 有完整內容；Hero 只有首圖高優先級；GitHub／Explore Again link 可用。
- Workflow：`pnpm test` → `pnpm lint` → `pnpm build` 後才 upload Pages artifact。

### 瀏覽器 QA

- 1440×900、1920×1080、1280×720、1024×768、390×844。
- normal／slow／fast／reverse wheel；快速上下切換；回頂重播。
- refresh at Wake、Break、Edge、Action；resize；mobile touch scroll。
- Reduced Motion、WebGL disabled、page hidden／visible。
- console error、page error、missing assets、document overflow 均為 0。
- 逐幕截圖、全程錄屏、三段 3–5 秒 Signature clips、15 秒 social cut。

若 app browser control 在執行環境不可用，必須在報告明示；改以 Playwright 真實 Chromium、錄屏、逐幀和人工圖片檢查補足，不得宣稱使用了 Computer Use。

## 10. 審查與迭代門檻

1. Concepts gate：Hero A 必須明顯勝過 V1，否則不進完整敘事。
2. Signature gate：Hero reveal、Break、Signal compression、Action 至少三項達到可單獨錄屏的完成度。
3. Creative review：只讀 Agent 檢查模板感、中文、海報構圖、Presence 高潮。
4. Motion review：只讀 Agent 檢查因果、空白幀、速度、反向與手機。
5. Engineering review：只讀 Agent 檢查 GSAP cleanup、Canvas lifecycle、性能、fallback、deployment。
6. 主 Agent 根據實際畫面自行取捨，至少完成三輪視覺修改，不照單全收 Reviewer 意見。

## 11. 驗收門檻

- 六個 Act，不再保留八幕等權模板。
- Hero 三秒內辨識小安，產品佔 50–65%，中文是主句。
- 三個以上 Signature Moment；Action／Presence 是最強高潮。
- Presence 後沒有 System 解釋。
- 全站有明確冷到暖的色彩弧線。
- 不存在三個以上相同「左標題＋右核心」構圖。
- 不存在全站 Signal Thread、持續圓環或全程 Bloom。
- 手機保留 Break 與 Action 兩個 signature motion。
- Reduced Motion 沒有長空白場景。
- Test、lint、static build、console、overflow、asset checks 全部通過。
- 完整成果只提交到 `feature/visual-overhaul-v2`，不更改 `0703` 或公開 Pages。

## 12. 交付

- `ART_DIRECTION_V2.md`
- `MOTION_SYSTEM_V2.md`
- `PERFORMANCE_REPORT_V2.md`
- `artifacts/v2/before/`
- `artifacts/v2/concepts/`
- `artifacts/v2/after/`
- `artifacts/v2/desktop/`
- `artifacts/v2/mobile/`
- `artifacts/v2/reduced-motion/`
- `artifacts/v2/signature-moments/`
- `artifacts/v2/recordings/`
- V1/V2 Hero、Breaking、Presence 對比
- 桌面／手機完整錄屏、三段 Signature clip、15 秒 social cut
- 驗證報告、已知限制與最終 commit SHA

