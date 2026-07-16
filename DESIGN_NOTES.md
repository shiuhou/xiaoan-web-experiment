# Xiao-An V2 Design Notes

## 藝術方向選擇

前期以三個方向評估現有素材：

1. `Porcelain Circuit`：瓷白產品、冷色結構線、精密硬件語彙。
2. `Soft Machine`：暖白、柔光、情緒陪伴與低頻呼吸。
3. `Signal Chapel`：黑色空間、巨大字體、單一光束與儀式化滾動。

最終選擇 `Signal Chapel / 訊號禮堂`，並吸收 Porcelain Circuit 的硬件精度與 Soft Machine 的暖色終章。這最適合現有真實產品圖：產品不用被偽造成另一台 3D 機器人，而是在黑色空間裡成為唯一實體錨點。

## 核心視覺隱喻

網站不是「展示很多 AI 功能」，而是一條狀態轉換：

```text
SIGNAL → FORM → INTENT → ACTION → PRESENCE
```

冷色線條代表尚未被理解的訊號；排列、分流與選擇代表處理；暖色光進入畫面代表決策回到物理世界。產品圖在每一幕都不是裝飾，而是「智能取得身體」的證據。

## 視覺系統

### 色彩

- Void `#020507`
- Deep blue-black `#061018`
- Structural cyan `#5ee7ff`
- Cold white `#edf8f7`
- Porcelain `#dce5e2`
- Copper / presence `#d79a56`
- Muted technical text `#7f9aa5`

青色只用於訊號、定位與可交互提示；銅色只在 Action 與 Presence 釋放。網站避免通用紫藍 SaaS 漸變、密集粒子、霓虹邊框與卡片牆。

### 字體

- 主標題：本地系統窄體與粗黑中文 fallback，形成海報尺度。
- 英文介面：Inter Tight Variable（已本地打包）。
- 技術標記：等寬字體 fallback，使用大幅尺寸反差而非大量圖標。

不在 build 時下載網絡字體。

## 共用動態元素

整個作品共用一條「訊號線」的語法，而不是每幕發明新特效：

- `SIGNAL`：細線、掃描、波形、時間刻度。
- `PROCESS`：收縮、排序、對齊、路徑分流。
- `DECISION`：焦點收斂、狀態選擇、冷色停頓。
- `ACTION`：由內向外釋放、產品靠近、暖光進場。
- `QUIET`：終章移除介面，保留產品與一句話。

Lenis 只負責平滑輸入，GSAP ScrollTrigger 把每幕進度映射到可重播 timeline；沒有 scroll snap 或滾輪劫持。

## 六幕動畫邏輯

### 01 — WAKE

產品由暗處進入單一垂直光束，前後兩層巨大中文字形成視差。Hero WebGL 只做克制的產品揭示與深度扭曲；DOM 產品圖同時作為可用 fallback。狀態列從 `SYSTEM / ONLINE` 到 `AGENT / AWAKE`，不顯示任何虛構數值。

### 02 — BREAK

抽象桌面介面在固定舞台中裂成前後空間，產品穿過切口而不是普通 fade-in。短暫負空間是轉折節拍，完整長版錄影保留這個 Signature Transition；社群短版則使用精選路徑避免黑場停格。

### 03 — SIGNAL

Camera、Voice、Expression、Time、Context 被設計為五種不同形態，不使用五張 Feature Card。訊號先分散，再進入大型「壓縮室」沿垂直軸整理為結構化事件；短促收斂光只標記資料成形的瞬間，不代表模型準確率或真實延遲。

### 04 — EDGE / INTENT

真實 Intel DK-2500 爆炸圖被嵌入暗色光學框，而不是以白底投影片直接貼入畫面；處理軌道把 Input 依次整理為 Context、Memory、Skills、Decision、Output。OpenClaw 被表現成決策秩序，而不是 AI 大腦。此幕由 DOM、CSS 與 SVG 完成，確保文字與硬件圖片保持清晰。

### 05 — ACTION

