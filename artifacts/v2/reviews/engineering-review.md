# Read-only Engineering Review — Disposition

## Review focus

檢查 V1/V2 共存風險、React Strict Mode、WebGL cleanup、靜態輸出、QA 可信度與交付可重現性。

## 主要觀察

- 舊 V1 scenes、styles、content 與新 V2 同時存在，增加誤用與維護成本。
- WebGL fallback 應檢查 present、visible 與 image complete，而不是只檢查 DOM 節點。
- QA 只把 console error 當失敗仍可能漏掉 WebGL context warning。
- Mobile journey 應驗證精確最大 scroll；resize、reload 與 Reduced Motion 需要語義 assertion。
- 交付截圖與錄影必須由同一 frozen source 重新產生，舊證據不可沿用。

## 主 Agent 採納

- 刪除未使用的 V1 scenes、canvas、styles、content 與測試；保留 V2 六幕與三個概念方向頁。
- 共用路徑 helper 移至 `src/lib/site-path.ts`，避免依賴已刪除的 V1 content。
- GSAP context、Lenis RAF、resize timer、navigator event 與 Canvas listener 都有 cleanup。
- QA 把所有 console warning 一併列為失敗。
- Journey QA 新增 mobile max scroll、reload section bounds、resize overflow、Reduced Motion semantic outputs 與 WebGL fallback 完整 assertion。
- 重新產生 final-delivery desktop／mobile／reduced 截圖、長版錄影、Signature Moment 與 4:5 社群短片。
- `compose_v2_delivery.py` 集中交付檔並產生 SHA-256 manifest。

## 最終工程判斷

V2 runtime 已與舊版隔離，沒有 hydration error、持續 console warning、圖片缺失或 document-level overflow。GitHub Pages 使用靜態 export 與 base path；一般 Vercel／local build 不啟用 export。分支仍是 `feature/visual-overhaul-v2`，沒有合併到 `0703`。
