---
title: 公开 PHP 契约
description: SoFinder 提供给整合与扩充使用的公开 PHP Interface 与 Value Object。
---

# 公开 PHP 契约

SoFinder 1.x 将 `SohoPHP\SoFinder\Contract` 下的 Interface 及文件化 Value Object 视为公开扩充界面。实现是 Symfony Service；可替换对应的 Interface Alias，或使用下述 Tag。实现必须能安全处理并行请求，且应抛出 SoFinder Domain Exception，不得泄漏 Storage Path 或机密。

## 授权与 Actor

`AuthorizationInterface` 验证请求，并针对每个 `operation`、Resource 及规范化 Path 作出决定。未知操作必须返回 `false`。Browser Capability Field 只供参考，不能取代服务器端检查。`ActorProviderInterface` 提供稳定、不透明的 Actor ID，用来隔离分块上传、Metadata 及回收站状态。

## 存储与状态

Storage Interface、可选的本机 Capability 及 Factory Tag 记录于[存储 Adapter 契约](/zh-CN/storage-adapters)。可通过 `ChunkUploadStoreInterface`、`RequestGateStoreInterface`、`MetadataStoreInterface` 及 `UsageTrackerInterface` 分别替换状态实现。Usage Tracker 必须依资源序列化 `mutate()` 调用，并以 Atomic 方式返回 Callback 的精确 Byte Delta。

Remote Adapter 也可实现 `StorageAuditProviderInterface`，向安全审计返回不含机密的 `warning` 或 `critical` Finding。

可选的 `AssetCatalogInterface` 按 Workspace／资源／路径解析不透明资产 ID，并维护上传、移动、删除与恢复的身份变化；JSON 实现用于单节点，共享实现基于 `AtomicStateStoreInterface`。`WorkspaceResolverInterface` 必须从可信请求上下文返回不可变 `WorkspaceContext`，不得直接信任浏览器查询参数。

`EntryUrlContextProviderInterface` 可为资源配置的 `entry_url` Route Template 加入宿主拥有的 Scalar Value。Autoconfiguration 会自动加入 `sofinder.entry_url_context_provider` Tag。Provider 对无关资源应返回空阵列，且不得在 Route Parameter 中暴露机密。

## 检查与图片

`FileInspectorInterface` 会接收私有 Quarantine Path、不受信任的文件名及 Resource Policy。它只能在内容检查成功后返回已验证的 Metadata。`ImageProcessorInterface` 必须验证完整图片 Decode、如实报告 Animation，并且只写入指定 Destination；不得默默压平不支持的动态图片。

## Event 与 Plugin

实现 `PluginInterface` 以提供 Browser-safe Descriptor，并使用 `sofinder.plugin` Tag。文件操作会发送名称为 `before.<operation>` 及 `after.<operation>` 的 `OperationEvent`。Before Handler 可通过抛出 Exception 拒绝操作；After Handler 必须假设 Storage 已变更，并让次要工作保持 Idempotent。Event Context 是可扩充 Map，因此 Subscriber 必须忽略未知 Key。

新版 `AssetOperationEvent` 会并行派发，包含稳定操作 ID、固定操作与阶段、Workspace、逻辑路径、可选资产 ID 和安全可序列化属性；公开格式见 [Event Schema](/schema/asset-operation-event.schema.json)。

`AssetUsageStoreInterface` 供宿主登记引用稳定资产 ID 的内容记录，并驱动使用位置与删除预检。可选 Plugin 可实现 `AssetVersionProviderInterface` 或 `AssetEnrichmentProviderInterface`。核心不保存文件版本，也不会自动写入 AI 生成的替代文本、标题或标签；这些结果始终只是需要宿主或用户确认的建议。`/api/capabilities` 会公布这两个可选契约。

公开 Value Object 不可变。1.x 可新建可选 Field 或 Capability Flag；Consumer 必须忽略不认识的值。在 1.x 期间，Method 不会被移除，Parameter 的意义也不会改变。
