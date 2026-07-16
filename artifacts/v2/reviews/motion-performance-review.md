# Read-only Motion & Performance Review — Disposition

## Review focus

以 Senior Motion Designer 與 Frontend Performance Reviewer 角度檢查時間軸語義、快速／緩慢滾動、WebGL 價值、context 生命週期、Reduced Motion 與影片輸出。

## 主要觀察

- 三個同時存在的 Canvas 會觸發 active WebGL context 警告，且中段視覺收益不足。
- WebGL 探測應要求 WebGL2；ready 狀態不能只代表 Canvas mounted。
- context lost／restored、頁面隱藏與離開 Hero 都需要明確生命週期。
- scroll velocity 曾寫入未被樣式使用的 CSS 變數，屬於無效每幀工作。
- Reduced Motion 初版隱藏了 REMINDER、CARE、WAIT 與具身輸出，語義不完整。
- 社群 4:5 首次錄影只有 720×900 內容貼在 1080×1350 左上角，不能交付。

## 主 Agent 採納

- 刪除 SignalField、EdgeTunnel 與相關 shader；全站最多一個 Hero Canvas。
- WebGL2 probe、首個成功 frame readiness、error boundary、context lost／restored 與 offscreen 延遲卸載全部落地。
- 桌面 DPR 1.5、手機 DPR 1；手機停用 antialias，頁面不可見時停止 frame loop。
- 刪除 velocity response 與四個 root CSS 變數寫入。
- Reduced Motion 改為自然流，六個語義輸出全部可見。
- Motion QA 使用 normal／fast／slow 三種速度，並驗證 replay、reload、resize。
- 4:5 影片改為真實 1080×1350 錄影畫布內嵌 720×900 互動頁，最終 15.44 秒、滿版無灰邊。

## 最終證據

- 所有 QA 結果的 console warning／error、page error、HTTP 失敗與 request failure 為 0。
- normal／fast／slow 均到達 Scene 06，反向回頂後 Wake 恢復初始狀態。
- Mobile touch 到達精確最大 scroll。
- WebGL-disabled fallback 可見且圖片完成載入。
- Desktop、mobile、social 與三個 Signature Moment 錄影都有尺寸／時長 metadata。
