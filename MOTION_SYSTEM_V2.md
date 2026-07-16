# Xiao-An Motion System V2

## 原則

動態必須回答一個語義問題：目前的資訊是在被感知、整理、選擇，還是回到身體。沒有語義的持續粒子、漂浮小球與裝飾發光不屬於本系統。

## 五種動態語彙

| 語彙 | 視覺動作 | 使用位置 |
|---|---|---|
| Signal | 掃描、波形、細線、時間刻度 | Wake、Signal |
| Process | 收縮、整理、對齊、壓縮 | Signal、Edge / Intent |
| Decision | 焦點收斂、路徑選擇、狀態停頓 | Edge / Intent、Action |
| Action | 由內向外釋放、產品靠近、表情切換 | Action |
| Quiet | 減少界面、降低頻率、保留實體 | Presence |

## Runtime 架構

- `MotionProvider` 在使用者未要求 Reduced Motion 時建立單一 Lenis 實例。
- Lenis 使用自有 RAF，scroll 事件只觸發 `ScrollTrigger.update()`。
- `V2NarrativeMotion` 按 desktop／mobile 建立 timeline，全部包在 GSAP context 內並在 unmount cleanup。
- resize 經短 debounce 後呼叫 `ScrollTrigger.refresh()`。
- Scene Navigator 開啟時暫停 Lenis，關閉後恢復；面板內部仍可滾動。
- 每幕使用 sticky stage 與有限 section 高度，沒有 3000vh 長 pin 或強制 snap。

## 節奏

| Act | 節奏 | 目的 |
|---|---|---|
| Wake | 慢、低頻 | 建立產品海報與呼吸感 |
| Break | 清楚轉折 | 從平面介面進入空間 |
| Signal | 流動 | 顯示不同原始訊號 |
| Edge / Intent | 精密、分段 | 把訊號整理為決策結構 |
| Action | 收斂後釋放 | 形成全站高潮 |
| Presence | 安靜 | 讓產品與標語成為最後記憶 |

## Signature Moment

Action timeline 分為四段：

1. 冷色決策場建立 `CARE / MOVE CLOSER`。
2. 控制路徑由左向右完成。
3. Expression、Voice、Motion 依次進入可讀狀態。
4. 暖色物理場打開，產品放大靠近並顯示關懷表情。

這段同時完成敘事閉環與最強視覺轉換，因此是主要 Signature Moment。

## Desktop / Mobile 差異

Desktop 使用水平深度、前後層與更長的 scrub 區間。Mobile 使用垂直閱讀、較短 section、獨立產品尺寸與文字斷行；Action 仍保留冷暖分界，但輸出標籤改為更集中排列。

## Reduced Motion

Reduced Motion 不只是 `animation-duration: 0`：

- Lenis 與 ScrollTrigger scrub 不建立。
- sticky 場景變回自然高度。
- 所有關鍵文字、產品圖與語義輸出直接顯示最終狀態。
- WebGL 停用並顯示本地產品 fallback。
- 內容順序與六幕敘事完整保留。

## QA 規則

Motion QA 以 normal、fast、slow 三種滾動速度驗證：

- 到底後 Scene Navigator 為 `06`。
- 回到頂部後 Wake 可以重播。
- 中段 reload 不出現空白頁。
- resize 後重算 section 與 timeline。
- 所有 console warning、console error、page error、HTTP 失敗與 request failure 都視為失敗。

Journey QA 另驗證真實 mobile touch、最大 scroll、Reduced Motion 六個語義輸出，以及 WebGL-disabled fallback。
