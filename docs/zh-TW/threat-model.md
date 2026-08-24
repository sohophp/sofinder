---
title: 威脅模型
description: SoFinder 的受保護資產、信任邊界、攻擊者能力及緩解措施。
---

# 威脅模型

## 受保護資產

SoFinder 保護已設定的 Storage Root、Private Resource、已驗證使用者能力、Upload Quarantine、Chunk Session、Metadata、Quota State 及回收站 Payload。Public Resource URL 刻意不經 SoFinder 授權即可讀取。

## 信任邊界

- Browser Input、名稱、Path、MIME Declaration 及回報的 Size 均不可信。
- 宿主應用程式提供 Authentication、Role、Actor Identity 及 CSRF Infrastructure。
- 已設定的 Local Root 與 Private State Directory 只有在 `sofinder:security:audit` 成功後才可信。
- 自訂 Adapter、Inspector、Metadata Store 及 Event Listener 以宿主應用程式權限執行，必須當作 Trusted Code 審查。

## 必要控制

- 正規化每個 Path，並拒絕 Traversal、Hidden Segment、Control Character 及 Symbolic-link Escape。
- 隔離上傳、計算實際 Byte、檢查內容，並在 Atomic Publication 前完整 Decode 圖片資源。
- 每個操作都重新檢查授權；UI Capability Value 永遠不授予權限。
- 以 Staged Target 或 Backup 保護 Replacement，確保失敗時保留原始檔案。
- 以不透明 Actor Identifier 隔離 Chunk 與回收站狀態，並強制執行 CSRF、Rate Limit、Concurrency Limit 及有界遞迴工作。
- 強制不安全內容下載；Authenticated Proxy Response 使用 `nosniff`、Private Cache Control 及嚴格 CSP。

## 剩餘風險

Public Delivery 按設計繞過 Read ACL。預設 Inspector 不是防毒或 Content-disarm Engine。本機 Lock File 無法協調多台主機。GD Processing 與 ZIP Creation 雖有界線，仍會消耗 CPU 及 Disk；接受惡意公開 Traffic 的部署應隔離 Worker 並套用外部 Request Limit。Remote Adapter 不在 1.0 Support Promise 內。
