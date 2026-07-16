# Xiao-An V2 Final Verification

驗證日期：2026-07-16（Asia/Shanghai）

分支：`feature/visual-overhaul-v2`

基準分支：`0703`（未合併、未修改）

## Automated tests

### PPT 與 V2 資產腳本

```text
python -m unittest tests/test_extract_ppt_assets.py tests/test_prepare_v2_assets.py
Ran 4 tests
OK
Exit code 0
```

### QA runtime contract

```text
node --test scripts/qa-runtime.test.mjs
Tests 4 passed
Failures 0
Exit code 0
```

### React / TypeScript tests

```text
pnpm test
Test Files 19 passed (19)
Tests      42 passed (42)
Exit code  0
```

Vitest 的 jsdom 環境會輸出兩行 `HTMLCanvasElement.getContext()` 未實作提示；它來自 jsdom 沒有安裝原生 Canvas，測試仍通過。Fresh Chromium runtime QA 沒有相同 warning。

## Lint

```text
pnpm lint
eslint . --max-warnings=0
Exit code 0
```

## GitHub Pages static export

```text
GITHUB_PAGES=true
NEXT_PUBLIC_SITE_BASE_PATH=/xiaoan-web-experiment
pnpm build
```

結果：

- Next.js 16.2.10
- Compiled successfully
- TypeScript finished
- Static pages generated 7/7
- `/`、`/_not-found`、`/concepts/a`、`/concepts/b`、`/concepts/c`、`/icon.png` 正常產生
- Exit code 0

`out/index.html` 路徑檢查：

```text
Prefixed Next chunk references  57
Prefixed local asset references 14
Bare /_next references           0
Bare /assets references          0
```

## Standard production build

```text
pnpm build
Compiled successfully
TypeScript finished
Static pages generated 7/7
Exit code 0
```

Production server smoke test：HTTP 200，首頁 title 為 `Xiao-An — From Signal to Presence`。

## Fresh Chromium browser QA

Final capture profiles：

- 1440×900 desktop
- 390×844 mobile
- 1440×900 desktop Reduced Motion
- 1920×1080、1280×720、1024×768、390×844 responsive matrix

Final polish 重點：Signal 壓縮室、Edge 光學硬件框、隱藏原生 scrollbar、幕間邊界封口，以及大幅跳捲時的 Scene Navigator 狀態同步。

所有 profile：

- 六幕存在。
- document-level horizontal overflow 為 0。
- missing images 為 0。
- console warning／error 為 0。
- page error、HTTP 失敗、request failure 為 0。

### Motion QA

normal、fast、slow 三種速度均：

- 到達最大 scroll 與 Scene 06。
- 回頂後 Wake 可重新播放。
- 中段 reload 保留完整內容。
- resize 至 1280×720 後沒有 overflow 或錯誤狀態。

### Journey QA

```text
Desktop normal bottom 8955 / max 8955
Desktop fast reverse  0
Presence data scene   presence
Presence toggle       opacity 0
Presence progress     opacity 0
Mobile touch bottom   7579 / max 7579
```

Reduced Motion：REMINDER、CARE、WAIT、EXPRESSION、VOICE、MOTION 六個語義輸出全部可見。

WebGL-disabled：fallback 存在、可見且圖片完整載入。

證據：

```text
artifacts/v2/qa/captures/final-delivery-desktop/
artifacts/v2/qa/captures/final-delivery-mobile/
artifacts/v2/qa/captures/final-delivery-desktop-reduced/
artifacts/v2/qa/captures/final-polish-desktop/
artifacts/v2/qa/captures/final-polish-mobile/
artifacts/v2/qa/captures/final-polish-desktop-reduced/
artifacts/v2/qa/responsive/results.json
artifacts/v2/qa/motion/results.json
artifacts/v2/qa/journey/results.json
```

## Video verification

| 錄影 | 尺寸 | 時長 |
|---|---:|---:|
| Desktop full scroll | 1440×900 | 26.12 s |
| Mobile full scroll | 390×844 | 21.88 s |
| Social 4:5 cut | 1080×1350 | 13.12 s |
| Action desktop / mobile | 1440×900 / 390×844 | 12.68 s / 9.20 s |
| Break desktop / mobile | 1440×900 / 390×844 | 11.04 s / 8.36 s |
| Signal desktop / mobile | 1440×900 / 390×844 | 10.76 s / 8.32 s |

`artifacts/v2/recordings/review-frames/` 已抽取 social 2／5／8／11／14 秒與 desktop 關鍵幀作視覺檢查。4:5 影片為滿版輸出，沒有灰邊或左上角低解析內容。

## Delivery integrity

`artifacts/v2/DELIVERY_MANIFEST.json` 記錄最終交付檔案的大小與 SHA-256。桌面、手機、Reduced Motion、比較圖、Signature Moment 與錄影均位於 `artifacts/v2/`。
