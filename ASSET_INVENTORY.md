# Xiao-An Asset Inventory

## 輸入資料

`references/` 目前包含：

| 文件 | 用途 |
|---|---|
| `结题(3).pptx` | 主要世界觀、產品圖、DK-2500、架構與技術語彙 |
| `香港科技大学（广州）_小安_作品设计报告.docx` | 產品定位、補充圖片與設計資料 |
| `demo(1).txt` | Demo 與交互脈絡參考 |
| `18ca95687677e79eefe76121e355a3ec_a9ca9e3e76da0fdacf55d557b2152e7e_8.doc` | 舊格式補充文件 |
| `全國賽大會通知.pdf` | 比賽背景資料，不作網站主文案 |
| `圖片_20260714162759.jpg` | 補充圖片，未作產品本體替代 |

原始參考文件只作素材與內容依據，不由網站 runtime 讀取。

## PPT 提取流程

```powershell
pnpm extract:assets
```

`scripts/extract-ppt-assets.py` 會：

1. 把 PPTX 當 ZIP 解壓並保留 `ppt/media` 原始檔。
2. 記錄格式、寬高、檔案大小與 SHA-256。
3. 建立 contact sheet。
4. 輸出 CSV／JSON inventory 與選取 manifest。
5. 把選取檔案複製至 `public/assets/ppt/`，不覆蓋原始來源。

產物：

```text
work/ppt-assets/final-deck/media/
work/ppt-assets/final-deck/contact-sheet.png
work/ppt-assets/final-deck/asset-inventory.csv
work/ppt-assets/final-deck/asset-inventory.json
work/ppt-assets/final-deck/selected-assets.json
public/assets/ppt/
```

## 網站核心產品資產

| 網站檔案 | 原始來源 | 尺寸 | SHA-256 | 用途 |
|---|---|---:|---|---|
| `public/assets/product/xiaoan-dock.png` | PPT `image3.png` | 1122×1402 | `3b1f73f9c9189b81d5f65a5abec0c3afd4002da7bee62f0e1a80e9e8f541217b` | Hero、Break、Action、Presence 的真實產品錨點 |
| `public/assets/product/dk2500-exploded.png` | PPT `image11.png` | 1267×845 | `7df0df3f40e5761aad5a1bf342b5da024e47c48f4b9576cd1d234d50592e4fd3` | Edge / Intent 硬件核心 |
| `public/assets/product/system-architecture.png` | PPT `image17.png` | 1672×941 | `489829724e696c2c76cc6dd6c06f13fe4b1c9d5e796b7674f4385292379db900` | 架構與內容核對，不直接作滿屏圖 |
| `public/assets/product/edge-hardware.png` | PPT `image19.png` | 1770×888 | `62a0fd1147c8c870f86c98fabd6d9db3311f5798a77c4715225f6aa8a270fb4f` | DK-2500 補充硬件參考 |
| `public/assets/product/robot-internals-front.png` | PPT `image13.png` | 1195×896 | `99dba4c95d6d6820432dc1f54d41a5e156313c51186149a9267b38c711533f2f` | 下一版產品內部細節 |
| `public/assets/product/robot-internals-top.jpeg` | PPT `image14.jpeg` | 4032×3024 | `bc8d1a02589531a2f1cce16185098d4470a95f3e6dd6b137b9949c5d148a5812` | 下一版硬件特寫 |
| `public/assets/product/xiaoan-expressions.png` | DOCX 圖片 | 745×571 | 見來源 inventory | 表情參考，不作假產品外觀 |

## V2 衍生資產

`scripts/prepare_v2_assets.py` 從核心產品圖建立可重複使用的本地衍生檔：

| 檔案 | 用途 |
|---|---|
| `public/assets/v2/product-dock.png` | 保留完整機器人與基站構圖 |
| `public/assets/v2/product-foreground.png` | Hero／Action 前景圖層 |
| `public/assets/v2/expression-care.png` | Action 的 CARE 表情遮罩 |
| `public/assets/v2/asset-manifest.json` | 衍生來源、尺寸與校驗資訊 |

衍生檔不會改寫 `public/assets/product/` 或 `public/assets/ppt/` 的來源圖。

## 素材使用原則

- 真實小安產品圖是唯一產品本體，不生成外觀不同的假機器人。
- 低解析來源以局部裁切、遮罩、輪廓光、視差與場景融合使用，不直接拉伸成 4K 背景。
- DK-2500 與架構圖保留原始技術資訊，不虛構硬件規格或性能數字。
- 網站不依賴遠端圖片、素材 CDN 或 build-time 網絡字體。
- Concept UI 與來源照片分層，避免讓概念事件看起來像真實 Dashboard 數據。

## 下一版優先素材

1. 4K 正面、45 度與側面產品照，固定光位並保留透明背景版本。
2. 基站屏幕、揚聲器、無線充電區、輪組與攝像頭微距。
3. DK-2500 單獨硬件照與可用於 2.5D 的分層爆炸圖。
4. 產品開心／關懷／等待三種屏幕表情的乾淨素材。
5. 同機位深度圖或遮罩，提升 Hero 的 2.5D 精度。
