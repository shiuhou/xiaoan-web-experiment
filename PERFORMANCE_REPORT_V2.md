# Xiao-An V2 Performance Report

## 結論

V2 的效能策略不是減少視覺內容，而是把高成本能力集中到真正有價值的位置。最終只有 Hero 使用一個 WebGL context；Signal、Edge / Intent、Action 與 Presence 都由 DOM、SVG、CSS 與 GSAP 完成。

本報告記錄工程預算與 runtime 驗證，不提供未量測的 Lighthouse 分數、FPS、延遲或硬件性能數據。

## WebGL 預算

| 項目 | Desktop | Mobile |
|---|---:|---:|
| Canvas 數量 | 最多 1 | 最多 1 |
| DPR 上限 | 1.5 | 1.0 |
| 產品平面 subdivisions | 1×1 | 1×1 |
| antialias | 開啟 | 關閉 |
| frame loop | Hero 可見且頁面可見時 | Hero 可見且頁面可見時 |

其他保護：

- 只在 WebGL2 探測成功後動態載入 Canvas。
- 第一個成功 frame 後才切換 ready 狀態。
- Hero 離開視窗後延遲卸載，避免快速反向滾動抖動。
- `visibilitychange` 讓隱藏頁面停止渲染。
- `webglcontextlost` 立即觸發 fallback，`webglcontextrestored` 重新 invalidate。
- `NEXT_PUBLIC_DISABLE_WEBGL=1` 提供明確停用路徑。

## JavaScript 與動畫

- Three.js 不遍布全站，只由 Hero Experience 動態載入。
- Lenis 不寫入未被 CSS 使用的速度變數。
- GSAP timeline 使用 context cleanup，避免 React Strict Mode 重複建立。
- ScrollTrigger 只在 resize debounce 後 refresh。
- Scene Navigator 不建立第二套滾動容器；面板只在開啟時阻止背景輸入。

## 圖片與字體

- 所有產品、PPT 與衍生圖片均本地化。
- Hero 關鍵圖片優先載入，非首屏內容由瀏覽器延遲解碼／載入。
- Next Image 在 GitHub Pages 靜態輸出時使用 unoptimized 本地路徑。
- Inter Tight 由 package 本地打包；不在 build 時請求 Google Fonts 或素材 CDN。

## 最終 runtime 證據

瀏覽器 QA 覆蓋：

- 1920×1080
- 1440×900
- 1280×720
- 1024×768
- 390×844
- Desktop Reduced Motion
- WebGL-disabled fallback
- normal／fast／slow scroll
- reload、reverse scroll、desktop → mobile resize
- 真實 mobile touch 到達最大 scroll

最終證據中：

- 六幕全部存在。
- document-level horizontal overflow 為 0。
- 圖片缺失為 0。
- console warning／error、page error、HTTP 失敗與 request failure 為 0。
- Reduced Motion 顯示 REMINDER、CARE、WAIT、EXPRESSION、VOICE、MOTION。
- WebGL-disabled fallback 存在、可見且圖片載入完成。

證據位置：

```text
artifacts/v2/qa/captures/final-delivery-desktop/
artifacts/v2/qa/captures/final-delivery-mobile/
artifacts/v2/qa/captures/final-delivery-desktop-reduced/
artifacts/v2/qa/responsive/results.json
artifacts/v2/qa/motion/results.json
artifacts/v2/qa/journey/results.json
artifacts/v2/recordings/video-metadata.json
```

## 影片輸出

| 檔案 | 尺寸 | 時長 |
|---|---:|---:|
| `xiaoan-v2-desktop.webm` | 1440×900 | 28.64 s |
| `xiaoan-v2-mobile.webm` | 390×844 | 22.52 s |
| `xiaoan-v2-social-15s.webm` | 1080×1350 | 15.44 s |

社群影片使用 1080×1350 真實錄影畫布包覆 720×900 互動頁，避免 Playwright 把低解析內容貼在左上角造成灰邊；影片未經會凍結動畫的 Canvas 二次重編碼。

## 已知限制

- 沒有正式 Lighthouse／WebPageTest 報告，因此不宣稱 Core Web Vitals 數字。
- 真實產品圖來源解析度有限，Action 與 Presence 大幅裁切時仍受來源細節限制。
- Headless SwiftShader 與真實獨立 GPU 的 WebGL 表現不同；交付以生命週期、錯誤與 fallback 驗證為主。
- WebM 是瀏覽器 QA 的原始交付格式；發布 Instagram 前可由剪輯工具轉為 H.264 MP4，但不得重新裁切成非 4:5。
