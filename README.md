# Xiao-An Web Experiment

以「**FROM SIGNAL TO UNDERSTANDING TO PRESENCE**」為主線的小安概念產品網站。這不是答辯簡報網頁化，也不是可控制機器人的 Dashboard；它是一個使用真實產品素材、ScrollTrigger、2.5D 與單一 WebGL 場景完成的 Creative Web Experiment。

## 快速開始

需求：Node.js 20+，建議使用 pnpm。

```powershell
pnpm install
pnpm dev
```

開啟 `http://localhost:3000`。

完整驗證：

```powershell
pnpm test
pnpm lint
pnpm build
```

PPT 素材提取測試：

```powershell
python -m unittest tests/test_extract_ppt_assets.py
```

## 專案結構

```text
src/
├── app/                    # App Router 入口與全域樣式
├── components/
│   ├── canvas/             # Edge WebGL aperture 與 fallback
│   ├── motion/             # Lenis、GSAP、Signal Thread
│   ├── scenes/             # 八個連續敘事場景
│   └── ui/                 # 導航與系統狀態
├── content/                # 文案、場景資料與資產路徑
├── hooks/                  # reduced-motion、page visibility
└── styles/                 # 按視覺系統拆分的 CSS

scripts/                    # 素材提取、視覺 QA、截圖、錄屏
public/assets/product/      # 網站實際使用或保留的本地產品素材
work/ppt-assets/            # 完整 PPT extraction、inventory、contact sheet
artifacts/                  # QA、交付截圖、審查報告與錄屏
references/                 # 原始輸入文件；不在網站中直接載入
```

> 公開 repository 同時保留 `references/`、完整 extraction、QA 截圖與交付素材，讓其他 Agent 可以核對原始資料、實作和最終視覺。

## 調整文案

八幕主標題、中文說明、技術標記與 Concept Event 集中在：

```text
src/content/site-content.ts
```

主標題可用 `\n` 控制分行。不要在 component 中加入長段答辯文字；每幕應維持一個核心句子。

## 替換產品圖

目前產品路徑集中在 `ASSETS`：

```text
src/content/site-content.ts
public/assets/product/
```

最直接的替換方式是保留檔名與近似長寬比：

- `xiaoan-dock.png`：Hero、Breaking、Presence、Closing；建議透明背景。
- `dk2500-exploded.png`：Edge 硬件錨點。
- `xiaoan-expressions.png`：保留作下一版表情素材，目前不直接疊在主畫面。

低解析或有簡報背景的圖片不要放大填滿畫面；優先以局部裁切、輪廓光、遮罩或設計場景融合。

## WebGL 開關與降級

Edge WebGL 只在接近 viewport 時動態載入，離屏、頁面不可見或 Reduced Motion 時停止或改用靜態 aperture。若需在低階設備或錄製流程中強制停用：

```powershell
$env:NEXT_PUBLIC_DISABLE_WEBGL='1'
pnpm dev
```

部署時可在環境變數加入：

```text
NEXT_PUBLIC_DISABLE_WEBGL=1
```

靜態 fallback 保留完整的四階段標記，不會出現空白場景。

## 素材提取

```powershell
pnpm extract:assets
```

腳本 `scripts/extract-ppt-assets.py` 會：解壓 `ppt/media`、讀取尺寸/格式/大小/SHA-256、追蹤 slide 使用位置、產生 CSV/JSON inventory 與 contact sheet、分類候選資產，並把選定原圖複製到 `public/assets/ppt/`。原始 PPT 不會被修改。

完整素材說明見 [ASSET_INVENTORY.md](./ASSET_INVENTORY.md)。

## 視覺 QA 與錄製

桌面逐幕截圖：

```powershell
$env:QA_PASS='manual-desktop'
node scripts/capture-qa.mjs
```

手機逐幕截圖：

```powershell
$env:QA_PASS='manual-mobile'
$env:QA_VIEWPORT='mobile'
node scripts/capture-qa.mjs
```

Reduced Motion：

```powershell
$env:QA_PASS='manual-reduced'
$env:QA_REDUCED='1'
node scripts/capture-qa.mjs
```

完整桌面滾動錄屏：

```powershell
node scripts/record-scroll.mjs
```

輸出在 `artifacts/recordings/xiaoan-scroll-desktop.webm`。若剪成社交媒體版本，建議只保留 Hero、Breaking、Edge、Presence、Closing，控制在 12–16 秒；完整錄屏仍作為工程交付與全頁動態證據。

## 部署至 Vercel

本專案不依賴遠端圖片、網路字體、API 或外部資料服務，可直接部署：

1. 將此獨立專案放入自己的 Git repository。
2. 在 Vercel 匯入 repository。
3. Framework 選擇 Next.js；Install/Build 使用預設 `pnpm install`、`pnpm build`。
4. 如需停用 WebGL，加入 `NEXT_PUBLIC_DISABLE_WEBGL=1`。
5. 部署前再次執行 `pnpm test && pnpm lint && pnpm build`。

本專案已依使用者授權建立 GitHub repository。Vercel 部署仍需另外執行，因為 GitHub repository URL 本身只展示代碼，不會運行 Next.js 網站。

## 已知限制

- `港科广初赛答辩PPT.pptx` 未出現在提供的來源目錄；現版以 `结题(3).pptx`、設計報告、demo script 與 live repository 架構核對內容。
- 產品主圖為 1122×1402，已透過構圖與 2.5D 使用，仍不等同新的 4K 商業攝影。
- WebGL/Three 只創造 Edge 的空間資料處理場；它仍是此站最大的 client bundle 成本。
- 所有事件、狀態與資料線均為 Concept UI，沒有連接真實機器人、DK-2500 API、OpenClaw、WebSocket 或 Dashboard。
- 系統字體會依 Windows/macOS 環境產生小幅排版差異。

## 設計與審查紀錄

- [DESIGN_NOTES.md](./DESIGN_NOTES.md)
- [ASSET_INVENTORY.md](./ASSET_INVENTORY.md)
- `artifacts/reviews/read-only-review.md`
- `artifacts/qa/QA_REPORT.md`
