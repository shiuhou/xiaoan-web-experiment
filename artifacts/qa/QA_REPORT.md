# Visual QA Report

## Round 1 — Composition Review

輸出：`artifacts/qa/first-pass/`、`artifacts/screenshots/hero-first-pass.png`

檢查重點：Hero 是否具海報感、產品是否為唯一主角、標題層級、八幕構圖差異、是否出現 Feature Card/SaaS 模板感。

主要調整：強化產品尺寸與背景深度、收斂不必要發光、建立全站 Scene Index 與 Signal Thread、讓 Scene 02 由 UI 平面真正打開 Z-depth。

## Round 2 — Motion Review

輸出：`artifacts/qa/second-pass/`、`artifacts/qa/motion-review/results.json`

以 normal、fast、slow 三種速度完整滾動；另驗證回到頂部、resize 至 1280×720、中段 reload。三種模式都到達 08/08，返回頂部後 Hero 可重新顯示，沒有 pin 跳動、錯誤狀態、水平溢出或 page error。

## Round 3 — Visual Polish Review

輸出：`artifacts/qa/third-pass/`、`artifacts/qa/final-desktop/`、`artifacts/qa/final-mobile/`

1440×900 與 390×844 逐幕檢查。主要調整：

- Hero 移除重複 face layer，保留真實產品圖與 CSS 呼吸光。
- System 三層提高可讀性，移除假的 `/agent` route。
- Edge 不顯示含未驗證性能資訊的來源圖片。
- 手機架構改為垂直堆疊，修正橫向 overflow。

## Read-only Reviewer Pass

完整紀錄：`artifacts/reviews/read-only-review.md`

Reviewer 指出 Edge 原粒子語義不足、手機關鍵幕仍像桌面縮排版、Presence/System 有低價值疊層。主 Agent 驗證後完成：

- Edge 粒子由散亂訊號收斂成三條結構化軌道。
- 以 viewport gate 延後 WebGL 載入，離屏停止 frameloop。
- Breaking、Edge、Presence 手機版改為短距離 sticky composition 並重新縮放。
- 移除 expression film、架構幽靈底圖與四個非必要 compute labels。

精修後輸出：`artifacts/qa/review-polish-desktop/`、`artifacts/qa/review-polish-mobile-2/`。

## Final matrix

| 尺寸/模式 | Scenes | Overflow | Console warnings/errors | Page errors | Edge |
|---|---:|---:|---:|---:|---|
| 1920×1080 | 8 | 0 | 0 | 0 | Canvas 或完整 fallback |
| 1440×900 | 8 | 0 | 0 | 0 | Canvas |
| 1280×720 | 8 | 0 | 0 | 0 | Canvas 或完整 fallback |
| 1024×768 | 8 | 0 | 0 | 0 | Canvas |
| 390×844 | 8 | 0 | 0 | 0 | 低 DPR Canvas |
| Reduced Motion 1440×900 | 8 | 0 | 0 | 0 | Static fallback |

「Canvas 或完整 fallback」表示 WebGL dynamic chunk 尚未載入時先顯示設計完成的靜態 aperture，不是空白或錯誤。

## Final deliverables

- `artifacts/screenshots/desktop-full-narrative.png`
- `artifacts/screenshots/mobile-full-narrative.png`
- `artifacts/screenshots/hero-1440x900.png`
- `artifacts/screenshots/signature-moment-1440x900.png`
- `artifacts/recordings/xiaoan-scroll-desktop.webm`

所有 final capture 與 recording diagnostics 均無 page error、console error 或 document-level horizontal overflow。
