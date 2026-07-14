# Final Verification

執行日期：2026-07-14（Asia/Shanghai）

## Automated tests

```text
pnpm test
Test Files  8 passed (8)
Tests       23 passed (23)
Duration    7.57s
Exit code   0
```

覆蓋內容包括：八幕存在與文案邊界、Hero/Breaking 結構、Edge fallback 與粒子 budget、散亂訊號到結構化軌道、Motion Provider、Narrative timeline、Scene Navigator、reduced-motion 契約。

## PPT extraction tests

```text
python -m unittest tests/test_extract_ppt_assets.py
Ran 3 tests in 0.130s
OK
Exit code 0
```

## Lint

```text
pnpm lint
eslint . --max-warnings=0
Exit code 0
```

ESLint warnings：0。

## Production build

```text
pnpm build
Next.js 16.2.10 (Turbopack)
Compiled successfully in 3.2s
TypeScript finished in 9.1s
Static pages generated: 4/4
Routes: /, /_not-found, /icon.png
Exit code 0
```

## Production smoke test

以 `pnpm start` 啟動 production build，請求 `http://localhost:3000`：

```text
HTTP 200
Response bytes 72736
```

測試後已停止本地 production server。

## Browser QA

- 1440×900 desktop：8 scenes、overflow 0、console/page errors 0。
- 390×844 mobile：8 scenes、overflow 0、console/page errors 0。
- 1920×1080、1280×720、1024×768、390×844 responsive matrix：全部 8 scenes、overflow 0、navigator 可用、console/page errors 0。
- Reduced Motion：8 scenes、WebGL canvas 0、designed fallback 1、overflow 0、warnings/errors 0。
- Normal / fast / slow scroll：均到達 `08 / 08`，回頂部恢復 `01 / 08`；中段 reload 保留 Edge canvas；resize 1280×720 後 overflow 0。
- 完整錄屏：到達 max scroll，active index `08 / 08`，overflow 0，WebGL canvas 1，warnings/errors 0。

詳細 JSON：

- `artifacts/qa/motion-review/results.json`
- `artifacts/qa/responsive/results.json`
- `artifacts/qa/final-desktop/diagnostics.json`
- `artifacts/qa/final-mobile/diagnostics.json`
- `artifacts/qa/final-reduced/diagnostics.json`
- `artifacts/recordings/recording-diagnostics.json`
