# Xiao-An Asset Inventory

## 輸入文件

| 文件 | 狀態 | 用途 |
|---|---|---|
| `references/结题(3).pptx` | 已完整盤點，15 slides | 產品圖、DK-2500、架構、硬件與世界觀主來源 |
| `references/香港科技大学（广州）_小安_作品设计报告.docx` | 已盤點文字與 media | 世界觀、功能敘述、真實六表情圖 |
| `references/demo(1).txt` | 已讀取 | Demo 行為與敘事語氣參考 |
| `references/18ca95687677e79eefe76121e355a3ec_a9ca9e3e76da0fdacf55d557b2152e7e_8.doc` | 已檢查 | 空白/制式功能表，未作主要內容來源 |
| `references/全國賽大會通知.pdf` | 保留，未作視覺來源 | 行政文件，不屬網站內容範圍 |
| `references/圖片_20260714162759.jpg` | 保留，未作產品主圖 | 補充圖片，未優於簡報透明產品圖 |
| `references/港科广初赛答辩PPT.pptx` | **未找到** | 已在 supplied references 與來源專案做 targeted search；不虛構其內容 |

原始輸入文件只讀，沒有被覆寫。

## PPT extraction 輸出

- 腳本：`scripts/extract-ppt-assets.py`
- 測試：`tests/test_extract_ppt_assets.py`
- 完整 media 數量：29
- 自動/人工選定候選：21
- 原始提取：`work/ppt-assets/final-deck/media/`
- Contact sheet：`work/ppt-assets/final-deck/contact-sheet.png`
- 完整清單：`work/ppt-assets/final-deck/asset-inventory.csv`
- JSON 清單：`work/ppt-assets/final-deck/asset-inventory.json`
- 選定 manifest：`work/ppt-assets/final-deck/selected-assets.json`
- Public 原圖副本：`public/assets/ppt/`

CSV 記錄 `filename`、來源路徑、尺寸、格式、色彩模式、bytes、SHA-256、使用 slide、分類、selected 與 context。所有選取均複製原圖，不直接覆蓋。

## 網站產品資產

| 網站檔名 | 原始來源 | 尺寸 | SHA-256 | 使用方式 |
|---|---|---:|---|---|
| `xiaoan-dock.png` | PPT `image3.png`, slides 1/14 | 1122×1402 | `3b1f73f9…f541217b` | Hero、Breaking、Presence、Closing 的真實產品錨點 |
| `dk2500-exploded.png` | PPT `image11.png`, slide 6 | 1267×845 | `7df0df3f…592e4fd3` | Edge 的 DK-2500 實體來源圖 |
| `system-architecture.png` | PPT `image17.png`, slide 8 | 1672×941 | `48982972…379db900` | 架構內容核對；Reviewer 後不再作幽靈底圖 |
| `edge-hardware.png` | PPT `image19.png`, slide 9 | 1770×888 | `62a0fd11…a270fb4f` | 保留但不渲染；原圖含未重新驗證的性能資訊 |
| `robot-internals-front.png` | PPT `image13.png`, slide 6 | 1195×896 | `99dba4c9…11533f2f` | 下一版硬件細節候選 |
| `robot-internals-top.jpeg` | PPT `image14.jpeg`, slide 6 | 4032×3024 | `bc8d1a02…148a5812` | 下一版硬件特寫候選 |
| `xiaoan-expressions.png` | DOCX `word/media/image75.*` | 745×571 | `e601c368…ff8a679d` | 真實六表情 grid；保留但不在 Presence 疊加 |

完整 SHA-256 可在 `asset-inventory.csv` 與檔案本身查驗。

## 視覺使用原則

- 不生成與真實小安外觀不同的假機器人。
- 產品主圖保留原始透明圖，以輪廓、光場、遮罩、視差與場景融合強化，不做粗糙去背。
- `edge-hardware.png` 因含來源簡報內的性能資訊而不直接顯示，避免被誤認為本網站驗證過的數據。
- WebGL 只生成抽象訊號與處理空間，不冒充真實硬件外觀。
- 架構 route 以 live repository 的 `/video`、`/audio`、`/control` 契約為準；不建立假的 `/agent` endpoint。

## 下一版建議素材

1. 4K 透明或中性背景的正面、45°、側面產品照。
2. DK-2500 基站單獨實拍與無文字 exploded view。
3. 表情螢幕的原始 PNG/動畫序列。
4. 馬達、鏡頭、麥克風與底盤細節 macro shots。
5. 可公開、無敏感內容的真實桌面環境照片。