這是最終主要 Signature Moment。左側冷色決策場與右側暖色物理場先分離，`CARE / MOVE CLOSER` 決策沿控制路徑回到產品；Expression、Voice、Motion 依次被點亮，產品由遠處靠近，悲傷表情形成情緒回應。

### 06 — PRESENCE

介面與技術標記逐步退出，只留下暖黑空間、真實小安與「從虛擬中走出來，在現實中走近你」。它既是結尾，也是可獨立截圖的產品海報。

## Final Visual Polish

最後一輪沒有增加新的粒子或發光系統，而是處理中段敘事的構圖弱點：Signal 以更大的壓縮室建立單一焦點；Edge 將真實硬件圖吸收進同一套暗色光學語言；全站隱藏原生 scrollbar，並以極薄的幕間漸層封住 sticky 舞台邊界。Scene Navigator 改以 viewport focus line 同步，避免大幅跳捲越過 IntersectionObserver band 後顯示上一幕。這些修改保持 Hero-only WebGL 預算不變。

## Signature Moment

主要 Signature Moment 是 Action 的冷暖世界轉換：意圖沿控制線回到身體，冷色界面打開成暖色物理空間，產品靠近並改變表情。它有清晰語義——決策成為具身回應——而不是純裝飾光效。

Breaking the Screen 是次要 Signature Transition，負責建立「平面介面被實體穿破」的世界觀。

## WebGL 使用原因

WebGL 只保留在 Hero，因為產品揭示需要比 CSS mask 更有深度的表面變形；Signal 與 Edge 的 WebGL 已在審查後移除，避免三個 Canvas 競爭 context、增加 bundle 與產生無語義動畫。

最終策略：

- WebGL2 探測成功才載入 Three.js。
- Canvas 動態載入，第一個成功 frame 後才標記 ready。
- 桌面 DPR 上限 1.5，手機 DPR 1。
- Hero 離開視窗後停止 frame loop，延遲卸載。
- 頁面不可見時停止渲染。
- context lost 時立即切換為產品圖 fallback；恢復後重新 invalidate。
- `NEXT_PUBLIC_DISABLE_WEBGL=1` 可全域停用。

## 手機版策略

手機不是桌面縮小版：

- 版式改為垂直海報與單一焦點。
- 標題重新斷行，產品裁切與靠近幅度獨立設定。
- Signal 與 Edge 改為更清楚的垂直閱讀順序。
- Action 保留冷暖分界、控制線與三種輸出。
- 架構與決策軌道不使用橫向 overflow。
- Navigator 加大文字寬度，面板內部可滾動，背景保持鎖定。
- Presence 隱藏 Navigator，避免破壞終章海報。

## Reduced Motion

當使用者偏好 Reduced Motion：

- 不建立 Lenis、scrub timeline 或長 sticky 舞台。
- 六幕回到自然文檔流，每幕為可讀的最終狀態。
- WebGL 停用，Hero 使用本地產品圖。
- REMINDER、CARE、WAIT、EXPRESSION、VOICE、MOTION 全部直接可見。
- 不因停用動畫而留下空白舞台。

## Concept UI 邊界

下列內容只用於視覺敘事：感知事件、Context／Memory／Skills／Decision 軌道、CARE 決策、MOVE CLOSER 指令與系統狀態。網站不宣稱準確率、延遲、用戶數、部署規模、銷售數據或真實 API 狀態。

## 下一版素材替換

1. 以相同角度拍攝 4K 去背景產品圖，替換 Hero、Action、Presence 三個錨點。
2. 新增基站、屏幕、攝像頭與輪組微距素材，插入現有遮罩與控制線，不改敘事結構。
3. 若有深度圖，可把 Hero 的單平面揭示升級為真實 2.5D 分層。
4. 若有 Demo 影片，應放在獨立案例頁；首頁仍保持概念敘事，不改成影片播放頁。
5. 新素材需先更新 `public/assets/v2/asset-manifest.json` 與視覺 QA 截圖。
