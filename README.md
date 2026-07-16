# Xiao-An Web Experiment V2

小安的實驗性概念產品網站，以六幕連續滾動敘事把真實產品、Intel DK-2500 與 OpenClaw 的關係轉化為一段從訊號到具身存在的視覺旅程。

> FROM SIGNAL TO UNDERSTANDING TO PRESENCE
>
> 從虛擬中走出來，在現實中走近你。

這不是答辯 PPT 網頁化，也不是可控制機器人的 Dashboard。所有狀態、事件與決策介面都屬於 Concept UI，不代表真實性能數據。

目前版本位於 [`feature/visual-overhaul-v2`](https://github.com/shiuhou/xiaoan-web-experiment/tree/feature/visual-overhaul-v2)，只供審閱；`0703` 與其 GitHub Pages 網站不會因本分支而改變。

## 快速開始

需求：Node.js 20+、pnpm。

```powershell
pnpm install
pnpm dev
```

開啟 `http://localhost:3000`。

Production 模式：

```powershell
pnpm build
pnpm start
```

完整程式驗證：

```powershell
python -m unittest tests/test_extract_ppt_assets.py tests/test_prepare_v2_assets.py
node --test scripts/qa-runtime.test.mjs
pnpm test
pnpm lint
pnpm build
```

## 六幕敘事

1. `WAKE`：以海報式產品構圖喚醒小安。
2. `BREAK`：平面介面斷裂，智能從屏幕進入空間。
3. `SIGNAL`：Camera、Voice、Expression、Time、Context 形成可讀訊號。
4. `EDGE / INTENT`：Intel DK-2500 把輸入整理為 Context、Memory、Skills 與 Decision。
5. `ACTION`：冷色決策場轉為暖色具身回應，是主要 Signature Moment。
6. `PRESENCE`：移除技術介面，只留下小安與核心標語。

## 專案結構

```text
src/
├── app/                         # Next.js App Router
├── components/
│   ├── acts/                    # 六幕場景
│   ├── concepts/                # 三個藝術方向的可視提案
│   ├── experience/              # Hero WebGL、fallback、生命週期
│   ├── motion/                  # Lenis、GSAP、各幕 timeline
│   └── ui/                      # Scene Navigator
├── content/                     # V2 文案、資產與連結
├── hooks/                       # Reduced Motion、頁面可見性
├── lib/                         # 路徑與狀態工具
├── shaders/                     # Hero 產品揭示 shader
└── styles/v2/                   # 各幕、手機、降級樣式

scripts/                         # 資產、QA、截圖、錄影、交付封裝
public/assets/product/           # PPT/DOCX 中選出的真實產品素材
public/assets/v2/                # V2 衍生素材與 manifest
work/ppt-assets/                 # 原始提取、inventory、contact sheet
artifacts/v2/                    # 最終截圖、錄影、QA 與審查結果
references/                      # 原始輸入文件，不由網站 runtime 讀取
```

## 調整內容

主要文案、場景索引、GitHub 連結與資產路徑集中在：

```text
src/content/v2-content.ts
```

場景結構在 `src/components/acts/`，各幕動畫在 `src/components/motion/`，視覺樣式在 `src/styles/v2/`。

## 替換產品圖

目前核心資產：

```text
public/assets/product/xiaoan-dock.png
public/assets/product/dk2500-exploded.png
public/assets/v2/product-foreground.png
public/assets/v2/product-dock.png
public/assets/v2/expression-care.png
```

替換時維持檔名可避免修改程式；若比例不同，需同步檢查 `wake.css`、`action.css`、`presence.css` 的 `object-fit`、裁切位置與產品圖層尺寸。不要直接把低解析圖片放大成滿屏背景。

## WebGL 與降級

WebGL 只用於 Hero 的產品揭示，其他幕以 DOM、SVG、CSS 與 GSAP 完成。它會在離開 Hero、頁面不可見或 context lost 時停止或降級；手機 DPR 固定為 1，桌面上限為 1.5。

停用 WebGL：

```powershell
$env:NEXT_PUBLIC_DISABLE_WEBGL='1'
pnpm dev
```

或在部署環境加入：

```text
NEXT_PUBLIC_DISABLE_WEBGL=1
```

fallback 仍會顯示完整產品圖，不會留下空白 Hero。

## Reduced Motion

`prefers-reduced-motion: reduce` 會停用 Lenis、scrub、長 sticky 敘事與 WebGL，六幕改為自然文檔流並直接顯示最終語義狀態。REMINDER、CARE、WAIT、EXPRESSION、VOICE、MOTION 均保留可讀。

## PPT 素材提取

```powershell
pnpm extract:assets
```

`scripts/extract-ppt-assets.py` 會解壓 `ppt/media`、記錄尺寸／格式／大小／SHA-256、建立 contact sheet、輸出 CSV/JSON inventory，並把選取資產複製到 `public/assets/ppt/`，不覆蓋原始檔。

詳見 [ASSET_INVENTORY.md](./ASSET_INVENTORY.md)。

## 視覺 QA 與錄影

先啟動 production server，再設定實際網址：

```powershell
$env:BASE_URL='http://127.0.0.1:3000'
$env:CHROME_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
```

常用命令：

```powershell
node scripts/responsive-qa.mjs
node scripts/motion-qa.mjs
node scripts/v2-journey-qa.mjs
node scripts/record-scroll.mjs
node scripts/record-v2-signatures.mjs
node scripts/record-v2-social.mjs
node scripts/video-metadata.mjs
node scripts/extract-video-review-frames.mjs
python scripts/compose_v2_delivery.py --pass-name final-delivery
```

主要交付：

- `artifacts/v2/desktop/`、`mobile/`、`reduced-motion/`
- `artifacts/v2/signature-moments/`
- `artifacts/v2/recordings/xiaoan-v2-desktop.webm`
- `artifacts/v2/recordings/xiaoan-v2-mobile.webm`
- `artifacts/v2/recordings/xiaoan-v2-social-15s.webm`
- `artifacts/v2/DELIVERY_MANIFEST.json`

## GitHub Pages 靜態輸出

```powershell
$env:GITHUB_PAGES='true'
$env:NEXT_PUBLIC_SITE_BASE_PATH='/xiaoan-web-experiment'
pnpm build
```

輸出位於 `out/`，資產會使用 `/xiaoan-web-experiment` base path。

## Vercel 部署

1. 在 Vercel 匯入 GitHub repository。
2. Framework 選 Next.js，Install Command 使用 `pnpm install`，Build Command 使用 `pnpm build`。
3. 不要設定 `GITHUB_PAGES=true`。
4. 若目標裝置不需要 WebGL，可加入 `NEXT_PUBLIC_DISABLE_WEBGL=1`。
5. 部署前先完成 test、lint、build 與瀏覽器 QA。

## 相關文檔

- [DESIGN_NOTES.md](./DESIGN_NOTES.md)
- [MOTION_SYSTEM_V2.md](./MOTION_SYSTEM_V2.md)
- [PERFORMANCE_REPORT_V2.md](./PERFORMANCE_REPORT_V2.md)
- [ASSET_INVENTORY.md](./ASSET_INVENTORY.md)
- [artifacts/verification/VERIFICATION.md](./artifacts/verification/VERIFICATION.md)
